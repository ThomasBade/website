# Stripe-Zahlungen auf statischen HTML-Seiten

## Empfohlene Variante für öffentliche Angebote

GitHub Pages kann auf einer HTML-Seite einen Stripe Payment Link oder den von Stripe erzeugten Buy Button anzeigen. Der eigentliche Checkout läuft auf der von Stripe gehosteten Zahlungsseite. Dafür ist auf GitHub Pages kein eigener Server erforderlich.

Ein einfacher Link genügt:

```html
<a href="https://buy.stripe.com/DEIN_PAYMENT_LINK">Jetzt sicher mit Stripe bezahlen</a>
```

Alternativ wird im Stripe Dashboard beim Payment Link unter **Buy button** ein HTML-Snippet erzeugt. Dieses enthält `https://js.stripe.com/v3/buy-button.js`, eine Buy-Button-ID und einen veröffentlichbaren Schlüssel.

## Sicherheitsregeln

- Niemals einen Stripe Secret Key (`sk_…`) in HTML, JavaScript, GitHub Actions, Commits oder GitHub Pages speichern.
- Payment Links und veröffentlichbare Schlüssel (`pk_…`) dürfen clientseitig verwendet werden.
- Preise, Erfolgsstatus und Berechtigungen niemals allein über URL-Parameter oder clientseitiges JavaScript bestätigen.

## Was GitHub Pages nicht schützen kann

Alle von GitHub Pages ausgelieferten HTML-, PDF-, JSON- und Mediendateien sind öffentlich abrufbar. Eine vermeintlich „versteckte“ Premium-Seite im Repository ist daher kein geschütztes Bezahlangebot.

Für kostenpflichtige Inhalte mit Zugriffsschutz wird zusätzlich benötigt:

1. Stripe Checkout oder Payment Link für die Zahlung,
2. ein serverseitiger Stripe-Webhook zur verlässlichen Zahlungsbestätigung,
3. Benutzeranmeldung und Berechtigungsverwaltung,
4. ein geschützter Speicher- oder Auslieferungsdienst für Premium-Inhalte.

GitHub Pages kann weiterhin die öffentliche Verkaufs- und GEO-Landingpage hosten. Checkout, Webhook und Premium-Auslieferung müssen jedoch über einen Backend- oder Serverless-Dienst laufen.

## Messung

Für Plausible kann der Klick auf den Stripe-Link als eigenes Ereignis erfasst werden. Umsatz und erfolgreiche Zahlungen bleiben im Stripe Dashboard beziehungsweise werden serverseitig über Webhooks verarbeitet.
