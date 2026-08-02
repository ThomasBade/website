/* 
=================================================================
SHARE BUTTON JAVASCRIPT - thomas-bade.de
=================================================================
Variante 4: Compact Icon Button mit Instagram
Link-Kopieren statt E-Mail (kein Outlook-Fehler)
=================================================================
*/

// Toggle-Funktion für Share-Button
function toggleShare(container) {
    container.classList.toggle('active');
}

// Klick außerhalb schließt Pop-up
document.addEventListener('click', function(event) {
    const container = document.querySelector('.share-container');
    if (container && !container.contains(event.target)) {
        container.classList.remove('active');
    }
});

// Link in Zwischenablage kopieren (statt mailto:)
function copyLinkToClipboard(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const shareText = pageTitle + '\n' + pageUrl;
    
    // In Zwischenablage kopieren
    navigator.clipboard.writeText(shareText).then(function() {
        // Bestätigung anzeigen
        const notification = document.getElementById('copyNotification');
        if (notification) {
            notification.classList.add('show');
            
            // Nach 3 Sekunden ausblenden
            setTimeout(function() {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Pop-up schließen
        const container = document.querySelector('.share-container');
        if (container) {
            container.classList.remove('active');
        }
    }).catch(function(err) {
        // Fallback für ältere Browser
        console.error('Kopieren fehlgeschlagen:', err);
        alert('Link wurde in die Zwischenablage kopiert:\n\n' + shareText);
    });
}

// Share-URLs automatisch generieren beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    // Share-URLs für verschiedene Plattformen
    const shareUrls = {
        linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl,
        twitter: 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle,
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl,
        instagram: 'https://www.instagram.com/',
        mastodon: 'https://mastodon.social/share?text=' + pageTitle + '%20' + pageUrl
    };
    
    // Alle Share-Links aktualisieren
    document.querySelectorAll('[data-platform]').forEach(function(link) {
        const platform = link.getAttribute('data-platform');
        if (shareUrls[platform]) {
            link.href = shareUrls[platform];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});

/* 
=================================================================
ANPASSUNGEN
=================================================================

MASTODON INSTANCE:
Falls du eine andere Mastodon-Instance bevorzugst, ändere in Zeile 57:
mastodon: 'https://deine-instance.de/share?text=' + pageTitle + '%20' + pageUrl

WEITERE PLATTFORMEN HINZUFÜGEN:
Füge einfach neue Einträge in das shareUrls-Objekt ein, z.B.:
whatsapp: 'https://wa.me/?text=' + pageTitle + '%20' + pageUrl,

=================================================================
*/