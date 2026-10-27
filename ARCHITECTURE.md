# Portfolio: Website Architecture & Content Platform Plan

> Approved on 2026-10-27. Later decisions are logged in [DECISIONS.md](DECISIONS.md), which wins wherever the two differ.

## Context

The repo is still empty: it holds only `CLAUDE.md`, the project brief. You asked for (1) the full website architecture and (2) a plan for the content management platform. Per CLAUDE.md §0, every open choice was put to you. The 12 decisions below are settled, so this plan builds on them. Anything still open is listed as a **gate** at the start of the phase that needs it. Library versions and pricing were checked against current docs on 2026-10-27; sources are at the bottom.

**Outcome:** a blueprint ready to build. Executing it starts with Phase 0, which records the decisions, and then Phase 1, the foundation.

## Decisions made on 2026-10-27 (to copy into `DECISIONS.md` in Phase 0)

| # | Topic | Chosen | Main alternatives |
|---|---|---|---|
| 1 | Content platform | **Sanity**, with Studio embedded at `/admin` | Payload, Git-based + admin UI, plain MDX |
| 2 | Budget | **Free tiers only, always** | $0 now then revisit, ~$25/mo, ~$60/mo |
| 3 | Video hosting | **YouTube embeds** | Mux, YouTube + Mux hybrid, Cloudflare Stream |
| 4 | Visitor feedback | **Emoji reactions + comments shown after your approval** | reactions only, rating + review, Giscus |
| 5 | Locale URLs | **`/en/...` and `/ka/...` both prefixed**; `/` redirects | ka at root, en at root |
| 6 | Missing translation | **Show the item with a "not translated" notice**; canonical points to the original language | hide until translated, choose per item |
| 7 | Slugs | **One Latin slug shared by both languages** | localized slugs |
| 8 | Comments/reactions storage | **All in Sanity**: private docs, moderated in `/admin` | Upstash for reactions, Neon Postgres |
| 9 | Bilingual model | **Field-level**: one document with `en` and `ka` fields | one document per language |
| 10 | Site map | **Separate pages; Design and 3D split** (`/design`, `/3d`) | combined Design + 3D, one long page |
| 11 | i18n library | **next-intl** | custom dictionaries, Paraglide |
| 12 | Styling | **Tailwind CSS v4** (v4.3 line) | CSS Modules, vanilla-extract |

## Constraints that follow from these decisions

- **Vercel Hobby is for non-commercial use only.** Vercel counts "advertising the sale of a product or service" as commercial. A "hire me" call to action or a "hire" topic on the contact form could fall under that. The wording is your call at the Contact-page gate.
- **Hobby limits shape the design:**
  - 5K image transformations a month. All CMS images are therefore served by Sanity's image CDN through a custom `next/image` loader, and Vercel never optimizes them.
  - Cron jobs can run at most once a day. Scheduled publishing therefore uses cache expiry instead of cron.
  - One WAF rate-limit rule per project.
  - 200K ISR writes, 1M function invocations, 4 h of active CPU and 100 GB of transfer a month.
  - The GitHub repo must be on your **personal account**: Hobby projects cannot connect to repos owned by a GitHub organization.
- **Sanity Free plan:**
  - 20 seats, 10k documents, 250k API requests and 1M CDN requests a month, 100 GB of assets.
  - 2 datasets, and both must be public-read. Drafts and documents whose ID contains a dot stay private.
  - No native scheduled publishing and no AI Assist.
  - Requests are **blocked** at the limit rather than billed. Published reads therefore go through the CDN, and Next.js caching means Sanity is only hit when a page revalidates.
- **Vercel functions accept at most 4.5 MB per request body.** Every upload goes straight from the browser to Sanity through the Studio; the site never proxies files.
- **A custom domain is the one unavoidable cost** (roughly $10–40 a year). Without one, the site stays on `*.vercel.app`. This is decided at Launch.

