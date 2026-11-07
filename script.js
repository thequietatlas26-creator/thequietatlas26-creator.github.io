/**
 * THE QUIET ATLAS — Interactive Companion Engine
 * Handles YouTube video cards, 9:16 promotional reel, interactive cartography,
 * journey categorization filters, and smooth UI animations.
 */

const YOUTUBE_CHANNEL = "https://www.youtube.com/@theQuiet_Atlas";
const SUBSCRIBE_URL = `${YOUTUBE_CHANNEL}?sub_confirmation=1`;

const journeys = [
  {
    id: "_m3B7nm6fZk",
    title: "Can You Just Walk Across The German-Polish Border?",
    place: "Görlitz – Zgorzelec",
    region: "Germany / Poland Border",
    group: "borderlands",
    lat: 51.153,
    lon: 14.988,
    badge: "Border Crossing",
    description: "Crossing the Old Town Footbridge over the Lusatian Neisse river connecting two nations united in peaceful daily life."
  },
  {
    id: "AAV2V21bz-g",
    title: "I Walked Across The German Border Along The Beach",
    place: "Świnoujście",
    region: "Baltic Coast · Poland / Germany",
    group: "borderlands",
    lat: 53.910,
    lon: 14.247,
    badge: "Baltic Borderland",
    description: "Following the tranquil sandy shores of Usedom Island across the unpatrolled Schengen border between Poland and Germany."
  },
  {
    id: "P5XYaqQoxdw",
    title: "I Investigated Poland's “Ugliest” City, Łódź",
    place: "Łódź",
    region: "Central Poland",
    group: "cities",
    lat: 51.759,
    lon: 19.456,
    badge: "Industrial Heritage",
    description: "Exploring Poland's 19th-century textile capital: monumental red-brick factories, Manufaktura, and ornate Piotrkowska Street."
  },
  {
    id: "cr4Oxhz67iQ",
    title: "Discover Opole, Poland: Market Square & First Impressions",
    place: "Opole",
    region: "Silesia · Southern Poland",
    group: "cities",
    lat: 50.675,
    lon: 17.921,
    badge: "Silesian Gem",
    description: "Strolling the pastel Renaissance market square, the tranquil Młynówka Canal, and centuries of Silesian architectural heritage."
  },
  {
    id: "Gzc_Trn2ODE",
    title: "Walking Along Warsaw's Royal Route",
    place: "Warsaw",
    region: "Capital Region · Central Poland",
    group: "streets",
    lat: 52.229,
    lon: 21.012,
    badge: "Royal Route",
    description: "A contemplative stroll from Royal Castle Square along Krakowskie Przedmieście and Nowy Świat through the heart of Warsaw."
  },
  {
    id: "Bq4qx--alHY",
    title: "From Stettin to Szczecin: Poland's Hidden Maritime City",
    place: "Szczecin",
    region: "West Pomerania · North-west Poland",
    group: "streets",
    lat: 53.428,
    lon: 14.552,
    badge: "Maritime Borderland",
    description: "Parisian-style roundabouts, monumental Pomeranian Dukes' Castle, and the historic maritime port along the lower Oder river."
  }
];

const videoUrl = id => `https://www.youtube.com/watch?v=${id}`;
const thumbUrl = id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const highResThumbUrl = id => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// ---------------------------------------------------------------------------
// 1. Video Cards & Filter System
// All cards link directly to YouTube in a new tab for seamless playback
// ---------------------------------------------------------------------------
let currentFilter = "all";

