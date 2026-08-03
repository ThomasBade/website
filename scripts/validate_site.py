"""Dependency-free validation for the static GEO platform."""

from __future__ import annotations

import json
from pathlib import Path
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
    if page_count != 52:
        raise SystemExit(f"Expected 52 page records, found {page_count}")

    print(f"Validated {len(json_files)} JSON files, sitemap.xml and {page_count} pages.")


if __name__ == "__main__":
    main()