## 1. System overview

```
 Visitor ──► Vercel CDN ──► Next.js 16 app (App Router · RSC · Cache Components)
                             ├─ /[locale]/*   static pages, en + ka (revalidated live)
                             ├─ /admin        embedded Sanity Studio (members only)
                             └─ /api/*        draft-mode · revalidate · reactions · comments
                                   │
          ┌────────────────────────┼─────────────────────────────┐
          ▼                        ▼                             ▼
 Sanity Content Lake        YouTube (nocookie,          Cloudflare Turnstile (spam)
 dataset "production"       click-to-load facade)       Vercel WAF (1 rate-limit rule)
 ├─ content docs   → CDN API (public read)
 ├─ comment.* docs → token-only (private path)
 └─ assets: images → image CDN · GLB/PDF → file CDN
```

**Core principle:** the code is server components by default. `src/content/` is the **only** code that knows about Sanity, because pages consume typed domain objects. GROQ queries stay in one place, and the CMS could be swapped later without touching any page.

## 2. Stack

These versions were checked on 2026-10-27; re-check at scaffold time. Next.js shipped security releases in July, August, September and October 2026, so pin to the latest patch.

- **Next.js 16.4.x:** App Router, React 19.x, Turbopack, `proxy.ts` (the file formerly called `middleware.ts`), Cache Components (`'use cache'`, `cacheTag`, `cacheLife`). Requires Node ≥ 20.9.
- **next-intl:** routing through `defineRouting` / `createMiddleware` in `src/proxy.ts`, `createNavigation`, and `next/root-params`, which needs Next ≥ 16.3.
- **Tailwind CSS v4.3:** tokens are defined as CSS variables through `@theme`, and each world overrides them.
- **Sanity:**
  - Studio embedded through `next-sanity` v13 (`NextStudio`).
  - Live updates with `defineLive` (`sanityFetch` and `<SanityLive>`).
  - Visual editing with the Presentation tool and `<VisualEditing>`.
  - Supporting packages: `@sanity/image-url`, `@portabletext/react`, `@sanity/code-input`.
  - Types generated by Sanity TypeGen.
- **Cloudflare Turnstile:** free, used for comment spam protection.
- **Gated (decided in a later phase):** package manager, validation library (CLAUDE.md suggests Zod), test tools, animation library, 3D library, fonts, analytics.

## 3. Repository layout

This is a proposal; approving this plan approves it.

```
src/
  app/
    [locale]/                  root layout A: <html lang>, fonts, theme, shell, WorldStage, <SanityLive>
      page.tsx  layout.tsx  not-found.tsx  error.tsx
      about/ skills/ now/ future/ contact/
      work/ work/[slug]/
      engineering/ it/ computer-science/ design/ 3d/ startups/
      blog/ blog/[slug]/ blog/rss.xml/route.ts
      vlog/ vlog/[slug]/ vlog/rss.xml/route.ts
      styleguide/              dev-only (notFound() in production)
    admin/[[...tool]]/         root layout B: NextStudio only (no SanityLive, no site shell)
    api/
      draft-mode/enable/route.ts   draft-mode/disable/route.ts
      revalidate/route.ts      Sanity webhook backstop (signature-verified)
      reactions/route.ts       GET counts · POST react
      comments/route.ts        POST comment (Turnstile)
    sitemap.ts  robots.ts  manifest.ts
  proxy.ts                     next-intl locale routing; skips /admin, /api, static files
  i18n/        routing.ts request.ts navigation.ts
  messages/    en.json ka.json             UI strings only (no content)
  content/                     domain layer, the only importer of Sanity clients
    types.ts                   Project, Post, Vlog, Skill, Event, Startup, Goal, Localized<T>
    queries/                   GROQ via defineQuery (typed by TypeGen)
    api.ts                     getProjects(locale, filter), getPost(slug, locale), …
    localize.ts                fallback resolution → { value, lang, isFallback }
    portable-text/             block → React component map
  sanity/                      Studio code
    schemaTypes/{documents,objects}/  structure.ts  actions/  badges/  components/
    client.ts  live.ts  image.ts  env.ts
  features/
    worlds/                    WorldStage, scheduler, one module per world
    video/                     YouTube facade player
    model-viewer/              GLB viewer (library gated)
    interactions/              reactions + comments UI and server logic
  components/{ui,layout}/   lib/{env,seo,jsonld,dates,turnstile}.ts
  styles/globals.css           Tailwind v4 @theme tokens + [data-world] overrides
sanity.config.ts  sanity.cli.ts  DECISIONS.md  .env.example
```

