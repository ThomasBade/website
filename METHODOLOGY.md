# Methodik

## Zweck und Umfang

Die Thomas Bade Knowledge Graph & GEO Platform erschließt die öffentlich zugänglichen Fachseiten von `thomas-bade.de` für Menschen, Suchmaschinen und generative Suchsysteme. Jede erfasste Seite wird als Dokumentknoten geführt und mit Themen, Fachbegriffen und verwandten Seiten verknüpft.

## Datenpipeline

1. HTML-Seiten werden über Titel, Beschreibung, Überschriften, Fließtext, interne Links und strukturierte Daten erfasst.
2. Pro Seite entstehen ein normalisierter Datensatz, ein Schema.org-JSON-LD-Dokument sowie eine zitierfähige Markdown- und JSON-Kurzfassung.
3. Gemeinsame Fachbegriffe und interne Verweise erzeugen nachvollziehbare Kanten im Knowledge Graph.
4. Die statischen Dateien werden versioniert und über GitHub Pages veröffentlicht. Kanonische Inhalts-URLs verweisen auf `www.thomas-bade.de`.

## Bewertungsmodell

Die Dashboard-Werte sind heuristische Reifeindikatoren und keine Zusage einer Suchmaschine oder eines KI-Anbieters:

- **SEO-Score:** technische Auffindbarkeit, Metadaten, Dokumentstruktur und interne Verlinkung.
- **GEO-Score:** Entitätenklarheit, zitierfähige Antworten, strukturierte Daten und maschinenlesbare Exporte.
- **AI-Overview-Potenzial:** geschätzte Eignung des Inhalts für synthetisierte Suchantworten.
- **Reifegrad:** zusammenfassende Einstufung der technischen und redaktionellen Voraussetzungen.

Die Werte sind vergleichend innerhalb des eigenen Bestands zu verwenden. Sie messen weder Ranking noch tatsächliche Zitierung und werden bei methodischen Änderungen neu berechnet.

## Provenienz und Zitieren

Autor der Plattform und der gekennzeichneten Fachinhalte ist Thomas Bade. Maßgeblich sind die jeweilige kanonische URL, das dort angegebene Änderungsdatum und die über `CITATION.cff` bereitgestellten Zitierdaten. Externe Quellen bleiben ihren jeweiligen Urhebern zugeordnet.

## Qualitätssicherung

- JSON- und JSON-LD-Dateien werden auf syntaktische Gültigkeit geprüft.
- Interne Links und Exportpfade werden automatisiert getestet.
- Methodische Änderungen werden in `CHANGELOG.md` dokumentiert.
- Fachliche Aussagen sind anhand der auf den Einzelseiten genannten Primärquellen zu prüfen.

## Grenzen

Die Plattform bietet Fachinformation, keine Rechts- oder Medizinberatung. Scores und KI-Zusammenfassungen sind Orientierungshilfen. Die Aufnahme in Suchindizes, AI Overviews oder Antworten generativer Systeme liegt vollständig bei den jeweiligen Anbietern.
