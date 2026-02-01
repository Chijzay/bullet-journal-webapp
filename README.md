
# Fullstack Webentwicklung eines Bullet Journal

Diese Webapplikation demonstriert eine vollständig implementierte, moderne Fullstack-Architektur und verbindet Software-Engineering-Best-Practices mit einer nutzerfreundlichen UI.
Sie dient als selbst initiiertes Portfolio-Projekt zur Demonstration moderner Fullstack-Entwicklung sowie softwaretechnischer Entscheidungsprozesse und dient als realistische Grundlage für produktionsnahe Webentwicklung. Neben der klassischen Verwaltung persönlicher Aufgaben mit Deadlines, Kategorien, Filter- und Sortierfunktionen, Pagination umfasst die Anwendung zusätzlich ein digitales Journal, welches tägliche Stimmungen, Prioritäten, Dankbarkeitsmomente, Wasseraufnahme und freie Notizen speichert. Damit vereint die Applikation sowohl Produktivität (ToDos) als auch Selbstreflexion (Journal) in einem einzigen System. Alle Daten werden benutzerspezifisch gespeichert und sind jederzeit online abrufbar.


## Demo

Die Webapplikation ist unter folgendem Link erreichbar:

```
https://chijzay.github.io/bullet-journal-webapp/
```

**Hinweis:**

Das Backend läuft auf Render (Free Tier) und wird nach einer Inaktivität von ca. 15 Minuten automatisch in den Sleep-Modus versetzt. Beim ersten Request nach dem Aufwachen dauert der Startvorgang daher typischerweise 20–60 Sekunden, bis der Server wieder verfügbar ist. Während dieser Zeit antwortet auch die Verbindung zu MongoDB Atlas verzögert.


## Projektbeschreibung

Diese Webapplikation demonstriert eine vollständig implementierte, moderne Fullstack-Architektur und verbindet Software-Engineering-Best-Practices mit einer nutzerfreundlichen UI. Sie dient als selbst initiiertes Portfolio-Projekt zur Demonstration moderner Fullstack-Entwicklung sowie softwaretechnischer Entscheidungsprozesse und dient als realistische Grundlage für produktionsnahe Webentwicklung. Die Anwendung ermöglicht:

* Benutzerregistrierung und Login (JWT)
* Verwaltung persönlicher Aufgaben
* Deadlines und Kategorien
* Vollständige Filter- und Sortieroptionen
* Stimmungs- und Wassertracker
* Dankbarkeitsliste
* Tagesprioritäten
* Tagebucheintrag
* Light und Dark Mode (persistiert)
* Pagination (keine Scroll-Listen)
* Sichere und skalierbare API-Struktur

## Funktionen

### Benutzerverwaltung

* Registrierung und Login über `JWT`-Authentifizierung
* Sicheres Passwort-Hashing mit `bcrypt`
* Benutzername wird bei Registrierung vergeben und im UI angezeigt
* Jeder Benutzer sieht ausschließlich seine eigenen Aufgaben
* Authentifizierung wird clientseitig persistent und in `localStorage` gespeichert

### ToDo-Management (CRUD)

* Aufgaben erstellen, anzeigen, bearbeiten und löschen
* Inline-Bearbeitung von:
  - Text
  - Deadline
  - Kategorie
* Speichern per Button oder `Enter`, Abbrechen per `Esc`
* Pflicht-Deadline (Standard = aktuelles Datum)
* Deadlines können nicht in der Vergangenheit liegen
* Kategorien frei wählbar oder vordefiniert

### Filtern, Sortieren und Kategorien

* Filteroptionen:
  - Offen
  - Heute
  - Diese Woche 
  - Erledigt
  - Alle

* Sortieroptionen:
  - Erstellungsdatum (↑/↓)
  - Deadline (früh oder spät)
  - Status
  - Text (A–Z oder Z–A)
  - Kategorie (A–Z)

* Kategorie-Filter:
  - Dynamische Liste aller vorhandenen Kategorien
  - Auch benutzerdefinierte Kategorien werden erkannt
  - Jede Kategorie mit eigener Farb-Badge (automatisch generiert)

### Pagination und UX

* Maximal 8 Aufgaben pro Seite
* Navigation über `Weiter` und `Zurück`
* Keine endlosen Scroll-Listen
* Erledigte Aufgaben werden visuell abgedunkelt
*	Modernes, schlankes und responsives UI mit Tailwind CSS

### Journal-Funktionen

Das integrierte Journal-Modul ermöglicht eine strukturierte Tagesreflexion und bietet produktive sowie wellbeing-orientierte Funktionen:

*	Datumsauswahl per Kalender
  -	Einträge pro Tag (YYYY-MM-DD)
  -	Historische Einträge jederzeit abrufbar
*	Stimmungstracker
  -	Auswahl von 5 Mood-Leveln (😢 bis 😄)
  -	Persistente Tagesstimmung
* Wasser-Tracker
  - 0–8 Gläser pro Tag
  - Visuelle Fortschrittsanzeige per Icons
* Dankbarkeitsliste (Gratitude)
  - Bis zu 3 Dinge, die den Tag positiv beeinflusst haben
* Top-4 Tagesprioritäten
  - Vier wichtigste Aufgaben des Tages
  - Ergänzt die ToDo-Liste als Tagesfokus
* Freitext für Notizen und Reflektion
  - Offenes Tagebuchfeld
  - Unterstützt tägliche Einträge und Rückblicke