There are two root layouts, `[locale]` and `admin`. This keeps the Studio out of the site shell and out of `<SanityLive>`, which next-sanity requires.

## 4. Rendering, caching and data flow

- **Static by default.** Every page is prerendered for both locales and every slug, using `generateStaticParams` with next-sanity's cached static-params helper.
- **Fetching:**
  - `sanityFetch` runs inside next-sanity's shared `'use cache'` wrapper, which sets cache tags itself and uses a long default lifetime.
  - Metadata and the sitemap use the cached metadata helper.
  - Do not put `'use cache'` on pages or layouts that await `params`.
- **Live publishing:**
  - `<SanityLive>` sits in the `[locale]` layout. A publish in the Studio revalidates the affected tags within seconds, with no rebuild. The Live Content API works on all plans and replays missed events for 15 minutes.
  - **Backstop:** a Sanity GROQ webhook calls `/api/revalidate`, which verifies the signature and then revalidates the tag. Phase 3 checks whether the backstop is actually needed.
- **Scheduled publishing, emulated for free:**
  - Every publishable document has a required `publishAt` field.
  - Date-dependent queries (lists, feeds, sitemap, detail pages) filter on `publishAt <= $now`, with `$now` rounded to the hour, and use an hourly `cacheLife`.
  - A future-dated item therefore appears within about an hour of its time. The Studio shows a "Scheduled" badge.
- **Draft preview:**
  1. The Presentation tool in the Studio calls `/api/draft-mode/enable`, built with next-sanity's `defineEnableDraftMode`.
  2. The site renders the drafts perspective with `<VisualEditing>` click-to-edit overlays and a visible "Preview" banner.
  3. Next.js bypasses its cache while draft mode is on.
- **Images:**
  - A Sanity image URL builder feeds a custom `next/image` loader (width, quality, `auto=format` for AVIF/WebP).
  - The blur placeholder comes from the LQIP in the asset metadata, and crop/hotspot set in the Studio are respected.
  - This costs no Vercel image quota.
- **Dynamic islands only:** reaction counts, the comments list, the comment form, world canvases, the video player, the 3D viewer, the theme and locale switchers, and later the ⌘K palette.

## 5. Internationalization

- **Routing:**
  - next-intl with `localePrefix: 'always'` and locales `['en', 'ka']`.
  - On `/`, the proxy picks the language: the `NEXT_LOCALE` cookie first, then `Accept-Language`, then the default locale.
  - The switcher swaps only the prefix, because the slug is shared.
- **UI strings** live in `messages/{en,ka}.json`, with keys typed through next-intl's `AppConfig` augmentation. Components contain no hard-coded text.
- **Content model:** fields typed `Localized<T> = { en?: T; ka?: T }`. `localize.ts` returns the value along with the language actually used.
- **Fallback rendering:**
  - Wrap fallback text in `lang="en"` or `lang="ka"` so screen readers and fonts behave.
  - Show the "not yet translated" notice from the message files.
- **SEO for fallback pages:**
  - The canonical URL points to the original-language page.
  - Fallback URLs are left out of hreflang and the sitemap.
  - When both translations exist, emit `alternates.languages` with `en`, `ka` and `x-default`.
