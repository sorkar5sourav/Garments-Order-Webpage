# Garments Order — Web Frontend

**Visit deployed app:** https://garments-order-tracker.web.app

Professional React frontend for the Garments Order application. Built with Vite and React, this repository contains the single-page application used by buyers, managers, and admins to browse products, place bookings, and manage orders.

## Highlights

- **Framework:** React (Vite) with modern tooling and fast HMR
- **Auth:** Firebase authentication (see `src/Firebase/firebase.init.js`)
- **Layouts & Routing:** Role-based routes and dashboard layout
- **Components:** Modular components in `src/Components` for reuse
- **Design System:** DaisyUI + Tailwind for consistent theming

## Project Features

- Browse latest products, view product details, and book orders
- Role-based dashboards for Admin, Manager, and Buyer users
- Client-side form validation and responsive UI
- Social login (Google) and protected routes
- Search and filter products by category, price range, and availability
- Order tracking and management dashboard

## Tech Stack

- **React** + **Vite** — fast development and build tooling
- **Firebase** — authentication, optional Firestore/Storage
- **Axios** — HTTP client with custom secure request hooks
- **DaisyUI** + **Tailwind CSS** — modern UI components and styling
- **Recharts** — charts for dashboard analytics

## Repository Structure

```
src/
├── Components/       # Reusable UI components and atoms
│   ├── ProductCard.jsx
│   ├── atoms/        # Small UI primitives
│   ├── shared/       # Navbar, Footer
│   └── ui/          # Card, Skeleton, EmptyState, etc.
├── Pages/           # Route pages (Home, Products, Dashboard)
├── Layouts/         # App and Dashboard layouts
├── Context/         # Auth and Theme context providers
├── Firebase/        # Firebase initialization
├── hooks/           # Custom React hooks (useAuth, useAxios, etc.)
├── Theme/          # Design tokens and theme configuration
└── assets/         # Images, icons, animations
```

## Prerequisites

- **Node.js** v16+ and npm/yarn
- **Firebase Project** — with authentication enabled (Google sign-in recommended)
- **Backend Server** — running Garments Order Server (default: `http://localhost:3000`)

## Getting Started (Local Development)

### 1. Clone and Install

```bash
git clone <repo-url>
cd Garments-Order-Webpage
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root with:

```bash
# Firebase Configuration (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend Server URL
VITE_BACKEND_URL=http://localhost:3000
```

> **Note:** Variables must be prefixed with `VITE_` for Vite to expose them to the client.

### 3. Start Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

Output is in `dist/` directory. Serve with any static host.

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Enable **Authentication** → add **Google** as a sign-in provider
4. Copy your Firebase config to `src/Firebase/firebase.init.js`
5. Ensure Firestore or Realtime Database rules allow your auth flow

For details, see `src/Firebase/firebase.init.js`.

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint checks
npm run lint
```

## Key Files to Review

| File | Purpose |
|------|---------|
| `src/Firebase/firebase.init.js` | Firebase config and initialization |
| `src/Context/AuthProvider.jsx` | Global auth context and user state |
| `src/Routs/router.jsx` | Route definitions and navigation structure |
| `src/Pages/Homeoage/Homepage.jsx` | Landing page with multiple sections |
| `src/Theme/tokens.js` | Design tokens (colors, spacing, typography) |
| `.env` | Environment variables (not committed) |

## Deployment

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public dir to 'dist'
npm run build
firebase deploy
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist/ folder to Netlify, or connect Git repo
```

## Environment Reference

**Backend API URLs** (if using `.env`):
- Products: `GET /products` — list all products with pagination
- Product Details: `GET /products/:id`
- Auth endpoints: uses Firebase Admin SDK on backend

**Public Endpoints** (no auth required):
- `GET /products` — list products
- `GET /products/:id` — product details
- `GET /products/categories-summary` — product categories

**Protected Endpoints** (require Bearer token):
- `POST /products` — create product (manager/admin only)
- `PATCH /products/:id` — update product (manager/admin only)
- `POST /orders` — place order (all users)

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors on API calls | Check `VITE_BACKEND_URL` in `.env` matches your backend URL |
| Firebase auth not working | Verify Firebase config in `firebase.init.js` and check Console → Auth settings |
| Blank page or 404 errors | Ensure SPA routing is configured (see deployment config above) |
| Images not loading | Check `productImage` field is a valid URL in product documents |

## Contributing

1. Create a feature branch (`git checkout -b feature/name`)
2. Follow existing code style (ESLint rules in `eslint.config.js`)
3. Commit with clear messages (`git commit -m "feat: description"`)
4. Push and open a pull request

## License & Contact

This project is part of the Garments Order Production Tracker System. For questions or issues, contact the maintainer or open an issue in the repository.

## Next Steps

- [ ] Customize theme colors in `src/Theme/tokens.js`
- [ ] Add more sections to the home page
- [ ] Set up dashboard analytics with Recharts
- [ ] Add automated tests (Jest + React Testing Library)
- [ ] Set up CI/CD pipeline (GitHub Actions)
