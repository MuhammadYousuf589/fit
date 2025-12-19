# Demo Frontend App — GitHub Pages Deployable

This repository contains a frontend-only demo app (HTML/CSS/vanilla JS) that simulates backend behavior using `localStorage`. The site is placed in the `docs/` folder so it can be published via GitHub Pages.

What is included

- `docs/index.html` — Login / Signup page
- `docs/dashboard.html` — Dashboard with profile and items (CRUD)
- `docs/style.css` — Styles
- `docs/app.js` — All application logic; simulates backend using `localStorage`

Why this works on GitHub Pages

GitHub Pages serves static files (HTML/CSS/JS). It cannot run server-side code (Node, databases). The app simulates server behavior entirely in the browser using `localStorage`, so it runs correctly when served as static files.

Quick deploy (manual)

1. Commit and push your repo to GitHub (example):

```powershell
git add .
git commit -m "Add frontend demo for GitHub Pages"
git push origin main
```

2. Open your repository on GitHub → Settings → Pages.
3. Under "Source", choose "Deploy from a branch" and select `gh-pages` branch (if using the provided workflow) or choose `main` branch and folder `docs/` to publish directly.

Automated deploy (recommended)

This repo includes a GitHub Actions workflow that automatically deploys the `docs/` folder to the `gh-pages` branch on pushes to `main`. If you keep the default workflow, push to `main` and GitHub Actions will publish the site.

Local preview

Serve the `docs/` folder locally to test:

```powershell
# Using Python
Set-Location 'C:\Users\sukku\Music\create demo\docs'
python -m http.server 8000
# then open http://localhost:8000
```

or with npx http-server:

```powershell
Set-Location 'C:\Users\sukku\Music\create demo'
npx http-server ./docs -p 8000
```

Notes and next steps

- If you want real server behavior (authentication, database), deploy a backend (e.g., Heroku, Vercel, AWS) and change `app.js` AJAX calls to talk to that API.
- You can customize the GitHub Actions workflow to publish from a different branch or build step.
# fitness_tracker

## GitHub Pages (host the static site)

This repository contains a static front-end in the `public/` folder. To host the site with GitHub Pages we copy the site into the `docs/` folder and configure GitHub Pages to serve from `main` / `docs`.

Steps to publish:

- Commit the new `docs/` folder (created locally by the project helper).
- Push to your GitHub repository `main` branch.
- In the GitHub repository UI go to: `Settings` → `Pages` → `Build and deployment`.
	- Under `Source`, select `Branch: main` and `Folder: /docs` then click `Save`.
	- Wait a minute and your site will be available at `https://<your-username>.github.io/<repo-name>`.

Quick commands (from repository root):

```powershell
git add docs README.md
git commit -m "Add docs for GitHub Pages"
git push origin main
```

If you prefer automatic deployment via GitHub Actions (deploy to `gh-pages`), I can add a workflow for that — tell me if you want it.

Notes:
- We added `docs/.nojekyll` so GitHub Pages won't process files with Jekyll.
- The `app.js` is a Node server and won't be used by GitHub Pages — GitHub Pages serves static files only.

If you want, I can also create a GitHub Action to deploy `public/` automatically to `gh-pages` branch.
# fitness_tracker
