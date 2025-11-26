<p align="center">
  <img src="./logo.svg" width="300" />
</p>

# Fullstack Webentwicklung einer ToDo-Liste

Eine moderne, vollständige Fullstack-Webapplikation zur Verwaltung persönlicher Aufgaben. Das System umfasst Benutzerkonten, Deadlines, Kategorien, Filter- und Sortierfunktionen, Pagination, sowie Light- und Dark-Mode. Alle Daten werden benutzerspezifisch gespeichert und sind jederzeit online abrufbar und bietet eine klare Oberfläche.


## Live-Demo

Die Webapplikation ist unter folgendem Link erreichbar:

```
https://todo-liste-webapp.netlify.app/
```

**Hinweis:** Der erste Aufruf kann einige Sekunden dauern, da Render das Backend zunächst _aufweckt_.


## Funktionen

### Benutzerverwaltung

* Registrierung und Login über `JWT`-Authentifizierung
* Sicheres Passwort-Hashing mit `bcrypt`
* Benutzername wird bei Registrierung vergeben und im UI angezeigt
* Jeder Benutzer sieht ausschließlich seine eigenen Aufgabe
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


## Architekturübersicht

Die Anwendung folgt einer klassischen und vollständigen Fullstack `Client-Server-Architektur.`

```text
┌──────────────────────────┐
│     Frontend (React)     │
│  - Single Page App       │
│  - Vite, Tailwind, Axios │
│  - Auth per JWT          │
└────────────┬─────────────┘
             │ HTTPS / JSON
             ▼
┌──────────────────────────┐
│ Backend (Node + Express) │
│ - REST API               │
│ - Express, Auth, JWT     │
│ - Auth, Business Logic   │
└────────────┬─────────────┘
             │ Mongoose
             ▼
┌──────────────────────────┐
│   MongoDB Atlas Cluster  │
│ - persistent storage     │
└──────────────────────────┘

```

* `Frontend:` React SPA kommuniziert ausschließlich über REST-API
* `Backend:` Express verarbeitet Requests, validiert Token und Daten
* `Datenbank:` MongoDB Atlas, angebunden via Mongoose

* Authentication: JWTs (stateless, skalierbar)
* Hosting: Netlify (Frontend) und Render (Backend)
* CI/CD: Automatische Deployments über GitHub Push


## Projektstruktur

```text
.
├── backend/
│   ├── middleware/           # Auth Middleware, Error Handling
│   ├── models/               # User und ToDo Schemas
│   ├── routes/               # REST API Endpunkte
│   ├── .env                  # Umgebungsvariablen
│   ├── package.json          # Projektkonfiguration und Abhängigkeiten
│   └── server.js             # Haupteinstiegspunkt des Backends.
│
└── frontend/
│   ├── src/
│   │   ├── components/       # React Kompinenten
│   │   ├── App.jsx           # Hauptkomponente der Webappplikation
│   │   ├── index.css         # Einbindung der Tailwind-Styles
│   │   ├── main.jsx          # Einstiegspunkt des Clients
│   ├── index.html            # Einstiegspunkt der React-Anwendung.
│   ├── package.json          # Projektkonfiguration und Abhängigkeiten
│   ├── postcss.config.js     # Post-CSS Konfiguration für Tailwind
│   ├── tailwind.config.js    # Konfiguration für Tailwind
\   └── vite.config.js        # Konfiguration für Vite
```


## Deployment und Hosting

* Backend (API):
  - Hosted auf Render.com
  - Automatisches Deployment bei jedem GitHub-Push
  - Environment Variables:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `PORT`

* Frontend:
  - Hosted auf Netlify
  - Build-Prozess mit Vite (npm run build)
  - Environment Variables:
    - `VITE_API_URL`
    - `VITE_AUTH_API_URL`

* CI/CD:
  - Jedes GitHub-Push löst auto-Deploy auf Render und Netlify aus
  - Zero-Downtime Deployments
  - Keine lokale Umgebung für Betrieb notwendig und zu 100% Cloud


## Lizenz

Die Nutzung der Anwendung ist zu Demonstrations- und Lernzwecken erlaubt. Die kommerzielle Nutzung, Weitergabe, Vervielfältigung oder Verbreitung ist untersagt. Siehe LICENSE für Details.
