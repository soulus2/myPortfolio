# Decision log

Format per CLAUDE.md §11. Check here before asking a question again.

## 2026-10-27 — Content management platform
Options considered: Sanity (hosted CMS, Studio embedded in the site), Payload CMS (self-hosted inside Next.js, Postgres + Blob), Git-based content folder + admin UI (Keystatic / Sveltia CMS), plain MDX folder
Chosen: Sanity, with Sanity Studio embedded in the site at `/admin`
Reason: Easiest bilingual publishing, including from a phone. Publishing is instant with no rebuild, drafts can be previewed live, and images go through Sanity's CDN. Lowest maintenance, and the Free plan covers a portfolio. Accepted trade-offs: content is hosted by Sanity (mitigated by weekly exports, and all queries are isolated in `src/content/`), and the Free plan has no native scheduled publishing (emulated with a `publishAt` field).

## 2026-10-27 — Budget
Options considered: $0 now and revisit at launch, free tiers only (always), up to ~$25/month, up to ~$60/month
Chosen: Free tiers only, always
Reason: Owner's choice. What follows from it:
- Vercel Hobby: non-commercial use only; cron at most once a day; 5K image transformations a month, so images are served from Sanity's CDN instead.
- Sanity Free plan.
- Scheduled posts appear within about an hour of their time, via cache expiry.
- A custom domain is the only remaining cost; it is decided at launch.

## 2026-10-27 — Video hosting
Options considered: Mux, YouTube embeds, YouTube + Mux hybrid, Cloudflare Stream
Chosen: YouTube embeds
Reason: Free, with extra reach. Videos load in privacy-enhanced mode (youtube-nocookie) behind a click-to-load facade for performance. EN/KA subtitles are managed on YouTube.

## 2026-10-27 — Visitor reactions and reviews
Options considered: reactions + moderated comments, reactions only, rating + short review (moderated), Giscus (GitHub Discussions)
Chosen: Emoji reactions with no login, plus comments that are shown only after the owner approves them
Reason: Low friction for visitors and full control for the owner. Spam protection comes from Cloudflare Turnstile and a Vercel WAF rate-limit rule.

## 2026-10-27 — Locale URL structure
Options considered: `/en` and `/ka` both prefixed; Georgian at root with `/en`; English at root with `/ka`
Chosen: Both prefixed. The bare `/` redirects using the remembered choice first, then the browser language.
Reason: Symmetric URLs, clean hreflang, and every page stays static and cacheable.

## 2026-10-27 — Missing-translation behaviour
Options considered: show the item with a notice, hide until translated, choose per item
Chosen: Show the item with a "not translated" notice.
- Untranslated text keeps the correct `lang` attribute.
- The canonical URL points to the original-language page.
- Fallback URLs are excluded from hreflang and the sitemap.
Reason: Every item is visible in both languages, without duplicate-content problems for SEO.

## 2026-10-27 — Slugs
Options considered: one Latin slug shared by both languages, localized slugs
Chosen: One Latin slug shared by both languages (e.g. `/en/work/gear-robot` and `/ka/work/gear-robot`)
Reason: One field to fill, the language switcher only swaps the prefix, and shared links stay readable.

## 2026-10-27 — Storage for comments and reactions
Options considered: all in Sanity, Sanity comments + Upstash Redis reactions, Neon Postgres for both
Chosen: All in Sanity.
- Comments are private documents (IDs `comment.<uuid>`) and are moderated in `/admin`.
- Reaction counters are separate documents.
- Only a display name is stored, with no email and no IP.
Reason: One admin and no extra service. A spike runs before building to verify how the Studio handles dotted IDs, whether webhooks fire for them, and whether token reads work.

## 2026-10-27 — Bilingual content model (Sanity)
Options considered: field-level (one document holding `en` and `ka` fields), document-level (one document per language)
Chosen: Field-level
Reason: Fits shared slugs and fallback-with-notice. Shared fields (dates, images, disciplines, progress) are entered once, and both languages publish together.

## 2026-10-27 — Site map: discipline pages
Options considered: separate pages with Design and 3D split, separate pages with Design + 3D combined, one long page with sections
Chosen: Separate pages with Design and 3D split: `/engineering`, `/it`, `/computer-science`, `/design`, `/3d`, `/startups`
Reason: Matches the six world concepts in CLAUDE.md §5.2, and gives 3D its own page with an interactive model gallery. This replaces the combined `/design` entry in the CLAUDE.md §4 draft.

## 2026-10-27 — i18n library
Options considered: next-intl, Next.js routing + custom dictionaries, Paraglide JS
Chosen: next-intl
Reason: Mature and built for the App Router and Server Components, and its docs cover the Next.js 16 `proxy.ts` setup. It provides locale routing, localized navigation helpers, ICU messages and typed message keys.

## 2026-10-27 — Styling
Options considered: Tailwind CSS v4, CSS Modules, vanilla-extract
Chosen: Tailwind CSS v4
Reason: Design tokens are CSS variables (via `@theme`), so re-theming each discipline world is simple. vanilla-extract was ruled out because its Next.js plugin reportedly doesn't work with Turbopack.

## 2026-10-27 — Package manager
Options considered: pnpm, npm, bun
Chosen: pnpm
Reason: Fast and disk-efficient, and its strict dependency resolution catches missing dependencies early. Vercel detects it automatically.

## 2026-10-27 — Light/dark theme
Options considered: follow system (design light first), follow system (design dark first), light by default, dark by default
Chosen: Follow the visitor's system setting, with a toggle that remembers the choice; light is designed first and dark is derived from the same tokens
Reason: Light-first suits the "lots of whitespace, strong typography" direction in CLAUDE.md §5.1.

## 2026-10-27 — Fallback language for detection
Options considered: English, Georgian
Chosen: English. When the browser language is neither `en` nor `ka`, `/` redirects to `/en`.
Reason: English is understood by most international visitors. Georgian-language browsers still land on `/ka` automatically.

## 2026-10-27 — Quality tooling
Options considered: full set (Zod, Vitest, Playwright + axe, Dependabot), only Zod + Dependabot with tests added later
Chosen: Full set. Zod handles env and input validation, Vitest the unit tests, Playwright + axe-core the end-to-end and accessibility checks in both languages, and Dependabot the security-update PRs once the GitHub repo exists.
Reason: Catches i18n and accessibility regressions from day one.
