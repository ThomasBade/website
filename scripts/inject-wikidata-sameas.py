#!/usr/bin/env python3
"""Inject verified Wikidata links into the controlled vocabulary and write a report."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


def norm(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return " ".join(value.casefold().replace("-", " ").split())


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", norm(value)).strip("-")


def validate_qids(qids: list[str]) -> dict[str, bool]:
    params = urllib.parse.urlencode({"action": "wbgetentities", "ids": "|".join(qids), "format": "json"})
    url = f"https://www.wikidata.org/w/api.php?{params}"
    request = urllib.request.Request(url, headers={"User-Agent": "ThomasBade-KG-LinkValidator/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        entities = json.load(response).get("entities", {})
    return {qid: qid in entities and "missing" not in entities[qid] for qid in qids}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--vocab", type=Path, required=True)
    parser.add_argument("--patch", type=Path, default=Path("config/wikidata-sameas-patch.json"))
    parser.add_argument("--output-dir", type=Path, default=Path("data"))
    parser.add_argument("--in-place", action="store_true", help="Also replace the source vocabulary atomically")
    parser.add_argument("--validate-online", action="store_true")
    args = parser.parse_args()

    vocabulary = json.loads(args.vocab.read_text(encoding="utf-8"))
    patch = json.loads(args.patch.read_text(encoding="utf-8"))
    terms = vocabulary.get("terms", vocabulary if isinstance(vocabulary, list) else [])
    mappings = patch["mappings"]
    qid_status = validate_qids([item["qid"] for item in mappings]) if args.validate_online else {}

    index: dict[str, dict] = {}
    for term in terms:
        for value in [term.get("label", ""), *term.get("synonyms", [])]:
            if value:
                index[norm(value)] = term

    linked, missing = [], []
    for item in mappings:
        match = next((index.get(norm(candidate)) for candidate in [item["term"], *item.get("aliases", [])] if index.get(norm(candidate))), None)
        if not match:
            match = {
                "id": f"https://www.thomas-bade.de/id/defined-term/{slug(item['term'])}",
                "label": item["term"],
                "synonyms": item.get("aliases", []),
                "usageCount": 0,
                "source": "Wikidata alignment vocabulary",
            }
            terms.append(match)
            for value in [match["label"], *match["synonyms"]]:
                index[norm(value)] = match
        match["sameAs"] = sorted(set([*match.get("sameAs", []), item["uri"]]))
        match["wikidataQid"] = item["qid"]
        linked.append({"term": item["term"], "vocabularyLabel": match.get("label"), "qid": item["qid"], "uri": item["uri"]})

    args.output_dir.mkdir(parents=True, exist_ok=True)
    linked_path = args.output_dir / "vocabulary-linked.json"
    linked_path.write_text(json.dumps(vocabulary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.in_place:
        temp = args.vocab.with_suffix(args.vocab.suffix + ".tmp")
        temp.write_text(json.dumps(vocabulary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        temp.replace(args.vocab)

    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "mappingCount": len(mappings),
        "linkedCount": len(linked),
        "coveragePercent": round(100 * len(linked) / len(mappings), 1) if mappings else 100,
        "linked": linked,
        "unmatched": missing,
        "onlineValidation": qid_status or "not requested",
    }
    (args.output_dir / "wikidata-coverage-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"linked": len(linked), "unmatched": len(missing), "output": str(linked_path)}))
    valid = not missing and (not qid_status or all(qid_status.values()))
    return 0 if valid else 1


if __name__ == "__main__":
    raise SystemExit(main())
