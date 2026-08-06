# Semantische Architektur und Forschungsbasis

## Zielbild

Die Thomas Bade Knowledge Graph & GEO Platform bildet die Fachinhalte als gerichteten, kantenbeschrifteten Graphen ab. Sie verbindet nachvollziehbare Dokumentknoten, kontrollierte Fachbegriffe und explizite Seitenbeziehungen. Das Modell ist für Suchmaschinen, generative Suchsysteme, KI-Agenten und semantische Werkzeuge statisch abrufbar, ohne eine laufende Graphdatenbank vorauszusetzen.

## Forschungsbasierte Leitlinien

Die Architektur setzt drei wiederkehrende Anforderungen aus Forschung und Audit um:

1. **Mehrere Einsatzebenen:** Knowledge Graphs können vor, innerhalb oder nach einem KI-Modell für Konstruktion, Merkmalsextraktion, Relationsextraktion und Schlussfolgerung eingesetzt werden. Die Plattform stellt deshalb Rohdaten, normalisierte Begriffe, Relationen und zitierfähige Seitenauszüge getrennt bereit.
2. **Abstraktion und Instanzen:** Das kontrollierte Vokabular und die Ontologie bilden die abstrakte Begriffsebene; Seiten, Dokumente und konkrete Aussagen bilden die Instanzebene. Gerichtete, typisierte Kanten machen den Übergang nachvollziehbar.
3. **Erklärbarkeit vor Vollautomatisierung:** Die Qualität eines erklärenden Systems hängt von der Qualität und Herkunft seines Wissens ab. Deshalb veröffentlicht die Plattform keine ungeprüften LLM- oder Ähnlichkeitsinferenzkanten als Fakten.

## Produktive Schichten

| Schicht | Artefakt | Funktion |
|---|---|---|
| Dokumente | `pages.json` und seitenweise Exporte | Inhalte, Zusammenfassungen, Scores und Metadaten |
| Begriffe | `vocabulary.json` | Kanonische Benennungen, Synonyme und stabile URIs |
| Ontologie | `ontology.json` | Klassen, zulässige Prädikate und Statusmodell |
| Graph | `graph.json`, `graph.ttl` | Knoten und gerichtete, provenienzbehaftete Kanten |
| Austausch | `dataset.jsonld`, `api/v1/index.json` | Schema.org-Dataset und statische Agenten-API |
| Qualität | JSON Schema, SHACL, Build-Manifest | Strukturregeln, Prüfsummen und reproduzierbarer Build |

## Aussage- und Reviewmodell

Jede produktive Kante besitzt eine stabile ID, ein Prädikat, eine Erzeugungsmethode, eine Quelle, einen Zeitstempel, eine Konfidenz sowie Aussage- und Reviewstatus. Deterministisch extrahierte Begriffe und explizite HTML-Verweise sind als solche gekennzeichnet. Eine inferierte Kante darf nur veröffentlicht werden, wenn sie fachlich geprüft und als `reviewed` markiert ist.

Die derzeit produktiven Prädikate `about` und `linksTo` vermeiden eine fachliche Überinterpretation. Domänenspezifische Beziehungen wie `requires`, `implements`, `measures` oder `evidencedBy` sind im Vokabular vorbereitet, werden aber erst mit überprüfbarer Quellenstelle freigeschaltet.

## Stabile Identität und Zitierbarkeit

- Seiten und Begriffe besitzen global eindeutige URIs.
- Synonyme werden auf einen kanonischen Begriff abgebildet.
- Das Build-Manifest dokumentiert Generator- und Schema-Version, Umfang und SHA-256-Prüfsummen.
- Dataset-Metadaten beschreiben Lizenz und Distributionen.
- Originale, extrahierte und inferierte Aussagen bleiben unterscheidbar.
- Doppelte Inhalte werden als Alias gekennzeichnet, nicht als eigenständige kanonische Entität ausgegeben.

## Ausbaupfad

Die statische Architektur bleibt maßgeblich, solange dateibasierte Exporte und GitHub Pages den Nutzungsbedarf erfüllen. Fachliche Inferenz, zusätzliche Ontologieklassen oder eine Graphdatenbank werden erst ergänzt, wenn belastbare Anwendungsfälle, Quellenregeln, Reviewverantwortung und messbarer Mehrwert vorliegen.

## Literaturgrundlage

- Rajabi, E.; Etminani, K.: *Knowledge-graph-based explainable AI: A systematic review*.
- Füßl, A.; Nissen, V.; Heringklee, J.: *Knowledge-graph-based explainable artificial intelligence for business process analysis*.
- *Knowledge Graph Audit thomas-bade.de 2026*: technischer und strategischer Audit der vorhandenen Plattform.
