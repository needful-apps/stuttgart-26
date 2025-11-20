# Issues aus Tests.MD - Zusammenfassung

Dieses Dokument listet alle 28 offenen Fehler auf, die aus Tests.MD extrahiert und für die GitHub Issues-Erstellung vorbereitet wurden.

## 🔴 Kritische Issues (3)

Sofortige Behebung erforderlich! Sicherheits- und Funktionskritische Fehler.

| Nr | Titel | Kategorie | Beschreibung |
|----|-------|-----------|--------------|
| 1.3 | Mobile Menu bleibt manchmal offen | UX / Mobile | Race Conditions bei schneller Navigation |
| 5.1 | **XSS-Anfälligkeit bei Event-Rendering** | Security | Event-Daten ohne Sanitization im HTML |
| 5.2 | **Keine Content Security Policy** | Security | Fehlender CSP-Header zum XSS-Schutz |

## 🟡 Mittelschwere Issues (12)

Sollten zeitnah behoben werden.

| Nr | Titel | Kategorie | Beschreibung |
|----|-------|-----------|--------------|
| 2.1 | Inkonsistente Datumsfilterung in Events | Events / Filter | endDate wird nicht berücksichtigt |
| 2.2 | Fehlende Accessibility-Labels | A11y | Filter ohne aria-label |
| 2.3 | News-Suche funktioniert nicht mit Umlauten | Search / i18n | toLowerCase() Problem mit Umlauten |
| 2.4 | CSS-Variablen in CSS-Strings | CSS / Styling | var(--color)dd wird ungültig |
| 2.5 | Featured-Badge überschneidet Kategorie-Icon | CSS / Mobile | Kein responsive Layout |
| 3.3 | Inkonsistente Error-Handling Patterns | Code Quality | Unterschiedliche Fehlerbehandlung |
| 8.1 | Farbkontrast bei gelben Badges zu niedrig | A11y / WCAG | Kontrast < 4.5:1 |
| 6.1 | Zeitzone-Probleme bei Datumsvergleichen | DateTime / i18n | Lokale Zeitzone verursacht Fehler |
| 6.2 | JSON-Daten inkonsistente Strukturen | Data / JSON | Unterschiedliche Feldnamen |

## 🟢 Kleinere Issues (13)

Nice-to-have, Code-Qualität und Performance-Optimierungen.

| Nr | Titel | Kategorie | Beschreibung |
|----|-------|-----------|--------------|
| 3.1 | Duplizierter Code bei Mock-Daten | Code Quality | Redundanz zwischen JS und JSON |
| 3.2 | Magic Numbers in Zeitberechnungen | Code Quality | Hardcoded Zahlen ohne Konstanten |
| 3.4 | Fehlende Input-Validierung | Validation / UX | Kein maxlength bei Suchfeldern |
| 3.5 | Notification-Styles dynamisch injiziert | CSS / Code Quality | CSS in JavaScript |
| 3.6 | Fehlende Debounce bei Window Resize | Performance | Event-Handler zu oft aufgerufen |
| 3.7 | Chart.js wird synchron geladen | Performance | Blockiert Rendering |
| 3.8 | Favicon fehlt | Assets | 404-Fehler im Browser |
| 3.9 | Stuttgart-Logo nicht inline | Performance | Zusätzlicher HTTP-Request |
| 3.10 | Fehlende Meta-Tags für SEO | SEO | Keine OG/Twitter Cards |
| 4.1 | Alle Event-Cards sofort gerendert | Performance | Kein Lazy Loading |
| 4.2 | Animations-Performance | Performance / CSS | Direkte Style-Manipulation |
| 7.1 | CSS Custom Properties Fallback | Browser Compat | IE11 Unterstützung |
| 7.2 | Z-Index-Werte ohne System | CSS / Code Quality | Willkürliche Werte |
| 7.3 | Fehlende Vendor-Prefixes | Browser Compat | Moderne CSS-Features |
| 8.2 | Keine Skip-Navigation | A11y | Keyboard-User müssen durch alles tabben |
| 8.3 | Focus-Reihenfolge Mobile Menu falsch | A11y / Mobile | Versteckte Elemente fokussierbar |
| 9.1 | Smooth Scrolling in Safari | Browser Compat | Safari < 15.4 |
| 9.2 | Grid-Template in IE11 | Browser Compat | IE11 End-of-Life |
| 10.1 | Events.json: Fehlende Pflichtfelder | Data / Validation | Inkonsistente Felder |
| 10.2 | News.json: URL-Felder unvollständig | Data / Bug | Bilder werden nicht geladen |

