const YOUTUBE_CHANNEL = "https://www.youtube.com/@theQuiet_Atlas";
const SUBSCRIBE_URL = `${YOUTUBE_CHANNEL}?sub_confirmation=1`;

const videos = [
  {id:"_m3B7nm6fZk",title:"Can You Just Walk Across The German-Polish Border?",place:"Görlitz – Zgorzelec",region:"Germany / Poland",group:"borderlands",lat:51.153,lon:14.988},
  {id:"AAV2V21bz-g",title:"I Walked Across The German Border Along The Beach",place:"Świnoujście",region:"Poland / Germany",group:"borderlands",lat:53.910,lon:14.247},
  {id:"P5XYaqQoxdw",title:"I Investigated Poland's “Ugliest” City, Łódź",place:"Łódź",region:"Central Poland",group:"cities",lat:51.759,lon:19.456},
  {id:"cr4Oxhz67iQ",title:"Discover Opole, Poland: Market Square & First Impressions",place:"Opole",region:"Southern Poland",group:"cities",lat:50.675,lon:17.921},
  {id:"Gzc_Trn2ODE",title:"Walking Along Warsaw's Royal Route",place:"Warsaw",region:"Central Poland",group:"streets",lat:52.229,lon:21.012},
  {id:"Bq4qx--alHY",title:"From Stettin to Szczecin: Poland's Hidden Maritime City",place:"Szczecin",region:"North-west Poland",group:"streets",lat:53.428,lon:14.552}
];

const videoUrl = id => `https://www.youtube.com/watch?v=${id}`;
const thumbUrl = id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function renderCards(group, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = videos.filter(video => video.group === group).map(video => `
    <a class="video-card" href="${videoUrl(video.id)}" target="_blank" rel="noopener noreferrer">
      <div class="video-thumb">
        <img src="${thumbUrl(video.id)}" alt="${escapeHtml(video.title)} — ${escapeHtml(video.place)} video thumbnail" loading="lazy" decoding="async">
        <span class="thumb-play" aria-hidden="true">▶</span>
      </div>
      <h4>${escapeHtml(video.title)}</h4>
      <span class="location">${escapeHtml(video.place)} · ${escapeHtml(video.region)}</span>
    </a>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

function loadFeaturedVideo() {
  const player = document.getElementById("featured-player");
  if (!player) return;
  player.addEventListener("click", () => {
    const id = player.dataset.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    iframe.title = "The Quiet Atlas — featured walking journey";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    player.replaceChildren(iframe);
    player.style.cursor = "default";
    player.setAttribute("aria-label", "Featured YouTube video player");
  }, {once:true});
}

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
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 600) close(); });
}

function setupMap() {
  const list = document.getElementById("destination-list");
  if (list) {
    list.innerHTML = videos.map((video, index) => `
      <button class="destination-item" type="button" data-video="${video.id}" aria-label="Show ${escapeHtml(video.place)} on the map">
        <span class="destination-number">${String(index + 1).padStart(2,"0")}</span>
        <span><span class="destination-name">${escapeHtml(video.place)}</span><span class="destination-region">${escapeHtml(video.region)}</span></span>
      </button>
    `).join("");
  }

  const mapElement = document.getElementById("journey-map");
  if (!mapElement || typeof L === "undefined") {
    if (mapElement) {
      mapElement.innerHTML = '<div class="map-unavailable">The interactive map needs an internet connection. Explore the destinations listed alongside.</div>';
    }
    return;
  }

  const map = L.map(mapElement, {scrollWheelZoom:false, zoomControl:true}).setView([52.05,18.2], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const markers = new Map();
  videos.forEach((video, index) => {
    const icon = L.divIcon({className:"", html:'<div class="custom-pin"></div>', iconSize:[17,17], iconAnchor:[8,8]});
    const marker = L.marker([video.lat, video.lon], {icon, title:video.place, alt:`${video.place} video location`}).addTo(map);
    marker.bindPopup(`<strong>${escapeHtml(video.place)}</strong><br>${escapeHtml(video.title)}<br><a href="${videoUrl(video.id)}" target="_blank" rel="noopener noreferrer">Watch this journey ↗</a>`);
    markers.set(video.id, marker);
  });

  list?.querySelectorAll(".destination-item").forEach(button => {
    button.addEventListener("click", () => {
      const marker = markers.get(button.dataset.video);
      if (!marker) return;
      map.flyTo(marker.getLatLng(), 11, {duration:0.8});
      marker.openPopup();
      if (window.innerWidth < 850) mapElement.scrollIntoView({behavior:"smooth", block:"center"});
    });
  });
  setTimeout(() => map.invalidateSize(), 250);
}

function setupScrollEffects() {
  const topButton = document.getElementById("back-to-top");
  const onScroll = () => topButton?.classList.toggle("visible", window.scrollY > 650);
  window.addEventListener("scroll", onScroll, {passive:true});
  topButton?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCards("borderlands", "collection-borderlands");
  renderCards("cities", "collection-cities");
  renderCards("streets", "collection-streets");
  loadFeaturedVideo();
  setupNavigation();
  setupMap();
  setupScrollEffects();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
