"""Add controlled semantics, provenance, RDF and build metadata to the static graph."""

from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "knowledge-graph" / "data"
BASE = "https://www.thomas-bade.de"
VERSION = "2.0.0"

SYNONYMS = {
    "EU AI Act": ["AI Act", "EU-KI-Verordnung", "KI-Verordnung", "Verordnung (EU) 2024/1689"],
    "ISO/IEC 42001": ["ISO 42001", "AIMS-Norm", "AI Management System Standard"],
    "WHODAS": ["WHODAS 2.0", "WHO Disability Assessment Schedule 2.0"],
    "ICF": ["International Classification of Functioning, Disability and Health", "Internationale Klassifikation der Funktionsfähigkeit"],
    "Medizinprodukte": ["MDR", "Medical Device Regulation", "Verordnung (EU) 2017/745"],
    "DSGVO": ["GDPR", "Datenschutz-Grundverordnung", "Verordnung (EU) 2016/679"],
    "KI-Kompetenz": ["AI Literacy", "KI literacy"],
    "Künstliche Intelligenz": ["KI", "Artificial Intelligence", "AI"],
}

CLASSES = [
    "ContentPage", "ContentPageAlias", "Document", "Standard", "LegalAct", "Requirement", "Assessment",
    "Organization", "AIApplication", "Technology", "Process", "Evidence", "Outcome",
]

