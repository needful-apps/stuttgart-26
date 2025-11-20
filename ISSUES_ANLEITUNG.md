# Anleitung: GitHub Issues aus Tests.MD erstellen

Dieses Dokument beschreibt, wie die Fehler aus `Tests.MD` in GitHub Issues überführt werden.

## 📋 Übersicht

Aus der `Tests.MD` wurden **28 offene Fehler** identifiziert, die in GitHub Issues konvertiert werden müssen:

- 🔴 **3 kritische Fehler** (sofortige Behebung erforderlich)
- 🟡 **12 mittelschwere Fehler** (sollten zeitnah behoben werden)
- 🟢 **13 kleinere Fehler** (Nice-to-have, Code-Qualität)

## 🤖 Automatische Erstellung (Empfohlen)

### Voraussetzungen

1. Node.js installiert (Version 12 oder höher)
2. GitHub Personal Access Token mit `repo` Berechtigung

### Schritt-für-Schritt Anleitung

#### 1. GitHub Token erstellen

1. Gehe zu: https://github.com/settings/tokens
2. Klicke auf "Generate new token" → "Generate new token (classic)"
3. Gib dem Token einen Namen: z.B. "Issues Creator"
4. Wähle die Berechtigung: ✅ `repo` (Full control of private repositories)
5. Klicke auf "Generate token"
6. **Wichtig:** Kopiere den Token sofort, er wird nur einmal angezeigt!

#### 2. Skript ausführen

```bash
# Option 1: Token als Umgebungsvariable
export GITHUB_TOKEN="ghp_deinTokenHier"
node create-issues.js

# Option 2: Token als Argument
node create-issues.js ghp_deinTokenHier
```

#### 3. Ergebnis prüfen

Das Skript erstellt alle Issues und gibt eine Zusammenfassung aus:
- Liste der erfolgreich erstellten Issues mit URLs
- Eventuell fehlgeschlagene Issues mit Fehlergrund
- Detaillierte Ergebnisse in `issues-creation-results.json`

## 📝 Manuelle Erstellung (Alternative)

Falls du die Issues lieber manuell erstellen möchtest, kannst du die Datei `issues-to-create.json` verwenden.

### Für jedes Issue:

1. Gehe zu: https://github.com/needful-apps/stuttgart-26/issues/new
2. Kopiere `title` aus der JSON in das Titel-Feld
3. Kopiere `body` aus der JSON in das Beschreibungs-Feld
4. Füge die `labels` hinzu (erstelle sie falls nötig)
5. Klicke auf "Submit new issue"

### Empfohlene Reihenfolge:

Erstelle die Issues in folgender Reihenfolge (nach Priorität):

#### 1. Kritische Issues (🔴)
1. XSS-Anfälligkeit bei Event-Rendering
2. Keine Content Security Policy
3. Mobile Menu bleibt manchmal offen

#### 2. Mittelschwere Issues (🟡)
4. Inkonsistente Datumsfilterung in Events
5. Fehlende Accessibility-Labels bei interaktiven Elementen
6. News-Suche funktioniert nicht mit Umlauten
7. CSS-Variablen werden in CSS-Strings nicht aufgelöst
8. Featured-Badge Position überschneidet sich mit Kategorie-Icon
9. Inkonsistente Error-Handling Patterns
10. Farbkontrast bei gelben Badges zu niedrig
11. Zeitzone-Probleme bei Datumsvergleichen
12. JSON-Daten haben inkonsistente Strukturen

#### 3. Kleinere Issues (🟢)
13. Duplizierter Code bei Mock-Daten
14. Magic Numbers in Zeitberechnungen
15. Fehlende Input-Validierung bei Services-Suche
16. Notification-Styles werden dynamisch injiziert
17. Fehlende Debounce bei Window Resize
18. Chart.js wird synchron geladen
19. Favicon fehlt tatsächlich
20. Stuttgart-Logo SVG wird nicht inline geladen
21. Fehlende Meta-Tags für SEO
22. Alle Event-Cards werden sofort gerendert
23. Animations-Performance bei vielen Event-Cards
24. CSS Custom Properties nicht überall unterstützt
25. Z-Index-Werte ohne System
26. Fehlende Vendor-Prefixes
27. Keine Skip-Navigation für Keyboard-User
28. Focus-Reihenfolge bei Mobile Menu falsch
29. Smooth Scrolling in Safari
30. Grid-Template in IE11
31. Events.json: Fehlende Pflichtfelder
32. News.json: URL-Felder ohne Validierung

