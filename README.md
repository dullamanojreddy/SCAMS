# Campus OS

> Smart campus. Smarter you.

<p align="center">
	<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
	<img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
	<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white" alt="Node.js" />
	<img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express" />
	<img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
	<img src="https://img.shields.io/badge/Gemini_AI-Optional-4285F4?logo=google%20gemini&logoColor=white" alt="Gemini AI" />
</p>

Campus OS is a unified campus administration and student experience platform for connecting everyday campus services in one place. It combines a React web app, a modular Express API, PostgreSQL persistence, and an optional Gemini-powered campus assistant.

## Features

- Campus map search and walking directions
- Timetables, notices, events, and notifications
- Canteen menus, food ordering, and order tracking
- Library, placements, student community, and campus resources
- Complaints, feedback, facility bookings, and role-based portals
- AI assistant for campus questions and confirmed actions

## Tech Stack

- React 19, Vite, Tailwind CSS, Motion, and Lucide React
- Node.js, Express, and modular REST API routes
- PostgreSQL with a schema in `src/db/postgres_schema.sql`
- Google Gemini through `@google/genai` (optional)

## Run Locally

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Optional: a Gemini API key for the AI assistant

### Install

```bash
npm install
```

Create a `.env` file from [.env.example](.env.example), then set your PostgreSQL password in `DATABASE_URL`.

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/scam_db
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Create the local database and apply the schema. In Windows PowerShell:

```powershell
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE scam_db;"
psql -U postgres -h localhost -p 5432 -d scam_db -f .\src\db\postgres_schema.sql
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run lint     # Type-check the project
npm run build    # Build the frontend and server
npm start        # Run the production build
```

Check the PostgreSQL connection at [http://localhost:3000/api/v1/db/status](http://localhost:3000/api/v1/db/status). A working setup returns `"connected": true`.

## Project Structure

```text
src/                  React frontend and campus UI
server/src/           Express API, modules, middleware, and database access
src/db/               PostgreSQL schema
docs/                 Project context and technical notes
```

## Security

Never commit `.env`, database passwords, or API keys. The repository ignores local environment files; use `.env.example` as the shareable configuration template.
