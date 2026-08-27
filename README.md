# Alex Morgan — Personal Portfolio

A modern, fully responsive personal portfolio website built with React and Material UI (MUI), designed with a scalable architecture ready for backend integration.

## 🚀 Tech Stack

- **React 18** — UI library
- **Material UI (MUI) v5** — Component library + theming
- **React Router v6** — Client-side routing
- **Axios** — HTTP client (pre-configured)
- **Formik + Yup** — Form management + validation
- **Context API** — Theme state management
- **Vite** — Build tool

## 📁 Folder Structure

```
src/
├── components/
│   ├── common/          # Reusable: SectionWrapper, LoadingStates
│   ├── layout/          # Navbar, Footer
│   └── sections/        # Hero, About, Skills, Projects, Experience, Education, Certificates, Contact
├── context/             # ThemeContext (dark/light mode)
├── data/                # Mock JSON data (profile, skills, projects, experience, education)
├── hooks/               # useApiData, useScrollSpy, useInView
├── layouts/             # MainLayout
├── pages/               # HomePage
├── routes/              # Route constants + nav links
├── services/            # api.js (Axios config) + portfolioService.js
├── theme/               # MUI theme tokens
└── utils/               # (ready for helpers)
```

## 🏗️ Getting Started

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🔌 Backend Migration Guide

The project is fully prepared for a backend. When you're ready:

1. Set `VITE_USE_MOCK=false` in your `.env` file
2. Set `VITE_API_BASE_URL` to your backend URL
3. Implement these REST endpoints on your server:
   - `GET /api/profile`
   - `GET /api/skills`
   - `GET /api/projects?category=&technology=`
   - `GET /api/projects/:id`
   - `GET /api/experience`
   - `GET /api/education`
   - `GET /api/certificates`
   - `POST /api/contact`

All mock data in `src/data/` documents the expected response shape for each endpoint.

## 🎨 Customization

- **Personal info**: Edit `src/data/profile.js`
- **Projects**: Edit `src/data/projects.js`
- **Skills**: Edit `src/data/skills.js`
- **Theme colors**: Edit `src/theme/index.js`
- **Fonts**: Change the Google Fonts import in `index.html` and `src/theme/index.js`

## ✨ Features

- Dark / Light mode toggle (persisted in localStorage)
- Scroll-spy active navigation
- Intersection Observer fade-in animations
- Animated hero with role rotation
- Project filtering by category
- Contact form with Formik + Yup validation
- Fully responsive (mobile-first)
- API service layer with mock/real toggle
