# Project ReMotion – Investigation Portal

Investigate the failure of an AI-assisted rehabilitation robot.

## About

Project ReMotion is a browser-based investigation platform built around a fictional incident.
During a pre-demonstration calibration test, the AI-assisted rehabilitation robot **ReMotion**
loaded the wrong calibration profile and triggered its emergency stop. This application lets an
investigator review the evidence, people, locations, and timeline surrounding the incident, and
build up a working hypothesis about what happened.

This repository contains an existing vanilla-JavaScript (no frameworks used) investigation application. The system is
functional but has accumulated technical debt and inconsistent implementation decisions. Your task
during the course will be to analyse, maintain, refactor, migrate, and extend it.

## Running the application

This application uses `fetch()` to load its case data from local JSON files, so it must be served
over HTTP — opening `index.html` directly from the filesystem (`file://`) will not work in most
browsers.

Any static file server will do. For example, from the project root:

```bash
# Python 3
python -m http.server 8080

# Node.js (no install required)
npx serve .

# VS Code
# Use the "Live Server" extension
```

Then open `http://localhost:8080` (or whatever port your server prints) in your browser.

## Lokale Node.js-API für Exercise 6

Für Exercise 6 gibt es einen kleinen, schreibgeschützten Node.js-Server. Er ist nur für die
lokale Entwicklung gedacht und gehört nicht zur Deployment-Pipeline von Exercise 2. Starte ihn
im Projektordner mit:

```bash
npm run server
```

Der Server läuft auf `http://localhost:3001`. Er stellt diese GET-Endpunkte bereit:

- `GET /api/case`
- `GET /api/evidence`
- `GET /api/people`
- `GET /api/locations`
- `GET /api/timeline`

Für die späteren Loading- und Error-State-Demos können reale Bedingungen simuliert werden:

- Künstliche Verzögerung von drei Sekunden:
  `http://localhost:3001/api/evidence?delay=3000`
- Absichtlicher Serverfehler:
  `http://localhost:3001/api/evidence?error=1`
- Beides gleichzeitig:
  `http://localhost:3001/api/evidence?delay=3000&error=1`

Der `delay`-Wert wird in Millisekunden angegeben und auf maximal zehn Sekunden begrenzt.
Der Parameter `error=1` erzeugt eine HTTP-500-Antwort. Ohne diese Parameter liefern die
Endpunkte weiterhin die normalen JSON-Daten.

Starte `npm run dev` in einem zweiten Terminal, damit Vite und die API gleichzeitig laufen.
Die API erlaubt Anfragen vom Vite-Entwicklungsserver unter `http://localhost:5173`.

## Features

- **Dashboard** — case summary and key statistics calculated from the loaded case data.
- **Evidence catalogue** — search, filter (by type, person, location, status, relevance), sort,
  bookmark, and open detailed evidence records.
- **People & Locations** — profile cards for the investigation team and the six key locations.
- **Timeline** — chronological view of case events with filtering and links to related evidence.
- **Investigator workspace** — bookmarked evidence, personal notes, and a hypothesis draft form.
  Workspace data is saved to your browser's local storage and will still be there when you reload
  the page.

## Browser requirements

A recent version of any evergreen desktop browser (Chrome, Firefox, Edge, Safari). JavaScript must
be enabled. The layout targets common desktop and tablet widths.

## Project status

This is an existing brownfield application, not a fresh scaffold. It works for everyday use, but
you should expect to find rough edges, inconsistent patterns, and a handful of bugs as you work
with it — that discovery process is part of the course.
