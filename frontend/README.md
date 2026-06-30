# Aangan Frontend

React + Vite web app for the Aangan society maintenance tracker — the
marketing site, auth flows, and dashboards for both admins and residents.

---

## Tech stack

- **Framework**: React 18, Vite
- **Routing**: React Router
- **State**: Context API (`AuthContext`)
- **Styling**: Plain CSS with a custom design system (see
  [Design system](#design-system) below)
- **HTTP**: Fetch wrapper in `src/api/`

---

## Project structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── auth.js           ← login/signup requests
│   │   ├── client.js         ← fetch wrapper, attaches JWT, base URL
│   │   └── resources.js      ← complaints/notices/dashboard requests
│   ├── assets/                ← images, logos
│   ├── components/
│   │   ├── AuthShell.jsx      ← shared layout for login/signup pages
│   │   ├── CTAFooter.jsx
│   │   ├── DashboardShell.jsx ← shared layout for admin/resident dashboards
│   │   ├── Features.jsx
│   │   ├── FormElements.jsx   ← reusable inputs, selects, buttons
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Navbar.jsx
│   │   ├── NoticeBoard.jsx
│   │   ├── RouteGuards.jsx    ← protects routes by auth/role
│   │   └── StatusBadge.jsx    ← colored complaint status pill
│   ├── context/
│   │   └── AuthContext.jsx    ← logged-in user, token, login/logout
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminComplaints.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminNotices.jsx
│   │   │   └── AdminSettings.jsx
│   │   ├── auth/
│   │   │   ├── AdminSignup.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ResidentSignup.jsx
│   │   └── resident/
│   │       ├── ComplaintDetail.jsx
│   │       ├── RaiseComplaint.jsx
│   │       ├── ResidentDashboard.jsx
│   │       └── ResidentNoticeBoard.jsx
│   ├── App.jsx                ← route definitions
│   ├── index.css              ← design tokens, global styles
│   └── main.jsx                ← React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Routing overview

| Path                         | Page                      | Access            |
|-------------------------------|----------------------------|--------------------|
| `/`                           | Landing page                | Public             |
| `/login`                      | `Login.jsx`                 | Public             |
| `/signup/admin`               | `AdminSignup.jsx`           | Public             |
| `/signup/resident`            | `ResidentSignup.jsx`        | Public             |
| `/resident`                   | `ResidentDashboard.jsx`     | Resident           |
| `/resident/raise`             | `RaiseComplaint.jsx`        | Resident           |
| `/resident/complaints/:id`    | `ComplaintDetail.jsx`       | Resident           |
| `/resident/notices`           | `ResidentNoticeBoard.jsx`   | Resident           |
| `/admin`                      | `AdminDashboard.jsx`        | Admin              |
| `/admin/complaints`           | `AdminComplaints.jsx`       | Admin              |
| `/admin/notices`              | `AdminNotices.jsx`          | Admin              |
| `/admin/settings`             | `AdminSettings.jsx`         | Admin              |

`RouteGuards.jsx` checks `AuthContext` for a valid logged-in user and
correct role before rendering protected pages, redirecting to `/login`
otherwise.

---

## Environment variables

Create a `.env` file (see `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Change this to your deployed backend URL in production.

---

## Setup

```bash
npm install
cp .env.example .env     # confirm VITE_API_URL points at your backend
npm run dev                # http://localhost:5173
```

### Useful scripts

```bash
npm run dev        # start Vite dev server
npm run build       # production build → dist/
npm run preview     # preview the production build locally
```

---

## Design system

- **Name**: Aangan (Hindi/Urdu for *courtyard*) — the shared heart of an
  Indian housing society.
- **Palette**: warm plaster paper (background), deep verandah green
  (primary), rust/terracotta (accent/alerts), brass marigold (highlights).
- **Typography**:
  - Headlines — **Fraunces** (serif, expressive)
  - Body — **Inter** (sans-serif, clean)
  - Status tags & timestamps — **IBM Plex Mono** (monospace)
- **Signature element**: the marketing hero is a literal corkboard —
  pinned, slightly rotated complaint/notice cards, evoking a real society
  noticeboard.
- Fully responsive: mobile drawer navigation, wrapping grid layouts.
  Built with future PWA wrapping (or a shared-backend React Native app) in
  mind.

---

## Notes

- All authenticated requests attach the JWT from `AuthContext` via the
  `client.js` fetch wrapper's `Authorization` header — never read from
  local component state directly.
- Photo uploads on `RaiseComplaint.jsx` use `multipart/form-data` and are
  sent directly to the backend, which pushes them to Cloudinary.
- `StatusBadge.jsx` color-codes complaint status (`OPEN` / `IN_PROGRESS` /
  `RESOLVED`) consistently across both admin and resident views.
