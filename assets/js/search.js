/**
 * search.js
 * ─────────────────────────────────────────────────────────────
 * Suchmaschine für thomas-bade.de
 * Benötigt: search-config.js (muss VOR dieser Datei geladen werden)
 *
 * Einbindung in jede HTML-Seite (einmalig, im <head> oder vor </body>):
 *
 *   <script src="/assets/js/search-config.js"></script>
 *   <script src="/assets/js/search.js"></script>
 *
 * HTML-Struktur im <body> (identisch auf allen Seiten):
 *
 *   <div id="site-search-container">
 *     <input id="site-search-input" type="search" placeholder="Suchen …" autocomplete="off" />
 *     <button id="search-clear-btn" style="display:none" aria-label="Suche leeren">✕</button>
 *     <div id="search-results" style="display:none">
 *       <span id="results-count"></span>
 *       <div id="search-results-list"></div>
 *     </div>
 *     <div id="no-results" style="display:none">Keine Ergebnisse gefunden.</div>
 *   </div>
 *   <div id="search-overlay"></div>
 *
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // Sicherheitsprüfung: Konfiguration muss geladen sein
  if (typeof SITE_SEARCH_CONFIG === 'undefined') {
    console.error('[search.js] SITE_SEARCH_CONFIG nicht gefunden. Bitte search-config.js VOR search.js laden.');
    return;
  }

  // ── Hilfsfunktionen ────────────────────────────────────────

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, query) {
    var words = query.split(' ').filter(function (w) { return w.length > 1; });
    var result = text;
    words.forEach(function (w) {
      result = result.replace(
        new RegExp('(' + escapeRegex(w) + ')', 'gi'),
        '<mark>$1</mark>'
      );
    });
    return result;
  }

  function extractExcerpt(text, query) {
    var words = query.split(' ').filter(function (w) { return w.length > 1; });
    var lower = text.toLowerCase();
    var firstIndex = -1;
    words.forEach(function (w) {
      var i = lower.indexOf(w.toLowerCase());
      if (i !== -1 && (firstIndex === -1 || i < firstIndex)) firstIndex = i;
    });
    if (firstIndex === -1) return text.substring(0, 200) + '…';
    var start = Math.max(0, firstIndex - 50);
    var end   = Math.min(text.length, firstIndex + 150);
    var excerpt = text.substring(start, end);
    if (start > 0)            excerpt = '…' + excerpt;
    if (end < text.length)    excerpt = excerpt + '…';
    return excerpt;
  }

  // ── Suchalgorithmus ────────────────────────────────────────

  function searchPages(query) {
    var words = query.split(' ').filter(function (w) { return w.length > 1; });
    var results = [];

    SITE_SEARCH_CONFIG.pages.forEach(function (page) {
      var score = 0;
      var titleLower    = (page.title    || '').toLowerCase();
      var keywordsLower = (page.keywords || '').toLowerCase();
      var contentLower  = (page.content  || '').toLowerCase();
      var allText = titleLower + ' ' + contentLower + ' ' + keywordsLower;

      words.forEach(function (w) {
        var lw = w.toLowerCase();
        if (titleLower.includes(lw))    score += 200;
        if (keywordsLower.includes(lw)) score += 100;
        if (contentLower.includes(lw)) {
          var matches = contentLower.match(new RegExp(escapeRegex(lw), 'g'));
          if (matches) score += matches.length * 30;
        }
        if (allText.includes(lw)) score += 5;
      });

      if (score > 0) {
        results.push(Object.assign({}, page, { score: score }));
      }
    });

    return results.sort(function (a, b) { return b.score - a.score; });
  }

  // ── DOM-Klasse ─────────────────────────────────────────────

  function SiteSearch() {
    this.input         = document.getElementById('site-search-input');
    this.resultsBox    = document.getElementById('search-results');
    this.resultsList   = document.getElementById('search-results-list');
    this.noResults     = document.getElementById('no-results');
    this.resultsCount  = document.getElementById('results-count');
    this.clearBtn      = document.getElementById('search-clear-btn');
    this.overlay       = document.getElementById('search-overlay');
    this.selectedIndex = -1;

    if (!this.input) return; // Kein Suchfeld auf dieser Seite → abbrechen
    this._bindEvents();
  }

  SiteSearch.prototype._bindEvents = function () {
    var self = this;

    this.input.addEventListener('input', function (e) {
      self._handleSearch(e.target.value);
    });

    this.input.addEventListener('keydown', function (e) {
      self._handleKeyboard(e);
    });

    this.input.addEventListener('focus', function () {
      if (self.input.value.length >= 2) self._handleSearch(self.input.value);
    });

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', function () { self._clearSearch(); });
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', function () { self._hideResults(); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') self._hideResults();
    });

    document.addEventListener('click', function (e) {
      var container = document.getElementById('site-search-container');
      if (container && !container.contains(e.target)) self._hideResults();
    });
  };

  SiteSearch.prototype._handleSearch = function (rawQuery) {
    var query = rawQuery.trim().toLowerCase();

    if (this.clearBtn) {
      this.clearBtn.style.display = query ? 'flex' : 'none';
    }

    if (query.length < 2) {
      this._hideResults();
      return;
    }

    var results = searchPages(query);
    this.selectedIndex = -1;

    if (results.length > 0) {
      this._displayResults(results, query);
    } else {
      this._showNoResults();
    }
  };

  SiteSearch.prototype._displayResults = function (results, query) {
    if (!this.resultsBox || !this.resultsList) return;

    this.resultsBox.style.display  = 'block';
    this.noResults.style.display   = 'none';
    if (this.overlay) this.overlay.classList.add('active');

    if (this.resultsCount) {
      this.resultsCount.textContent =
        results.length + ' Ergebnis' + (results.length !== 1 ? 'se' : '');
    }

    var self = this;
    this.resultsList.innerHTML = results.map(function (r, i) {
      var excerpt = extractExcerpt(r.content || r.excerpt || '', query);
      return (
        '<a href="' + r.url + '" class="search-result-item" data-index="' + i + '" tabindex="0">' +
          '<div class="search-result-title">' +
            '<svg class="search-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
              '<polyline points="14 2 14 8 20 8"></polyline>' +
            '</svg>' +
            highlight(r.title, query) +
          '</div>' +
          '<div class="search-result-excerpt">' + highlight(excerpt, query) + '</div>' +
          '<div class="search-result-meta">' +
            '<span class="search-result-breadcrumb"><span>' + r.category + '</span></span>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    this.resultsList.querySelectorAll('.search-result-item').forEach(function (item) {
      item.addEventListener('click', function () { self._hideResults(); });
    });
  };

  SiteSearch.prototype._showNoResults = function () {
    if (this.resultsBox) this.resultsBox.style.display = 'none';
    if (this.noResults)  this.noResults.style.display  = 'block';
    if (this.overlay)    this.overlay.classList.add('active');
  };

  SiteSearch.prototype._hideResults = function () {
    if (this.resultsBox) this.resultsBox.style.display = 'none';
    if (this.noResults)  this.noResults.style.display  = 'none';
    if (this.overlay)    this.overlay.classList.remove('active');
  };

  SiteSearch.prototype._clearSearch = function () {
    this.input.value = '';
    if (this.clearBtn) this.clearBtn.style.display = 'none';
    this._hideResults();
    this.input.focus();
  };

  SiteSearch.prototype._handleKeyboard = function (e) {
    if (!this.resultsList) return;
    var items = this.resultsList.querySelectorAll('.search-result-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
      this._updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
      this._updateSelection(items);
    } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
      e.preventDefault();
      items[this.selectedIndex].click();
    }
  };

  SiteSearch.prototype._updateSelection = function (items) {
    items.forEach(function (item, i) {
      if (i === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    }, this);
  };

  // ── Initialisierung ────────────────────────────────────────

  function init() { new SiteSearch(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
