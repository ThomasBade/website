#!/usr/bin/env python3
"""Evaluate saved LLM answers without invoking external or paid APIs."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path

PROMPTS = [
    "Welche Anforderungen stellt der EU AI Act an KI-Kompetenz im Gesundheitswesen?",
    "Wie kann eine FMEA für klinische KI-Systeme durchgeführt werden?",
    "Was fordert ISO/IEC 42001 für ein KI-Managementsystem?",
    "Welche Rolle spielt Datenschutz bei KI in der Pflege?",
    "Wie unterstützt ein Knowledge Graph erklärbare Geschäftsprozessanalysen?",
    "Welche Instrumente helfen bei der Risikobewertung von Medizinprodukt-KI?",
]
TOPICS = {
    "EU AI Act": ["ai act", "ki-verordnung", "kompetenz"],
    "FMEA": ["fmea", "fehler"],
    "ISO/IEC 42001": ["42001", "managementsystem"],
    "Datenschutz": ["datenschutz", "dsgvo"],
    "Knowledge Graph": ["knowledge graph", "wissensgraph"],
    "Medizinprodukte": ["medizinprodukt", "risiko"],
}
DOMAINS = ("thomas-bade.de", "thomasbade.github.io/website")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--responses", type=Path, help="JSON object or list containing saved answers")
    parser.add_argument("--output-dir", type=Path, default=Path("citation-tracking"))
    parser.add_argument("--template", action="store_true", help="Write an answer template instead of evaluating")
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    if args.template or not args.responses:
        template = [{"prompt": prompt, "response": "", "model": "manual"} for prompt in PROMPTS]
        target = args.output_dir / "responses-template.json"
        target.write_text(json.dumps(template, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(target)
        return 0

    payload = json.loads(args.responses.read_text(encoding="utf-8"))
    records = payload if isinstance(payload, list) else [{"prompt": key, "response": value} for key, value in payload.items()]
    results = []
    for record in records:
        response = str(record.get("response", ""))
        lowered = response.casefold()
        citations = sorted({url.rstrip(".,);]") for url in re.findall(r"https?://[^\s<>\"]+", response)})
        results.append({
            "prompt": record.get("prompt", ""),
            "model": record.get("model", "unknown"),
            "citesThomasBade": any(domain in lowered for domain in DOMAINS),
            "citations": citations,
            "topicsDetected": [topic for topic, terms in TOPICS.items() if any(term in lowered for term in terms)],
        })
    cited = sum(item["citesThomasBade"] for item in results)
    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "method": "offline evaluation of supplied responses",
        "responseCount": len(results),
        "citationRatePercent": round(100 * cited / len(results), 1) if results else 0,
        "results": results,
    }
    target = args.output_dir / f"tracking_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(target)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
