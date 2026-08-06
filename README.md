# Thomas Bade Knowledge Graph & GEO Platform

Offene, statische Wissensplattform für KI-Governance, EU AI Act, ISO/IEC 42001 sowie KI im Gesundheits- und Sozialwesen.

## Zugänge

- Primäre Website: https://www.thomas-bade.de/
- Knowledge Graph & GEO-Dashboard: https://www.thomas-bade.de/knowledge-graph/
- GitHub-Pages-Spiegel: https://thomasbade.github.io/website/
- Maschinell lesbare Seitendaten: `knowledge-graph/data/pages.json`
- Vollständiger Knowledge Graph: `knowledge-graph/data/graph.json`
- Kontrolliertes Vokabular und Ontologie: `knowledge-graph/data/vocabulary.json`, `knowledge-graph/data/ontology.json`
- RDF/Turtle-Export: `knowledge-graph/data/graph.ttl`
- Dataset-Metadaten und Build-Provenienz: `knowledge-graph/data/dataset.jsonld`, `knowledge-graph/data/build-manifest.json`
- Statischer Agenten-Endpunkt: `knowledge-graph/api/v1/index.json`
- JSON-LD-, JSON- und Markdown-Exporte: `knowledge-graph/data/`
- LLM-Einstieg: `llms.txt`

## Inhalt

Das Repository enthält 52 Fachseiten mit semantischen Verknüpfungen, strukturierten Daten und zitierfähigen Kurzfassungen. Das GEO-Dashboard bewertet die Seiten unter anderem nach SEO- und GEO-Reife und bietet Exporte für Suchsysteme, KI-Agenten und LLMs.

## Zitieren und Methodik

- GitHub-Zitierfunktion: [`CITATION.cff`](CITATION.cff)
- Bewertungs- und Datenmethodik: [`METHODOLOGY.md`](METHODOLOGY.md)
- Semantische Architektur und Forschungsbasis: [`docs/SEMANTIC_ARCHITECTURE.md`](docs/SEMANTIC_ARCHITECTURE.md)
- Änderungen: [`CHANGELOG.md`](CHANGELOG.md)
- Nutzungsbedingungen: [`LICENSE.md`](LICENSE.md) – CC BY-NC-SA 4.0

Die Veröffentlichung erfolgt automatisiert über GitHub Actions und GitHub Pages. Inhaltlich maßgeblich sind die kanonischen URLs unter `www.thomas-bade.de`.

## Semantische Qualität

Der produktive Graph veröffentlicht ausschließlich explizite HTML-Verweise und deterministisch erkannte kontrollierte Begriffe. Jede Kante enthält Provenienz und Reviewstatus. Ungeprüfte LLM- oder Ähnlichkeitsinferenz wird nicht als Fakt publiziert. JSON Schema, SHACL-Grundregeln, Exportvollständigkeit und Manifest-Prüfsummen werden vor jedem GitHub-Pages-Deployment automatisiert geprüft.
