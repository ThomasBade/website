/**
 * ============================================================
 *  MODAL KIT — KI-gestützte Teilhabeplanung
 *  Einbinden via: <script src="modal-kit.js" defer></script>
 * ============================================================
 *
 *  VERWENDUNG
 *  ----------
 *  Trigger-Button:
 *    <button class="tkp-modal-trigger" data-modal="mein-modal">Text</button>
 *
 *  Modal-Overlay:
 *    <div id="mein-modal" class="tkp-modal-overlay" role="dialog"
 *         aria-modal="true" aria-labelledby="mein-modal-title" data-theme="blau">
 *      <div class="tkp-modal">
 *        ...
 *        <button class="tkp-modal__close" aria-label="Schließen">✕</button>
 *        <button class="tkp-modal__btn-close">Schließen</button>
 *      </div>
 *    </div>
 *
 *  Oder per JavaScript:
 *    TkpModal.open('mein-modal');
 *    TkpModal.close('mein-modal');
 * ============================================================
 */

const TkpModal = (function () {

  /* ── Interner State ──────────────────────────────────────── */
  let _activeModal = null;
  let _lastFocused = null;

  /* ── Öffnen ─────────────────────────────────────────────── */
  function open(idOrElement) {
    const overlay = _resolve(idOrElement);
    if (!overlay) return;

    // Vorherigen Modal ggf. schließen
    if (_activeModal && _activeModal !== overlay) {
      _hide(_activeModal);
    }

    _lastFocused = document.activeElement;
    _activeModal = overlay;

    overlay.classList.add('is-open');

    // Zweistufige Animation: erst display:flex, dann opacity
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('is-visible');
      });
    });

    // Body-Scroll sperren
    document.body.style.overflow = 'hidden';

    // Fokus in den Modal setzen
    const firstFocusable = overlay.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      setTimeout(function () { firstFocusable.focus(); }, 50);
    }

    // Callback-Event
    overlay.dispatchEvent(new CustomEvent('tkp:open', { bubbles: true }));
  }

  /* ── Schließen ──────────────────────────────────────────── */
  function close(idOrElement) {
    const overlay = _resolve(idOrElement) || _activeModal;
    if (!overlay) return;
    _hide(overlay);
  }

  function _hide(overlay) {
    overlay.classList.remove('is-visible');

    // Nach Transition: display entfernen
    function onTransitionEnd() {
      overlay.classList.remove('is-open');
      overlay.removeEventListener('transitionend', onTransitionEnd);
      overlay.dispatchEvent(new CustomEvent('tkp:close', { bubbles: true }));
    }
    overlay.addEventListener('transitionend', onTransitionEnd);

    // Fallback falls kein transitionend feuert
    setTimeout(function () {
      overlay.classList.remove('is-open');
    }, 350);

    document.body.style.overflow = '';
    _activeModal = null;

    // Fokus zurück auf Auslöser
    if (_lastFocused) {
      _lastFocused.focus();
      _lastFocused = null;
    }
  }

  /* ── Umschalten ─────────────────────────────────────────── */
  function toggle(idOrElement) {
    const overlay = _resolve(idOrElement);
    if (!overlay) return;
    overlay.classList.contains('is-open') ? close(overlay) : open(overlay);
  }

  /* ── Hilfsfunktion ──────────────────────────────────────── */
  function _resolve(idOrElement) {
    if (!idOrElement) return null;
    if (typeof idOrElement === 'string') {
      return document.getElementById(idOrElement);
    }
    return idOrElement;
  }

  /* ── Event-Delegation ───────────────────────────────────── */
  function _init() {
    document.addEventListener('click', function (e) {

      // Trigger-Button
      const trigger = e.target.closest('[data-modal]');
      if (trigger) {
        e.preventDefault();
        open(trigger.dataset.modal);
        return;
      }

      // Schließen-Button (.tkp-modal__close oder .tkp-modal__btn-close)
      const closeBtn = e.target.closest('.tkp-modal__close, .tkp-modal__btn-close');
      if (closeBtn) {
        const overlay = closeBtn.closest('.tkp-modal-overlay');
        if (overlay) close(overlay);
        return;
      }

      // Klick auf den Hintergrund (Overlay selbst, nicht Modal-Box)
      if (e.target.classList.contains('tkp-modal-overlay')) {
        close(e.target);
      }
    });

    // ESC-Taste
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _activeModal) {
        close(_activeModal);
      }
    });

    // Fokus-Falle (Tab bleibt im Modal)
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !_activeModal) return;

      const focusable = Array.from(
        _activeModal.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ── Initialisierung beim DOM-Ready ─────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  /* ── Öffentliche API ────────────────────────────────────── */
  return { open: open, close: close, toggle: toggle };

})();
