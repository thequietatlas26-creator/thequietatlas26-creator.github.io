/**
 * THE QUIET ATLAS — Interactive Companion Engine
 * Handles the on-page video theater, featured journey cards, the 9:16 promotional
 * reel, the interactive map, category filters, and smooth UI animations.
 */

const YOUTUBE_CHANNEL = "https://www.youtube.com/@theQuiet_Atlas";
const SUBSCRIBE_URL = `${YOUTUBE_CHANNEL}?sub_confirmation=1`;

/**
 * Optional social proof. Leave a value empty ("") to hide it.
 * Update these by hand when you want to show them — nothing here is fetched or invented.
 *   subscribers: "12.4K"      totalViews: "480K"
 *   quote: { text: "Beautifully calm.", author: "Viewer comment" }
 */
const CHANNEL_PROOF = {
  subscribers: "",
  totalViews: "",
  quote: {
    text: "A rare kind of travel video that lets Europe breathe. No rush, no shouting — just the quiet rhythm of walking.",
    author: "YouTube viewer"
  }
};

// The six FEATURED walks. The channel has many more — add new ones here to feature them.
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
const pad2 = n => String(n).padStart(2, "0");
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
// 1. Proof strip (real, derived facts + optional hand-entered numbers)
// ---------------------------------------------------------------------------
function renderProof() {
  const row = document.getElementById("proof-row");
  if (!row) return;

  const items = [];
  if (CHANNEL_PROOF.subscribers) items.push({ value: CHANNEL_PROOF.subscribers, label: "Subscribers" });
  if (CHANNEL_PROOF.totalViews) items.push({ value: CHANNEL_PROOF.totalViews, label: "Total views" });
  items.push({ value: String(journeys.length), label: "Featured walks" });
  items.push({
    value: String(journeys.filter(j => j.group === "borderlands").length),
    label: "Border crossings on foot"
  });
  items.push({ value: "4K", label: "Filmed in Ultra HD" });

  const stats = items.map(item => `
    <div class="proof-item">
      <span class="proof-value">${escapeHtml(item.value)}</span>
      <span class="proof-label">${escapeHtml(item.label)}</span>
    </div>
  `).join("");

  const q = CHANNEL_PROOF.quote;
  const quote = q && q.text
    ? `<figure class="proof-quote">
         <blockquote>“${escapeHtml(q.text)}”</blockquote>
         ${q.author ? `<figcaption>— ${escapeHtml(q.author)}</figcaption>` : ""}
       </figure>`
    : "";

  row.innerHTML = `<div class="proof-stats">${stats}</div>${quote}`;
}

// ---------------------------------------------------------------------------
// 2. Featured Theater — plays videos on this page, keeps visitors here longer
// ---------------------------------------------------------------------------
let theaterIndex = 0;

function getTheaterEls() {
  return {
    box: document.getElementById("theater-box"),
    stage: document.getElementById("theater-stage"),
    posterBtn: document.getElementById("featured-player"),
    posterImg: document.getElementById("theater-poster"),
    label: document.getElementById("theater-label"),
    nowPlaying: document.getElementById("theater-now-playing"),
    eyebrow: document.getElementById("theater-eyebrow"),
    title: document.getElementById("theater-title"),
    desc: document.getElementById("theater-desc"),
    ytBtn: document.getElementById("theater-yt-btn")
  };
}

function highlightCurrentCard() {
  const current = journeys[theaterIndex];
  document.querySelectorAll(".journey-card").forEach(card => {
    card.classList.toggle("is-current", !!current && card.dataset.id === current.id);
  });
}

function showTheaterPoster(index) {
  const els = getTheaterEls();
  const journey = journeys[index];
  if (!els.stage || !els.posterBtn || !journey) return;

  theaterIndex = index;

  els.posterBtn.dataset.videoId = journey.id;
  els.posterBtn.setAttribute("aria-label", `Play video: ${journey.title}`);

  if (els.posterImg) {
    els.posterImg.onerror = () => {
      els.posterImg.onerror = null;
      els.posterImg.src = thumbUrl(journey.id);
    };
    els.posterImg.src = highResThumbUrl(journey.id);
    els.posterImg.alt = `${journey.title} — video thumbnail`;
  }
  if (els.label) els.label.innerHTML = `WATCH · <b>${pad2(index + 1)} / ${pad2(journeys.length)}</b>`;
  if (els.nowPlaying) els.nowPlaying.textContent = journey.place;
  if (els.eyebrow) els.eyebrow.textContent = `${journey.place} · ${journey.region}`;
  if (els.title) els.title.textContent = journey.title;
  if (els.desc) els.desc.textContent = journey.description;
  if (els.ytBtn) els.ytBtn.href = videoUrl(journey.id);

  // Restore the poster button if an iframe from a previous video is showing
  if (els.stage.firstElementChild !== els.posterBtn) els.stage.replaceChildren(els.posterBtn);

  highlightCurrentCard();
}

