# DownloadHub — Modern Social Video Downloader Web App

> **Fast, clean, mobile-first social media video downloader and preview application inspired by InDown (`indown.io`). Built with React, Vite, Tailwind CSS, Node.js, and Express.**
>
> 🚫 **Zero Ads** • 🛡️ **Zero Tracking** • 💾 **Zero Database** • 🔒 **Zero Logins Required**

---

## 🌟 Highlights & Features

- **InDown-Style UX (`indown.io`)**: Clean, minimalist interface with category quick-tabs (*All Links*, *Instagram Reels*, *YouTube Shorts*, *Facebook Videos*), clipboard paste button, and instant preview card.
- **1-Click Clipboard Paste**: Integrated browser Clipboard API (`navigator.clipboard.readText()`) allows users to paste video links with a single tap.
- **Auto-Detection**: Automatically detects platform from URL with instant client-side format feedback.
- **Supported Platforms**:
  - **Instagram**: Reels, single video posts, and public feed videos.
  - **YouTube**: YouTube Shorts, standard watch links (`youtube.com/watch?v=`), and `youtu.be` links.
  - **Facebook**: Facebook Watch, Public Reels, and video posts (`fb.watch`).
- **Rich Preview Cards**: Displays high-resolution video thumbnail, title, author/channel with profile link, duration, and direct actions.
- **Permitted Downloads & Fallback**: Where permitted by platform policies and content owners, direct high-quality downloads are provided. When a platform restricts direct streams (e.g. DRM or authentication barriers), DownloadHub provides high-res thumbnail downloads alongside a prominent **"Open Original"** button.
- **Security & SSRF Hardened**:
  - Server-Side Request Forgery (SSRF) protection blocking loopbacks, private IPs (`127.0.0.1`, `10.x.x.x`, `192.168.x.x`, `172.16.x.x`, `169.254.169.254`, `::1`), and disallowed protocols (`file://`, `ftp://`).
  - Strict hostname allowlist.
  - Rate limiting (20 requests per IP per 10 minutes, configurable via `.env`).
  - Request size limits (10kb max body size).
  - Sanitized error responses (never exposing stack traces or server paths).
- **Stateless & Privacy-First**: No database, no user accounts, no tracking cookies, no advertising networks.
- **Responsive & Accessible**: Tested on screens from 360px up to 4K desktops, with semantic HTML and keyboard navigation.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (feather-style clean icons)
- **Backend**: Node.js, Express.js, Helmet (security headers), CORS, `express-rate-limit`
- **Testing**: Jest, Supertest (32 automated unit & integration tests)
- **Deployment**: Vercel-ready with `vercel.json` or any standard Node.js hosting platform (Railway, Render, Fly.io)

---

## 📁 Project Structure

```
downloadhub/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Favicon, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/         # Navbar, HeroDownloader, ResultCard, HowToSteps,
│   │   │                       # FeaturesGrid, PlatformShowcase, FaqSection, Footer
│   │   ├── pages/              # HomePage, HowItWorksPage, SupportedPlatformsPage,
│   │   │                       # PrivacyPage, TermsPage
│   │   ├── services/api.js     # API communication service with timeouts
│   │   ├── utils/urlHelper.js  # Client-side URL detection & validation
│   │   ├── App.jsx             # Main layout & view controller
│   │   └── index.css           # Tailwind & glassmorphism utilities
│   ├── index.html              # SEO metadata, Open Graph, Twitter cards
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── middleware/         # ssrfGuard.js, rateLimiter.js, errorHandler.js
│   │   ├── platforms/          # BasePlatform.js, youtube.js, instagram.js, facebook.js
│   │   ├── controllers/        # processController.js, streamController.js
│   │   ├── routes/apiRoutes.js # POST /api/process, GET /api/download, GET /api/health
│   │   ├── utils/logger.js
│   │   ├── app.js              # Express app (Vercel serverless export)
│   │   └── server.js           # Local standalone runner
│   ├── tests/                  # Automated Jest / Supertest test suite
│   └── package.json
│
├── vercel.json                 # Vercel deployment configuration
├── .env.example                # Environment configuration template
├── .gitignore
├── README.md
└── package.json                # Monorepo scripts
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 1. Install Dependencies
Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

Install root dependencies (for monorepo script runner):
```bash
cd ..
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` in root (or `server/.env`):
```bash
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX=20
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Run Development Servers
From the root directory:
```bash
npm run dev
```
This runs both:
- **Client**: `http://localhost:8080` (with automatic API proxying)
- **API Server**: `http://localhost:3001`

Alternatively, you can run them separately in two terminals:
```bash
# Terminal 1: Backend API
cd server && npm run dev

# Terminal 2: Frontend Client
cd client && npm run dev
```

---

## 🧪 Running Automated Tests

Run the full test suite (SSRF guard, platform regexes, API error sanitization, rate limiting):
```bash
npm test
# or: cd server && npm test
```

All 32 unit and integration tests will execute and report passing status.

---

## 🏗️ Production Build

To build the client for production:
```bash
cd client
npm run build
```
The optimized static build will be placed in `client/dist/`.

To run the production backend server:
```bash
cd server
npm start
```

---

## ☁️ Vercel Deployment

This project includes a `vercel.json` configuration configured for Vercel:

1. Push your repository to GitHub or GitLab.
2. Import the repository in [Vercel Dashboard](https://vercel.com).
3. The build configuration in `vercel.json` automatically maps:
   - Frontend static assets from `client/`
   - Serverless API routes from `server/src/app.js` under `/api/*`
4. Set optional environment variables in your Vercel Project Settings if desired (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`).

---

## 🛡️ Security & Platform Compliance

- **No DRM or Access Control Circumvention**: DownloadHub adheres to platform rules and copyright standards. It does not extract protected content, steal cookies, bypass CAPTCHAs, or defeat paywalls.
- **SSRF Protection**: Incoming URLs are verified against a safe protocol (`http` / `https`) and hostname allowlist. Attempts to resolve internal IP ranges (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, `169.254.169.254`) are immediately rejected with HTTP 400.
- **No Temporary Files on Disk**: Permitted media is streamed directly to the client's browser with attachment headers using memory-safe pipelines.

---

## 📄 License & Attribution

- Built as a free, open utility under the MIT License.
- Instagram, YouTube, and Facebook are trademarks of their respective owners. DownloadHub is an independent application.