- **Dates and numbers:** next-intl's formatter on top of `Intl` gives Georgian month names (`ka-GE`).
- **Georgian typography:** Tailwind's `uppercase` must never reach Georgian text, because it turns into Mtavruli. Use a `caps` utility scoped to `:lang(en)`. Layouts are tested with the longer Georgian strings.

## 6. Content model (Sanity, field-level bilingual)

This is a draft. Per CLAUDE.md §6.1, the full field list is shown to you before implementation, at the Phase 3 gate.

- **Localized primitives:**
  - `localeString`, `localeText` and `localeBody` (Portable Text per language), each holding `{ en, ka }`.
  - One custom input shows EN and KA side by side, with a "copy from EN" button.
  - Images carry `alt: localeString`. §9 requires alt text in **both** languages; if that blocks quick English-only posts, ka alt can be relaxed to a warning (your call at the gate).
- **Fields shared by publishable documents:**
  - `title`, `slug` (shared and Latin, generated from the EN title, unique per type), `summary`, `body`.
  - `cover` (a figure), `publishAt`, `featured`, `tags`.
  - `seo { title, description, ogImage }`.
  - Translation status is computed, not stored.
- **Documents:**
  - `project`: §6.1 fields plus `updates[] {date, text, progress}`, `models3d[]`, `videos[]` (YouTube), and links to skills, posts and events.
  - `post` (`type`: article | blog), `vlog` (YouTube id, chapters, related projects), `event`, `startup`, `skill` (optional `levelHistory[]` for the roadmap idea), `goal`.
  - `discipline`: six fixed documents for the world pages' intro text, featured items and accent.
- **Singletons:** `siteSettings` (identity, socials, CV PDF per locale, default OG image), `homePage`, `aboutPage` (story + timeline), `nowPage`.
- **Body blocks:** `figure`, `gallery`, `youtube`, `model3d` (GLB + poster + alt + camera preset), `codeBlock`, `callout`, `beforeAfter`, `quote`, `embed` (allow-listed hosts), `caseStudySection` (Problem / Process / Result).
- **Interactions** (see §8):
  - `comment` documents with ID `comment.<uuid>`, so they are private.
  - `reactionCounter` documents with ID `reactions-<docId>`, public-read and hidden from the Studio menus. Counts aren't sensitive, and CDN reads save API quota.
- **Gated details:** tags as plain strings or as documents; project updates embedded (current proposal) or as separate documents.

## 7. Content platform plan (Studio = the admin)

- **Location and access:**
  - `/admin` is embedded through `NextStudio`, marked `noindex`, and excluded from the proxy and the sitemap.
  - Login is handled by Sanity: only invited project members can get in, and the site has no admin-auth code.
  - Sanity CORS allows only `http://localhost:3000` and the production origin. Wildcard `*.vercel.app` stays off, because credentialed wildcard origins are a data-leak risk.
- **Desk structure:**
  - Content by type: Projects (In progress, Completed, Concept, Paused), Posts (Articles, Blog), Vlogs, Events, Startups, Skills (by discipline), Goals.
  - **Pages** (the singletons and the 6 disciplines).
  - **Translations**: "Missing Georgian" and "Missing English" lists.
  - **Scheduled** (`publishAt > now()`).
  - **Moderation** (Pending, with a count, then Approved and Rejected/Spam).
- **Badges:**
  - Translation status, e.g. `EN ✓ · KA –`.
  - Scheduled or Live.
- **Document actions:**
  - Comments get Approve, Reject and Spam.
  - Publishable documents get "Open preview" through Presentation.
- **Publishing workflow:**
  1. Create the document; the draft autosaves privately.
  2. Write EN and/or KA side by side; the badge shows what's missing.
  3. Preview in Presentation (the real site in draft mode, either locale).
  4. Set `publishAt` (now or in the future), then Publish.
  5. Live in seconds, or within about an hour after a future `publishAt`.
  - The whole flow works in a mobile browser, which is a Phase 3 acceptance test.