function playTheater(index) {
  const els = getTheaterEls();
  const journey = journeys[index];
  if (!els.stage || !journey) return;

  // Opening from file:// can't embed (YouTube blocks it, Error 153) — open YouTube instead.
  if (window.location.protocol === "file:") {
    window.open(videoUrl(journey.id), "_blank", "noopener,noreferrer");
    return;
  }

  // Don't let the promo reel play over the main video
  document.getElementById("promo-video")?.pause();

  const iframe = document.createElement("iframe");
  iframe.className = "theater-iframe";
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(journey.id)}?autoplay=1&rel=0`;
  iframe.title = `The Quiet Atlas — ${journey.title}`;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  els.stage.replaceChildren(iframe);
}

function selectJourney(index, { play = false, scroll = false } = {}) {
  showTheaterPoster(index);

  if (scroll) {
    const box = document.getElementById("theater-box");
    box?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }
  if (play) playTheater(index);
}

function setupFeaturedPlayer() {
  const posterBtn = document.getElementById("featured-player");
  if (!posterBtn) return;

  posterBtn.addEventListener("click", () => playTheater(theaterIndex));
  showTheaterPoster(0);
}

// ---------------------------------------------------------------------------
// 3. Journey cards & filter system
//    Cards play in the on-page theater; each also has a direct YouTube link.
// ---------------------------------------------------------------------------
function renderJourneys(filter = "all") {
  const container = document.getElementById("videos-grid");
  if (!container) return;

  const filtered = filter === "all" ? journeys : journeys.filter(j => j.group === filter);

  container.innerHTML = filtered.map(journey => `
    <article class="journey-card" data-id="${journey.id}" data-category="${journey.group}">
      <button class="journey-thumb-box" type="button" data-play="${journey.id}" aria-label="Play ${escapeHtml(journey.title)} on this page">
        <span class="card-badge-pill">${escapeHtml(journey.badge)}</span>
        <img src="${highResThumbUrl(journey.id)}"
             alt=""
             loading="lazy"
             decoding="async"
             onerror="this.onerror=null; this.src='${thumbUrl(journey.id)}';">
        <span class="card-play-pill" aria-hidden="true">▶</span>
      </button>

      <div class="journey-body">
        <div class="journey-meta-row">
          <span class="journey-place">${escapeHtml(journey.place)}</span>
          <span class="journey-region">${escapeHtml(journey.region)}</span>
        </div>
        <h3 class="journey-title">${escapeHtml(journey.title)}</h3>
        <p class="journey-desc">${escapeHtml(journey.description)}</p>

        <div class="journey-actions-row">
          <button class="quick-load-btn" type="button" data-play="${journey.id}">
            <span aria-hidden="true">▶</span>
            <span>Watch here</span>
          </button>
          <a class="yt-direct-btn" href="${videoUrl(journey.id)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(journey.title)} on YouTube (opens in a new tab)">
            <span>Open on YouTube</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  `).join("");

  highlightCurrentCard();
}

function setupJourneyGrid() {
  const container = document.getElementById("videos-grid");
  if (!container) return;

  container.addEventListener("click", event => {
    const trigger = event.target.closest("[data-play]");
    if (!trigger) return;
    const index = journeys.findIndex(j => j.id === trigger.dataset.play);
    if (index === -1) return;
    selectJourney(index, { play: true, scroll: true });
  });
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll(".journey-filters .filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      renderJourneys(btn.dataset.filter);
    });
  });
}

// ---------------------------------------------------------------------------
// 4. 9:16 Promotional Reel (HTML5 Video Player)
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

  const syncMuteUi = () => {
    if (iconSound) iconSound.innerHTML = video.muted ? soundMutedSvg : soundOnSvg;
    muteToggle?.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  };

  // Start muted so the browser allows playback without a prior gesture
  video.muted = true;
  syncMuteUi();

  const togglePlay = () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  playToggle?.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  video.addEventListener("play", () => {
    container?.classList.add("is-playing");
    playToggle?.setAttribute("aria-label", "Pause promotional video");
  });
  video.addEventListener("pause", () => {
    container?.classList.remove("is-playing");
    playToggle?.setAttribute("aria-label", "Play promotional video");
  });

  muteToggle?.addEventListener("click", () => {
    video.muted = !video.muted;
    syncMuteUi();
  });

  video.addEventListener("timeupdate", () => {
    if (video.duration && progressFill) {
      progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }
  });

  progressTrack?.addEventListener("click", event => {
    const rect = progressTrack.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    if (video.duration) video.currentTime = pos * video.duration;
  });

  // Pause when scrolled out of view (saves data, stops sound from playing off-screen)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      });
    }, { threshold: 0.15 }).observe(video);
  }
}

// ---------------------------------------------------------------------------
// 5. Interactive Map (CARTO Dark Matter tiles, OpenStreetMap data — no API key)
// ---------------------------------------------------------------------------
function setupMap() {
  const list = document.getElementById("destination-list");
  if (list) {
    list.innerHTML = journeys.map((journey, index) => `
      <button class="destination-item" type="button" data-id="${journey.id}" aria-label="Show ${escapeHtml(journey.place)} on the map">
        <span class="destination-number">${pad2(index + 1)}</span>
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
      mapElement.innerHTML = '<div class="map-fallback">The interactive map needs an internet connection. Destinations are listed alongside.</div>';
    }
    return;
  }

  // Centered over Poland & Central European borderlands
  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([52.05, 18.2], 6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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

    // The popup button plays the video in the on-page theater
    const popupHtml = `
      <div style="min-width: 180px;">
        <h4 class="popup-title">${escapeHtml(journey.place)}</h4>
        <div class="popup-video-title">${escapeHtml(journey.title)}</div>
        <button class="popup-link popup-watch" type="button" data-play="${journey.id}">Watch this walk ▶</button>
      </div>
    `;

    marker.bindPopup(popupHtml);
    markers.set(journey.id, marker);
  });

  // Popup content is created on open, so delegate from the map container
  mapElement.addEventListener("click", event => {
    const trigger = event.target.closest(".popup-watch");
    if (!trigger) return;
    const index = journeys.findIndex(j => j.id === trigger.dataset.play);
    if (index === -1) return;
    map.closePopup();
    selectJourney(index, { play: true, scroll: true });
  });

  const listItems = list?.querySelectorAll(".destination-item");

  listItems?.forEach(button => {
    button.addEventListener("click", () => {
      const marker = markers.get(button.dataset.id);
      if (!marker) return;

      listItems.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      map.flyTo(marker.getLatLng(), 11, { duration: prefersReducedMotion() ? 0 : 1.0 });
      marker.openPopup();

      if (window.innerWidth < 850) {
        mapElement.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      }
    });
  });

  setTimeout(() => map.invalidateSize(), 300);
}

