# The Quiet Atlas — Website Package

A cinematic, responsive promotional website and interactive companion for **The Quiet Atlas** YouTube channel ([@theQuiet_Atlas](https://www.youtube.com/@theQuiet_Atlas)).

Designed around slow travel, contemplative walking journeys, overlooked cities, and European borderlands across Poland and Central Europe.

## Features & Architecture

- **Authentic Channel Branding**:
  - Incorporates the official channel banner, monogram wordmark, and channel motto (*Explore • Experience • Understand*).
  - Bilingual Polish-English welcome greeting (`Cześć & witajcie! 🇵🇱`).
  - Three core pillars: *Slow Travel*, *Visual Storytelling*, *Meaningful Journeys*.
  - Grounded social proof: real channel stats and viewer testimonial.
- **Featured Journeys & On-Page 4K Theater**:
  - Features 6 curated walking journeys representing borderlands, historic routes, and overlooked cities, from an expanding YouTube catalog.
  - Interactive on-page theater: clicking "Watch here" or card thumbnails streams the episode directly in place via privacy-enhanced embeds (`youtube-nocookie.com`).
  - Direct "Open on YouTube ↗" links on each card and closing links to explore the full channel library.
- **34-Second Promotional Reel (9:16)**:
  - Custom HTML5 mobile device frame showcasing the 34-second promotional video (`assets/promo-reel.mp4`) with dedicated poster (`assets/reel-poster.jpg`).
  - Interactive play/pause, volume mute/unmute, progress scrub bar, and auto-pause when scrolled out of view.
- **Interactive Dark Cartography Map**:
  - Built with Leaflet and CARTO Dark Matter tiles (OpenStreetMap data) to seamlessly match the channel's dark aesthetic without requiring paid API keys.
  - Glowing gold location pins with pulse animations for featured destinations.
  - Synchronized destination sidebar: selecting any location triggers smooth animated fly-to, opens the pin popup, and allows one-click playback in the featured theater.
- **The Quiet Dispatches (Email Notification Fallback)**:
  - An on-page notification form for visitors wanting updates when new European walking journeys drop.
- **Mobile Subscription QR & Printable Companion (Footer)**:
  - Streamlined footer QR code (`assets/qr-code.jpg`) for instant camera scanning on mobile.
  - Downloadable official A4 channel distribution poster (`assets/the-quiet-atlas-poster.pdf`).
- **High Performance, SEO & Accessibility**:
  - Fully static assets, fast responsive layout, and clean typography hierarchy (`Playfair Display` + `DM Sans`).
  - Full keyboard accessibility, ARIA live labels, canonical URL, absolute Open Graph/Twitter metadata, and reduced-motion support.

## Project Structure

```text
thequietatlas26-creator.github.io/
├── index.html                     # Semantic HTML5 page structure & schema metadata
├── style.css                      # Modern dark-mode visual design system & animations
├── script.js                      # Video filters, Leaflet map, HTML5 reel, theater & dispatches
├── README.md                      # Documentation
└── assets/
    ├── channel-banner-wide.jpg    # Optimized widescreen hero banner (1983x793, 516 KB)
    ├── channel-banner.jpg         # YouTube channel banner (1280x720, 423 KB)
    ├── reel-poster.jpg            # 9:16 video reel poster frame (360x640, 34 KB)
    ├── promo-reel.mp4             # 34-second 9:16 promotional reel (18 MB)
    ├── qr-code.jpg                # Optimized YouTube subscribe QR code (148 KB)
    ├── the-quiet-atlas-poster.pdf # Official A4 distribution printable PDF (261 KB)
    └── favicon.svg                # Channel monogram SVG favicon
```

## Preview Locally

You can open `index.html` directly in any web browser. For local server testing:

```bash
python -m http.server 8000
# or npx serve
```

Then visit `http://localhost:8000`.

## Publishing with GitHub Pages

1. In your GitHub repository (`thequietatlas26-creator.github.io`), go to **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose the `main` branch and `/ (root)` folder, then click **Save**.
4. GitHub Pages publishes the site at `https://thequietatlas26-creator.github.io/`.
