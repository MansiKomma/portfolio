# Build report

Built a responsive editorial portfolio for Mansi Komma using Vite, TypeScript and plain CSS. The experience includes a first-visit loader, oversized serif hero, fixed navigation and mobile overlay, scroll-revealed introduction, a pinned More in Motion desktop gallery / mobile carousel followed directly by the category-filtered masonry archive, tool marquee, embedded media lightbox, about / experience / tools, contact placeholders and back-to-top. Lenis and GSAP are synchronized. Reduced motion removes smooth scrolling, parallax, pinning and the loader.

All work remains on Google Drive, as requested in the user's revised instruction. One video iframe exists at a time. Closing or changing work removes its player. Images use responsive Drive thumbnails with WebP and JPEG fallback. No original media is bundled with the website. Sync lists metadata only and never modifies Drive.

## Complete archive

| Drive category | Videos | Images | Total |
| --- | ---: | ---: | ---: |
| 3D/CGI | 3 | 0 | 3 |
| AI | 8 | 0 | 8 |
| Logo Animation | 3 | 0 | 3 |
| Long Form Video | 1 | 0 | 1 |
| Motion Graphics | 2 | 0 | 2 |
| Social Media | 20 | 0 | 20 |
| Static | 0 | 7 | 7 |
| **Total** | **37** | **7** | **44** |

The complete recursive Drive listing was checked twice. No category reached the 50-entry listing limit. All 44 thumbnails loaded successfully. All 37 video preview pages exposed a Play control. No files were skipped and no Google-native documents requiring manual export were found.

## Validation

- `npm run build` passes, including strict TypeScript checks and static SEO generation.
- Playwright screenshots at 390, 1024 and 1440px include hero, full page, work and lightbox views. No horizontal overflow, broken images or application errors were found.
- Filters return the correct counts and restore all 44 works. Lightbox arrows, Escape from the parent page, iframe removal, mobile menu and reduced motion were checked.
- Final mobile Lighthouse: **94 Performance / 100 Accessibility**, **0 CLS**, **2.7s LCP**. The requested 90+ performance score is met; the separate 2.5s LCP goal remains slightly unmet in the throttled test. Drive's remote thumbnail response adds latency.
- A few initialization / measurement tasks took 50–92ms in browser profiling. These are recorded rather than claiming guaranteed 60fps on every device. Pinning was changed to transforms, archive animation setup deferred, fonts preloaded, and thumbnail formats and sizes reduced.
- A real 1200×630 Open Graph image was captured from an HTML composition containing a Drive poster, with no original video download. Canonical URL, sitemap, robots and static Person / CreativeWork / VideoObject JSON-LD are included.

## Assumptions and deliberate adjustments

1. The newer request to embed Drive media replaces downloading / transcoding, local preview clips and the autoplay montage. Click-to-play is used because Google Drive owns its player and does not offer controllable muted hover previews through this iframe.
2. Top-level folders define the seven categories. Display casing is normalized; source filenames and file IDs remain recorded. Underscores and hyphens become spaces in titles, while original numbers and labels are retained.
3. Selected Work was removed at the user's request to shorten the page. More in Motion now appears directly before the collage archive. Original video resolution is unknown in embed mode, so layout dimensions are explicitly thumbnail measurements.
4. The stat counts archive pieces, rather than claiming 44 distinct commissioned projects or clients. Filenames do not prove client relationships.
5. No project dates are inferred from file modification times. Descriptions, client metadata and dates stay blank.
6. The biography uses only the supplied facts. Employer title and dates, email, social URLs, personal pitch, availability and extra AI tools are TODO fields in `src/data/site.ts`. Unprovided email / social links are shown as pending. The personal pitch and extra AI-tool placeholder do not render.
7. No portrait or CV is shown because no clearly identified portrait / CV exists in the listing. No location, clients, awards, testimonials or career dates were invented.
8. The warm cream / near-black palette is retained. Real poster colour samples are recorded in `palette-report.json`; chartreuse is used sparingly as the accent.
9. Intro words begin at 0.55 opacity instead of the requested 0.15 to keep readable contrast while retaining the scroll reveal. A complete screen-reader version is also provided.
10. The new Site is published privately for the owner. Its privacy setting does not change the public Drive permissions.

## Playback and access limits

Google Drive controls streaming, cookies, buffering, availability and embed access. Every item includes an “Open in Google Drive” fallback. Keep viewing permission enabled on the files. Keyboard shortcuts and swipe events inside the cross-origin player are handled by Drive; the portfolio's close / previous / next controls remain outside it. Escape and swipe navigation apply when focus / touch is on the portfolio surface.

The automated browser successfully loaded every video preview and its controls. An actual Play attempt on the sample Clayco embed returned “An unexpected error occurred” from Drive, and its nested player stayed paused. Full streaming is therefore **unverified in a normal browser**; preview availability must not be read as proof that all streams played. A visible “Open in Drive” fallback is retained. No Drive permission or media change was made to work around this external player error.

The earlier partial download was stopped immediately when the user changed the brief. It remains ignored in the workspace and is excluded from the source repository, source download and production build. Drive itself was never changed.

See `README.md` for metadata-only sync, changing content / fonts / colours and deployment to Sites, Vercel, Netlify or GitHub Pages.