// ---------------------------------------------------------------------------
// 6. Copy Channel Link Helper
// ---------------------------------------------------------------------------
function setupCopyLink() {
  const copyBtn = document.getElementById("copy-channel-link");
  const copyText = document.getElementById("copy-btn-text");
  if (!copyBtn) return;

  const flash = (message, ok) => {
    if (ok) copyBtn.classList.add("copied");
    if (copyText) copyText.textContent = message;
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      if (copyText) copyText.textContent = "Copy Channel Link";
    }, 2500);
  };

  copyBtn.addEventListener("click", () => {
    if (!navigator.clipboard) {
      window.prompt("Copy channel URL:", SUBSCRIBE_URL);
      return;
    }
    navigator.clipboard.writeText(SUBSCRIBE_URL)
      .then(() => flash("Link Copied! ✓", true))
      .catch(() => window.prompt("Copy channel URL:", SUBSCRIBE_URL));
  });
}

// ---------------------------------------------------------------------------
// 7. Navigation, Scroll Effects & Back to Top
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
    header?.classList.toggle("is-scrolled", y > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }));

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
// 8. Dispatches Email Notification Form
// ---------------------------------------------------------------------------
function setupDispatchesForm() {
  const form = document.getElementById("dispatches-form");
  const input = document.getElementById("dispatch-email");
  const feedback = document.getElementById("dispatches-feedback");
  if (!form || !input || !feedback) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const email = input.value.trim();
    if (!email || !email.includes("@")) {
      feedback.className = "form-feedback error";
      feedback.textContent = "Please enter a valid email address.";
      return;
    }

    try {
      localStorage.setItem("tqa_subscriber_email", email);
    } catch (_) {}

    input.value = "";
    feedback.className = "form-feedback success";
    feedback.textContent = "✓ Thank you for following along! You will be notified when new walking journeys drop.";

    setTimeout(() => {
      feedback.textContent = "";
      feedback.className = "form-feedback";
    }, 6000);
  });
}

// ---------------------------------------------------------------------------
// 9. Initialization
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProof();
  renderJourneys("all");
  setupFilterButtons();
  setupJourneyGrid();
  setupFeaturedPlayer();
  setupPromoReel();
  setupMap();
  setupDispatchesForm();
  setupCopyLink();
  setupNavigation();
  setupScrollEffects();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
