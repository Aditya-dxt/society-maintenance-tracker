# Aangan — Society Maintenance Tracker

A multi-tenant complaint and notice-board platform for apartment societies.
Each society is fully isolated — admins create a society and get a unique join
code; residents can only register with a valid code, and every query on the
backend is scoped to the logged-in user's society. No cross-society data leaks
are possible by design (see `backend/README.md` for how this is enforced).

## Project structure
```
society-maintenance-tracker/
├── backend/     ← Express + Prisma + PostgreSQL REST API
├── frontend/    ← React + Vite web app (this is what users see)
└── mobile/      ← (future) React Native app, same backend API
```

## Status
- Landing page (design system, marketing site) — done
- Backend API — auth, society creation/join, complaints, notices, dashboard,
  multi-tenant isolation, overdue detection, email + photo upload wiring — done
- Frontend — admin & resident auth, dashboards, raise complaint with photo,
  complaint history timeline, notice board, admin complaint management,
  society settings (join code, overdue threshold) — done
- Fully responsive (mobile drawer nav, wrapping layouts) — ready to wrap as
  a PWA or to share its backend with a future React Native app — done
- Not yet done: deployment (Render/Vercel), mobile app, production email/photo
  credentials, system design write-up

## Run it locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env       # fill in your real DATABASE_URL etc.
npx prisma generate
npx prisma migrate dev --name init
npm run dev                 # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The frontend's `.env` already points `VITE_API_URL` at `http://localhost:5000/api`.

## Design direction
- **Name**: Aangan (Hindi/Urdu for courtyard) — the shared heart of an Indian housing society.
- **Palette**: warm plaster paper, deep verandah green, rust/terracotta accent, brass marigold.
- **Type**: Fraunces (headlines) + Inter (body) + IBM Plex Mono (status tags, timestamps).
- **Signature element**: the marketing hero is a literal corkboard — pinned, rotated cards.

## Next steps
1. Deploy backend (Render/Railway) and frontend (Vercel)
2. Add Cloudinary + Gmail App Password credentials for live photo/email
3. Write the system design document (required deliverable, 800 words max)
4. Scaffold `mobile/` with React Native, pointed at the same backend
