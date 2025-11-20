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