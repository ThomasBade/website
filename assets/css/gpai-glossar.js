/**
 * GPAI Glossar - Floating Button mit Ein-/Ausblenden
 * Für thomas-bade.de/GPAI.html
 * Standalone-Lösung ohne Änderung am existierenden Stylesheet
 */

(function() {
    'use strict';
    
    // Glossar-Daten
    const glossar = {
        'GPAI': {
            term: 'GPAI (General Purpose AI)',
            definition: 'Allzweck-KI-Modelle, die vielseitig für verschiedene Aufgaben einsetzbar sind und die 10²³ FLOPS-Schwelle beim Training überschreiten.'
        },
        'FLOPS': {
            term: 'FLOPS',
            definition: 'Floating Point Operations Per Second – Gleitkomma-Operationen pro Sekunde. Maßeinheit für Rechenleistung beim Training von KI-Modellen.'
        },
        '10²³ FLOPS': {
            term: '10²³ FLOPS-Schwelle',
            definition: 'Rechenaufwand von 100 Trilliarden Operationen. Ab dieser Schwelle gilt ein KI-Modell nach EU AI Act als GPAI-Modell mit speziellen Compliance-Pflichten.'
        },
        '10²⁵ FLOPS': {
            term: '10²⁵ FLOPS-Schwelle',
            definition: 'Schwelle für GPAI-Modelle mit systemischem Risiko (100-fach höher als die Basis-GPAI-Schwelle). Unterliegen noch strengeren EU-Anforderungen.'
        },
        'EU AI Act': {
            term: 'EU AI Act',
            definition: 'EU-Verordnung zur Regulierung von Künstlicher Intelligenz. Definiert Risikoklassen und Pflichten für KI-Anbieter und -Betreiber.'
        },
        'Downstream AI System': {
            term: 'Downstream AI System',
            definition: 'KI-System, das auf einem GPAI-Modell aufbaut und für spezifische Anwendungen genutzt wird (z.B. medizinische Dokumentation).'
        },
        'Human Oversight': {
            term: 'Human Oversight',
            definition: 'Menschliche Aufsicht und Kontrolle über KI-Entscheidungen. Menschen behalten die finale Entscheidungshoheit.'
        },
        'Compliance': {
            term: 'Compliance',
            definition: 'Regelkonformität – Einhaltung gesetzlicher und regulatorischer Vorgaben, hier speziell für KI-Systeme.'
        },
        'Zweckbestimmung': {
            term: 'Zweckbestimmung',
            definition: 'Definierte Verwendung eines KI-Systems (z.B. administrativ vs. klinisch). Bestimmt die Risikoklasse und Pflichten nach EU AI Act.'
        },
        'Hochrisiko-KI': {
            term: 'Hochrisiko-KI',
            definition: 'KI-Systeme mit erhöhtem Risiko für Gesundheit, Sicherheit oder Grundrechte. Unterliegen strengen Anforderungen nach Art. 6 AI Act.'
        },
        'AI Literacy': {
            term: 'AI Literacy',
            definition: 'KI-Kompetenz – Fähigkeit, KI-Systeme zu verstehen, deren Grenzen zu kennen und sicher anzuwenden.'
        },
        'Bias': {
            term: 'Bias (Verzerrung)',
            definition: 'Systematische Verzerrungen in KI-Modellen, die zu diskriminierenden oder fehlerhaften Ergebnissen führen können.'
        },
        'Halluzination': {
            term: 'Halluzination',
            definition: 'Fehlerhafte oder erfundene Ausgaben von KI-Modellen, die plausibel klingen, aber faktisch falsch sind.'
        },
        'AVV': {
            term: 'AVV (Auftragsverarbeitungsvertrag)',
            definition: 'Vertrag nach DSGVO Art. 28, der die Verarbeitung personenbezogener Daten durch Dritte regelt.'
        },
        'DSGVO': {
            term: 'DSGVO',
            definition: 'Datenschutz-Grundverordnung – EU-weites Gesetz zum Schutz personenbezogener Daten.'
        },
        'TDM': {
            term: 'TDM (Text and Data Mining)',
            definition: 'Automatisierte Analyse großer Textmengen. Urheberrechtlich relevanter Prozess beim Training von KI-Modellen.'
        },
        'Red Teaming': {
            term: 'Red Teaming',
            definition: 'Sicherheitstest durch simulierte Angriffe, um Schwachstellen und Risiken von KI-Systemen aufzudecken.'
        },
        'Incident Flow': {
            term: 'Incident Flow',
            definition: 'Definierter Ablauf zur Meldung und Bearbeitung von Vorfällen, Fehlern oder Sicherheitsproblemen bei KI-Systemen.'
        },
        'RACI': {
            term: 'RACI',
            definition: 'RACI-Matrix: Verantwortlichkeitsmodell zur Zuordnung von Rollen. R=Responsible (durchführend), A=Accountable (verantwortlich), C=Consulted (konsultiert), I=Informed (informiert).'
        },
        'IR-Runbook': {
            term: 'IR-Runbook (Incident Response Runbook)',
            definition: 'Dokumentierter Ablaufplan für die Reaktion auf Sicherheitsvorfälle und kritische Ereignisse. Enthält Schritt-für-Schritt-Anweisungen, Verantwortlichkeiten und Eskalationswege.'
        },
        'DSB': {
            term: 'DSB (Datenschutzbeauftragter)',
            definition: 'Nach DSGVO benannte Person, die die Einhaltung datenschutzrechtlicher Vorschriften überwacht und als Ansprechpartner für Datenschutzfragen dient.'
        },
        'RBAC': {
            term: 'RBAC (Role-Based Access Control)',
            definition: 'Rollenbasierte Zugriffskontrolle – Rechtevergabe nach definierten Rollen statt individuellen Berechtigungen.'
        },
        'SLA': {
            term: 'SLA (Service Level Agreement)',
            definition: 'Dienstgütevereinbarung – vertragliche Zusicherung von Leistungsparametern (z.B. Verfügbarkeit, Reaktionszeiten).'
        },
        'Change Control': {
            term: 'Change Control',
            definition: 'Prozess zur kontrollierten Bewertung, Genehmigung und Dokumentation von Änderungen an Systemen.'
        },
        'MDR': {
            term: 'MDR (Medical Device Regulation)',
            definition: 'EU-Medizinprodukteverordnung. Reguliert auch KI-basierte Medizinprodukte.'
        },
        'Copyright Policy': {
            term: 'Copyright Policy',
            definition: 'Richtlinie zum Umgang mit urheberrechtlich geschützten Inhalten, insbesondere bei KI-Trainingsdaten.'
        }
    };
    
    // CSS für Button und Panel (inline, berührt nicht das existierende Stylesheet)
    const style = document.createElement('style');
    style.textContent = `
        /* Glossar Floating Button - Standalone Styles */
        #gpai-glossar-toggle {
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
        
        #gpai-glossar-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        #gpai-glossar-toggle:active {
            transform: scale(0.95);
        }
        
        #gpai-glossar-panel {
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
        
        #gpai-glossar-panel.active {
            display: flex;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .gpai-glossar-header {
            background: #ffc451;
            color: #1a1a1a;
            padding: 20px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .gpai-glossar-close {
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
        
        .gpai-glossar-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .gpai-glossar-search {
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .gpai-glossar-search input {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .gpai-glossar-search input:focus {
            outline: none;
            border-color: #ffc451;
        }
        
        .gpai-glossar-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px 20px;
        }
        
        .gpai-glossar-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .gpai-glossar-item:last-child {
            border-bottom: none;
        }
        
        .gpai-glossar-term {
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 8px;
            font-size: 15px;
        }
        
        .gpai-glossar-definition {
            color: #333;
            line-height: 1.6;
            font-size: 14px;
        }
        
        .gpai-glossar-empty {
            text-align: center;
            color: #999;
            padding: 40px 20px;
            font-style: italic;
        }
        
        /* Mobile Anpassungen */
        @media (max-width: 768px) {
            #gpai-glossar-toggle {
                width: 50px;
                height: 50px;
                bottom: 20px;
                left: 20px;
                font-size: 20px;
            }
            
            #gpai-glossar-panel {
                bottom: 80px;
                left: 20px;
                width: calc(100vw - 40px);
                max-height: 60vh;
            }
        }
    `;
    document.head.appendChild(style);
    
    // HTML-Struktur erstellen
    function createGlossarUI() {
        // Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'gpai-glossar-toggle';
        toggleBtn.innerHTML = '?';
        toggleBtn.title = 'Glossar öffnen';
        toggleBtn.setAttribute('aria-label', 'Glossar öffnen');
        
        // Glossar Panel
        const panel = document.createElement('div');
        panel.id = 'gpai-glossar-panel';
        panel.innerHTML = `
            <div class="gpai-glossar-header">
                <span>📚 Glossar</span>
                <button class="gpai-glossar-close" aria-label="Glossar schließen">×</button>
            </div>
            <div class="gpai-glossar-search">
                <input type="text" placeholder="Begriff suchen..." id="gpai-glossar-search-input">
            </div>
            <div class="gpai-glossar-content" id="gpai-glossar-items">
            </div>
        `;
        
        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);
        
        // Event Listeners
        toggleBtn.addEventListener('click', togglePanel);
        panel.querySelector('.gpai-glossar-close').addEventListener('click', closePanel);
        
        // Schließen bei Klick außerhalb
        document.addEventListener('click', function(e) {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                closePanel();
            }
        });
        
        // Suchfunktion
        const searchInput = document.getElementById('gpai-glossar-search-input');
        searchInput.addEventListener('input', filterGlossar);
        
        // Initial rendern
        renderGlossar();
    }
    
    function togglePanel() {
        const panel = document.getElementById('gpai-glossar-panel');
        panel.classList.toggle('active');
    }
    
    function closePanel() {
        const panel = document.getElementById('gpai-glossar-panel');
        panel.classList.remove('active');
    }
    
    function renderGlossar(filter = '') {
        const container = document.getElementById('gpai-glossar-items');
        const filterLower = filter.toLowerCase();
        
        // Sortiere Glossar alphabetisch
        const sortedEntries = Object.entries(glossar).sort((a, b) => 
            a[1].term.localeCompare(b[1].term, 'de')
        );
        
        const filteredEntries = sortedEntries.filter(([key, value]) => {
            return value.term.toLowerCase().includes(filterLower) ||
                   value.definition.toLowerCase().includes(filterLower);
        });
        
        if (filteredEntries.length === 0) {
            container.innerHTML = '<div class="gpai-glossar-empty">Keine Begriffe gefunden</div>';
            return;
        }
        
        container.innerHTML = filteredEntries.map(([key, value]) => `
            <div class="gpai-glossar-item">
                <div class="gpai-glossar-term">${value.term}</div>
                <div class="gpai-glossar-definition">${value.definition}</div>
            </div>
        `).join('');
    }
    
    function filterGlossar() {
        const searchInput = document.getElementById('gpai-glossar-search-input');
        renderGlossar(searchInput.value);
    }
    
    // Initialisierung nach DOM-Laden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGlossarUI);
    } else {
        createGlossarUI();
    }
})();
