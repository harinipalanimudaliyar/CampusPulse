# CampusPulse

CampusPulse is a responsive full-stack campus community platform built with React + Vite, Node.js + Express, and MongoDB Atlas.

The UI follows the supplied reference screenshots: warm paper backgrounds, editorial serif typography, forest-green navigation/actions, orange highlights, dotted feed texture, and a calm publication-style layout.

## Features

- JWT authentication with bcrypt password hashing
- MongoDB Atlas + Mongoose persistence
- Authenticated campus profiles
- Chronological post feed with topic/institution filtering
- Secure owner-only post deletion with confirmation modal
- General campus chat with authenticated posting
- Near-real-time chat refresh every 3 seconds
- Responsive mobile navigation
- Centralized frontend API layer
- Helmet, CORS, rate limiting, request-size limits, graceful server shutdown
- Production build via Vite

## Project structure

```text
CampusPulse/
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Message.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   │   ├── ChatBox.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── Icon.jsx
│   │   ├── LoadingState.jsx
│   │   ├── Navbar.jsx
│   │   ├── PostCard.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── CreatePost.jsx
│   │   ├── Feed.jsx
│   │   ├── GeneralChat.jsx
│   │   ├── IntroLanding.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── Signup.jsx
│   ├── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 1. Prerequisites

Install:

- Node.js 20 LTS or newer
- npm
- A MongoDB Atlas account and database

## 2. Install dependencies

From the project root:

```bash
npm install
cd server
npm install
cd ..
```

## 3. Configure MongoDB and JWT

Copy the server environment template:

```bash
cd server
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Set:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/campuspulse?retryWrites=true&w=majority
JWT_SECRET=use-a-long-random-secret-value
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Do not commit `.env`.

For Atlas, add your development machine's IP address to Network Access and create a database user with the required permissions.

## 4. Run locally

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so no frontend API URL is required during local development.

## 5. Production frontend API URL

For a separately hosted backend, create a root `.env.production`:

```env
VITE_API_URL=https://your-api.example.com
```

The frontend will then request:

```text
https://your-api.example.com/api/...
```

## 6. API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/signup` | No | Create account |
| POST | `/api/login` | No | Authenticate |
| GET | `/api/posts` | No | Read feed |
| POST | `/api/posts` | Yes | Create post |
| DELETE | `/api/posts/:id` | Yes | Delete own post |
| GET | `/api/messages` | No | Read recent chat |
| POST | `/api/messages` | Yes | Send chat message |

## 7. Security notes

- Passwords are hashed with bcrypt using 10 salt rounds.
- JWTs expire after one day.
- Password fields are excluded from normal Mongoose queries.
- Post deletion is authorized server-side by comparing the authenticated user id with the post author id.
- Authentication and message endpoints are rate-limited.
- Helmet adds standard HTTP security headers.
- JSON request bodies are limited to 10 KB.
- CORS is restricted to `CLIENT_ORIGIN`.
- Client-side localStorage stores the JWT and basic user profile for this demo architecture. For a higher-security deployment, move authentication to secure, HttpOnly, SameSite cookies and add CSRF protection.

## 8. Production deployment

### Backend

Deploy `server/` to a Node-compatible service such as Render, Railway, Fly.io, or a container platform.

Set production environment variables:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLIENT_ORIGIN=https://your-frontend.example.com
NODE_ENV=production
```

Start command:

```bash
npm start
```

Health check:

```text
GET /api/health
```

### Frontend

Build:

```bash
npm run build
```

Deploy the generated `dist/` directory to a static hosting provider such as Vercel, Netlify, Cloudflare Pages, or an equivalent service.

Set:

```env
VITE_API_URL=https://your-api.example.com
```

If deploying the React SPA to a host that requires rewrite rules, configure all non-file routes to serve `index.html`.

## 9. Recommended production upgrades

For a larger campus deployment, add:

1. HttpOnly cookie-based authentication instead of localStorage JWT storage.
2. Email/institution verification before granting verified status.
3. Role-based permissions for institutional moderators and administrators.
4. Socket.IO or WebSockets if true server-pushed chat is required.
5. Content moderation, reporting, blocking, and audit logs.
6. Pagination/cursors for feed and chat instead of fixed result limits.
7. Automated tests and CI/CD.
8. Centralized structured logging and error monitoring.
9. MongoDB indexes tuned from real query metrics.
10. A real notification system for important announcements.
