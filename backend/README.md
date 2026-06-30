# Aangan Backend

Express + Prisma + PostgreSQL REST API powering the Aangan society
maintenance tracker. Multi-tenant by design: every operational table is
scoped to a `societyId`, and no query anywhere in the app reads or writes
across societies.

---

## Tech stack

- **Runtime**: Node.js, Express 5
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6
- **Auth**: JWT (jsonwebtoken) + bcrypt password hashing
- **File uploads**: Multer (in-memory) → Cloudinary
- **Email**: Nodemailer
- **Dev tooling**: nodemon

---

## Project structure

```
backend/
├── prisma/
│   └── schema.prisma          ← data model (Society, User, Complaint, Notice, etc.)
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── complaint.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── notice.controller.js
│   │   └── society.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js          ← verifies JWT, sets req.user
│   │   ├── role.middleware.js          ← restricts routes by role
│   │   ├── tenantScope.middleware.js   ← THE isolation guard, sets req.societyId
│   │   └── upload.middleware.js        ← Multer config (memory storage)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── complaint.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── notice.routes.js
│   │   └── society.routes.js
│   ├── services/
│   │   ├── cloudinary.service.js       ← uploads complaint photos
│   │   ├── code.service.js             ← generates society join codes
│   │   ├── email.service.js            ← status-change notifications
│   │   └── overdue.service.js          ← recalculates overdue complaints
│   ├── app.js                          ← Express app entry point
│   └── prismaClient.js                 ← shared PrismaClient instance
├── .env.example
└── package.json
```

---

## Data model

Every table except a user's auth fields carries a `societyId` foreign key.

```
Society
 ├── joinCode (unique, e.g. "PLM-7K2X")
 ├── overdueThresholdDays
 └── has many → User, Complaint, Notice

User
 ├── role: ADMIN | RESIDENT
 ├── flatNumber (residents only)
 └── belongs to → Society

Complaint
 ├── status: OPEN | IN_PROGRESS | RESOLVED
 ├── priority: LOW | MEDIUM | HIGH
 ├── isOverdue (auto-computed)
 ├── photoUrl (optional, via Cloudinary)
 ├── belongs to → Society, User (resident)
 └── has many → ComplaintHistory (immutable audit trail)

Notice
 ├── isImportant
 └── belongs to → Society, User (postedBy)
```

---

## Multi-tenant isolation — how it's enforced

This is the core architectural guarantee of the app:

1. `auth.middleware.js` verifies the JWT and attaches the decoded payload
   (`{ id, role, societyId, email }`) to `req.user`. The token is the
   **only** source of truth for identity.
2. `tenantScope.middleware.js` runs immediately after, and sets
   `req.societyId = req.user.societyId` — derived **only** from the
   verified token, never from `req.body`, `req.query`, or `req.params`.
3. Every controller filters its Prisma queries using `req.societyId`, with
   no exceptions. A resident or admin from Society A can never read or
   write Society B's complaints, notices, or users, even if a malicious
   client tries to pass a different `societyId` in the request payload.

---

## API routes

All routes below are prefixed with `/api`. Protected routes require
`Authorization: Bearer <token>`.

### Auth (`/api/auth`)

| Method | Route             | Access | Description                     |
|--------|--------------------|--------|----------------------------------|
| POST   | `/admin/signup`    | Public | Create a society + admin account |
| POST   | `/resident/signup` | Public | Join a society with a join code  |
| POST   | `/login`           | Public | Login (admin or resident)        |

### Complaints (`/api/complaints`)

| Method | Route               | Access            | Description                              |
|--------|----------------------|-------------------|--------------------------------------------|
| POST   | `/`                  | Resident          | Raise a complaint (photo optional)         |
| GET    | `/mine`              | Resident          | List the logged-in resident's complaints   |
| GET    | `/`                  | Admin             | List all complaints in the society (filterable by status/category/date) |
| GET    | `/:id`               | Resident or Admin | View a single complaint (resident: own only) |
| PATCH  | `/:id/status`        | Admin             | Update status, appends to history, emails resident |
| PATCH  | `/:id/priority`      | Admin             | Update priority                           |

### Notices (`/api/notices`)

| Method | Route   | Access   | Description                  |
|--------|---------|----------|-------------------------------|
| GET    | `/`     | Resident/Admin | List notices for the society |
| POST   | `/`     | Admin    | Post a new notice              |

### Dashboard & Society (`/api/dashboard`, `/api/society`)

| Method | Route                   | Access | Description                              |
|--------|--------------------------|--------|--------------------------------------------|
| GET    | `/api/dashboard`         | Admin  | Summary stats for the society              |
| GET    | `/api/society/settings`  | Admin  | View join code, overdue threshold, etc.    |
| PATCH  | `/api/society/settings`  | Admin  | Update society settings                    |

> Exact route names may vary slightly — check `src/routes/*.routes.js` for
> the source of truth.

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

JWT_SECRET=a-long-random-string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

PORT=5000
```

> ⚠️ `.env` is git-ignored and must never be committed. If it ever leaks,
> rotate every key listed above immediately.

---

## Setup

```bash
npm install
cp .env.example .env        # fill in real values
npx prisma generate         # generates the Prisma Client
npx prisma migrate dev --name init   # creates tables in your database
npm run dev                 # starts the server on http://localhost:5000
```

### Useful scripts

```bash
npm run dev              # start with nodemon (auto-restart on changes)
npm start                # start without nodemon
npm run prisma:generate  # regenerate Prisma Client
npm run prisma:migrate   # run a new migration
npm run prisma:studio    # open Prisma Studio (visual DB browser)
```

---

## Notes

- **Photo uploads**: Multer stores files in memory (not disk), since most
  hosts (Render, Railway, Vercel) have ephemeral filesystems. The buffer is
  pushed straight to Cloudinary; only the resulting URL is stored in
  Postgres.
- **Overdue detection**: `overdue.service.js` runs on server startup (and
  can be scheduled) to flag complaints as overdue based on each society's
  own configured `overdueThresholdDays` — never a global constant.
- **Audit trail**: `ComplaintHistory` rows are append-only. Status changes
  are never edited in place; a new history row is created every time.