- **Media:**
  - **Images:** uploaded browser→Sanity, with hotspot/crop and required alt text.
  - **GLB models:**
    - Optimized locally before upload with a script (tooling gated at the 3D phase), aiming for ≤ ~10 MB.
    - A poster image is required, and the viewer lazy-loads.
  - **YouTube:** a custom input takes a URL, extracts the ID and shows the thumbnail.
    - The title and thumbnail come from oEmbed, which needs no key.
    - Duration needs either a free Data API key or manual entry (gated in Phase 6).
    - EN/KA subtitles live on YouTube. The player passes `cc_lang_pref` and `hl` for the current locale.
  - **Short silent loops** (optional): small MP4/WebM file assets for case-study clips.
  - **CV PDFs:** file assets.
- **Schemas as code:**
  - Schemas live in `src/sanity/schemaTypes/` and change through PRs.
  - `sanity typegen generate` types every query.
  - The Studio is part of the site, so a site deploy is also a Studio deploy.
- **Datasets:** `production` holds all real content; drafts give the safety net. The second free dataset is reserved for rehearsing schema migrations.
- **Backups and portability:**
  - A weekly GitHub Actions job runs `sanity dataset export production` and keeps the result as an artifact. The free tier allows 2,000 minutes a month on private repos.
  - Because GROQ lives only in `src/content/`, leaving Sanity would mean rewriting one folder.
