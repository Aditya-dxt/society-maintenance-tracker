# Aangan Backend — Setup Guide

## 1. Install dependencies
```bash
cd backend
npm install
```

## 2. Configure environment
Copy `.env.example` to `.env` and fill in real values:
```bash
cp .env.example .env
```
`DATABASE_URL` should already be your real Neon connection string.

## 3. Generate Prisma client & create tables
> **Important**: this step could not be run inside the build sandbox (its network
> doesn't allow reaching Prisma's binary download host), so run these two
> commands yourself — they only need your normal internet connection:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

The second command creates all tables (`societies`, `users`, `complaints`,
`complaint_history`, `notices`) in your Neon database, matching
`prisma/schema.prisma` exactly.

## 4. Run the server
```bash
npm run dev
```
API runs at `http://localhost:5000`. Health check: `GET /health`.

## 5. (Optional) Inspect your data visually
```bash
npx prisma studio
```
Opens a browser GUI to view/edit rows directly — useful for debugging.

---

## How multi-tenancy works here
- An **admin** signs up via `POST /api/auth/admin/signup` — this creates a
  brand-new `Society` row AND the admin's `User` row in one transaction, and
  generates a unique join code (e.g. `PLM-7K2X`).
- A **resident** signs up via `POST /api/auth/resident/signup` with a
  `joinCode` — if it doesn't match an existing society, signup is rejected.
- Every JWT issued encodes `{ id, role, societyId, email }`.
- `tenantScope` middleware reads `societyId` **only** from the verified JWT
  and attaches it as `req.societyId`. Every controller filters Prisma queries
  by `req.societyId` — there is no code path where a client can pass a
  different society's ID and get data back.

## API summary
```
POST   /api/auth/admin/signup        { name, email, password, societyName, address }
POST   /api/auth/resident/signup     { name, email, password, joinCode, flatNumber }
POST   /api/auth/login               { email, password }
GET    /api/auth/me                  (auth required)

GET    /api/society                  (auth required)
POST   /api/society/regenerate-code  (admin only)
PATCH  /api/society/settings         (admin only) { overdueThresholdDays, name, address }

POST   /api/complaints               (resident) multipart/form-data: title, description, category, photo
GET    /api/complaints/mine          (resident)
GET    /api/complaints               (admin) ?status=&category=&from=&to=
GET    /api/complaints/:id           (own complaint or admin)
PATCH  /api/complaints/:id/status    (admin) { status, note }
PATCH  /api/complaints/:id/priority  (admin) { priority }

GET    /api/notices                  (auth required)
POST   /api/notices                  (admin) { title, content, isImportant }
DELETE /api/notices/:id              (admin)

GET    /api/dashboard                (admin) — totals by status/category, overdue count
```

## Email & photo setup (optional but recommended)
- **Email**: create a [Gmail App Password](https://myaccount.google.com/apppasswords),
  put it in `EMAIL_APP_PASSWORD`. Without it, emails are skipped with a console warning
  (the app still works — emails just won't send).
- **Photos**: free [Cloudinary](https://cloudinary.com) account, copy cloud name/key/secret
  into `.env`. Without it, photo uploads will fail — add these before testing complaint creation with photos.
