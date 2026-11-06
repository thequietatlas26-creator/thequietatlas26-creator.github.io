# The Quiet Atlas — website package

A cinematic, responsive promotional website for **The Quiet Atlas**, designed around slow travel, walking journeys, overlooked cities and borderlands across Poland and Europe.

## Files

- `index.html` — page structure, metadata and content
- `style.css` — responsive visual design
- `script.js` — video collections, click-to-load YouTube player, mobile navigation, map markers and scroll effects
- `assets/favicon.svg` — custom favicon

## Preview locally

You can open `index.html` directly in a browser. For the most reliable local preview, run a simple static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

The map uses Leaflet and OpenStreetMap tiles loaded from the internet. Google Fonts, YouTube thumbnails and YouTube embeds also require an internet connection. If the map library cannot load, the destination list remains available.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `the-quiet-atlas`.
2. Upload the contents of this package (the files inside the folder, not the outer ZIP).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The URL will usually be `https://YOUR-USERNAME.github.io/the-quiet-atlas/`.

Keep `index.html`, `style.css`, `script.js` and the `assets` folder together in the repository root. Relative paths are already used for local files, so the project supports a repository subpath.

## Before launch

- Replace the two Unsplash image URLs in `style.css` with your own licensed photography or preferred images if desired.
- Check that the six video titles and destinations match the published videos.
- Add your own custom domain in GitHub Pages settings if you have one.
- If you use analytics, add your own measurement ID and privacy notice as appropriate.
- Consider adding a real `og:image` hosted in this repository or on your domain once the site URL is known. The current social preview uses the featured YouTube thumbnail.

## Notes

- YouTube thumbnails are loaded from `img.youtube.com`. A few videos may not provide a `maxresdefault.jpg`, so the cards use `hqdefault.jpg` for broad compatibility.
- The featured video only embeds after a visitor clicks play, using YouTube's privacy-enhanced `youtube-nocookie.com` domain.
- The map uses OpenStreetMap data and Leaflet. Map tiles and third-party resources are subject to their respective terms and availability.
- No backend, build step, API key or paid hosting service is required.
