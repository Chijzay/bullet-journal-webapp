<p align="center">
  <img src="./logo.svg" width="250" />
</p>

# Fullstack Webentwicklung einer ToDo-Liste als Webapplikation

Eine moderne, vollständige Fullstack-Webapplikation zur Verwaltung persönlicher Aufgaben. Das System umfasst Benutzerkonten, Deadlines, Kategorien, Filter- und Sortierfunktionen, Pagination, sowie Light-/Dark-Mode. Alle Daten werden benutzerspezifisch gespeichert und sind jederzeit online abrufbar und bietet eine klare, responsive Oberfläche.

## Funktionen

### Benutzerverwaltung

* Registrierung und Login über `JWT`-Authentifizierung
* Sicheres Passwort-Hashing mit `bcrypt`
* Benutzername wird bei Registrierung vergeben und im UI angezeigt
* Jeder Benutzer sieht ausschließlich seine eigenen Aufgabe
* Authentifizierung wird clientseitig persistent gespeichert (LocalStorage)

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
  - Deadline (früh/spät)
  - Status
  - Text (A–Z / Z–A)
  - Kategorie (A–Z)

* Kategorie-Filter:
  - Dynamische Liste aller vorhandenen Kategorien
  - Auch benutzerdefinierte Kategorien werden erkannt
  - Jede Kategorie mit eigener Farb-Badge (automatisch generiert)





---
### Pagination und UX

* Maximal 8 Aufgaben pro Seite
* Keine Scroll-Liste, due Navigation erfolgt über "Weiter" und "Zurück"
* Modernes, responsives UI mit Tailwind CSS

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
* JWT
* bcryptjs
* dotenv
* cors

### Datenbank

* MongoDB (Atlas)
* Modelle:

  * `User`: Benutzername, E-Mail, Passwort (gehasht)
  * `Todo`: Text, Status, Deadline, Kategorie, User-Referenz

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

## Projektstruktur

```text
.
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
\   └── postcss.config.js
```

## Nutzung

Die Webapplikation ist unter dem nachfolgenden Link abrufbar:

```
https://todo-liste-webapp.netlify.app/
```

### Hinweis

Der Ladevorgang benötigt beim Starten der Webapplikation etwas Zeit.
