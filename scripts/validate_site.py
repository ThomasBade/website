"""Dependency-free validation for the static GEO platform."""

from __future__ import annotations

import json
import hashlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_ROOT_FILES = (
    "CITATION.cff",
    "METHODOLOGY.md",
    "robots.txt",
    "llms.txt",
    "llms-full.txt",
    "sitemap.xml",
)

REQUIRED_KG_FILES = (
    "graph.json",
    "pages.json",
    "vocabulary.json",
    "ontology.json",
    "dataset.jsonld",
    "graph.ttl",
    "build-manifest.json",
    "schemas/graph.schema.json",
    "schemas/pages.schema.json",
    "schemas/knowledge-graph.shacl.ttl",
)


class ImageReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.sources: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "img":
            return
        source = dict(attrs).get("src")
        if source:
            self.sources.append(source)


def validate_local_images() -> int:
    checked = 0
    missing: list[str] = []
    for html_path in sorted(ROOT.rglob("*.html")):
        parser = ImageReferenceParser()
        parser.feed(html_path.read_text(encoding="utf-8", errors="replace"))
        for source in parser.sources:
            checked += 1
            parsed = urlsplit(source)
            if parsed.scheme in {"http", "https", "data"} or source.startswith("//"):
                continue
            local_path = unquote(parsed.path)
            if not local_path or local_path.startswith("#"):
                continue
            target = (
                ROOT / local_path.lstrip("/")
                if local_path.startswith("/")
                else html_path.parent / local_path
            )
            if not target.is_file():
                missing.append(f"{html_path.relative_to(ROOT)}: {source}")
    if missing:
        raise SystemExit("Missing local image references:\n" + "\n".join(missing))
    return checked


def main() -> None:
    missing = [name for name in REQUIRED_ROOT_FILES if not (ROOT / name).is_file()]
    if missing:
        raise SystemExit(f"Missing discovery files: {', '.join(missing)}")

    ElementTree.parse(ROOT / "sitemap.xml")

    json_files = sorted((ROOT / "knowledge-graph" / "data").rglob("*.json"))
    if not json_files:
        raise SystemExit("No Knowledge Graph JSON files found")
    for path in json_files:
        with path.open(encoding="utf-8") as handle:
            json.load(handle)

    pages = json.loads(
        (ROOT / "knowledge-graph" / "data" / "pages.json").read_text(encoding="utf-8")
    )
    page_count = len(pages) if isinstance(pages, list) else len(pages.get("pages", []))
    if page_count != 53:
        raise SystemExit(f"Expected 53 page records, found {page_count}")

    data_root = ROOT / "knowledge-graph" / "data"
    missing_kg = [name for name in REQUIRED_KG_FILES if not (data_root / name).is_file()]
    if missing_kg:
        raise SystemExit(f"Missing semantic artifacts: {', '.join(missing_kg)}")

    graph = json.loads((data_root / "graph.json").read_text(encoding="utf-8"))
    vocabulary = json.loads((data_root / "vocabulary.json").read_text(encoding="utf-8"))
    relation_types = {item["id"] for item in vocabulary["relations"]}
    node_ids = {node["id"] for node in graph["nodes"]}
    node_uris = {node.get("uri") for node in graph["nodes"]}
    if None in node_uris or len(node_uris) != len(graph["nodes"]):
        raise SystemExit("Every graph node must have a unique stable URI")

    edge_ids: set[str] = set()
    for edge in graph["edges"]:
        required = {
            "id", "source", "target", "type", "predicate", "assertionStatus",
            "reviewStatus", "confidence", "isInferred", "provenance",
        }
        missing_edge = required - set(edge)
        if missing_edge:
            raise SystemExit(f"Edge is missing fields: {sorted(missing_edge)}")
        if edge["id"] in edge_ids:
            raise SystemExit(f"Duplicate edge ID: {edge['id']}")
        edge_ids.add(edge["id"])
        if edge["source"] not in node_ids or edge["target"] not in node_ids:
            raise SystemExit(f"Edge references missing node: {edge['id']}")
        if edge["type"] not in relation_types:
            raise SystemExit(f"Undefined relation type: {edge['type']}")
        if edge["isInferred"] and edge["reviewStatus"] != "reviewed":
            raise SystemExit(f"Unreviewed inferred edge must not be published: {edge['id']}")
        provenance = edge["provenance"]
        for key in ("source", "method", "generatedAt", "generator"):
            if not provenance.get(key):
                raise SystemExit(f"Incomplete provenance on edge {edge['id']}: {key}")

    for page in pages:
        slug = page["slug"]
        for relative in (f"exports/{slug}.json", f"exports/{slug}.md", f"jsonld/{slug}.json"):
            if not (data_root / relative).is_file():
                raise SystemExit(f"Missing page export: {relative}")

    manifest = json.loads((data_root / "build-manifest.json").read_text(encoding="utf-8"))
    for artifact in manifest["artifacts"]:
        path = data_root / artifact["path"]
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != artifact["sha256"]:
            raise SystemExit(f"Manifest hash mismatch: {artifact['path']}")

    api_index = ROOT / "knowledge-graph" / "api" / "v1" / "index.json"
    if not api_index.is_file():
        raise SystemExit("Missing static agent API index")
    json.loads(api_index.read_text(encoding="utf-8"))

    image_count = validate_local_images()
    print(
        f"Validated {len(json_files)} JSON files, sitemap.xml, "
        f"{page_count} pages, {len(graph['nodes'])} nodes, {len(graph['edges'])} "
        f"provenanced edges and {image_count} image references."
    )


if __name__ == "__main__":
    main()