function renderJourneys(filter = "all") {
  const container = document.getElementById("videos-grid");
  if (!container) return;

  const filtered = filter === "all" ? journeys : journeys.filter(j => j.group === filter);

  container.innerHTML = filtered.map(journey => `
    <a class="journey-card" href="${videoUrl(journey.id)}" target="_blank" rel="noopener noreferrer" data-category="${journey.group}" aria-label="Watch ${escapeHtml(journey.title)} on YouTube">
      <div class="journey-thumb-box">
        <span class="card-badge-pill">${escapeHtml(journey.badge)}</span>
        <img src="${highResThumbUrl(journey.id)}" 
             alt="${escapeHtml(journey.title)} thumbnail" 
             loading="lazy" 
             decoding="async"
             onerror="this.onerror=null; this.src='${thumbUrl(journey.id)}';">
        <span class="card-play-pill" aria-hidden="true">▶</span>
      </div>

      <div class="journey-body">
        <div class="journey-meta-row">
          <span class="journey-place">${escapeHtml(journey.place)}</span>
          <span class="journey-region">${escapeHtml(journey.region)}</span>
        </div>
        <h4>${escapeHtml(journey.title)}</h4>
        <p class="journey-desc">${escapeHtml(journey.description)}</p>

        <div class="journey-actions-row">
          <span class="yt-direct-btn">
            <span>Watch on YouTube</span>
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </div>
    </a>
  `).join("");
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll(".journey-filters .filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      currentFilter = btn.dataset.filter;
      renderJourneys(currentFilter);
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Featured Theater Player
// ---------------------------------------------------------------------------
function setupFeaturedPlayer() {
  const player = document.getElementById("featured-player");
  if (!player) return;

  player.addEventListener("click", () => {
    const id = player.dataset.videoId || "_m3B7nm6fZk";

    // When viewing locally via file:// protocol, YouTube deliberately blocks
    // iframe embedding with Error 153 ("video player configuration error").
    // In file:// mode, immediately open the video directly on YouTube in a new tab.
    if (window.location.protocol === "file:") {
      window.open(videoUrl(id), "_blank", "noopener,noreferrer");
      return;
    }

    // On standard HTTP / HTTPS (e.g. GitHub Pages or local server), embed the player cleanly
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    iframe.title = "The Quiet Atlas — featured walking journey";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    player.replaceChildren(iframe);
    player.style.cursor = "default";
    player.setAttribute("aria-label", "Featured YouTube video player");
  }, { once: true });
}

// ---------------------------------------------------------------------------
// 3. 9:16 Promotional Reel (HTML5 Video Player)
// ---------------------------------------------------------------------------
function setupPromoReel() {
  const video = document.getElementById("promo-video");
  const playToggle = document.getElementById("reel-play-toggle");
  const muteToggle = document.getElementById("reel-mute-toggle");
  const progressFill = document.getElementById("reel-progress-fill");
  const progressTrack = document.getElementById("reel-progress-track");
  const container = document.querySelector(".reel-video-container");
  const iconSound = document.getElementById("icon-sound");

  if (!video) return;

  const soundOnSvg = `
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  `;
  const soundMutedSvg = `
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  `;

  // Start video muted for autoplay safety and smooth UX
  video.muted = true;
  if (iconSound) iconSound.innerHTML = soundMutedSvg;

  const togglePlay = () => {
    if (video.paused) {
      video.play().then(() => {
        container?.classList.add("is-playing");
      }).catch(() => {});
    } else {
      video.pause();
      container?.classList.remove("is-playing");
    }
  };

  playToggle?.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  video.addEventListener("play", () => container?.classList.add("is-playing"));
  video.addEventListener("pause", () => container?.classList.remove("is-playing"));

  muteToggle?.addEventListener("click", () => {
    video.muted = !video.muted;
    if (iconSound) {
      iconSound.innerHTML = video.muted ? soundMutedSvg : soundOnSvg;
    }
  });

  video.addEventListener("timeupdate", () => {
    if (video.duration && progressFill) {
      const pct = (video.currentTime / video.duration) * 100;
      progressFill.style.width = `${pct}%`;
    }
  });

  progressTrack?.addEventListener("click", event => {
    const rect = progressTrack.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    if (video.duration) {
      video.currentTime = pos * video.duration;
    }
  });
}

// ---------------------------------------------------------------------------
// 4. Interactive Cartography Map (Standard OpenStreetMap — Zero API Key Required)
// ---------------------------------------------------------------------------
function setupMap() {
  const list = document.getElementById("destination-list");
  if (list) {
    list.innerHTML = journeys.map((journey, index) => `
      <button class="destination-item" type="button" data-id="${journey.id}" aria-label="Show ${escapeHtml(journey.place)} on the map">
        <span class="destination-number">${String(index + 1).padStart(2, "0")}</span>
        <div class="destination-info">
          <span class="destination-name">${escapeHtml(journey.place)}</span>
          <span class="destination-region">${escapeHtml(journey.region)}</span>
        </div>
        <span class="destination-chevron" aria-hidden="true">→</span>
      </button>
    `).join("");
  }

  const mapElement = document.getElementById("journey-map");
  if (!mapElement || typeof L === "undefined") {
    if (mapElement) {
      mapElement.innerHTML = '<div style="padding:40px; text-align:center; color:#d8c18c;">The interactive map needs an internet connection. Destinations are listed alongside.</div>';
    }
    return;
  }

  // Centered over Poland & Central European borderlands
  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([52.05, 18.2], 6);

  // Standard OpenStreetMap tiles — reliable, free, completely public, NO API KEY REQUIRED
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const markers = new Map();

  journeys.forEach(journey => {
    const customIcon = L.divIcon({
      className: "",
      html: `
        <div class="custom-map-pin">
          <span class="pin-pulse"></span>
          <span class="pin-core"></span>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12]
    });

    const marker = L.marker([journey.lat, journey.lon], {
      icon: customIcon,
      title: journey.place,
      alt: `${journey.place} video location`
    }).addTo(map);

    const popupHtml = `
      <div style="min-width: 180px;">
        <h4 class="popup-title">${escapeHtml(journey.place)}</h4>
        <div class="popup-video-title">${escapeHtml(journey.title)}</div>
        <a class="popup-link" href="${videoUrl(journey.id)}" target="_blank" rel="noopener noreferrer">
          Watch Walk on YouTube ↗
        </a>
      </div>
    `;

    marker.bindPopup(popupHtml);
    markers.set(journey.id, marker);
  });

  const listItems = list?.querySelectorAll(".destination-item");

  listItems?.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const marker = markers.get(id);
      if (!marker) return;

      listItems.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      map.flyTo(marker.getLatLng(), 11, {
        duration: 1.0
      });

      marker.openPopup();

      if (window.innerWidth < 850) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  setTimeout(() => map.invalidateSize(), 300);
}

// ---------------------------------------------------------------------------
// 5. Copy Channel Link Helper
// ---------------------------------------------------------------------------
function setupCopyLink() {
  const copyBtn = document.getElementById("copy-channel-link");
  const copyText = document.getElementById("copy-btn-text");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(SUBSCRIBE_URL).then(() => {
      copyBtn.classList.add("copied");
      if (copyText) copyText.textContent = "Link Copied! ✓";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (copyText) copyText.textContent = "Copy Channel Link";
      }, 2500);
    }).catch(() => {
      prompt("Copy channel URL:", SUBSCRIBE_URL);
    });
  });
}

// ---------------------------------------------------------------------------
// 6. Navigation, Scroll Effects & Back to Top
// ---------------------------------------------------------------------------
function setupNavigation() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", isOpen);
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 680) close(); });
}

function setupScrollEffects() {
  const topButton = document.getElementById("back-to-top");
  const header = document.querySelector(".site-header");

  const onScroll = () => {
    const y = window.scrollY;
    topButton?.classList.toggle("visible", y > 600);
    if (header) {
      if (y > 40) {
        header.style.background = "rgba(13, 19, 24, 0.95)";
        header.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.5)";
      } else {
        header.style.background = "rgba(13, 19, 24, 0.85)";
        header.style.boxShadow = "none";
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
}

// ---------------------------------------------------------------------------
// 7. Initialization
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderJourneys("all");
  setupFilterButtons();
  setupFeaturedPlayer();
  setupPromoReel();
  setupMap();
  setupCopyLink();
  setupNavigation();
  setupScrollEffects();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