- **Secrets:**
  - Server-only, stored in Vercel and `.env.local`, all listed in `.env.example`: `SANITY_API_READ_TOKEN` (Viewer: drafts and private docs), `SANITY_API_WRITE_TOKEN` (Editor, used only by `/api/reactions` and `/api/comments`), `SANITY_WEBHOOK_SECRET`, `TURNSTILE_SECRET_KEY`.
  - Public: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_SITE_URL`.
  - The `server-only` package guards the token modules.

## 8. Interactions (reactions + moderated comments, all in Sanity)

- **Reactions** (👍 ❤️ 🔥):
  - `POST /api/reactions` validates input, then runs a transaction: `createIfNotExists` followed by `patch().inc()`.
  - The client marks a reacted emoji in localStorage, so there is one reaction per visitor per emoji.
  - Counts are fetched by a small island from `GET /api/reactions?id=`, which is CDN-cached for about 60 s, so pages stay static.
  - Known trade-off: a determined bot could inflate counts up to the rate limit. That's acceptable for a portfolio.
- **Comments:**
  - `POST /api/comments` runs input validation, Turnstile verification, a honeypot and a minimum fill time, plus length and link-count limits.
  - It then creates `comment.<uuid>` with `{ target ref, locale, name, body, status: 'pending', createdAt }`. **No email and no IP are stored.**
  - Comments are rendered as plain text, and links are not auto-linked.
  - A short notice under the form tells visitors their comment is shown after approval.
- **Moderation:** Approve in the Studio, which fires a webhook. `/api/revalidate` then refreshes the target's comments tag. Approved comments are read server-side with the read token and cached by tag.
- **Abuse protection:** the single free WAF rate-limit rule covers `POST /api/(reactions|comments)`, counted per IP, for example 20 requests per 60 s, answering 429.
- **Spike first** (start of Phase 7). Verify three things:
  - (a) the Studio lists and edits dotted-ID documents;
  - (b) webhooks fire for them;
  - (c) token reads work.
  - If (a) fails, a custom Moderation tool in the Studio queries them directly.

## 9. Discipline worlds (front-end architecture)

- **WorldStage:** mounted once in the `[locale]` layout, fixed behind the content, so it persists across navigations. The current world comes from the route segment and sets `data-world`, which swaps the CSS tokens. This lets worlds **morph** instead of hard-cutting; whether that uses View Transitions or an animation library is gated in Phase 5.
- **Each world module exports:**
  - a static SVG `Poster`, server-rendered and LCP-safe;
  - a lazily loaded engine: client-only dynamic import, started after idle on capable devices.
- **Shared scheduler:**
  - One requestAnimationFrame loop.
  - Pauses when the tab is hidden or the stage is off-screen (IntersectionObserver).
  - An FPS cap per device tier.
  - `prefers-reduced-motion` shows the poster only.
  - Device tier (full / lite / static) is judged from cores, memory, `saveData`, coarse pointer and WebGL support. The fallback strategy is confirmed at Phase 5 (§5.3).
- **Readability:**
  - A per-theme scrim token, with optional blur.
  - Contrast is checked over the posters in automated accessibility tests.
- **Worlds:** seven modules: home (morph), engineering, it, computer-science, design, 3d, startups. They are built **one at a time**, each shown to you before the next. `/3d` hosts the interactive GLB gallery.

## 10. SEO, feeds, OG images

- **Metadata:**
  - `generateMetadata` on every page, using messages plus content `seo` fields.
  - Canonical and hreflang rules as in §5.
- **Sitemap and robots:**
  - `sitemap.ts` covers both locales with alternates and leaves out fallback-only and future-dated URLs.
  - `robots.ts` disallows `/admin` and `/api`.
- **JSON-LD:** Person (home/about), CreativeWork (projects), BlogPosting (posts), VideoObject (vlogs: thumbnail, uploadDate, duration, embedUrl), Event.
- **RSS** per locale for blog and vlog (`/[locale]/blog/rss.xml`, `/[locale]/vlog/rss.xml`), with an hourly cache.
- **OG images:** `opengraph-image.tsx` per route using `next/og`, with a bundled Georgian-capable TTF so Georgian titles render.

## 11. Security

- Studio access is handled by Sanity, and `/admin` is `noindex`.
- Secrets stay server-only, and environment variables are validated at boot in `src/lib/env.ts`.
- Webhook signatures are verified with `@sanity/webhook`.
- Draft mode is enabled only through a validated preview secret.
- Every write endpoint has input validation, Turnstile, the WAF limit and a honeypot.
- In the Polish phase:
  - CSP allows only youtube-nocookie, the Sanity CDNs and Turnstile.
  - Security headers: `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`.
- Proposed: Dependabot (free) keeps Next.js patched, since 2026 has had monthly security releases. Confirmed at the Phase 1 gate.

## 12. Build phases (each phase is confirmed before it starts; gates are asked first)

| Phase | Gate questions (asked first) | Work | Done when |
|---|---|---|---|
| 0 Record | – | Create `DECISIONS.md` with the 12 entries; **you** create a GitHub repo on your personal account and a Sanity account | Decisions logged |
| 1 Foundation | package manager, validation library, test tools, fallback locale for detection, default theme, Dependabot | Scaffold Next 16.x (TS strict) with Tailwind v4, ESLint and Prettier; next-intl + `proxy.ts`; `[locale]` layout and shell (nav, footer, locale switcher, theme toggle); `.env.example`; deploy the empty site to Vercel Hobby; fill in CLAUDE.md §15 commands | `/en` and `/ka` live on Vercel; switcher keeps you on the page |
| 2 Design system | fonts (Georgian + Latin pairing, licences), colours, per-world accents | Tokens, type scale, spacing, components, `[data-world]` themes, dev-only `/styleguide` | You approve the styleguide |
| 3 Content platform | **full schema field list**, ka-alt strictness, tags format | Sanity project and dataset, schemas, Studio at `/admin`, desk structure, side-by-side inputs, badges, Presentation and draft mode, `<SanityLive>` + webhook backstop, TypeGen, image loader, bilingual seed content, backup workflow, `src/content/` API | Publish from your phone; preview a draft; missing-KA badge and site notice show; a future-dated post appears within ~1 h |
| 4 Core pages | contact delivery (store in Sanity + optional free notification), "hire" wording vs Hobby terms, CV download | Home, About, Skills, Now, Future, Work with filters, case study template, Contact | Both locales; 360–1440 px |
| 5 Worlds | animation library, 3D library, device fallback, transition approach | WorldStage + scheduler, then one world at a time | Each world approved; reduced-motion and lite versions work |
| 6 Blog & vlog | YouTube metadata (oEmbed + manual duration vs free API key) | Posts, Portable Text blocks, RSS, YouTube facade player, chapters, VideoObject | Feeds validate; player passes accessibility checks |
| 7 Interactions | – | Spike (§8), reactions, comments, moderation, WAF rule, Turnstile | Pending comments are invisible until approved |
| 8 Startups & events | timeline style (idea #7) | Startups, events, timeline | – |
| 9 Polish | which §10 ideas go in | Transitions, CSP, accessibility audit, performance pass, OG images | Lighthouse mobile ≥ 90, LCP < 2.5 s, CLS < 0.1 |
| 10 Launch | domain (paid), analytics (Vercel Web Analytics free: 50K events/mo, or none) | §13 checklist | Checklist green |

## 13. Verification

- **Each phase:** the acceptance criteria in the "Done when" column, and lint, typecheck and tests clean. The exact commands are added to CLAUDE.md §15 in Phase 1.
- **Local:**
  - Run the dev server through `.claude/launch.json` and check it in the built-in browser pane.
  - Check both locales at 360, 768, 1024 and 1440 px, in light and dark, with reduced motion emulated.
  - Test the locale switcher, the fallback notice and the canonical tag.
- **Content platform:**
  1. Create an EN-only post and confirm the KA page shows the notice, with the canonical pointing to EN.
  2. Add KA and confirm the notice disappears and hreflang appears.
  3. Set `publishAt` an hour ahead and confirm the post appears within the cache window.
  4. Preview a draft through Presentation.
  5. Publish from a phone.
- **Interactions:**
  1. Submit a comment using Turnstile's test keys; it must not be visible until Approved.
  2. Exceed the rate limit and get a 429.
  3. Reaction counts update.
- **Deployed:** Lighthouse mobile on the Vercel production URL; `/admin` requires a Sanity login; `/api` and `/admin` are disallowed in robots.txt.

## Sources checked on 2026-10-27

- Next.js blog/releases: https://nextjs.org/blog (16.4, 2026-10-06; security update 2026-10-14)
- next-intl routing setup with `proxy.ts`: https://next-intl.dev/docs/routing/setup
- next-sanity, Live + Cache Components: https://github.com/sanity-io/next-sanity
- Sanity pricing: https://www.sanity.io/pricing
- Sanity localization: https://www.sanity.io/docs/studio/localization
- Live Content API: https://www.sanity.io/docs/content-lake/live-content-api
- Sanity IDs and paths: https://www.sanity.io/docs/content-lake/ids
- Vercel limits: https://vercel.com/docs/limits
- Vercel fair use and commercial use: https://vercel.com/docs/limits/fair-use-guidelines
- Vercel functions (4.5 MB body limit): https://vercel.com/docs/functions/limitations
- Vercel cron (Hobby runs once per day): https://vercel.com/docs/cron-jobs/usage-and-pricing
- Vercel WAF rate limiting: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
- Vercel Blob pricing: https://vercel.com/docs/vercel-blob/usage-and-pricing
- Mux pricing: https://www.mux.com/pricing
- Cloudflare Stream pricing: https://developers.cloudflare.com/stream/pricing/
- TinaCloud pricing: https://tina.io/pricing
- Payload localization: https://payloadcms.com/docs/configuration/localization
- Keystatic GitHub mode: https://keystatic.com/docs/github-mode
- Sveltia CMS: https://github.com/sveltia/sveltia-cms
- Neon pricing: https://neon.com/pricing
- Upstash pricing: https://upstash.com/pricing/redis
