**Garments Order — Web Frontend**

Professional React frontend for the Garments Order application. Built with Vite and React, this repository contains the single-page application used by buyers, managers, and admins to browse products, place bookings, and manage orders.

**Highlights**
- **Framework:** React (Vite) with modern tooling and fast HMR
- **Auth:** Firebase authentication (see `src/Firebase/firebase.init.js`)
- **Layouts & Routing:** Role-based routes and dashboard layout
- **Components:** Modular components in `src/Components` for reuse

**Project Features**
- Browse latest products, view product details, and book orders
- Role-based dashboards for Admin, Manager, Buyer
- Client-side form validation and responsive UI
- Social login and protected routes

**Tech Stack**
- React + Vite
- Firebase (Auth + optional Firestore/Storage)
- Axios (custom hooks for secure requests)
- Tailwind / CSS (project styles in `src`) — adjust as needed

Repository structure (key folders)
- `src/Components` — UI components and atoms
- `src/Pages` — route pages (Home, Products, Dashboard)
- `src/Layouts` — App and Dashboard layouts
- `src/Context` — Auth and Theme providers
- `src/Firebase` — Firebase initialization
- `public/` — static assets

Getting started
1. Prerequisites: Node.js (14+), npm or yarn
2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start dev server:

```bash
npm run dev
# or
yarn dev
```

4. Build for production:

```bash
npm run build
# or
yarn build
```

Environment & Firebase
- The project expects a Firebase config in `src/Firebase/firebase.init.js`. Do not commit sensitive keys.
- If you use environment variables, prefix them with `VITE_` for Vite to expose them to the client.

Deployment
- This site can be deployed to Vercel, Netlify, or any static host that supports SPA routing. Example: push to Vercel and set the build command to `npm run build` and output directory to `dist`.

Contributing
- Open an issue or submit a PR. Follow existing code style and keep changes focused.

License & Contact
- This project inherits the license of the parent repository. For questions, contact the maintainer listed in the main repo.

Files to check first
- `src/Firebase/firebase.init.js` — Firebase setup
- `src/Context/AuthProvider.jsx` — authentication flow
- `src/Pages/Homeoage/Homepage.jsx` — main landing page

Thank you for reviewing the frontend — ask if you want a README tailored for contributors, deployment scripts, or environment examples.
