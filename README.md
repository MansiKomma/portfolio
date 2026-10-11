# Mansi Komma — editorial portfolio

Vite + TypeScript, plain CSS, GSAP / ScrollTrigger / Flip, Lenis and SplitType. Fonts are self-hosted through Fontsource. The complete archive contains 44 real Drive items: 37 videos and 7 images.

## Playback and source of truth

The revised brief uses **Google Drive embeds**. Media remains on Drive. Opening a video creates one `drive.google.com/file/d/ID/preview` iframe; closing or changing it destroys that iframe and stops playback. Gallery cards use responsive Drive thumbnails. Every work has an “Open in Google Drive” fallback.

Drive is read-only. Build and sync never upload, edit, rename, move or delete anything there. No media download, local transcoding or poster generation is part of this version. Google Drive controls player features, buffering, cookies, bandwidth, video availability and embedding access. Keep the files shared for viewing. Hover clips and a muted autoplay montage require hosted video URLs, so this embed edition uses click-to-play.

## Run and build

Use Node 22+ and Python 3. Install dependencies with `npm ci`, then `npm run dev`. `npm run lint` checks TypeScript and `npm run build` emits the static `dist/` folder. Package versions are pinned in the lockfile. No UI framework is used.

## Re-sync Drive without downloading files

Install the listing dependency with `python -m pip install -r requirements.txt`, then run `npm run sync:drive`. It uses gdown's `skip_download=True` to refresh `src/data/drive-catalog.json`, then rebuilds `src/data/works.json`. Preserve the folder structure: each top-level folder becomes a category, and loose files become Other. A listing failure preserves the current catalog.

`npm run manifest` rebuilds from the saved listing offline. Thumbnail dimensions in `src/data/thumbnail-metadata.json` are browser-observed image dimensions, not invented project metadata. After adding new works, run `npm run dev` and `npm run probe` to refresh them. Unknown dimensions fall back to a square card until the thumbnail loads. The source images and videos are never saved locally by this probe.

An earlier partial download was stopped when the user changed the brief. Those untouched originals remain in the workspace's ignored `assets-raw/` folder and are absent from this project, its build, source repository and deployment.

## Edit content, colours and typography

Personal facts, biography, tool groups, employers, contact placeholders and social links live in **src/data/site.ts**. Add an email to enable the magnetic email link. Add social URLs to make the pending labels clickable. Confirm availability, role and dates before replacing the placeholders. The unprovided personal pitch and extra AI tools are marked TODO and do not render. No portrait or CV is shown because none was clearly identified.

Edit **src/styles/tokens.css** for the palette, spacing, type families and maximum width. Other styles are split into `base.css`, `components.css`, `sections.css` and the embed-specific `embed.css`. Fontsource imports are in `src/main.ts`; replace the imports and the display/body variables together. The accent is a sparing chartreuse on a warm neutral base, chosen after reviewing real thumbnails.

Work titles come from filenames with underscores and hyphens converted to spaces. Original labels and numbers are preserved. No descriptions, client relationships, project dates or awards are inferred. Category diversity determines the selected rows; the user can curate these further in `main.ts`.

## Deploy anywhere

- Vercel / Netlify: build command `npm run build`, output directory `dist`.
- GitHub Pages: set `BASE_PATH=/your-repository/` during `npm run build` and upload `dist` with a Pages workflow. All bundled asset paths respect Vite's base path. Drive URLs remain absolute.
- Update `site.origin` and the canonical / Open Graph URL in `index.html` to the actual production origin, then run `npm run manifest` and `npm run build` to regenerate the sitemap.
- Sites: `.openai/hosting.json` identifies the private Site and static `dist` output. Publication does not change Drive permissions.

The local Open Graph image is an HTML composition captured in the browser using the actual Clayco thumbnail and portfolio typography. Original media stays on Drive. JSON-LD uses real names, tool lists, titles, thumbnails and embed URLs; unknown video dates and descriptions stay absent.

## Verification

`npm run qa` uses Playwright at 390, 1024 and 1440px. It checks horizontal overflow, thumbnail loads, filters, lightbox navigation, iframe lifecycle, mobile menu, reduced motion, layout shifts and long animation frames. Screenshots and results go to `qa/`, which is ignored. For a system browser override set `PLAYWRIGHT_EXECUTABLE_PATH`; otherwise install Playwright Chromium. Browser-internal Drive keyboard events cannot be intercepted across origins; the close and previous/next controls remain outside the player.

See `processing-report.json` and `BUILD-REPORT.md` for category counts, assumptions and verification limits.
