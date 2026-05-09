# 🐈 Meowly

<div align="center">
  <img src="./public/favicon.ico" width="80" height="80" alt="Meowly Logo" />
  
  <h3>An ultra-minimalist, luxury dark cinematic streaming and media discovery platform built using Next.js, React 19, Tailwind CSS v4, and the TMDB API.</h3>

  [![Next.js](https://img.shields.io/badge/Next.js-16%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-v12-FF00FE?style=for-the-badge&logo=framer-motion)](https://framer.com/motion/)
  [![Vercel](https://img.shields.io/badge/Vercel-Hosted-black?style=for-the-badge&logo=vercel)](https://meowly.vercel.app)
</div>

---

## 🌟 Live Experience

👉 **Explore the Live App:** **[meowly.vercel.app](https://meowly.vercel.app)**

Meowly is a state-of-the-art cinematic web application that redefines digital media exploration. Utilizing an absolute black (#000000) canvas, glowing background radial gradients, crystal-clear glassmorphic panels, and bold white highlights, Meowly delivers a bespoke, theater-like atmosphere. It brings movie trailers, series episodes, production studios, actor timelines, and community reviews into a single, cohesive, luxury interface with highly responsive, fluid micro-animations.

---

## ✨ Features

### 🎬 1. Cinematic Watch Experience
* **Adaptive Multi-Server Video Player:** Stream movies and TV shows instantly through a custom `VideoPlayer` supporting multiple source servers, theater mode, autoplay overrides, and seamless quality selection.
* **Resume Playback:** Pick up exactly where you left off. The app remembers your viewing progress across multiple seasons and movies.
* **Trailer Modals:** Instant overlays that play high-definition YouTube trailers, teasers, and clips directly inside the browser.
* **Season & Episode Trackers:** Elegant interactive episode dropdowns and carousels showcasing episode runtimes, release dates, and high-res stills.

### 🏢 2. Studios & Networks Hub
* **Production Studios Catalog:** A dedicated explorer for iconic entertainment conglomerates like Marvel, Pixar, Walt Disney, Warner Bros, A24, and Studio Ghibli.
* **TV Networks Grid:** Browse premium streaming channels (Netflix, HBO, Disney+, Apple TV+, Prime Video) with dynamic media feeds.
* **Infinite Scroll Delivery:** Fluid, modern paging utilizing the browser's native `IntersectionObserver` to append additional shows and movies in real-time as you browse.

### 💖 3. Hyper-Customized Client Storage
* **Watchlist:** Save your favorite titles for later inside a clean, beautiful horizontal row sync.
* **Recently Played Carousel:** Instant access to your watch history directly on the home page so you can resume active media in one click.
* **No-Lag Client Syncing:** Uses an optimized dual-layered in-memory cache system to bypass slow localStorage reads and dispatches custom state-update events (`watchlistUpdated`, `recentlyPlayedUpdated`) for smooth multi-tab sync.

### 📊 4. Advanced Discovery, Filters & Search
* **Unified Instant Search:** Rapidly search and parse results across multi-layered queries: Movies, TV Shows, Actors, Directors, and Production Companies.
* **Refined Genre and Date Filters:** Deep discovery tools that sort matching movies by release year, genre tags, popularity, ratings, or custom criteria.
* **Dynamic Title Hero Carousel:** An auto-sliding dashboard on the landing page that pulls trending items and asynchronously resolves dynamic title typography logos for an authentic theatre feel.

### 💬 5. Authentic Community Reviews
* **Moctale API Integration:** Incorporates a custom scraper powered by `got-scraping` that asynchronously pulls, sanitizes, and displays authentic movie and show reviews directly on details dashboards.

### 🛡️ 6. Seamless Streaming Extras
* **Ad Blocker Detection:** A subtle, helpful overlay dialog that alerts users if aggressive ad blockers are interfering with streaming server endpoints, ensuring reliable video playback.
* **Exit Page Transitions:** Fluid entry and exit page animations designed with `framer-motion` for a true app-like experience.

---

## 🏗️ Repository Architecture

The project is structured around standard Next.js App Router conventions:

```text
meowly/
├── public/                  # Core assets, favicons, logos
├── src/
│   ├── app/                 # Next.js Routes & Server Pages
│   │   ├── actions.ts       # Central server actions (TMDB, Moctale Scraper)
│   │   ├── awards/          # Oscars and awards timelines
│   │   ├── categories/      # Custom genre lists
│   │   ├── collection/      # TMDB movie collections route
│   │   ├── companies/       # Production company directory pages
│   │   ├── company/         # Selected company detailed media list
│   │   ├── dmca/            # DMCA and legal disclaimer compliance
│   │   ├── layout.tsx       # Root layout, fonts, custom hooks
│   │   ├── loading.tsx      # Global dynamic skeleton loaders
│   │   ├── movies/          # Film catalog pages
│   │   ├── network/         # TV Network detail feeds
│   │   ├── people/          # Star actors directory list
│   │   ├── person/          # Detailed celebrity biographies and timelines
│   │   ├── tv/              # Series exploration directory
│   │   ├── watch/           # Dual-server cinema page route
│   │   └── watchlist/       # User bookmark and watchlist layout
│   │
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Atom level custom components
│   │   ├── AdBlockerPopup.tsx
│   │   ├── AmbientBackground.tsx
│   │   ├── CompanyDetailsClient.tsx
│   │   ├── DetailsHero.tsx
│   │   ├── EpisodeList.tsx
│   │   ├── Hero.tsx         # Auto-scroller marquee
│   │   ├── MoctaleReviews.tsx
│   │   ├── MovieCard.tsx    # Thumbnail hover container
│   │   ├── Navbar.tsx       # Glassmorphic responsive header
│   │   ├── PageTransition.tsx
│   │   ├── VideoPlayer.tsx  # Multi-server player
│   │   └── WatchContainer.tsx
│   │
│   └── lib/                 # Core utilities and data caches
│       ├── storage.ts       # Watchlist & History sync mechanics
│       ├── tmdb.ts          # Core TMDB Client with retry fallback logic
│       └── utils.ts         # Tailwind style mergers
│
├── tailwind.config.ts       # Tailwind CSS properties
├── tsconfig.json            # Strict TypeScript settings
└── package.json             # Core scripts and dependencies
```

---

## 🛠️ Tech Stack

* **Front-End Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **UI Library:** [React 19](https://react.dev/)
* **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion v12](https://framer.com/motion/)
* **Iconography:** [Lucide React](https://lucide.dev/)
* **Network & Requests:** [Got Scraping](https://github.com/apify/got-scraping) (Server-side reviews API client)
* **Metadata Provider:** [The Movie Database (TMDB) API](https://www.themoviedb.org/)

---

## 🚀 Getting Started & Local Setup

Follow these steps to run a copy of Meowly on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/utkarshgupta188/meowly.git
cd meowly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file in the root directory and append your TMDB API token and credentials:

```ini
# TMDB Developer API Key (Create at https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here

# (Optional) Moctale Integration cookies
MOCTALE_COOKIE=your_moctale_auth_token_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the site live!

---

## 👨‍💻 Contribution

Contributions are always welcome to improve features, refine animations, or optimize streams!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License & Legal

This product uses the **TMDB API** but is not endorsed or certified by TMDB. All video streaming servers are third-party embeds; Meowly does not host, upload, or own any video streams on its servers.

For copyright removals, please refer to our integrated [DMCA Compliance Page](https://meowly.vercel.app/dmca).

Made with 💚 by [Utkarsh Gupta](https://github.com/utkarshgupta188)
