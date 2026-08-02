/**
 * FMEA-Glossar - Floating Button mit Ein-/Ausblenden
 * Für thomas-bade.de/fmea.html
 * Standalone-Lösung ohne Änderung am existierenden Stylesheet
 * Präfix: fmea-glossar- (kein Konflikt mit monitoring-glossar.js)
 */

(function() {
    'use strict';

    // Glossar-Daten
    const glossar = {
        'FMEA': {
            term: 'FMEA (Failure Mode and Effects Analysis)',
            definition: 'Fehlermöglichkeits- und Einflussanalyse – eine strukturierte, präventive Methode zur systematischen Identifikation, Bewertung und Priorisierung potenzieller Fehler in Prozessen, Systemen oder Produkten, bevor diese auftreten. Im Gesundheitswesen Pflicht nach ISO 14971 und EU AI Act Art. 9.'
        },
        'RPZ': {
            term: 'RPZ – Risikopriorätszahl',
            definition: 'Risk Priority Number (RPN). Kennzahl der FMEA, berechnet als Produkt A × B × E. Je höher der Wert, desto dringender ist eine Korrekturmaßnahme erforderlich. Handlungsschwelle in der Regel RPZ ≥ 125.'
        },
        'Auftreten (A)': {
            term: 'Auftreten (A)',
            definition: 'FMEA-Kriterium: Wie wahrscheinlich tritt ein bestimmter Fehler auf? Bewertet auf einer Skala von 1 (nahezu ausgeschlossen) bis 10 (tritt ständig auf). Wird durch historische Fehlerdaten, Post-Market-Daten und Expertenschätzung kalibriert.'
        },
        'Bedeutung (B)': {
            term: 'Bedeutung (B)',
            definition: 'FMEA-Kriterium: Wie schwerwiegend sind die Folgen des Fehlers für den Patienten, die Einrichtung oder den Betrieb? Skala 1 (keine Auswirkung) bis 10 (existenzbedrohend / Patiententod). Entspricht dem Severity-Wert (S) in internationaler Notation.'
        },
        'Entdeckung (E)': {
            term: 'Entdeckung (E)',
            definition: 'FMEA-Kriterium: Wie wahrscheinlich ist es, dass ein Fehler NICHT entdeckt wird, bevor er Auswirkungen hat? Skala 1 (zwangsläufig erkannt) bis 10 (nicht erkennbar). Entspricht dem Detection-Wert (D). Hohe E-Werte fordern bessere Erkennungsmechanismen.'
        },
        'Fehlermode': {
            term: 'Fehlermode (Failure Mode)',
            definition: 'Die Art, auf die eine Komponente, ein Prozess oder ein System ausfallen oder fehlerhaft funktionieren kann. Beispiel KI: falsch-negative Diagnose, Modell-Drift, Halluzination, Out-of-Distribution-Ausgabe.'
        },
        'Fehlerursache': {
            term: 'Fehlerursache (Root Cause)',
            definition: 'Die eigentliche Ursache, die einen Fehlermode auslöst. Beispiele: fehlende Trainingsdaten, unzureichendes Human Oversight, mangelnde KI-Kompetenz der Anwender, veraltete Modellversion.'
        },
        'Fehlerauswirkung': {
            term: 'Fehlerauswirkung (Failure Effect)',
            definition: 'Die Konsequenz eines Fehlermodes für den Patienten, den klinischen Prozess oder die Organisation. Grundlage für die Bewertung des B-Kriteriums. Unterscheidung: lokale Wirkung (Subsystem) vs. systemische Wirkung (gesamter Versorgungsprozess).'
        },
        'Design-FMEA': {
            term: 'Design-FMEA (D-FMEA)',
            definition: 'FMEA-Typ zur Analyse potenzieller Fehler in der Entwicklungs- und Designphase eines KI-Systems oder Medizinprodukts. Pflicht nach MDR Annex I und EU AI Act Art. 9. Ziel: Fehler verhindern, bevor das System in Betrieb geht.'
        },
        'Prozess-FMEA': {
            term: 'Prozess-FMEA (P-FMEA)',
            definition: 'FMEA-Typ zur Analyse von Fehlern in klinischen oder organisatorischen Arbeitsabläufen, in die ein KI-System eingebettet ist. Relevant für Betreiber nach EU AI Act Art. 26. Analysiert z.B. Workflow-Brüche bei KI-gestützter Diagnostik.'
        },
        'System-FMEA': {
            term: 'System-FMEA (S-FMEA)',
            definition: 'FMEA-Typ zur ganzheitlichen Betrachtung von Systemgrenzen und Schnittstellen zwischen Komponenten, z.B. KI-Modell, KIS/RIS/PACS-Integration, klinischer Workflow und organisatorische Prozesse.'
        },
        'Software-FMEA': {
            term: 'Software-FMEA',
            definition: 'Spezialisierte FMEA für Softwarekomponenten nach IEC 62304. Anwendbar auf KI-Softwaremodule in Medizinprodukten. Analysiert Fehler auf Ebene von Algorithmen, Schnittstellen, Datenflüssen und Systemzuständen.'
        },
        'AI-FMEA': {
            term: 'AI-FMEA (KI-gestützte FMEA)',
            definition: 'Erweiterung der klassischen FMEA durch KI-Technologien wie Machine Learning, NLP und Predictive Analytics. Ermöglicht dynamische RPZ-Aktualisierung auf Basis von Real-time-Daten aus Post-Market Surveillance, Logs und klinischen Quellen. Wandelt FMEA von statischer Dokumentation in kontinuierliches Risikomanagementsystem.'
        },
        'Dynamische RPZ': {
            term: 'Dynamische RPZ',
            definition: 'Erweiterung des klassischen RPZ-Konzepts: A, B und E werden kontinuierlich auf Basis realer Betriebsdaten neu kalibriert, statt bei Erstbewertung eingefroren zu bleiben. Kernelement der AI-FMEA. Ermöglicht frühzeitigere Erkennung kritischer Fehlertrends.'
        },
        'Post-Market Surveillance': {
            term: 'Post-Market Surveillance (PMS)',
            definition: 'Systematische Datenerhebung und -auswertung nach dem Inverkehrbringen. Pflicht nach MDR Art. 83–86 und EU AI Act Art. 72. PMS-Daten fließen als zentrale Datenquelle in die dynamische FMEA-Aktualisierung ein.'
        },
        'Post-Market Monitoring': {
            term: 'Post-Market Monitoring (PMM)',
            definition: 'Kontinuierliche Überwachung eines KI-Systems im realen Betrieb nach der Inbetriebnahme. Nach EU AI Act Art. 72 Pflicht für Anbieter und Betreiber von Hochrisiko-KI. Ergänzt die FMEA durch laufende Rückmeldung aus dem Betrieb.'
        },
        'ISO 14971': {
            term: 'ISO 14971:2019',
            definition: 'Internationaler Standard für das Risikomanagement von Medizinprodukten und KI-Systemen im Gesundheitswesen. Bildet das methodische Fundament jeder FMEA. Fordert iteratives Risikomanagement über den gesamten Produktlebenszyklus inkl. Post-Market-Phase.'
        },
        'EU AI Act': {
            term: 'EU AI Act (VO (EU) 2024/1689)',
            definition: 'EU-Verordnung zur Regulierung von Künstlicher Intelligenz. Art. 9 schreibt ein Risikomanagementsystem vor, das strukturell dem FMEA-Ansatz entspricht. Pflichten für Hochrisiko-KI (Annex III) ab 2. August 2026 wirksam.'
        },
        'Hochrisiko-KI': {
            term: 'Hochrisiko-KI (Annex III)',
            definition: 'KI-Systeme, die erhebliche Risiken für Gesundheit, Sicherheit oder Grundrechte darstellen. Im Gesundheitswesen: KI in Medizinprodukten (Annex III Nr. 5), KI zur Diagnoseunterstützung. Unterliegen erweiterten Pflichten nach EU AI Act Art. 9–17, insbesondere FMEA-ähnlichem Risikomanagement.'
        },
        'MDR': {
            term: 'MDR (Medical Device Regulation)',
            definition: 'EU-Medizinprodukteverordnung (EU) 2017/745. KI-Systeme, die als Medizinprodukt klassifiziert sind, benötigen eine FMEA als Teil der technischen Dokumentation (DHF) und als Voraussetzung für die CE-Kennzeichnung.'
        },
        'IVDR': {
            term: 'IVDR (In-Vitro-Diagnostika-Verordnung)',
            definition: 'EU-Verordnung (EU) 2017/746 für In-vitro-Diagnostika. KI-basierte Diagnostiksysteme (z.B. KI-Pathologie, KI-Laboranalyse) fallen unter IVDR und erfordern FMEA als Teil des Risikomanagements.'
        },
        'Design History File': {
            term: 'Design History File (DHF) / Technische Dokumentation',
            definition: 'Dokumentenmappe, die den gesamten Entwicklungsprozess eines Medizinprodukts nachweist: Risikoanalysen (FMEA), Verifizierung, Validierung, klinische Bewertung. Pflicht für CE-Kennzeichnung nach MDR. Die FMEA ist zentraler Bestandteil der DHF.'
        },
        'ALARP': {
            term: 'ALARP-Prinzip',
            definition: '"As Low As Reasonably Practicable" – Risikominderungsprinzip der ISO 14971: Risiken sind so weit zu reduzieren, wie es vernünftigerweise praktikabel ist. Bildet die Entscheidungsgrundlage für Maßnahmenpriorisierung nach RPZ-Bewertung.'
        },
        'Intended Use': {
            term: 'Intended Use (Zweckbestimmung)',
            definition: 'Die vom Hersteller vorgesehene Verwendung eines KI-Systems oder Medizinprodukts. Grundlage für die FMEA-Scope-Festlegung. Betreiber, die ein KI-System außerhalb des Intended Use einsetzen, übernehmen die Herstellerhaftung (EU AI Act Art. 26 Abs. 1 lit. b).'
        },
        'Reasonably Foreseeable Misuse': {
            term: 'Reasonably Foreseeable Misuse',
            definition: 'Vorhersehbarer Fehlgebrauch: Nutzungsszenarien außerhalb des Intended Use, die vernünftigerweise erwartet werden können. Muss nach ISO 14971 und EU AI Act Art. 9 in der FMEA berücksichtigt werden.'
        },
        'FRIA': {
            term: 'FRIA (Fundamental Rights Impact Assessment)',
            definition: 'Grundrechts-Folgenabschätzung nach EU AI Act Art. 27. Pflicht für Betreiber von Hochrisiko-KI aus dem öffentlichen Sektor und bestimmten privaten Einrichtungen. Ergänzt die technische FMEA um eine grundrechtliche Perspektive (Diskriminierung, Würde, Datenschutz).'
        },
        'DSFA': {
            term: 'DSFA (Datenschutz-Folgenabschätzung)',
            definition: 'Data Protection Impact Assessment (DPIA) nach Art. 35 DSGVO. Bei KI-Systemen, die Gesundheitsdaten in großem Umfang verarbeiten, Pflicht. Ergänzt die FMEA um datenschutzrechtliche Risikobetrachtung. Sinnvoll: integriertes FMEA-DSFA-Dokument.'
        },
        'CAPA': {
            term: 'CAPA (Corrective and Preventive Action)',
            definition: 'Korrektur- und Vorbeugemaßnahmen im Qualitätsmanagement. FMEA-Maßnahmen bei RPZ ≥ 125 werden als CAPA-Einträge dokumentiert, mit Verantwortlichem, Frist und Wirksamkeitsprüfung. Standard nach ISO 9001 und DIN EN 15224.'
        },
        'IEC 62304': {
            term: 'IEC 62304',
            definition: 'Internationaler Standard für den Lebenszyklus von Medizingeräte-Software. Schreibt für sicherheitskritische Software-Klassen (B und C) eine Software-FMEA und Risikoanalyse vor. Anwendbar auf KI-Softwaremodule in Medizinprodukten.'
        },
        'NLP': {
            term: 'NLP (Natural Language Processing)',
            definition: 'Natürliche Sprachverarbeitung. In der AI-FMEA eingesetzt, um Freitexte (klinische Notizen, Vigilanz-Meldungen, Audit-Berichte) automatisch auf Hinweise auf bekannte Fehlermodi zu scannen. Ermöglicht schnellere und vollständigere Fehlermodenidentifikation.'
        },
        'Machine Learning': {
            term: 'Machine Learning (ML)',
            definition: 'Teilgebiet der KI, das Modelle durch Training auf Daten erstellt. In der AI-FMEA: ML-Modelle erkennen Fehlermuster in großen Datensätzen (Post-Market-Daten, Vorfallsberichte), die manuell nicht entdeckt würden, und kalibrieren RPZ-Werte automatisch.'
        },
        'Predictive Analytics': {
            term: 'Predictive Analytics',
            definition: 'Prädiktive Analytik: statistische und ML-basierte Methoden zur Vorhersage zukünftiger Ereignisse auf Basis historischer Daten. In der AI-FMEA: Vorhersage von Fehlermustern und Risikoschwellenwert-Überschreitungen, bevor sie klinisch sichtbar werden.'
        },
        'Halluzination': {
            term: 'Halluzination (KI-Fehlermode)',
            definition: 'Spezifischer Fehlermode von generativen KI-Modellen (LLMs): Das Modell erzeugt faktenwidrige, erfundene oder inkonsistente Ausgaben mit hoher scheinbarer Konfidenz. In der FMEA als eigenständiger Fehlermode mit hohem B-Wert zu bewerten, wenn KI-Ausgaben direkt in klinische Entscheidungen einfließen.'
        },
        'Out-of-Distribution': {
            term: 'Out-of-Distribution (OOD)',
            definition: 'Fehlermode: Das KI-System erhält Eingabedaten, die sich wesentlich von den Trainingsdaten unterscheiden (z.B. andere Patientenpopulation, anderes Gerät). OOD-Verhalten führt zu unzuverlässigen Ausgaben, die vom Modell aber oft mit hoher Konfidenz ausgegeben werden.'
        },
        'Adversarial Attack': {
            term: 'Adversarial Attack (Angriffs-Fehlermode)',
            definition: 'Gezielter Angriff auf ein KI-System durch minimale, für Menschen unsichtbare Modifikation der Eingabedaten, die zu dramatisch falschen Ausgaben führen. In der FMEA bei Hochrisiko-KI als Fehlermode zu berücksichtigen; relevant nach EU AI Act Art. 15 und NIS2.'
        },
        'Bias': {
            term: 'Bias (Verzerrung)',
            definition: 'Systematische Verzerrung in KI-Modellen oder Trainingsdaten, die zu ungleich verteilten Fehlern über Patientengruppen, Demografien oder Einrichtungstypen führt. FMEA-Fehlermode mit hohem B-Wert; muss in Grundrechts-Folgenabschätzung (FRIA) adressiert werden.'
        },
        'Modell-Drift': {
            term: 'Modell-Drift',
            definition: 'Schleichender Leistungsabfall eines KI-Modells durch Veränderungen in Daten, Patientenpopulation oder Arbeitsabläufen. Typischer Post-Market-Fehlermode; erfordert kontinuierliches Monitoring und definierte RPZ-Schwellenwerte für Revalidierung.'
        },
        'Human Oversight': {
            term: 'Human Oversight',
            definition: 'Menschliche Aufsicht und Kontrolle über KI-Entscheidungen nach EU AI Act Art. 14. Pflicht für Betreiber von Hochrisiko-KI. In der FMEA senkt ein robuster Human-Oversight-Prozess den E-Wert (Entdeckungswahrscheinlichkeit) für viele Fehlermodi.'
        },
        'Override-Protokoll': {
            term: 'Override-Protokoll',
            definition: 'Dokumentierter Prozess, mit dem klinisches Personal eine KI-Ausgabe bewusst übersteuert oder ablehnt. Reduziert den E-Wert in der FMEA. Pflicht nach EU AI Act Art. 14 Abs. 4: Betreiber müssen sicherstellen, dass Human Oversight technisch und organisatorisch möglich ist.'
        },
        'Stop-Use-Kriterium': {
            term: 'Stop-Use-Kriterium',
            definition: 'Vordefinierter Auslöser, bei dem ein KI-System sofort außer Betrieb genommen werden muss, z.B. bei Überschreitung eines Schwellenwerts im Post-Market Monitoring oder bei einem schwerwiegenden Vorfall. Direkt aus FMEA-Maßnahmenplan abzuleiten.'
        },
        'Logging / Protokollierung': {
            term: 'Logging / Protokollierung',
            definition: 'Automatische Aufzeichnung von KI-Systemereignissen: Eingaben, Ausgaben, Nutzer, Zeitstempel, Modellversion. Pflicht nach EU AI Act Art. 12 und Art. 26 Abs. 6 (mind. 6 Monate). Logs sind zentrale Datenquelle für die dynamische FMEA-Aktualisierung und für den Nachweis im Ereignisfall.'
        },
        'Incident (Vorfall)': {
            term: 'Incident (Schwerwiegender Vorfall)',
            definition: 'Ereignis, das zu einem Patientenschaden oder einer erheblichen Beeinträchtigung geführt hat oder hätte führen können. Meldepflicht nach EU AI Act Art. 73 (15-Tage-Frist im Gesundheitsbereich). Jeder Incident löst eine FMEA-Aktualisierung aus.'
        },
        'Vigilanz': {
            term: 'Vigilanz',
            definition: 'Systematische Überwachung von Medizinprodukten nach dem Inverkehrbringen, insbesondere die Meldung schwerwiegender Vorkommnisse an die zuständige Behörde (EUDAMED, BfArM). Pflicht nach MDR Art. 87. Vigilanz-Meldungen fließen als Datenquelle in die FMEA ein.'
        },
        'EUDAMED': {
            term: 'EUDAMED',
            definition: 'Europäische Datenbank für Medizinprodukte. Enthält Post-Market-Surveillance-Daten, Vigilanz-Meldungen und Informationen zu CE-zertifizierten Produkten. Pflichtnutzung für Hersteller nach MDR. Für Betreiber relevante Datenquelle für FMEA-Grundlagenrecherche.'
        },
        'KI-Kompetenz': {
            term: 'KI-Kompetenz (Art. 4 EU AI Act)',
            definition: 'Nach EU AI Act Art. 4 müssen Betreiber von KI-Systemen sicherstellen, dass einsetzendes Personal über hinreichende KI-Kompetenz verfügt. In der FMEA: mangelnde KI-Kompetenz erhöht den A-Wert (Auftreten von Fehlern durch Fehlbedienung) und den E-Wert (Fehler werden nicht erkannt).'
        },
        'Annex III': {
            term: 'Annex III (EU AI Act)',
            definition: 'Liste der Hochrisiko-KI-Anwendungen im EU AI Act. Für das Gesundheitswesen relevant: Nr. 5 (KI in Medizinprodukten nach MDR/IVDR) und ggf. Nr. 1 (biometrische Systeme). KI-Systeme in Annex III unterliegen dem vollständigen Pflichtenprogramm Art. 9–17.'
        },
        'Technische Dokumentation': {
            term: 'Technische Dokumentation (Annex IV EU AI Act)',
            definition: 'Umfassendes Dokumentationspaket für Hochrisiko-KI-Systeme nach EU AI Act Annex IV. Beinhaltet u.a. Systembeschreibung, Risikomanagement, Trainingsdaten, Validierungsergebnisse, Monitoring-Konzept. Die FMEA ist zentraler Bestandteil dieser Dokumentation.'
        },
        'KI-Risikoklassen': {
            term: 'KI-Risikoklassen (EU AI Act)',
            definition: 'Vierstufiges Risikomodell des EU AI Act: (1) Verbotene KI (Art. 5), (2) Hochrisiko-KI (Annex III, Art. 6–51), (3) KI mit Transparenzpflichten (Art. 50), (4) Minimales/kein Risiko. Die FMEA-Intensität richtet sich nach der Risikoklasse.'
        },
        'Fehlermode-Identifikation': {
            term: 'Fehlermode-Identifikation',
            definition: 'Erster Schritt der FMEA: systematische Erarbeitung aller potenziellen Fehlermodi eines Systems im Team. Quellen: Herstellerdokumentation, Expertenwissen, EUDAMED/BfArM-Meldungen, Fachliteratur, frühere FMEA-Versionen und für KI: Logging-Auswertungen und Post-Market-Daten.'
        },
        'Maßnahmenplan': {
            term: 'Maßnahmenplan (FMEA)',
            definition: 'Dokumentierter Plan mit Optimierungsmaßnahmen für alle Fehlermodi mit RPZ ≥ 125 (oder einrichtungsspezifisch definiertem Schwellenwert). Enthält: Maßnahmenbeschreibung, Verantwortlicher, Umsetzungsfrist, Wirksamkeitsprüfung. Basis für CAPA-Prozesse.'
        },
        'Revalidierung': {
            term: 'Revalidierung',
            definition: 'Erneute Prüfung eines KI-Systems nach Änderungen, Leistungsabfall oder Überschreitung von Monitoring-Schwellenwerten. Löst eine FMEA-Aktualisierung aus. In der AI-FMEA: automatisch getriggert, wenn definierte KPIs aus dem Post-Market Monitoring überschritten werden.'
        },
        'Risikomanagement-Akte': {
            term: 'Risikomanagement-Akte',
            definition: 'Nach ISO 14971 gefordertes Gesamtdokument, das alle Risikomanagement-Aktivitäten nachweist: Risikoanalyse (FMEA), Risikobewertung, Risikominderungsmaßnahmen, Restrisikobewertung, Post-Market-Erkenntnisse. Wird während des gesamten Produktlebenszyklus gepflegt.'
        },
        'Akzeptanzschwelle': {
            term: 'Akzeptanzschwelle (Risikobewertung)',
            definition: 'Einrichtungsspezifisch definierter RPZ-Wert, ab dem ein Risiko als nicht mehr akzeptabel gilt und zwingend eine Korrekturmaßnahme erforderlich ist. Übliche Praxis: RPZ ≥ 125 = Maßnahme erforderlich; RPZ ≥ 200 = sofortige Eskalation.'
        },
        'Severity (S)': {
            term: 'Severity (S) / Bedeutung (B)',
            definition: 'Internationaler Begriff (AIAG FMEA Handbook) für das FMEA-Kriterium Bedeutung/Schweregrad. In der deutschen Notation meist als B bezeichnet. Beschreibt, wie schwerwiegend die Auswirkungen eines Fehlermodes auf den Patienten, die Einrichtung oder den Betrieb sind.'
        },
        'Occurrence (O)': {
            term: 'Occurrence (O) / Auftreten (A)',
            definition: 'Internationaler Begriff für das FMEA-Kriterium Auftreten. In der deutschen Notation als A bezeichnet. Beschreibt, wie häufig ein Fehlermode unter den gegebenen Prozess- und Betriebsbedingungen auftreten wird.'
        },
        'Detection (D)': {
            term: 'Detection (D) / Entdeckung (E)',
            definition: 'Internationaler Begriff für das FMEA-Kriterium Entdeckung. In der deutschen Notation als E bezeichnet. Beschreibt, wie wahrscheinlich es ist, dass ein Fehler NICHT entdeckt wird, bevor er Auswirkungen entfaltet. Hohe D-Werte fordern verbesserte Erkennungsmechanismen.'
        }
    };

    // CSS – Präfix fmea-glossar- (kein Konflikt mit monitoring-glossar.js)
    const style = document.createElement('style');
    style.textContent = `
        #fmea-glossar-toggle {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 60px;
            height: 60px;
            background: #ffc451;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9998;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1a1a1a;
            font-size: 22px;
            font-weight: bold;
        }

        #fmea-glossar-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        #fmea-glossar-toggle:active {
            transform: scale(0.95);
        }

        #fmea-glossar-panel {
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 420px;
            max-width: calc(100vw - 60px);
            max-height: 70vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #fmea-glossar-panel.active {
            display: flex;
            animation: fmeaGlossarSlideIn 0.3s ease;
        }

        @keyframes fmeaGlossarSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fmea-glossar-header {
            background: #1a1a1a;
            color: #ffc451;
            padding: 16px 20px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            letter-spacing: 0.3px;
        }

        .fmea-glossar-header span {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .fmea-glossar-count {
            background: #ffc451;
            color: #1a1a1a;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 10px;
            min-width: 22px;
            text-align: center;
        }

        .fmea-glossar-close {
            background: none;
            border: none;
            color: #ffc451;
            font-size: 22px;
            cursor: pointer;
            padding: 0;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
            line-height: 1;
        }

        .fmea-glossar-close:hover {
            background: rgba(255, 196, 81, 0.15);
        }

        .fmea-glossar-search {
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
            background: #fafafa;
        }

        .fmea-glossar-search input {
            width: 100%;
            padding: 9px 14px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            color: #2d3748;
            background: #fff;
            transition: border-color 0.2s;
        }

        .fmea-glossar-search input:focus {
            outline: none;
            border-color: #2c5282;
        }

        .fmea-glossar-search input::placeholder {
            color: #a0aec0;
        }

        .fmea-glossar-content {
            flex: 1;
            overflow-y: auto;
            padding: 12px 16px;
        }

        .fmea-glossar-content::-webkit-scrollbar {
            width: 5px;
        }
        .fmea-glossar-content::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .fmea-glossar-content::-webkit-scrollbar-thumb {
            background: #ffc451;
            border-radius: 3px;
        }

        .fmea-glossar-item {
            margin-bottom: 18px;
            padding-bottom: 18px;
            border-bottom: 1px solid #f0f0f0;
        }

        .fmea-glossar-item:last-child {
            border-bottom: none;
            margin-bottom: 4px;
        }

        .fmea-glossar-term {
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 6px;
            font-size: 14px;
            line-height: 1.35;
        }

        .fmea-glossar-definition {
            color: #4a5568;
            line-height: 1.6;
            font-size: 13px;
        }

        .fmea-glossar-empty {
            text-align: center;
            color: #a0aec0;
            padding: 40px 20px;
            font-style: italic;
            font-size: 14px;
        }

        .fmea-glossar-footer {
            padding: 8px 16px;
            background: #f7fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #a0aec0;
            text-align: right;
        }

        @media (max-width: 768px) {
            #fmea-glossar-toggle {
                width: 50px;
                height: 50px;
                bottom: 20px;
                left: 20px;
                font-size: 18px;
            }

            #fmea-glossar-panel {
                bottom: 80px;
                left: 20px;
                width: calc(100vw - 40px);
                max-height: 60vh;
            }
        }
    `;
    document.head.appendChild(style);

    const totalTerms = Object.keys(glossar).length;

    function createGlossarUI() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'fmea-glossar-toggle';
        toggleBtn.innerHTML = '&#128218;';
        toggleBtn.title = 'FMEA-Glossar öffnen';
        toggleBtn.setAttribute('aria-label', 'FMEA-Glossar öffnen');

        const panel = document.createElement('div');
        panel.id = 'fmea-glossar-panel';
        panel.innerHTML = `
            <div class="fmea-glossar-header">
                <span>&#128218; FMEA-Glossar <span class="fmea-glossar-count" id="fmea-glossar-count">${totalTerms}</span></span>
                <button class="fmea-glossar-close" aria-label="FMEA-Glossar schließen">&times;</button>
            </div>
            <div class="fmea-glossar-search">
                <input type="text" placeholder="Begriff suchen … (z.B. RPZ, Fehlermode, ISO)" id="fmea-glossar-search-input">
            </div>
            <div class="fmea-glossar-content" id="fmea-glossar-items"></div>
            <div class="fmea-glossar-footer">ISO 14971 · EU AI Act · MDR/IVDR · thomas-bade.de</div>
        `;

        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePanel();
        });

        panel.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        panel.querySelector('.fmea-glossar-close').addEventListener('click', function(e) {
            e.stopPropagation();
            closePanel();
        });

        document.addEventListener('click', function(e) {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                closePanel();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closePanel();
        });

        const searchInput = document.getElementById('fmea-glossar-search-input');
        searchInput.addEventListener('input', filterGlossar);

        renderGlossar();
    }

    function togglePanel() {
        const panel = document.getElementById('fmea-glossar-panel');
        const isOpen = panel.classList.toggle('active');
        if (isOpen) {
            setTimeout(function() {
                const input = document.getElementById('fmea-glossar-search-input');
                if (input) input.focus();
            }, 150);
        }
    }

    function closePanel() {
        const panel = document.getElementById('fmea-glossar-panel');
        panel.classList.remove('active');
    }

    function renderGlossar(filter) {
        filter = filter || '';
        const container = document.getElementById('fmea-glossar-items');
        const countEl   = document.getElementById('fmea-glossar-count');
        const filterLower = filter.toLowerCase();

        const sortedEntries = Object.entries(glossar).sort(function(a, b) {
            return a[1].term.localeCompare(b[1].term, 'de-DE', { sensitivity: 'base' });
        });

        const filteredEntries = sortedEntries.filter(function(entry) {
            const value = entry[1];
            return value.term.toLowerCase().includes(filterLower) ||
                   value.definition.toLowerCase().includes(filterLower);
        });

        if (countEl) countEl.textContent = filteredEntries.length;

        if (filteredEntries.length === 0) {
            container.innerHTML = '<div class="fmea-glossar-empty">Keine Begriffe gefunden</div>';
            return;
        }

        container.innerHTML = filteredEntries.map(function(entry) {
            const value = entry[1];
            const termHighlighted   = filterLower ? highlight(value.term, filterLower) : escapeHtml(value.term);
            const defHighlighted    = filterLower ? highlight(value.definition, filterLower) : escapeHtml(value.definition);
            return '<div class="fmea-glossar-item">' +
                '<div class="fmea-glossar-term">' + termHighlighted + '</div>' +
                '<div class="fmea-glossar-definition">' + defHighlighted + '</div>' +
                '</div>';
        }).join('');
    }

    function highlight(text, term) {
        const escaped = escapeHtml(text);
        if (!term) return escaped;
        const re = new RegExp('(' + escapeRegex(escapeHtml(term)) + ')', 'gi');
        return escaped.replace(re, '<mark style="background:#ffc451;color:#1a1a1a;padding:0 2px;border-radius:2px;">$1</mark>');
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function filterGlossar() {
        const searchInput = document.getElementById('fmea-glossar-search-input');
        renderGlossar(searchInput.value);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGlossarUI);
    } else {
        createGlossarUI();
    }

})();
