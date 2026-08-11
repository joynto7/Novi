# Occasio — Event Discovery & Booking Platform

Occasio is a full-stack event platform where people discover, book, and review events,
and organizers/admins manage everything from a role-based dashboard.

Built as a production-style upgrade project: Next.js + Tailwind on the frontend,
Express + PostgreSQL + Prisma on the backend, JWT auth with role-based access
control, and no placeholder content anywhere — all data comes from a seeded
PostgreSQL database via a real REST API.

## Tech Stack

**Frontend** (`client/`)
- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 — 3-color design system (primary/accent/teal) + light & dark mode
- react-hook-form + zod for client-side validation
- recharts for dashboard analytics
- lucide-react for icons

**Backend** (`server/`)
- Express + PostgreSQL + Prisma ORM
- JWT auth (httpOnly cookies) + bcrypt password hashing
- Role-based access control: `USER`, `ORGANIZER`, `ADMIN`
- Centralized error handling, input validation (express-validator), CORS

## Project Structure

```
Novi/
├── client/               Next.js frontend
│   ├── src/app/           App Router pages
│   │   ├── (site)/         Public site: home, events, blog, about, contact, auth...
│   │   └── dashboard/      Role-based dashboard (user/organizer/admin)
│   ├── src/components/    UI primitives, layout, feature components
│   ├── src/context/       Auth, theme, toast providers
│   └── public/covers/     Locally generated SVG cover art (no external image CDN)
└── server/                Express API
    ├── src/routes/         Route definitions
    ├── src/controllers/    Request handlers
    ├── src/middleware/     Auth, validation, error handling
    └── prisma/             Schema, migrations, seed script
```

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL 14+ database

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string, and set a
`JWT_SECRET` (any long random string). Then run:

```bash
npx prisma migrate dev --name init   # creates tables
npm run seed                          # populates demo data
npm run dev                           # starts the API on http://localhost:5000
```

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env.local            # NEXT_PUBLIC_API_URL defaults to localhost:5000/api
npm run dev                            # starts the app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
cd client && npm run build && npm start
cd server && npm start
```

## Demo Credentials

All demo accounts use the password `Demo@123`, or use the one-click **Demo User** /
**Demo Admin** buttons on the login page.

| Role      | Email               | Password  |
| --------- | -------------------- | --------- |
| Admin     | `admin@novi.demo`     | `Demo@123` |
| Organizer | `organizer@novi.demo` | `Demo@123` |
| User      | `user@novi.demo`      | `Demo@123` |

## Feature Highlights

- **Public site**: landing page (hero + 8 content sections), event listing with
  search/filter/sort/pagination, event details with gallery + reviews + booking,
  blog, about, contact (wired to the backend), help/FAQ, privacy/terms.
- **Auth**: register/login with validation, demo login, Google button (UI-complete;
  needs a `GOOGLE_CLIENT_ID` to go live).
- **Role-based dashboard**:
  - **User**: overview with spend chart, my bookings, profile, settings.
  - **Organizer**: overview, my events (create/edit/delete), bookings, reviews.
  - **Admin**: overview, manage users, manage events, bookings, categories,
    analytics, contact messages, settings — all with real charts (recharts) driven
    by live database data.
- **Design system**: 3 primary colors + neutral, consistent card/border-radius
  language, full light/dark mode, fully responsive from mobile to desktop.

## Environment Variables

**`server/.env`**

| Variable         | Description                                  |
| ---------------- | --------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string                  |
| `PORT`           | API port (default `5000`)                     |
| `JWT_SECRET`     | Secret used to sign JWTs                      |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)                 |
| `CLIENT_URL`     | Frontend origin, for CORS (default `http://localhost:3000`) |

**`client/.env.local`**

| Variable              | Description                          |
| ---------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL (default `http://localhost:5000/api`) |
