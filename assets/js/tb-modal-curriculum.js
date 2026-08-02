/**
 * tb-modal-curriculum.js
 * Selbstständiges Script für das Curriculum-Modal auf thomas-bade.de
 * Lädt tb-modal-irland.css + tb-modal-curriculum.css falls noch nicht vorhanden
 * Injiziert Floater + Modal-HTML, bindet alle Events
 *
 * Einbindung auf Zielseiten (z. B. fmea.html, ai_monitoring.html etc.):
 *   <script src="assets/js/tb-modal-curriculum.js" defer></script>
 *
 * NICHT einbinden auf index.html
 * ---------------------------------------------------------------
 */

(function () {
  'use strict';

  /* ── 1. CSS-Abhängigkeiten laden ── */
  function loadCSS(id, href) {
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    link.onerror = function () {
      console.warn('[tb-curriculum] CSS nicht geladen: ' + href);
    };
    document.head.appendChild(link);
  }

  loadCSS('tb-modal-irland-css',     '/assets/css/tb-modal-irland.css');
  loadCSS('tb-modal-curriculum-css', '/assets/css/tb-modal-curriculum.css');


  /* ── 2. HTML-Templates ── */
  var FLOATER_HTML = [
    '<div class="tb-floater" id="tb-floater-curriculum">',
    '  <button class="tb-floater-dismiss" id="tb-floater-curriculum-close" aria-label="Schließen">Schließen ✕</button>',
    '  <div class="tb-floater-card"',
    '       role="button" tabindex="0"',
    '       aria-label="KI-Lernportal thomas-bade.org – Curriculum öffnen"',
    '       id="tb-floater-curriculum-trigger">',
    '    <div class="tb-floater-inner">',
    '      <div class="tb-floater-tag">Neu · KI Lernportal thomas-bade.org</div>',
    '      <div class="tb-floater-title">KI-Kompetenz für<br>Gesundheit &amp; Soziales</div>',
    '      <p class="tb-floater-text">',
    '        Basic kostenlos · Premium mit Zertifikat nach EU&nbsp;AI&nbsp;Act&nbsp;Art.&nbsp;4 —',
    '        speziell für Krankenhäuser, Pflegeeinrichtungen und Kommunen.',
    '      </p>',
    '      <span class="tb-floater-cta">Curriculum ansehen <span class="tb-arrow">→</span></span>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  var MODAL_HTML = [
    '<div id="modal-curriculum" class="modal-overlay"',
    '     role="dialog" aria-modal="true" aria-labelledby="tb-cur-modal-heading">',
    '  <div class="tb-modal-box">',

    /* Header */
    '    <div class="tb-modal-header">',
    '      <p class="tb-modal-eyebrow">KI Lernportal · thomas-bade.org · Ab Ende Mai 2026</p>',
    '      <h2 class="tb-modal-title" id="tb-cur-modal-heading">',
    '        KI-Kompetenz für Gesundheit,<br>Soziales &amp; Kommunen',
    '      </h2>',
    '      <p class="tb-modal-subtitle">',
    '        Vendor-unabhängig · Deployer-Perspektive · EU AI Act · MDR/IVDR · DSGVO',
    '      </p>',
    '      <button class="tb-modal-close" aria-label="Modal schließen"',
    '              onclick="tbCloseCurriculumModal()">✕</button>',
    '    </div>',

    /* Body */
    '    <div class="tb-modal-body">',

    '      <p class="tb-intro">',
    '        Generische KI-Manager-Ausbildungen kosten bis zu 6.200\u00a0€ — ohne Sektor-Fokus,',
    '        ohne Deployer-Perspektive. Dieses Curriculum richtet sich ausschließlich an',
    '        <strong>Betreiber im deutschen Gesundheits- und Sozialwesen</strong>:',
    '        QMBs, PDLs, IT-Leitungen, Verwaltungsführungen — die KI evaluieren,',
    '        beschaffen und verantworten.',
    '      </p>',

    /* Tier-Badges */
    '      <div class="tb-tier-row">',
    '        <span class="tb-tier-badge basic">Basic — Kostenlos</span>',
    '        <span class="tb-tier-badge premium">Premium — Paywall + Zertifikat</span>',
    '      </div>',

    /* Basic-Module */
    '      <p class="tb-section-label">Basic-Module — EU AI Act Art.\u00a04 Literacy für alle</p>',
    '      <div class="tb-curriculum-grid">',

    '        <div class="tb-cur-card basic">',
    '          <div class="tb-cur-num">B1 · Kostenlos</div>',
    '          <div class="tb-cur-title">Was ist KI? — Sektorperspektive</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>KI vs. klassische Software vs. Digitalisierung</li>',
    '            <li>Beispiele aus Pflege, Krankenhaus, Gemeinde</li>',
    '            <li>Welche Systeme laufen schon in meiner Einrichtung?</li>',
    '          </ul>',
    '        </div>',

    '        <div class="tb-cur-card basic">',
    '          <div class="tb-cur-num">B2 · Kostenlos</div>',
    '          <div class="tb-cur-title">EU AI Act — Grundlagen für Betreiber</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>Risikopyramide: verboten / Hochrisiko / minimal</li>',
    '            <li>Annex III: Hochrisiko im Sozial- &amp; Gesundheitssektor</li>',
    '            <li>Art.\u00a026 Deployer-Pflichten im Überblick</li>',
    '          </ul>',
    '        </div>',

    '        <div class="tb-cur-card basic">',
    '          <div class="tb-cur-num">B3 · Kostenlos</div>',
    '          <div class="tb-cur-title">KI-Tools erkennen &amp; einordnen</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>Ampel-Schema für konkrete Praxisbeispiele</li>',
    '            <li>ChatGPT, Copilot &amp; Co. im Klinikalltag</li>',
    '            <li>Erste Fragen an den Anbieter</li>',
    '          </ul>',
    '        </div>',

    '        <div class="tb-cur-card basic">',
    '          <div class="tb-cur-num">B4 · Kostenlos</div>',
    '          <div class="tb-cur-title">Datenschutz &amp; DSGVO im KI-Kontext</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>Art.\u00a09 DSGVO: Patientendaten &amp; KI</li>',
    '            <li>Auftragsverarbeitung mit KI-Anbietern</li>',
    '            <li>§\u00a0203 StGB: Schweigepflicht &amp; KI-Tools</li>',
    '          </ul>',
    '        </div>',

    '      </div>',

    /* Premium-Module */
    '      <p class="tb-section-label">Premium-Highlights — Compliance-Tiefe für Entscheider</p>',
    '      <div class="tb-curriculum-grid">',

    '        <div class="tb-cur-card">',
    '          <div class="tb-cur-num">P1 · Premium</div>',
    '          <div class="tb-cur-title">Hochrisiko-KI im Gesundheitssektor</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>Annex III detailliert mit Fallbeispielen</li>',
    '            <li>MDR/IVDR-Schnittstellen, SaMD-Klassifikation</li>',
    '            <li>FMEA für KI: RPZ, Schutzmaßnahmen</li>',
    '          </ul>',
    '        </div>',

    '        <div class="tb-cur-card">',
    '          <div class="tb-cur-num">P2 · Premium</div>',
    '          <div class="tb-cur-title">KI-Beschaffung &amp; Vendor-Evaluation</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>15 Pflichtfragen vor jeder Kaufentscheidung</li>',
    '            <li>ROI-Prüfung: Cochrane-Evidenz vs. Marketingclaims</li>',
    '            <li>Vertragsklauseln, Red Flags, Vergaberecht</li>',
    '          </ul>',
    '        </div>',

    '        <div class="tb-cur-card">',
    '          <div class="tb-cur-num">P3 · Premium</div>',
    '          <div class="tb-cur-title">KI-Governance &amp; interne Steuerung</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>NIST AI RMF: Govern, Map, Measure, Manage</li>',
    '            <li>Verantwortungsmatrix für Einrichtungen</li>',
    '            <li>Monitoring-Pflichten Art.\u00a026 Abs.\u00a05, KI-Register</li>',
    '          </ul>',
    '        </div>',

    '        <div class="tb-cur-card">',
    '          <div class="tb-cur-num">P4–P6 · Premium</div>',
    '          <div class="tb-cur-title">Generative KI · Use Cases · Zertifikat</div>',
    '          <ul class="tb-cur-topics">',
    '            <li>LLMs im Klinikalltag: Chancen &amp; Haftung</li>',
    '            <li>Use-Case-Entwicklung mit FMEA-Bewertung</li>',
    '            <li>PDF-Zertifikat nach EU AI Act Art.\u00a04</li>',
    '          </ul>',
    '        </div>',

    '      </div>',

    /* Relevanz-Tabelle */
    '      <div class="tb-relevanz">',
    '        <p class="tb-section-label">Warum vendor-unabhängig — und warum jetzt?</p>',
    '        <table class="tb-relevanz-table">',
    '          <thead><tr><th>Merkmal</th><th>thomas-bade.org</th></tr></thead>',
    '          <tbody>',
    '            <tr><td>Perspektive</td><td>Ausschließlich Deployer / Betreiber — keine Anbieterinteressen</td></tr>',
    '            <tr><td>Sektor</td><td>Gesundheit, Soziales, Kommunen — keine generische IT-Ausbildung</td></tr>',
    '            <tr><td>Regulatorik</td><td>EU AI Act · MDR/IVDR · DSGVO · SGB · KHEntgG integriert</td></tr>',
    '            <tr><td>Zertifikat</td><td>Referenziert EU AI Act Art.\u00a04 — compliance-dokumentierbar</td></tr>',
    '            <tr><td>Format</td><td>Asynchron, mobiloptimiert — kein Präsenzzwang, kein Reiseaufwand</td></tr>',
    '            <tr><td>Frist</td><td>Art.\u00a04 Literacy-Pflicht gilt — Vorbereitung jetzt, Frist 2027</td></tr>',
    '          </tbody>',
    '        </table>',
    '      </div>',

    /* Terminkalender */
    '      <div class="tb-cal-box">',
    '        <h4>Erstgespräch vereinbaren — kostenlos, 30 Minuten</h4>',
    '        <p>',
    '          Welche Module passen zu Ihrer Einrichtung? Welcher Einstieg macht Sinn?',
    '          Ich beantworte Ihre Fragen — ohne Verkaufsdruck, ohne Agenda.',
    '        </p>',
    '        <a href="https://zeeg.me/info3242/30min"',
    '           target="_blank" rel="noopener noreferrer"',
    '           class="tb-cal-btn">',
    '          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"',
    '               stroke="currentColor" stroke-width="2.5">',
    '            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>',
    '            <line x1="16" y1="2" x2="16" y2="6"></line>',
    '            <line x1="8" y1="2" x2="8" y2="6"></line>',
    '            <line x1="3" y1="10" x2="21" y2="10"></line>',
    '          </svg>',
    '          Termin buchen — zeeg.me',
    '        </a>',
    '        <p class="tb-cal-note">Videokonferenz · 30 Min · vendor-unabhängig · keine Folgekosten</p>',
    '      </div>',

    '    </div>',

    /* Footer */
    '    <div class="tb-modal-footer">',
    '      <p class="tb-modal-source">',
    '        thomas-bade.org · KI Lernportal ·',
    '        <a href="https://www.thomas-bade.org" target="_blank" rel="noopener noreferrer">thomas-bade.org</a>',
    '      </p>',
    '      <div class="tb-modal-footer-actions">',
    '        <a href="https://zeeg.me/info3242/30min"',
    '           target="_blank" rel="noopener noreferrer"',
    '           class="tb-cal-btn" style="font-size:11px;padding:8px 16px;">',
    '          Termin buchen →',
    '        </a>',
    '        <button class="tb-modal-footer-close"',
    '                onclick="tbCloseCurriculumModal()">Schließen ✕</button>',
    '      </div>',
    '    </div>',

    '  </div>',
    '</div>'
  ].join('\n');


  /* ── 3. HTML ins DOM injizieren ── */
  function inject() {
    /* Doppelte Initialisierung verhindern */
    if (document.getElementById('modal-curriculum')) return;

    var container = document.createElement('div');
    container.innerHTML = FLOATER_HTML + MODAL_HTML;
    document.body.appendChild(container);

    /* Floater-Positionierung: über Irland-Floater wenn vorhanden */
    var irlandFloater = document.getElementById('tb-floater');
    var curFloater    = document.getElementById('tb-floater-curriculum');
    if (irlandFloater && curFloater) {
      curFloater.style.bottom = '320px';
    }

    bindEvents();
  }


  /* ── 4. Öffnen / Schließen (global, für onclick-Attribute) ── */
  window.tbOpenCurriculumModal = function () {
    var o = document.getElementById('modal-curriculum');
    if (o) {
      o.classList.add('active');
      document.body.classList.add('modal-open');
    }
  };

  window.tbCloseCurriculumModal = function () {
    var o = document.getElementById('modal-curriculum');
    if (o) {
      o.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  };


  /* ── 5. Events binden ── */
  function bindEvents() {
    var SESSION_KEY = 'tb-floater-curriculum';
    var floater     = document.getElementById('tb-floater-curriculum');
    var trigger     = document.getElementById('tb-floater-curriculum-trigger');
    var overlay     = document.getElementById('modal-curriculum');
    var dismissBtn  = document.getElementById('tb-floater-curriculum-close');

    /* Floater: Session-Persistenz */
    try {
      if (sessionStorage.getItem(SESSION_KEY) && floater) {
        floater.classList.add('tb-hidden');
      }
    } catch (e) {}

    /* Floater: Dismiss-Button */
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (floater) floater.classList.add('tb-hidden');
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
      });
    }

    /* Floater-Trigger → Modal öffnen */
    if (trigger) {
      trigger.addEventListener('click', window.tbOpenCurriculumModal);
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.tbOpenCurriculumModal();
        }
      });
    }

    /* Klick auf Overlay-Hintergrund → Modal schließen */
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) window.tbCloseCurriculumModal();
      });
    }

    /* Escape-Taste → Modal schließen */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
        window.tbCloseCurriculumModal();
      }
    });
  }


  /* ── 6. Initialisierung ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
