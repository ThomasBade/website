"""Dependency-free validation for the static GEO platform."""

from __future__ import annotations

import json
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
    if page_count != 52:
        raise SystemExit(f"Expected 52 page records, found {page_count}")

    image_count = validate_local_images()
    print(
        f"Validated {len(json_files)} JSON files, sitemap.xml, "
        f"{page_count} pages and {image_count} image references."
    )


if __name__ == "__main__":
    main()
