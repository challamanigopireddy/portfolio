# Mani Gopi Reddy Challa - Portfolio

Static portfolio site. No build step, no dependencies. All content is rendered from `data/profile.json`.

## Structure
```
index.html          page shell
css/style.css       styles (light and dark themes)
js/app.js           reads data/profile.json and renders the page
data/profile.json   all your details: edit this to change the site
.gitlab-ci.yml      validates and deploys to GitLab Pages
Dockerfile          optional nginx container
```

## Run locally
```
python3 -m http.server 8080
# open http://localhost:8080
```
(Opening index.html directly will not work, because browsers block fetch() on file://.)

## Push to GitLab and deploy
```
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://gitlab.com/<username>/portfolio.git
git push -u origin main
```
The pipeline runs automatically. When it finishes, the site is live at
`https://<username>.gitlab.io/portfolio/` (Deploy > Pages in the project shows the exact URL).

## Other places to deploy
- Netlify / Vercel / Cloudflare Pages: import the GitLab repo, no build command, publish directory `.`
- Container: `docker build -t portfolio . && docker run -p 8080:80 portfolio`

## Updating content
Edit `data/profile.json` (name, summary, stats, skills, experience, certifications, contact) and push.