## 🏷️ Labels

Stelle sicher, dass folgende Labels im Repository existieren:

### Priorität
- `critical` (rot) - Kritische Fehler
- `high` (orange) - Hohe Priorität
- `medium` (gelb) - Mittlere Priorität
- `low` (grau) - Niedrige Priorität

### Typ
- `bug` (rot) - Fehler im Code
- `security` (dunkelrot) - Sicherheitslücke
- `enhancement` (blau) - Verbesserung
- `refactor` (lila) - Code-Refactoring
- `performance` (grün) - Performance-Optimierung
- `accessibility` / `a11y` (orange) - Barrierefreiheit

### Bereich
- `mobile` - Mobile-spezifische Issues
- `css` / `styling` - CSS/Design
- `ux` - User Experience
- `seo` - SEO/Meta-Tags
- `i18n` - Internationalisierung
- `data` / `json` - Datenstrukturen
- `events` / `search` / `filter` - Feature-spezifisch

### Technisch
- `xss` / `csp` - Sicherheit
- `wcag` - WCAG-Konformität
- `browser-compat` - Browser-Kompatibilität
- `code-quality` - Code-Qualität
- `validation` - Eingabevalidierung
- `error-handling` - Fehlerbehandlung

## 📊 Nach der Issue-Erstellung

### Tests.MD aktualisieren

Nachdem alle Issues erstellt wurden, sollte `Tests.MD` aktualisiert werden:

1. Bei jedem Fehler einen Link zum entsprechenden Issue hinzufügen
2. Beispiel:
   ```markdown
   ### 1.3 Mobile Menu bleibt manchmal offen
   
   **GitHub Issue:** [#123](https://github.com/needful-apps/stuttgart-26/issues/123)
   
   **Fehlerbeschreibung:** Bei schnellem Navigieren...
   ```

### Projektboard erstellen (Optional)

Erstelle ein GitHub Project Board zur besseren Übersicht:

1. Gehe zu: https://github.com/needful-apps/stuttgart-26/projects
2. Erstelle ein neues Projekt: "Stuttgart Mobil - Bug Fixes"
3. Füge Spalten hinzu:
   - 📋 To Do (Alle offenen Issues)
   - 🚧 In Progress (In Bearbeitung)
   - ✅ Done (Erledigt)
4. Füge alle erstellten Issues zum Board hinzu

### Milestones definieren (Optional)

Erstelle Milestones für die Bearbeitung:

1. **v1.1 - Kritische Fixes** (Deadline: z.B. 1 Woche)
   - Alle 3 kritischen Issues

2. **v1.2 - Wichtige Verbesserungen** (Deadline: z.B. 2 Wochen)
   - Alle mittelschweren Issues

3. **v1.3 - Qualitätsverbesserungen** (Deadline: z.B. 1 Monat)
   - Alle kleineren Issues

## 🔧 Troubleshooting

### Fehler: "Resource not accessible by integration"
→ Token hat nicht genug Berechtigungen. Erstelle neuen Token mit `repo` Berechtigung.

### Fehler: "Validation Failed"
→ Labels existieren nicht im Repository. Erstelle sie zuerst oder entferne sie aus der JSON.

### Rate Limiting
→ GitHub erlaubt max. 5000 API-Requests pro Stunde. Das Skript macht Pausen zwischen Requests.

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfe die Konsolen-Ausgabe des Skripts
2. Schau in `issues-creation-results.json` nach Details
3. Erstelle ein Issue im Repository

---

**Viel Erfolg beim Beheben der Fehler! 🚀**
