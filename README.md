# AI for Math Workshop @ ICML 2026 — Website

**3rd AI for Math Workshop: Toward Self-Evolving Scientific Agents**

Website for the AI for Math workshop at ICML 2026, held on July 10, 2026.

## Deploying to GitHub Pages

1. Create a new public GitHub repository (e.g., `ai4math-icml2026`)
2. Push the contents of `website/` as the root of the repo:
   ```bash
   cd website
   git init
   git add .
   git commit -m "Initial website"
   git remote add origin https://github.com/YOUR_ORG/ai4math-icml2026.git
   git push -u origin main
   ```
3. Go to **Settings > Pages** in the GitHub repo
4. Set **Source** to `Deploy from a branch`, branch `main`, folder `/`
5. The site will be live at `https://YOUR_ORG.github.io/ai4math-icml2026/`

## Updating Content

### Add Speaker Photos
Place photos in `assets/images/speakers/` with filenames matching the `<img src>` in `index.html`:
- `jia_li.jpg`
- `dawn_song.jpg`
- `emily_first.jpg`
- `yinya_huang.jpg`
- `joseph_tooby_smith.jpg`
- `sorrachai.jpg`
- `siyuan_guo.jpg`

Recommended size: 400×400px, square crop, JPG/WebP.

### Add Organizer Photos
Place photos in `assets/images/organizers/`:
- `haocheng_wang.jpg`
- `kun_xiang.jpg`
- `xiaodan_liang.jpg`
- `zhizhen_qin.jpg`
- `donghoon_hyeon.jpg`
- `bartosz_piotrowski.jpg`
- `leni_aniva.jpg`
- `zhijiang_guo.jpg`

### Update Key Dates
Edit the dates sections in `index.html` when deadlines change.

### Add Accepted Papers
Add a new section to `index.html` after the schedule section, listing accepted papers.

### Update Challenge Links
Replace `https://www.codabench.org/` with actual competition URLs when available.

### Update OpenReview Link
Replace the OpenReview placeholder `href="https://openreview.net"` with the actual venue URL.

## Structure

```
website/
├── index.html          # Main single-page site
├── assets/
│   ├── css/
│   │   └── style.css   # All styles
│   ├── js/
│   │   └── main.js     # Navigation, animations
│   └── images/
│       ├── speakers/   # Speaker headshots
│       └── organizers/ # Organizer headshots
└── README.md
```

## Local Preview

Simply open `index.html` in a browser — no build step required.
For a local server (avoids some browser restrictions on local files):

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```