* Automatisches Speichern und Laden
  - Journal-Einträge werden versioniert und benutzerspezifisch in MongoDB gespeichert
  - Beim Wechsel des Datums werden Einträge automatisch geladen

Dieses Modul erweitert die Anwendung von einer reinen Aufgabenverwaltung hin zu einer vollwertigen Productivity- und Personal-Development-App.

### Dark Mode

* Umschaltbar zwischen Light und Dark Mode
* Einstellung wird dauerhaft in `localStorage` gespeichert
*	Dark Mode gilt auch auf der Login- und Registrierungsseite
* Optimierte Farben, Kontraste und Schatten


## Technologiestack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* JWT

### Backend

*	Node.js + Express
* MongoDB + Mongoose
*	JWT-Authentifizierung
*	bcryptjs (Password Hashing)
*	dotenv
*	cors

### Datenbank

* MongoDB Atlas
*	Mongoose ODM
    - `User`: Benutzername, E-Mail, Passwort (gehasht)
    - `Todo`: Text, Status, Kategorie, Deadline, User-Referenz
    - `JournalEntry`: Benutzer, Datum, Dankbarkeitsliste, Tagespriorität, Stimmungstracker, Wasser-Tracker, Tagesnotizen


## Architekturübersicht

Die Anwendung folgt einer klassischen und vollständigen Fullstack `Client-Server-Architektur.`

```text
┌──────────────────────────┐
│     Frontend (React)     │
│  - ToDo-Seite            │
│  - Journal-Seite         │
│  - Navigation + UIState  │
│  - Vite, Tailwind, Axios │
│  - Auth per JWT          │
└────────────┬─────────────┘
             │ HTTPS / JSON
             ▼
┌──────────────────────────┐
│ Backend (Node + Express) │
│ - REST API               │
│ - Routes: ToDo, Journal  │
│ - Express, Auth, JWT     │
│ - Auth, Business Logic   │
└────────────┬─────────────┘
             │ Mongoose
             ▼
┌──────────────────────────┐
│   MongoDB Atlas Cluster  │
│ - persistent storage     │
│ - users                  │
│ - todos                  │
│ - journalentries         │
└──────────────────────────┘
```

* `Frontend:` React SPA kommuniziert ausschließlich über REST-API
* `Backend:` Express verarbeitet Requests, validiert Token und Daten
* `Datenbank:` MongoDB Atlas, angebunden via Mongoose

* Authentication: JWTs (stateless, skalierbar)
* Hosting: GitHub Actions und Pages (Frontend) und Render (Backend)
* CI/CD: Automatische Deployments über GitHub Push


## Projektstruktur

```text
.
├── backend/
│   ├── middleware/           # Auth Middleware, Error Handling
│   ├── models/               # Schemas
│   │   ├── User.js/          # Schema fuer Users
│   │   ├── Todo.js/          # Schema fuer Aufgaben
│   │   └── JournalEntry.js/  # Schema fuer Journal Eintraege
│   ├── routes/               # REST API Endpunkte
│   │   ├── authRoutes.js/    # Routes fuer Authentifizierung
│   │   ├── todoRoutes.js/    # Routes fuer Aufgaben
│   │   └── journalRoutes.js/ # Routes fuer Journal Eintraege
│   ├── .env                  # Umgebungsvariablen
│   ├── package.json          # Projektkonfiguration und Abhängigkeiten
│   └── server.js             # Haupteinstiegspunkt des Backends.
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React Komponenten
│   │   │   ├── JournalPage.jsx 
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   └── AuthScreen.jsx
│   │   ├── App.jsx           # Hauptkomponente der Webappplikation
│   │   ├── index.css         # Einbindung der Tailwind-Styles
│   │   └── main.jsx          # Einstiegspunkt des Clients
│   ├── index.html            # Einstiegspunkt der React-Anwendung.
│   ├── package.json          # Projektkonfiguration und Abhängigkeiten
│   ├── postcss.config.js     # Post-CSS Konfiguration für Tailwind
│   ├── tailwind.config.js    # Konfiguration für Tailwind
└   └── vite.config.js        # Konfiguration für Vite
```

## Qualität und Sicherheit

* Passwort-Hashing mit `bcrypt`
* Token-basierte Authentifizierung
* Geschützte Endpunkte (`JWT`-Pflicht)
* Cross-Origin-Schutz via `CORS`
* Eingabevalidierung im Backend
* Fehlerbehandlung und Response-Standardisierung
* Keine sensiblen Daten im Client gespeichert

## Deployment und Hosting

* Render (Backend):
  - Hosted auf Render.com
  - Node Server über `npm start`
  - Automatisches Deployment bei jedem GitHub-Push
  - Environment Variables:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `PORT`

* GitHub (Frontend):
  - Hosted auf GitHub via GitHub Actions und GitHub Pages
  - Build-Prozess mit Vite über `npm run build`
  - Deploy der `dist/`-Dateien
  - Environment Variables:
    - `VITE_API_URL`
    - `VITE_AUTH_API_URL`
    - `VITE_JOURNAL_API_URL`

* CI/CD:
  - Jedes GitHub-Push löst auto-Deploy auf Render und GitHub aus
  - Zero-Downtime Deployments
  - Keine lokale Umgebung für Betrieb notwendig und zu 100% Cloud

## Lizenz

Die Nutzung der Anwendung ist zu Demonstrations- und Lernzwecken erlaubt. Die kommerzielle Nutzung, Weitergabe, Vervielfältigung oder Verbreitung ist untersagt. Siehe `LICENSE` für Details.