## 📊 Statistik

| Kategorie | Anzahl |
|-----------|--------|
| **Gesamt** | **28** |
| Kritisch 🔴 | 3 |
| Mittel 🟡 | 12 |
| Klein 🟢 | 13 |

## 🏷️ Tags nach Häufigkeit

| Tag | Anzahl | Typ |
|-----|--------|-----|
| `low` | 13 | Priorität |
| `medium` | 12 | Priorität |
| `critical` | 3 | Priorität |
| `bug` | 11 | Typ |
| `enhancement` | 10 | Typ |
| `refactor` | 8 | Typ |
| `css` | 9 | Bereich |
| `code-quality` | 7 | Bereich |
| `accessibility` / `a11y` | 5 | Bereich |
| `performance` | 5 | Bereich |
| `security` | 2 | Typ (KRITISCH!) |

## 🎯 Empfohlene Bearbeitungsreihenfolge

### Sprint 1: Sicherheit & Kritische Fehler (Woche 1)
1. **5.1** - XSS-Anfälligkeit beheben 🔴
2. **5.2** - Content Security Policy implementieren 🔴
3. **1.3** - Mobile Menu Race Condition fixen 🔴

### Sprint 2: Wichtige UX & Accessibility (Woche 2)
4. **2.1** - Datumsfilterung korrigieren 🟡
5. **2.2** - Accessibility-Labels ergänzen 🟡
6. **8.1** - Farbkontraste verbessern 🟡
7. **2.3** - Umlaut-Suche fixen 🟡

### Sprint 3: Styling & Datenstrukturen (Woche 3)
8. **2.4** - CSS-Variablen-Problem beheben 🟡
9. **2.5** - Badge-Position responsive machen 🟡
10. **6.1** - Zeitzone-Handling verbessern 🟡
11. **6.2** - JSON-Strukturen vereinheitlichen 🟡

### Sprint 4: Code-Qualität & Refactoring (Woche 4)
12. **3.3** - Error-Handling vereinheitlichen 🟡
13. **3.1** - Mock-Daten konsolidieren 🟢
14. **3.2** - Magic Numbers eliminieren 🟢
15. **3.5** - CSS aus JavaScript extrahieren 🟢
16. **7.2** - Z-Index-System implementieren 🟢

### Sprint 5: Performance & Assets (Woche 5)
17. **3.6** - Window Resize debounce 🟢
18. **3.7** - Chart.js async laden 🟢
19. **4.1** - Event-Cards Lazy Loading 🟢
20. **4.2** - Animation-Performance verbessern 🟢
21. **3.8** - Favicon erstellen 🟢
22. **3.9** - Logo inline einbetten 🟢

### Sprint 6: Nice-to-have (Woche 6)
23. **3.4** - Input-Validierung 🟢
24. **3.10** - SEO Meta-Tags 🟢
25. **8.2** - Skip-Navigation 🟢
26. **8.3** - Mobile Menu Focus 🟢
27. **10.1** - Events.json Schema 🟢
28. **10.2** - News.json Pfade 🟢

## 📝 Notizen für Issue-Erstellung

### Labels die erstellt werden müssen:
- `critical`, `high`, `medium`, `low`
- `bug`, `security`, `enhancement`, `refactor`, `performance`
- `accessibility`, `a11y`, `mobile`, `css`, `styling`
- `ux`, `seo`, `i18n`, `data`, `json`
- `xss`, `csp`, `wcag`, `browser-compat`
- `code-quality`, `validation`, `error-handling`
- `events`, `search`, `filter`, `datetime`, `assets`

### Milestones:
1. **v1.1 - Security & Critical Fixes** (3 Issues)
2. **v1.2 - UX & Accessibility** (4 Issues)
3. **v1.3 - Data & Styling** (4 Issues)
4. **v1.4 - Code Quality** (5 Issues)
5. **v1.5 - Performance & Assets** (6 Issues)
6. **v1.6 - Final Polish** (6 Issues)

## 🔗 Verwendung

1. **Automatisch:** Nutze `create-issues.js` mit GitHub Token
2. **Manuell:** Nutze `issues-to-create.json` als Vorlage
3. **Dokumentation:** Siehe `ISSUES_ANLEITUNG.md` für Details

---

**Erstellt am:** 20. November 2025  
**Basis:** Tests.MD v1.0  
**Status:** Bereit zur Issue-Erstellung
