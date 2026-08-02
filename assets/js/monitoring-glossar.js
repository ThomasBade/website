/**
 * Monitoring Glossar - Floating Button mit Ein-/Ausblenden
 * Für thomas-bade.de/ai_monitoring.html
 * Standalone-Lösung ohne Änderung am existierenden Stylesheet
 */

(function() {
    'use strict';

    // Glossar-Daten
    const glossar = {
        'Post-Deployment Monitoring': {
            term: 'Post-Deployment Monitoring',
            definition: 'Kontinuierliche Überwachung eines KI-Systems nach dem Go-live. Ziel ist es, Leistung, Sicherheit, Zuverlässigkeit und regulatorische Konformität im realen Betrieb fortlaufend zu prüfen.'
        },
        'KI-Monitoring': {
            term: 'KI-Monitoring',
            definition: 'Laufende Beobachtung und Bewertung von KI-Systemen im Regelbetrieb. Umfasst technische Leistung, Nutzung im Alltag, Sicherheitsaspekte, Compliance und Auswirkungen auf Versorgung und Organisation.'
        },
        'KI-Betriebsüberwachung': {
            term: 'KI-Betriebsüberwachung',
            definition: 'Deutscher Begriff für Post-Deployment Monitoring. Bezeichnet die strukturierte Messung, Bewertung und Dokumentation eines KI-Systems nach der Einführung in den produktiven Betrieb.'
        },
        'Go-live': {
            term: 'Go-live',
            definition: 'Zeitpunkt, ab dem ein KI-System produktiv im realen Arbeitsalltag eingesetzt wird. Ab diesem Moment beginnt die eigentliche Betriebsverantwortung.'
        },
        'Regelbetrieb': {
            term: 'Regelbetrieb',
            definition: 'Produktiver Alltagseinsatz eines Systems außerhalb von Pilotierung und Testphase. Im Regelbetrieb müssen reale Risiken, Nutzungsmuster und Auswirkungen beobachtet werden.'
        },
        'Drift': {
            term: 'Drift',
            definition: 'Veränderung von Daten, Nutzungskontext oder Patientengruppen im Zeitverlauf, wodurch ein KI-System schleichend schlechter oder unzuverlässiger werden kann.'
        },
        'Modell-Drift': {
            term: 'Modell-Drift',
            definition: 'Leistungsabfall eines KI-Modells durch Veränderungen in Eingangsdaten, Arbeitsabläufen oder Umgebungsbedingungen. Ein zentrales Risiko im laufenden KI-Betrieb.'
        },
        'Nicht-deterministisch': {
            term: 'Nicht-deterministisch',
            definition: 'Eigenschaft eines Systems, bei der auf gleiche oder sehr ähnliche Eingaben nicht immer exakt dieselbe Ausgabe folgt. Gerade bei KI-Systemen ist das im Monitoring besonders relevant.'
        },
        'Verteilungsverschiebung': {
            term: 'Verteilungsverschiebung',
            definition: 'Änderung in der Zusammensetzung oder Struktur der Daten, auf die ein KI-System trifft. Kann dazu führen, dass frühere Testergebnisse im Alltag nicht mehr gelten.'
        },
        'Auditierbarkeit': {
            term: 'Auditierbarkeit',
            definition: 'Fähigkeit eines Systems oder Prozesses, durch Prüfungen nachvollziehbar bewertet zu werden. Dazu gehören dokumentierte Entscheidungen, Kennzahlen, Änderungen und Verantwortlichkeiten.'
        },
        'Lokale Validierung': {
            term: 'Lokale Validierung',
            definition: 'Prüfung eines KI-Systems unter den konkreten Bedingungen einer einzelnen Einrichtung, etwa mit lokaler Infrastruktur, realen Workflows und eigener Patientenpopulation.'
        },
        'Safety Reporting': {
            term: 'Safety Reporting',
            definition: 'Systematische Erfassung, Dokumentation und Bewertung von sicherheitsrelevanten Ereignissen, Fehlfunktionen oder kritischen Auffälligkeiten im KI-Betrieb.'
        },
        'Incident Reporting': {
            term: 'Incident Reporting',
            definition: 'Meldeprozess für Vorfälle, Fehlentscheidungen, unerwartete Ergebnisse oder technische Probleme im Zusammenhang mit einem KI-System.'
        },
        'Override': {
            term: 'Override',
            definition: 'Bewusste Übersteuerung oder Korrektur einer KI-Empfehlung durch einen Menschen. Ein wichtiger Bestandteil von Human Oversight im klinischen Alltag.'
        },
        'Mensch-KI-Interaktion': {
            term: 'Mensch-KI-Interaktion',
            definition: 'Zusammenspiel zwischen Anwendern und KI-Systemen. Entscheidend ist, ob Nutzer Grenzen, Fehlermuster und den richtigen Umgang mit Empfehlungen oder Warnungen verstehen.'
        },
        'Funktionalität': {
            term: 'Funktionalität',
            definition: 'Monitoring-Dimension, die prüft, ob ein KI-System weiterhin wie vorgesehen arbeitet und ob Genauigkeit, Leistung und Abweichungen stabil bleiben.'
        },
        'Prozessstabilität': {
            term: 'Prozessstabilität',
            definition: 'Stabilität der Arbeitsabläufe rund um ein KI-System. Dazu zählen Übergaben, Schnittstellen, Reaktionszeiten und das Zusammenspiel mit bestehenden Prozessen.'
        },
        'Technische Betriebsfähigkeit': {
            term: 'Technische Betriebsfähigkeit',
            definition: 'Zuverlässigkeit der technischen Infrastruktur eines KI-Systems, etwa Verfügbarkeit, Schnittstellen, Datenflüsse, Laufzeiten und Ausfallsicherheit.'
        },
        'KI-Inventar': {
            term: 'KI-Inventar',
            definition: 'Verzeichnis aller eingesetzten KI-Systeme mit Angaben zu Version, Einsatzbereich, Verantwortlichkeiten, Einführungsdatum und lokalem Nutzungskontext.'
        },
        'Referenzstandard': {
            term: 'Referenzstandard',
            definition: 'Vergleichsmaßstab, mit dem Ergebnisse eines KI-Systems überprüft werden können, etwa Fachgutachten, Goldstandard-Daten oder definierte Qualitätskriterien.'
        },
        'Audit-Stichprobe': {
            term: 'Audit-Stichprobe',
            definition: 'Gezielte Auswahl von Fällen oder Ergebnissen zur Prüfung, um die Leistung und Zuverlässigkeit eines KI-Systems im Betrieb stichprobenartig zu kontrollieren.'
        },
        'Abweichungsrate': {
            term: 'Abweichungsrate',
            definition: 'Kennzahl, die zeigt, wie häufig Ergebnisse eines KI-Systems von einem Referenzstandard, einer fachlichen Erwartung oder einer menschlichen Beurteilung abweichen.'
        },
        'Fehlermuster': {
            term: 'Fehlermuster',
            definition: 'Wiederkehrende Arten von Fehlern oder Auffälligkeiten in den Ergebnissen eines KI-Systems. Ihre Analyse hilft, Risiken systematisch zu erkennen.'
        },
        'Revalidierung': {
            term: 'Revalidierung',
            definition: 'Erneute Prüfung eines KI-Systems nach Änderungen, Auffälligkeiten oder Leistungseinbußen, um sicherzustellen, dass es weiterhin geeignet und sicher einsetzbar ist.'
        },
        'Änderungsprotokoll': {
            term: 'Änderungsprotokoll',
            definition: 'Dokumentation technischer oder organisatorischer Änderungen an einem KI-System, etwa bei Software-Updates, neuen Schnittstellen oder angepassten Workflows.'
        },
        'Lieferantensteuerung': {
            term: 'Lieferantensteuerung',
            definition: 'Steuerung und Kontrolle externer Anbieter oder Hersteller eines KI-Systems, einschließlich Updates, Leistungszusagen, Eskalationen und vertraglicher Pflichten.'
        },
        'Schwellenwert': {
            term: 'Schwellenwert',
            definition: 'Definierter Grenzwert, ab dem ein Review, eine Eskalation, eine Revalidierung oder eine andere Maßnahme ausgelöst wird.'
        },
        'Eskalation': {
            term: 'Eskalation',
            definition: 'Vordefinierter Prozess, der bei kritischen Auffälligkeiten, Leistungsabfall oder Sicherheitsproblemen weitergehende Prüfungen oder Entscheidungen auslöst.'
        },
        'Qualitätsmanagement': {
            term: 'Qualitätsmanagement',
            definition: 'Organisatorischer Rahmen zur Sicherung und Verbesserung von Qualität. KI-Monitoring sollte an bestehende Qualitätsmanagementstrukturen angeschlossen werden.'
        },
        'Risikomanagement': {
            term: 'Risikomanagement',
            definition: 'Systematische Identifikation, Bewertung, Steuerung und Überwachung von Risiken. Im KI-Kontext betrifft dies sowohl technische als auch organisatorische und klinische Risiken.'
        },
        'Klinische Governance': {
            term: 'Klinische Governance',
            definition: 'Rahmen für Verantwortung, Qualität und Sicherheit in der Versorgung. KI-Systeme müssen in diese Führungs- und Kontrollstrukturen eingebettet werden.'
        },
        'Nachgelagerte Entscheidungen': {
            term: 'Nachgelagerte Entscheidungen',
            definition: 'Entscheidungen, die auf den Ergebnissen oder Empfehlungen eines KI-Systems aufbauen, etwa Diagnosen, Priorisierungen oder weitere Behandlungsschritte.'
        },
        'Workflow-Bruch': {
            term: 'Workflow-Bruch',
            definition: 'Störung oder Unterbrechung im Arbeitsablauf, die durch fehlerhafte Integration, unklare Nutzung oder technische Probleme eines KI-Systems entsteht.'
        },
        'Übervertrauen': {
            term: 'Übervertrauen',
            definition: 'Zu hohe oder unkritische Verlässlichkeit gegenüber KI-Ergebnissen. Kann dazu führen, dass Warnsignale, Fehler oder Grenzen des Systems übersehen werden.'
        },
        'Human Oversight': {
            term: 'Human Oversight',
            definition: 'Menschliche Aufsicht und Kontrolle über KI-Entscheidungen. Menschen behalten die finale Entscheidungshoheit und greifen bei Bedarf korrigierend ein.'
        },
        'AI Risk Management': {
            term: 'AI Risk Management',
            definition: 'Strukturierter Umgang mit Risiken von KI-Systemen über den gesamten Lebenszyklus hinweg. Umfasst Erkennung, Bewertung, Überwachung und kontinuierliche Verbesserung.'
        },
        'Compliance': {
            term: 'Compliance',
            definition: 'Regelkonformität – Einhaltung gesetzlicher, regulatorischer und interner Vorgaben beim Einsatz von KI-Systemen.'
        },
        'Gesellschaftliche Auswirkungen': {
            term: 'Gesellschaftliche Auswirkungen',
            definition: 'Breitere Folgen des KI-Einsatzes über die unmittelbare Funktion hinaus, etwa für Fairness, Zugang, Priorisierung, Vertrauen und institutionelle Verantwortung.'
        },
        'EU AI Act': {
            term: 'EU AI Act',
            definition: 'EU-Verordnung zur Regulierung von Künstlicher Intelligenz. Definiert Risikoklassen sowie Pflichten für Anbieter und Betreiber von KI-Systemen.'
        },
        'MDR': {
            term: 'MDR (Medical Device Regulation)',
            definition: 'EU-Medizinprodukteverordnung. Relevant für KI-basierte Medizinprodukte und ihre regulatorische Einordnung im Gesundheitswesen.'
        },
        'Bias': {
            term: 'Bias (Verzerrung)',
            definition: 'Systematische Verzerrungen in KI-Modellen oder Datensätzen, die zu unfairen, diskriminierenden oder fehlerhaften Ergebnissen führen können.'
        },
        'Red Teaming': {
            term: 'Red Teaming',
            definition: 'Sicherheitstest durch simulierte Angriffe, um Schwachstellen, Missbrauchsszenarien und Risiken von KI-Systemen sichtbar zu machen.'
        }
    };

    // CSS für Button und Panel (inline, berührt nicht das existierende Stylesheet)
    const style = document.createElement('style');
    style.textContent = `
        #monitoring-glossar-toggle {
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
            font-size: 24px;
            font-weight: bold;
        }

        #monitoring-glossar-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        #monitoring-glossar-toggle:active {
            transform: scale(0.95);
        }

        #monitoring-glossar-panel {
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 400px;
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

        #monitoring-glossar-panel.active {
            display: flex;
            animation: monitoringGlossarSlideIn 0.3s ease;
        }

        @keyframes monitoringGlossarSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .monitoring-glossar-header {
            background: #ffc451;
            color: #1a1a1a;
            padding: 20px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .monitoring-glossar-close {
            background: none;
            border: none;
            color: #1a1a1a;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        }

        .monitoring-glossar-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .monitoring-glossar-search {
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
        }

        .monitoring-glossar-search input {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .monitoring-glossar-search input:focus {
            outline: none;
            border-color: #ffc451;
        }

        .monitoring-glossar-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px 20px;
        }

        .monitoring-glossar-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
        }

        .monitoring-glossar-item:last-child {
            border-bottom: none;
        }

        .monitoring-glossar-term {
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 8px;
            font-size: 15px;
        }

        .monitoring-glossar-definition {
            color: #333;
            line-height: 1.6;
            font-size: 14px;
        }

        .monitoring-glossar-empty {
            text-align: center;
            color: #999;
            padding: 40px 20px;
            font-style: italic;
        }

        @media (max-width: 768px) {
            #monitoring-glossar-toggle {
                width: 50px;
                height: 50px;
                bottom: 20px;
                left: 20px;
                font-size: 20px;
            }

            #monitoring-glossar-panel {
                bottom: 80px;
                left: 20px;
                width: calc(100vw - 40px);
                max-height: 60vh;
            }
        }
    `;
    document.head.appendChild(style);

    function createGlossarUI() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'monitoring-glossar-toggle';
        toggleBtn.innerHTML = '?';
        toggleBtn.title = 'Monitoring-Glossar öffnen';
        toggleBtn.setAttribute('aria-label', 'Monitoring-Glossar öffnen');

        const panel = document.createElement('div');
        panel.id = 'monitoring-glossar-panel';
        panel.innerHTML = `
            <div class="monitoring-glossar-header">
                <span>📚 Monitoring-Glossar</span>
                <button class="monitoring-glossar-close" aria-label="Monitoring-Glossar schließen">×</button>
            </div>
            <div class="monitoring-glossar-search">
                <input type="text" placeholder="Begriff suchen..." id="monitoring-glossar-search-input">
            </div>
            <div class="monitoring-glossar-content" id="monitoring-glossar-items"></div>
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
        panel.querySelector('.monitoring-glossar-close').addEventListener('click', function(e) {
            e.stopPropagation();
            closePanel();
        });

        document.addEventListener('click', function(e) {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                closePanel();
            }
        });

        const searchInput = document.getElementById('monitoring-glossar-search-input');
        searchInput.addEventListener('input', filterGlossar);

        renderGlossar();
    }

    function togglePanel() {
        const panel = document.getElementById('monitoring-glossar-panel');
        panel.classList.toggle('active');
    }

    function closePanel() {
        const panel = document.getElementById('monitoring-glossar-panel');
        panel.classList.remove('active');
    }

    function renderGlossar(filter = '') {
        const container = document.getElementById('monitoring-glossar-items');
        const filterLower = filter.toLowerCase();

        const sortedEntries = Object.entries(glossar).sort((a, b) =>
            a[1].term.localeCompare(b[1].term, 'de-DE', { sensitivity: 'base' })
        );

        const filteredEntries = sortedEntries.filter(([key, value]) => {
            return value.term.toLowerCase().includes(filterLower) ||
                   value.definition.toLowerCase().includes(filterLower) ||
                   key.toLowerCase().includes(filterLower);
        });

        if (filteredEntries.length === 0) {
            container.innerHTML = '<div class="monitoring-glossar-empty">Keine Begriffe gefunden</div>';
            return;
        }

        container.innerHTML = filteredEntries.map(([key, value]) => `
            <div class="monitoring-glossar-item">
                <div class="monitoring-glossar-term">${value.term}</div>
                <div class="monitoring-glossar-definition">${value.definition}</div>
            </div>
        `).join('');
    }

    function filterGlossar() {
        const searchInput = document.getElementById('monitoring-glossar-search-input');
        renderGlossar(searchInput.value);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGlossarUI);
    } else {
        createGlossarUI();
    }
})();
