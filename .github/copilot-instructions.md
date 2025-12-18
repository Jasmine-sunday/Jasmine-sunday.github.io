# Copilot instructions — Jasmine-sunday.github.io

Purpose
- Help an AI coding agent get immediately productive on this repository: a small static personal website (GitHub Pages) built with plain HTML, CSS and a little inline JS.

Big picture
- Structure: root HTML pages (`index.html`, `portfolio.html`, `about.html`), a `css/` folder for global + page-specific styles, `images/` and `certificates/` for assets. There is no build tool, templating engine, or backend—pages are edited directly.
- Deployment: intended for GitHub Pages. Keep `index.html` at repo root.

Important patterns & conventions
- Header / nav are duplicated per page (no layout template). When updating site-wide content (logo, contact), edit every HTML page.
- CSS split: `css/general.css` contains shared styles; page-specific files are `css/home.css`, `css/portfolio.css`, `css/about.css`.
- Portfolio items follow the `article.project-card` pattern. Example structure: `article.project-card` (optional `reverse` class), an `<img>` and a sibling `.project-content` block.
- Before/after slider: implemented in `portfolio.html` inside `.before-after-container`; it uses a range `<input class="slider">` and a CSS custom property `--position` set by inline JS.
- Third‑party libs are included via CDN in HTML files: Bootstrap (only in `about.html`) and Swiper (used in `index.html` with `new Swiper(...)`). Keep versions consistent or update both CSS/JS inclusions together.
- Asset references use relative paths (e.g. `images/`, `certificates/`). Be careful with filenames that contain spaces when linking; prefer dash/underscore for new files.
- Accessibility hints present (aria attributes on slider). Preserve or enhance ARIA roles when editing components.

Local dev & debug tips
- No build step. To preview pages locally either:
  - Use VS Code Live Server extension (recommended), or
  - Serve a simple HTTP server from the repo root: `python -m http.server 8000` (Windows: `py -m http.server 8000`) and open `http://localhost:8000`.
- Debugging: open developer console to check for CDN or asset 404s. Use browser responsive mode to validate mobile layout and Swiper/bootstrap components.

Testing & checks
- Manual visual checks: page load, nav active link, images load, responsive breakpoints. Confirm external links use `target="_blank"` as needed.
- There are no automated tests or CI. If you add tests/linters, document commands in `README.md` and update these instructions.

Editing guidelines
- When adding a new page: create the HTML in root, include shared header and nav markup copied from other pages, add a page-specific CSS file under `css/`, and update nav links.
- When changing site‑wide elements (header, footer, nav) update all HTML pages—no template engine present.
- When adding JS behavior: prefer small inline scripts at the bottom of the page (current pattern). For larger scripts consider adding a `js/` folder and reference it from pages.

Who to ask / notable files
- Quick references: `index.html`, `portfolio.html`, `about.html`, `css/general.css`, `css/portfolio.css`, `certificates/`.

If anything in these notes is unclear or you want more specific examples (e.g., adding a new project card or converting header to a shared include), tell me what to expand and I'll iterate.  