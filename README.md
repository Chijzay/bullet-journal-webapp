# Fullstack Webentwicklung einer ToDo-Liste

Eine vollständige, moderne Fullstack-Webapplikation zur Verwaltung persönlicher ToDos mit Benutzerkonten, Deadlines, Kategorien, Sortierung und Pagination.

Die Anwendung unterstützt Registrierung, Login, persönliche Aufgabenverwaltung und bietet eine klare, responsive Oberfläche.

---

## Funktionen

### Benutzerverwaltung

* Registrierung und Login über JWT-Authentifizierung
* Passwörter werden sicher gehasht (bcrypt)
* Benutzername wird bei Registrierung vergeben und im UI angezeigt
* Jeder Benutzer sieht nur seine eigenen ToDos

### ToDo-Funktionen

* Aufgaben erstellen, anzeigen, bearbeiten und löschen (CRUD)
* Inline-Editing: Text, Deadline und Kategorie direkt änderbar
* Speichern per Button oder `Enter`, Abbrechen per `Esc`
* Pflicht-Deadline (Standard = aktueller Tag)
* Keine Deadlines in der Vergangenheit
* Kategorien: Vorauswahl oder eigene Kategorie

### Filtern und Sortieren

* Filter: Alle, Offen, Erledigt, Heute, Diese Woche
* Sortierung:

  * Erstellungsdatum (neu → alt / alt → neu)
  * Deadline (früh → spät / spät → früh)
  * Status (offen → erledigt)
  * Text (A → Z / Z → A)
  * Kategorie (A → Z)

### Pagination und UX

* Maximal 8 Aufgaben pro Seite
* Keine Scroll-Liste – Navigation über "Weiter"/"Zurück"
* Modernes, responsives UI mit Tailwind CSS

---

## Technologiestack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* JWT

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JSON Web Tokens (jsonwebtoken)
* bcryptjs
* dotenv
* cors

### Datenbank

* MongoDB (lokal oder Atlas)
* Modelle:

  * `User`: Benutzername, E-Mail, Passwort (gehasht)
  * `Todo`: Text, Status, Deadline, Kategorie, User-Referenz

---

## Architekturübersicht

Die Anwendung ist eine vollständige **Fullstack Client-Server-Webapplikation**.

```text
[ Client (React, Browser) ]
           |
           |  HTTPS: /api/auth/... /api/todos/... (JWT)
           v
[ Server (Node.js + Express) ]
           |
           |  Mongoose
           v
[ Datenbank (MongoDB / Atlas) ]
```

* **Client-Schicht:** React SPA, kommuniziert per JSON mit dem Backend
* **Backend-Schicht:** Express API, Authentifizierung, Business-Logik
* **Datenhaltung:** MongoDB via Mongoose

---

## Projektstruktur

```text
.
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
```

---

## Projekt lokal starten

### 1. Backend

```bash
cd backend
npm install
```

`.env` Datei erstellen:

```env
MONGODB_URI=mongodb://localhost:27017/todo_app
PORT=5000
JWT_SECRET=geheimes-passwort
```

Backend starten:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Danach Browser öffnen: `http://localhost:5173`

---

## Deployment

### Backend auf Render

1. Backend-Repo auf GitHub pushen
2. Auf Render neuen Web Service anlegen
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variables setzen
7. Deploy

### Frontend auf Netlify oder Vercel

1. Frontend-Repo pushen
2. Projekt importieren
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. `VITE_API_URL` auf Backend-URL setzen
6. Deploy

---