RELATIONS = {
    "about": {"uri": "https://schema.org/about", "label": "behandelt Fachbegriff", "status": "productive"},
    "linksTo": {"uri": f"{BASE}/vocab/referencesPage", "label": "verweist auf Seite", "status": "productive"},
    "requires": {"uri": f"{BASE}/vocab/requires", "label": "fordert", "status": "reserved"},
    "appliesTo": {"uri": f"{BASE}/vocab/appliesTo", "label": "gilt für", "status": "reserved"},
    "basedOn": {"uri": f"{BASE}/vocab/basedOn", "label": "basiert auf", "status": "reserved"},
    "measures": {"uri": f"{BASE}/vocab/measures", "label": "misst", "status": "reserved"},
    "implementedBy": {"uri": f"{BASE}/vocab/implementedBy", "label": "wird umgesetzt durch", "status": "reserved"},
    "evidencedBy": {"uri": f"{BASE}/vocab/evidencedBy", "label": "wird nachgewiesen durch", "status": "reserved"},
    "replaces": {"uri": "https://schema.org/supersedes", "label": "ersetzt", "status": "reserved"},
    "supplements": {"uri": f"{BASE}/vocab/supplements", "label": "ergänzt", "status": "reserved"},
}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def stable_token(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def turtle_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


pages = load(DATA / "pages.json")
graph = load(DATA / "graph.json")
generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
page_by_id = {page["id"]: page for page in pages}
canonical_counts = Counter(page["canonical"] for page in pages)

degree = Counter()
for edge in graph["edges"]:
    degree[edge["source"]] += 1
    degree[edge["target"]] += 1
max_degree = max(degree.values(), default=1)

for node in graph["nodes"]:
    if node["type"] == "page":
        page = page_by_id[node["id"]]
        canonical_slug = Path(page["canonical"].split("?", 1)[0]).stem
        is_alias = canonical_counts[page["canonical"]] > 1 and page["slug"] != canonical_slug
        if is_alias:
            page["content_status"] = "duplicate-alias"
            page["canonical_entity"] = page["canonical"] + "#knowledge-graph-node"
            node["entityType"] = "ContentPageAlias"
            node["uri"] = f"{BASE}/{page['filename']}#knowledge-graph-node"
            node["canonicalEntity"] = page["canonical_entity"]
            node["contentStatus"] = "duplicate-alias"
        else:
            page["content_status"] = "published"
            node["entityType"] = "ContentPage"
            node["uri"] = page["canonical"] + "#knowledge-graph-node"
    else:
        node["entityType"] = "DefinedTerm"
        node["uri"] = f"{BASE}/id/defined-term/{stable_token(node['label'])}"
        node["synonyms"] = SYNONYMS.get(node["label"], [])
    node["metrics"] = {
        "degree": degree[node["id"]],
        "degreeCentrality": round(degree[node["id"]] / max_degree, 6),
    }

node_uri = {node["id"]: node["uri"] for node in graph["nodes"]}
for edge in graph["edges"]:
    source_page = page_by_id.get(edge["source"])
    edge["id"] = "edge:" + stable_token(f"{edge['source']}|{edge['type']}|{edge['target']}")
    edge["predicate"] = RELATIONS[edge["type"]]["uri"]
    edge["assertionStatus"] = "asserted" if edge["type"] == "linksTo" else "extracted"
    edge["reviewStatus"] = "source-confirmed" if edge["type"] == "linksTo" else "machine-generated-unreviewed"
    edge["confidence"] = 1.0 if edge["type"] == "linksTo" else 0.8
    edge["isInferred"] = False
    edge["provenance"] = {
        "source": source_page["canonical"] if source_page else node_uri.get(edge["source"]),
        "method": "deterministic-html-link" if edge["type"] == "linksTo" else "controlled-term-extraction",
        "generatedAt": generated_at,
        "generator": f"tbkg-static-pipeline/{VERSION}",
    }

graph["meta"].update({
    "generated_at": generated_at,
    "schema_version": VERSION,
    "method": "controlled static semantic pipeline v2",
    "inference_policy": "No unreviewed inferred edge is published as fact.",
    "metrics": {"degreeCentrality": {"algorithm": "undirected degree divided by maximum observed degree"}},
})
save(DATA / "graph.json", graph)
save(DATA / "pages.json", pages)

vocabulary = {
    "schemaVersion": VERSION,
    "id": f"{BASE}/knowledge-graph/data/vocabulary.json",
    "definedTermSet": f"{BASE}/id/defined-term-set/thomas-bade-knowledge-graph",
    "classes": [{"id": f"{BASE}/id/class/{name.lower()}", "label": name} for name in CLASSES],
    "relations": [{"id": key, **value} for key, value in RELATIONS.items()],
    "terms": [
        {"id": node["uri"], "label": node["label"], "synonyms": node.get("synonyms", []), "usageCount": node.get("count", 0)}
        for node in graph["nodes"] if node["type"] == "topic"
    ],
}
save(DATA / "vocabulary.json", vocabulary)

ontology = {
    "schemaVersion": VERSION,
    "baseUri": f"{BASE}/id/",
    "scope": "KI-Governance, Gesundheitswesen, Pflege, Sozialwirtschaft und generative Suche",
    "classes": vocabulary["classes"],
    "relations": vocabulary["relations"],
    "edgeStatusModel": ["asserted", "extracted", "inferred", "reviewed", "rejected", "deprecated"],
    "publicationRule": "Inferred relations require human review before publication as fact.",
}
save(DATA / "ontology.json", ontology)

dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": f"{BASE}/knowledge-graph/#dataset",
    "name": "Thomas Bade Knowledge Graph & GEO Dataset",
    "description": "Versionierter Wissensgraph zu KI-Governance, Standards und KI im Gesundheits- und Sozialwesen.",
    "url": f"{BASE}/knowledge-graph/",
    "creator": {"@type": "Person", "@id": f"{BASE}/#thomas-bade", "name": "Thomas Bade"},
    "inLanguage": "de-DE",
    "dateModified": generated_at,
    "version": VERSION,
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "isAccessibleForFree": True,
    "distribution": [
        {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": f"{BASE}/knowledge-graph/data/pages.json"},
        {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": f"{BASE}/knowledge-graph/data/graph.json"},
        {"@type": "DataDownload", "encodingFormat": "text/turtle", "contentUrl": f"{BASE}/knowledge-graph/data/graph.ttl"},
        {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": f"{BASE}/knowledge-graph/data/vocabulary.json"},
    ],
}
save(DATA / "dataset.jsonld", dataset)

ttl = [
    "@prefix schema: <https://schema.org/> .",
    "@prefix dcterms: <http://purl.org/dc/terms/> .",
    f"@prefix tbkg: <{BASE}/vocab/> .",
    "",
    f"<{BASE}/knowledge-graph/#dataset> a schema:Dataset ;",
    '  schema:name "Thomas Bade Knowledge Graph & GEO Dataset"@de ;',
    f'  schema:version "{VERSION}" ;',
    "  dcterms:license <https://creativecommons.org/licenses/by-nc-sa/4.0/> .",
    "",
]
for node in graph["nodes"]:
    kind = "schema:WebPage" if node["type"] == "page" else "schema:DefinedTerm"
    ttl.extend([f"<{node['uri']}> a {kind} ;", f'  schema:name "{turtle_text(node["label"])}"@de .', ""])
predicate_tokens = {value["uri"]: ("schema:about" if value["uri"] == "https://schema.org/about" else f"<{value['uri']}>") for value in RELATIONS.values()}
for edge in graph["edges"]:
    ttl.append(f"<{node_uri[edge['source']]}> {predicate_tokens[edge['predicate']]} <{node_uri[edge['target']]}> .")
(DATA / "graph.ttl").write_text("\n".join(ttl) + "\n", encoding="utf-8", newline="\n")

schemas = DATA / "schemas"
graph_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": f"{BASE}/knowledge-graph/data/schemas/graph.schema.json",
    "type": "object", "required": ["meta", "nodes", "edges"],
    "properties": {
        "nodes": {"type": "array", "items": {"type": "object", "required": ["id", "uri", "type", "entityType", "label"]}},
        "edges": {"type": "array", "items": {"type": "object", "required": ["id", "source", "target", "type", "predicate", "assertionStatus", "reviewStatus", "confidence", "isInferred", "provenance"]}},
    },
}
save(schemas / "graph.schema.json", graph_schema)
pages_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": f"{BASE}/knowledge-graph/data/schemas/pages.schema.json",
    "type": "array", "items": {"type": "object", "required": ["id", "slug", "canonical", "title", "summary", "topics", "seo_score", "geo_score", "ai_overview_probability"]},
}
save(schemas / "pages.schema.json", pages_schema)

shacl = f"""@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix schema: <https://schema.org/> .
@prefix tbkg: <{BASE}/vocab/> .

tbkg:ContentNodeShape a sh:NodeShape ;
  sh:targetClass schema:WebPage ;
  sh:property [ sh:path schema:name ; sh:minCount 1 ; sh:maxCount 1 ] .

tbkg:DefinedTermShape a sh:NodeShape ;
  sh:targetClass schema:DefinedTerm ;
  sh:property [ sh:path schema:name ; sh:minCount 1 ] .
"""
(schemas / "knowledge-graph.shacl.ttl").write_text(shacl, encoding="utf-8", newline="\n")

artifacts = [
    "pages.json", "graph.json", "vocabulary.json", "ontology.json", "dataset.jsonld",
    "graph.ttl", "schemas/graph.schema.json", "schemas/pages.schema.json", "schemas/knowledge-graph.shacl.ttl",
]
manifest = {
    "buildId": f"tbkg-{generated_at[:10].replace('-', '')}-{stable_token(graph['meta']['generated_at'])[:8]}",
    "generatedAt": generated_at,
    "generator": f"tbkg-static-pipeline/{VERSION}",
    "schemaVersion": VERSION,
    "source": {"repository": "https://github.com/ThomasBade/website", "branch": "main", "pageCount": len(pages)},
    "quality": {"nodeCount": len(graph["nodes"]), "edgeCount": len(graph["edges"]), "inferredPublished": 0},
    "artifacts": [
        {"path": path, "sha256": hashlib.sha256((DATA / path).read_bytes()).hexdigest()}
        for path in artifacts
    ],
}
save(DATA / "build-manifest.json", manifest)

api = {
    "apiVersion": "v1", "readOnly": True, "license": dataset["license"],
    "endpoints": {
        "pages": "../../data/pages.json", "graph": "../../data/graph.json",
        "dataset": "../../data/dataset.jsonld", "vocabulary": "../../data/vocabulary.json",
        "ontology": "../../data/ontology.json", "turtle": "../../data/graph.ttl",
        "manifest": "../../data/build-manifest.json",
    },
}
save(ROOT / "knowledge-graph" / "api" / "v1" / "index.json", api)

print(json.dumps(manifest["quality"], ensure_ascii=False))
