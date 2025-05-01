# Portfolio Website - Buddhsen Tripathi

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Welcome to the repository for my personal portfolio website, live at [buddhsentripathi.com](https://www.buddhsentripathi.com/). <br/>This repository hosts the source code for different iterations of the site.

## 🚀 Versions

### `2.0` (✨ Current & Live)
- **Tech Stack:** Next.js 15 (App Router), Tailwind CSS, TypeScript, Supabase (for views/subscriptions)
- **Description:** The latest iteration, focusing on performance, SEO, and a modern developer experience. Features include:
    - Server-Side Rendering (SSR) & Static Site Generation (SSG)
    - Self-hosted blog with Markdown
    - View counters & Newsletter subscription
    - Interactive tools and games (e.g., Resume Builder, Code Runner)
- **Status:** Actively developed and deployed.

### `1.0` (Legacy)
- **Tech Stack:** React, Vite, Tailwind CSS
- **Description:** The original version built with a client-side React setup using Vite. Fast and lightweight, but lacks some of the advanced features of v2.0.
- **Status:** No longer actively maintained, kept for historical reference.

## 🛠️ Setup & Development

Ensure you have Node.js (v18 or later recommended) and npm installed.

### Running `2.0` (Next.js)
```bash
cd 2.0
npm install
# For Supabase integration, create a .env.local file with your keys:
# NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY (for admin tasks)
# GEMINI_API_KEY=YOUR_GEMINI_KEY (for resume suggestions)
# EXA_API_KEY=EXA_KEY (for X/Twitter post retrieval for spam detection) 
npm run dev
```
Access at `http://localhost:3000`.

### Running `1.0` (React + Vite)
```bash
cd 1.0
npm install
npm run dev
```
Access at `http://localhost:5173` (or as indicated by Vite).

## ☁️ Deployment (Version 2.0)

The `2.0` branch/folder is automatically deployed to Vercel upon pushes to the main branch.

To build and run a production version locally:
```bash
cd 2.0
npm run build
npm run start
```

## 🤝 Feedback
This is my personal portfolio, but if you have feedback or suggestions, feel free to open an issue or reach out!
