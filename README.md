# Aurelia — Private Dental Atelier

A single-page marketing site for **Aurelia**, a fictional private dental
practice in Marylebone, London. Built as a fast, dependency-light static site
designed to deploy on **GitHub Pages**.

---

## Project structure

```
aurelia-dental/
├── index.html              # The page (markup only — styles & scripts are external)
├── css/
│   └── styles.css          # All styling, including the design-token :root variables
├── js/
│   └── main.js             # Smooth scroll, scroll-reveals, nav, and ambient motion
├── assets/
│   ├── images/             # Photography, logos, favicons (see folder README)
│   └── fonts/              # Optional self-hosted fonts (see folder README)
├── .gitignore
├── .nojekyll               # Tells GitHub Pages to serve files as-is (skip Jekyll)
└── README.md               # This file
```

> **Note on the filename:** the page is named `index.html` so GitHub Pages
> serves it automatically at the root of your site. If you were previously
> using `aurelia.html`, this is the same file, renamed.

---

## Running locally

Because the page references files by relative path, opening `index.html`
directly with a `file://` URL works for most things but can trip up on a few
browser security rules. Running a tiny local web server is more reliable:

```bash
# From inside the aurelia-dental/ folder:

# Python 3
python3 -m http.server 8000

# …or Node, if you prefer
npx serve .
```

Then open <http://localhost:8000> in your browser.

---

## Deploying to GitHub Pages

1. **Create a repository** on GitHub and push this folder's contents to it:

   ```bash
   cd aurelia-dental
   git init
   git add .
   git commit -m "Initial commit: Aurelia dental site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

2. **Enable Pages:** in the repo, go to **Settings → Pages**.
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Set the branch to **`main`** and the folder to **`/ (root)`**, then **Save**.

3. **Wait ~1 minute**, then visit your site at:

   ```
   https://USERNAME.github.io/REPO/
   ```

That's it — no build step. The included `.nojekyll` file ensures GitHub Pages
serves every file and folder exactly as-is.

> **Custom domain (optional):** add a file named `CNAME` to the project root
> containing just your domain (e.g. `aurelia.dental`), then configure your DNS
> as described in GitHub's [custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## Things to customize before going live

The site ships with sensible placeholders. Search for these and replace them
with the real details:

| What | Where | Placeholder to replace |
|------|-------|------------------------|
| **WhatsApp number** | `index.html` (floating button **and** footer icon) | `442079460102` — international format, no `+`, no spaces. A comment in the file marks it. |
| **Facebook URL** | `index.html` (footer) | `https://www.facebook.com/` |
| **Instagram URL** | `index.html` (footer) | `https://www.instagram.com/` |
| **Phone / email / address** | `index.html` (contact section) | `020 7946 0102`, `hello@aurelia.dental`, `14 Wimpole Mews` |
| **Practice name & legal line** | `index.html` (footer) | `© 2026 Aurelia Dental Ltd …` |

The WhatsApp links also carry a pre-filled message
(*"Hi Aurelia, I'd like to book a consultation"*) — edit the `?text=` part of
the URL to change it.

---

## Tech & dependencies

- **HTML, CSS, vanilla JavaScript** — no framework, no build tooling.
- Loaded from CDN at runtime (no install needed):
  - [GSAP 3.12.5](https://gsap.com) + ScrollTrigger — scroll animations
  - [Lenis 1.1.13](https://github.com/darkroomengineering/lenis) — smooth scrolling
- Fonts: **Fraunces** + **Manrope**, via Google Fonts (self-hosting optional —
  see `assets/fonts/README.md`).

### Design system

All colours, shadows, radii, and easing live as CSS custom properties in the
`:root` block at the top of `css/styles.css`. Adjust those variables to
re-theme the whole site from one place — for example the signature gradient:

```css
--g1:#FF9A7A;  --g2:#FF6FA0;  --g3:#8B7BFF;   /* coral → pink → violet */
```

---

## Accessibility & motion

- All animation respects **`prefers-reduced-motion`** — visitors with that OS
  setting get a calm, static page (handled both in the CSS and in `main.js`).
- Interactive controls have visible focus states and descriptive
  `aria-label`s.
- The layout is responsive down to small mobile widths.

---

## License & content

The code structure is yours to reuse. The "Aurelia" name, copy, and details
are illustrative placeholder content for a demo site — replace them with your
own before publishing.
