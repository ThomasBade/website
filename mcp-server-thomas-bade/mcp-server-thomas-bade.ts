import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = (process.env.TBKG_BASE_URL || "https://thomasbade.github.io/website/knowledge-graph").replace(/\/$/, "");

type JsonObject = Record<string, unknown>;
type Page = JsonObject & {
  id: string; slug: string; filename: string; title: string; canonical: string;
  topics?: string[]; summary?: string; geo_score?: number;
};
type Node = JsonObject & { id: string; label: string; type: string };
type Edge = JsonObject & { source: string; target: string };

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Knowledge Graph returned HTTP ${response.status} for ${path}`);
  return response.json() as Promise<T>;
}

function text(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

const server = new Server(
  { name: "thomas-bade-knowledge-graph", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "search_pages", description: "Durchsucht die Fachseiten nach Titel, Zusammenfassung und Themen.", inputSchema: { type: "object", properties: { query: { type: "string" }, min_geo_score: { type: "number", minimum: 0, maximum: 100 } }, required: ["query"] } },
    { name: "get_entity", description: "Liefert einen kontrollierten Begriff einschliesslich Wikidata-Links.", inputSchema: { type: "object", properties: { term: { type: "string" } }, required: ["term"] } },
    { name: "get_graph_relations", description: "Liefert direkte Beziehungen eines Knotens anhand ID, Label oder Seitenslug.", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
    { name: "get_page_content", description: "Liefert den strukturierten Export einer Fachseite.", inputSchema: { type: "object", properties: { slug: { type: "string", pattern: "^[A-Za-z0-9_-]+$" } }, required: ["slug"] } },
    { name: "list_topics", description: "Listet Themenfelder nach Seitenabdeckung.", inputSchema: { type: "object", properties: {} } },
    { name: "get_build_info", description: "Liefert Build-, Qualitaets- und Aktualitaetsinformationen.", inputSchema: { type: "object", properties: {} } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = (request.params.arguments || {}) as Record<string, unknown>;
  try {
    switch (request.params.name) {
      case "search_pages": {
        const pages = await fetchJson<Page[]>("/data/pages.json");
        const query = String(args.query || "").toLocaleLowerCase("de");
        const minGeo = Number(args.min_geo_score || 0);
        return text(pages.filter((page) => {
          const haystack = [page.title, page.summary, page.slug, ...(page.topics || [])].join(" ").toLocaleLowerCase("de");
          return haystack.includes(query) && Number(page.geo_score || 0) >= minGeo;
        }).slice(0, 15).map((page) => ({
          title: page.title, slug: page.slug, url: page.canonical,
          geo_score: page.geo_score, topics: page.topics,
        })));
      }
      case "get_entity": {
        const vocabulary = await fetchJson<{ terms: Array<JsonObject & { label?: string; synonyms?: string[] }> }>("/data/vocabulary.json");
        const query = String(args.term || "").toLocaleLowerCase("de");
        const entity = vocabulary.terms.find((entry) =>
          entry.label?.toLocaleLowerCase("de") === query ||
          entry.synonyms?.some((alias) => alias.toLocaleLowerCase("de") === query));
        return entity ? text(entity) : { content: [{ type: "text", text: `Entitaet "${args.term}" nicht gefunden.` }] };
      }
      case "get_graph_relations": {
        const graph = await fetchJson<{ nodes: Node[]; edges: Edge[] }>("/data/graph.json");
        const query = String(args.node || "").toLocaleLowerCase("de");
        const node = graph.nodes.find((candidate) =>
          candidate.id.toLocaleLowerCase("de") === query ||
          candidate.label.toLocaleLowerCase("de") === query ||
          candidate.id.toLocaleLowerCase("de") === `page:${query}`);
        if (!node) return { content: [{ type: "text", text: `Knoten "${args.node}" nicht gefunden.` }] };
        const nodeById = new Map(graph.nodes.map((candidate) => [candidate.id, candidate]));
        const relations = graph.edges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => ({
          ...edge,
          sourceNode: nodeById.get(edge.source),
          targetNode: nodeById.get(edge.target),
        }));
        return text({ node, relationCount: relations.length, relations });
      }
      case "get_page_content":
        return text(await fetchJson<JsonObject>(`/data/exports/${String(args.slug)}.json`));
      case "list_topics": {
        const graph = await fetchJson<{ nodes: Array<Node & { count?: number }> }>("/data/graph.json");
        return text(graph.nodes.filter((node) => node.type === "topic").sort((a, b) => Number(b.count || 0) - Number(a.count || 0)));
      }
      case "get_build_info":
        return text(await fetchJson<JsonObject>("/data/build-manifest.json"));
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
    }
  } catch (error) {
    return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
  }
});

const resources: Record<string, string> = {
  "kg://thomas-bade/graph": "/data/graph.json",
  "kg://thomas-bade/vocabulary": "/data/vocabulary.json",
  "kg://thomas-bade/pages": "/data/pages.json",
};

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: "kg://thomas-bade/graph", name: "Knowledge Graph", description: "Knoten, Kanten und Provenienz", mimeType: "application/json" },
    { uri: "kg://thomas-bade/vocabulary", name: "Kontrolliertes Vokabular", description: "Begriffe, Synonyme und externe Identitaeten", mimeType: "application/json" },
    { uri: "kg://thomas-bade/pages", name: "Seitenindex", description: "Metadaten aller Fachseiten", mimeType: "application/json" },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const path = resources[request.params.uri];
  if (!path) throw new Error(`Unknown resource: ${request.params.uri}`);
  return { contents: [{ uri: request.params.uri, mimeType: "application/json", text: JSON.stringify(await fetchJson(path), null, 2) }] };
});

await server.connect(new StdioServerTransport());
console.error("Thomas Bade Knowledge Graph MCP server running on stdio");
