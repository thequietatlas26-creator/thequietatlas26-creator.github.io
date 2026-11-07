# The Quiet Atlas — Website Package

A cinematic, responsive promotional website and interactive companion for **The Quiet Atlas** YouTube channel ([@theQuiet_Atlas](https://www.youtube.com/@theQuiet_Atlas)).

Designed around slow travel, contemplative walking journeys, overlooked cities, and European borderlands across Poland and Central Europe.

## Features & Improvements

- **Authentic Channel Branding**:
  - Incorporates the official banner, verified creator badge, and decoded channel motto (*Explore • Experience • Understand*).
  - Bilingual Polish-English welcome greeting (`Cześć & witajcie! 🇵🇱`).
  - Three core pillars: *Slow Travel*, *Visual Storytelling*, *Meaningful Journeys*.
- **30-Second Promotional Reel (9:16)**:
  - Custom HTML5 mobile device frame showcasing the 9:16 promotional video (`assets/promo-reel.mp4`).
  - Interactive play/pause, volume mute/unmute, and progress scrub bar.
- **Curated Video Journal & Filter System**:
  - Categorized journey filter tabs (*All*, *Borderlands & Crossings*, *Overlooked Cities*, *Historic Routes*).
  - High-res YouTube thumbnail support with automatic fallback.
  - Interactive featured 4K theater player with click-to-load privacy-enhanced embeds (`youtube-nocookie.com`).
  - Quick-watch buttons that load any journey directly into the featured theater.
- **Interactive Dark Cartography Map**:
  - Built with Leaflet and CartoDB Dark Matter tiles to seamlessly match the channel's dark aesthetic.
  - Glowing gold location pins with pulse animations for all featured walking destinations.
  - Synchronized destination sidebar: clicking any location triggers smooth animated fly-to and opens the video card popup.
- **Mobile Subscription QR & Printable Companion**:
  - Dedicated QR card with high-resolution scan code (`assets/qr-code.jpg`) for instant camera scanning on mobile.
  - Downloadable official A4 channel distribution poster (`assets/the-quiet-atlas-poster.pdf`).
- **High Performance & Accessibility**:
  - Fast static assets, responsive glassmorphism layout, clean typography hierarchy (`Playfair Display` + `DM Sans`).
  - Full keyboard accessibility, ARIA labels, and reduced-motion support.

## Project Structure

```text
thequietatlas26-creator.github.io/
├── index.html                     # Semantic HTML5 page structure & schema metadata
├── style.css                      # Modern dark-mode visual design system & animations
├── script.js                      # Video filters, Leaflet map, HTML5 reel, and YouTube player
├── README.md                      # Documentation
└── assets/
    ├── channel-banner.jpg         # YouTube channel banner (1280x720)
    ├── channel-banner-wide.png    # High-resolution widescreen banner (1983x793)
    ├── promo-reel.mp4             # 34-second 9:16 promotional reel
    ├── qr-code.jpg                # High-res YouTube subscribe QR code
    ├── the-quiet-atlas-poster.pdf # Official A4 distribution printable PDF
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
4. GitHub Pages will publish the site at `https://thequietatlas26-creator.github.io/`.
