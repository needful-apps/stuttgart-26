# „Stuttgart Mobil: Interaktive Bürger-Info-Webapp“

Komplexe Übung / Nur Frontend / Praxisnah für Kommunen

Eine moderne, responsive Web-App, die Bürger\*innen barrierearme Informationen anbietet – komplett statisch, aber mit dynamischer Interaktion.

Eine Single Page Application (SPA) (nur HTML und JS, ganz klassich ohne react npm o.ä.), die verschiedene Module enthält:

## 1. Event- & Kultur-Übersicht (kalenderartige Ansicht)

- Statische JSON-Dateien als “Fake-Datenquelle”
- Filter (Datum, Kategorie, Ort)
- Kartenähnliche Kachel-Darstellung
- Responsives Grid

## 2. „Aktuell in Stuttgart“ – Nachrichtenstream

- Statische Meldungen in einer JSON-Datei
- Sortierung nach Datum, Tags
- Dynamische Highlight-Box für Top-Artikel
- Markdown → HTML Rendering

## 3. Bürger-Services Navigator

Eine kleine interaktive Suche:

- Eingabe: „Ausweis“, „Eheschließung“, „Umzug“
- Ergebnisliste: Dienstleistungen + zuständige Ämter  
   (alles statisch!)

## 4. „Stuttgart Klima Dashboard“ (Mini-Analytics)

Mini-Datenauswertung rein im Frontend:

- Diagramme (Bar/Line/Pie) mit Chart.js
- Daten aus JSON
- Darstellung von Trends wie:
  - Grünflächenanteil
  - Fahrradverkehr
  - E-Ladestationen
  - Luftqualität
---

## 🐛 Issues und Fehler

Die Datei `Tests.MD` enthält eine detaillierte Analyse mit **28 offenen Fehlern**, die behoben werden müssen.

### Issue-Erstellung

Alle Fehler wurden strukturiert aufbereitet und können als GitHub Issues angelegt werden:

- **📋 [ISSUES_ANLEITUNG.md](ISSUES_ANLEITUNG.md)** - Schritt-für-Schritt Anleitung
- **🤖 [create-issues.js](create-issues.js)** - Automatisches Script zur Issue-Erstellung
- **📊 [ISSUES_ZUSAMMENFASSUNG.md](ISSUES_ZUSAMMENFASSUNG.md)** - Übersicht aller Issues
- **📦 [issues-to-create.json](issues-to-create.json)** - Strukturierte Issue-Daten

### Schnellstart

```bash
# GitHub Token erstellen auf: https://github.com/settings/tokens
# Dann Script ausführen:
export GITHUB_TOKEN="dein_token_hier"
node create-issues.js
```

### Issue-Kategorien

- 🔴 **3 kritische Issues** (XSS-Sicherheit, CSP, Mobile Menu)
- 🟡 **12 mittelschwere Issues** (UX, Accessibility, Datenstrukturen)
- 🟢 **13 kleinere Issues** (Code-Qualität, Performance, Browser-Kompatibilität)

Siehe [ISSUES_ZUSAMMENFASSUNG.md](ISSUES_ZUSAMMENFASSUNG.md) für Details.
