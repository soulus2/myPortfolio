# CLAUDE.md — Personal Portfolio Website

This file guides Claude Code while building, extending, and deploying my personal portfolio website. Read it fully at the start of every session.

---

## 0. THE MOST IMPORTANT RULE: Ask, don't assume

**Do not make product, design, architecture, or library decisions on your own.**

Before any non-trivial decision:

1. Stop and ask me.
2. Give **2–4 concrete options**, each with:
   - what it is (one line)
   - pros / cons
   - effort and cost (money, complexity, maintenance)
   - your recommendation, clearly marked, with the reason
3. Wait for my answer. Do not start building on the recommended option "in the meantime".

Use the `AskUserQuestion` tool for this where available; otherwise ask in plain text with a numbered list.

**What counts as a decision (always ask):**
- Choosing or adding any dependency, library, service, or paid tool
- Data model / content schema changes
- Folder structure changes
- Visual direction: colors, fonts, layout, animation style, background concepts
- Auth method, CMS approach, video hosting, database choice
- Anything that affects cost, privacy, SEO, or URLs
- Deleting or renaming files I created

**What you may do without asking:**
- Fix obvious bugs, typos, lint and type errors
- Refactor inside a single component without changing behavior
- Write tests
- Follow a decision I already made (recorded in `DECISIONS.md`, see §11)

**Additional working rules:**
- Work in small steps. After each step, summarize what changed and what's next.
- If something in this file conflicts with what I say in chat, ask which one wins, then update this file.
- If you are unsure whether something is a "decision" — it is. Ask.
- Before saying a library/API works a certain way, check its current docs. Versions change; do not rely on memory for version numbers or APIs.

---

## 1. Who I am (owner profile)

> ✏️ Fill in the placeholders before the first session.

- **Name:** `[YOUR NAME]` / Georgian: `[სახელი გვარი]`
- **Location:** Tbilisi, Georgia
- **Contact / socials:** `[email]`, `[LinkedIn]`, `[GitHub]`, `[Behance/ArtStation]`, `[YouTube]`
- **Backgrounds (all must be represented):**
  1. **Graphic design** — branding, layout, illustration
  2. **3D modeling** — extensive experience (tools: `[Blender / 3ds Max / Maya / Cinema 4D / ...]`)
  3. **Engineering** — `[field: mechanical / electrical / civil / ...]`
  4. **Computer science** — software, algorithms, development
  5. **Information technology (IT)** — extensive experience: networking, hardware, systems, support/infrastructure
  6. **Startups** — founded / co-founded / worked at startups; participated in startup events, hackathons, pitch competitions, accelerators

The site should feel like one person who sits at the intersection of all of these, not six separate portfolios glued together.

---

## 2. Project goals

A bilingual (Georgian + English) personal portfolio that:

1. Shows off **completed projects** (case studies with images, video, 3D, links).
2. Shows **current, in-progress projects** with status/progress updates.
3. Gives an **overview of experience**: what I'm good at, what I'm still learning, and future plans.
4. Hosts **videos** that visitors can watch and react to / review.
5. Lets me publish **articles, blogs, and vlogs** very easily.
6. Has a simple way to manage all content — either a content folder or a private admin page (decision pending, see §6).
7. Highlights my **startup experience** and **events** I've taken part in.
8. Feels **modern, minimalistic, fluid, and natural**, with strong visual flair that changes per section.
9. Works great on **desktop and mobile**.
10. Is built with **Next.js** and deployed on **Vercel**.

---

## 3. Tech baseline (fixed) and open choices

**Fixed (already decided by me):**
- Next.js, App Router, TypeScript (strict)
- Deployment on Vercel
- Two locales: `ka` (Georgian) and `en` (English)
- Responsive, mobile-first

**Open — ask me before choosing (offer options like these):**

| Area | Options to present |
|---|---|
| Styling | Tailwind CSS · CSS Modules · vanilla-extract |
| Animation | Motion (Framer Motion) · GSAP · CSS-only + View Transitions API |
| 3D / WebGL | react-three-fiber + drei · plain Three.js · `<model-viewer>` for simple model display · none (2D canvas/SVG only) |
| i18n | next-intl · Next.js built-in routing + custom dictionaries · Paraglide |
| Content/CMS | see §6 |
| Video | see §7 |
| Comments/reviews | see §7.3 |
| Database (if needed) | Vercel Postgres/Neon · Supabase · Turso · none |
| Auth (if admin page) | Auth.js (GitHub/Google OAuth, allow-list my account only) · Clerk · Supabase Auth · CMS-provided auth |
| Analytics | Vercel Analytics · Plausible · Umami · none |
| Package manager | pnpm · npm · bun |

---

## 4. Site structure (proposal — confirm with me before building)

```
/[locale]                      Home — intro, "who I am" in one screen, entry points to each world
/[locale]/about                Story, timeline, values
/[locale]/skills               Skills matrix: Strong / Comfortable / Learning / Planned
/[locale]/now                  What I'm working on and learning right now (frequently updated)
/[locale]/future               Future plans & goals
/[locale]/work                 All projects, filterable by discipline and status
/[locale]/work/[slug]          Project case study
/[locale]/engineering          Discipline landing page (themed)
/[locale]/it                   Discipline landing page (themed)
/[locale]/computer-science     Discipline landing page (themed)
/[locale]/design               Graphic design + 3D (themed)
/[locale]/startups             Startups, roles, events, hackathons, pitches, awards
/[locale]/blog                 Articles & blogs
/[locale]/blog/[slug]
/[locale]/vlog                 Videos / vlogs
/[locale]/vlog/[slug]          Video page with reactions / reviews
/[locale]/contact              Contact form + links
/admin                         Private content management (only if we choose that approach)
```

Questions to ask me: Should discipline pages be separate routes or sections on one long page? Should Design and 3D be one page or two? Do I want a downloadable CV (per language)?

---

## 5. Visual direction

### 5.1 Overall feel
- Modern, minimal, lots of whitespace, strong typography.
- **Fluid and natural:** smooth page transitions, gentle motion, nothing jarring.
- **Flair per section:** each discipline has its own animated background "world". The shell (nav, type, grid) stays consistent so it still feels like one site.
- Light and dark mode (ask: default to system? which is primary?).

### 5.2 Section background concepts (draft — present variations to me before building each one)

| Section | Concept ideas |
|---|---|
| **Engineering** | Interlocking cogs/gears rotating at linked speeds (correct gear ratios); blueprint grid with dimension lines drawing themselves; faint technical-drawing linework |
| **IT** | Network topology: nodes and links with data "packets" traveling along edges; server-rack LEDs blinking; subtle circuit-board traces; terminal/log lines scrolling faintly |
| **Computer Science** | Algorithm visualizations (sorting bars, graph traversal, tree growth); binary/hex rain kept very subtle; Conway's Game of Life; syntax-highlighted code fragments drifting |
| **Graphic Design** | Shapes snapping to grids; bezier curves with visible handles drawing themselves; color swatches morphing; type specimens |
| **3D Modeling** | Rotating wireframe mesh that shifts wireframe → solid → shaded; topology/edge-flow lines; interactive model viewer for my real models (GLB) |
| **Startups / Events** | Growth curves, pitch-deck style slides, a timeline of events with "milestone" markers, constellation of logos/events |
| **Home** | A blend: an element that morphs between all worlds (e.g., a gear → network node → mesh vertex → design shape), signaling "all of these are me" |

### 5.3 Motion rules (non-negotiable)
- Respect `prefers-reduced-motion`: provide static or near-static versions of every background.
- Backgrounds must **never** hurt readability: low contrast, behind content, optional subtle blur/overlay.
- Pause animations when off-screen (IntersectionObserver) and when the tab is hidden.
- On mobile / low-power devices: lighter versions (fewer particles, 2D instead of WebGL, lower frame rate). Ask me which fallback strategy to use.
- Lazy-load heavy backgrounds (dynamic import, no SSR for WebGL).
- Target: Lighthouse performance ≥ 90 on mobile; LCP < 2.5s; CLS < 0.1.
- Transitions between sections should morph the background theme rather than hard-cut (ask me about the approach: View Transitions API vs animation library).

### 5.4 Typography
- **Must support Georgian (Mkhedruli) properly.** Many Latin fonts don't include Georgian glyphs.
- Present options for paired fonts, e.g.: Noto Sans Georgian / Noto Serif Georgian, FiraGO (good Latin + Georgian coverage), BPG fonts, Helvetica Neue LT GEO-style alternatives — check licensing for each.
- Georgian text is often longer than English and has no capital letters (Mtavruli exists but is used for all-caps styling). Test layouts in both languages; never use `text-transform: uppercase` on Georgian without checking how it renders.
- Use `next/font` for self-hosting.

---

## 6. Content management (decision pending — present these options to me)

I want publishing new projects, articles, blogs, and vlogs to be **very easy**. Present these approaches with honest trade-offs:

**Option A — Content folder (Git-based, MDX)**
`/content/{projects,blog,vlog,events}/[slug]/{en,ka}.mdx` + images. Publish by adding files and pushing; Vercel rebuilds.
- ✅ Free, simple, versioned, fast
- ❌ Requires Git/editor; no UI; not great from a phone

**Option B — Git-based CMS with an admin UI (e.g., Keystatic, TinaCMS, Decap)**
Same content folder as A, but with a `/admin` editor UI that commits to GitHub for me. Login via GitHub.
- ✅ Admin page *and* content in files; free or cheap; no database
- ❌ Each publish triggers a rebuild (~1–2 min); large media should live elsewhere

**Option C — Headless CMS (e.g., Sanity, Payload CMS)**
Hosted editor with rich UI, image pipeline, localization built in.
- ✅ Best editing experience, instant updates, works from phone
- ❌ External service, possible cost at scale, more setup

**Option D — Custom admin built into the site (database + auth)**
Build my own `/admin` with Auth.js (my account only), Postgres, and file storage.
- ✅ Full control, exactly what I want
- ❌ Most work and most maintenance; I own all security

My current leaning is a hybrid (content folder + admin UI, i.e., Option B, or Option C) but **ask me**.

**Regardless of choice, the content model must support:**
- Every content item has both `en` and `ka` versions, with a clear indicator when a translation is missing (fallback behavior: ask me — show other language with a notice, or hide).
- Drafts vs published, and scheduled publish date.
- Preview before publishing.
- Easy media embedding: images, video, 3D models (GLB), code blocks, galleries.

### 6.1 Content types (draft schemas — confirm fields with me)

```ts
Project {
  slug; title{en,ka}; summary{en,ka}; body{en,ka}
  disciplines: ('engineering'|'it'|'cs'|'design'|'3d'|'startup')[]
  status: 'completed'|'in-progress'|'paused'|'concept'
  progress?: number            // 0–100 for in-progress
  updates?: { date; text{en,ka} }[]   // progress log for current projects
  role; team?; tools: string[]; startDate; endDate?
  cover; gallery?; videos?; models3d?; links?{live,repo,behance,...}
  featured: boolean
}
Post (blog/article) { slug; title; excerpt; body; tags; cover; publishedAt; readingTime; type: 'article'|'blog' }
Vlog { slug; title; description; video (provider id); thumbnail; duration; chapters?; tags; publishedAt }
Skill { name{en,ka}; discipline; level: 'expert'|'strong'|'comfortable'|'learning'|'planned'; years?; notes? }
StartupEntry { name; role; period; description; outcome; links; logo }
Event { name; date; location; type: 'hackathon'|'pitch'|'accelerator'|'conference'|'meetup'; result?; photos? }
Goal (future plans) { title; description; horizon: 'this-year'|'1-3y'|'long-term'; status }
```

---

## 7. Video

### 7.1 Hosting (ask me — present options)
Do **not** serve large videos as plain files from the Next.js app. Options:
- **Mux** — adaptive streaming, great player, analytics; paid per minute
- **Cloudflare Stream** — cheap, adaptive streaming
- **YouTube / Vimeo embed** — free, extra reach; less design control, third-party branding/tracking
- **Vercel Blob / S3 / R2 + direct upload** — cheap storage, but no adaptive streaming unless we add it

Important technical note: Vercel serverless functions have a small request body limit, so uploads from an admin page must go **directly from the browser to the storage/video provider** (signed upload URLs), never through a Next.js API route.

### 7.2 Player
- Accessible, keyboard-controllable, captions/subtitles support (EN and KA subtitle tracks).
- Thumbnails / poster images; lazy-load the player.

### 7.3 Viewer reviews / reactions (ask me — options)
- **Giscus** (GitHub Discussions) — free, but visitors need GitHub
- **Simple reactions** (👍 ❤️ 🔥 counts) stored in a DB — no login, low friction
- **Custom comments with moderation** — name/email + approval queue in admin; needs spam protection (e.g., Cloudflare Turnstile)
- **Rating + short review** with moderation

Ask whether reviews should be public immediately or require my approval.

---

## 8. Internationalization (ka / en)

- URL structure: ask me — `/en/...` + `/ka/...` (both prefixed) vs. one language unprefixed as default.
- Default language detection from browser `Accept-Language`, with a manual switcher that remembers the choice.
- Language switcher keeps you on the **same page** in the other language.
- All UI strings in translation files; no hard-coded text in components.
- Proper `hreflang`, `lang` attributes (`ka`, `en`), localized metadata and OG images.
- Localized date formats (Georgian month names) via `Intl`.
- Slugs: ask me — same slug for both languages, or localized slugs.

---

## 9. Quality requirements

- **Accessibility:** WCAG 2.2 AA; semantic HTML; focus states; alt text required on all images (both languages); color contrast checked over animated backgrounds.
- **SEO:** per-page metadata, sitemap.xml (both locales), robots.txt, JSON-LD (`Person`, `Article`, `VideoObject`, `CreativeWork`), RSS feed per language for blog and vlog.
- **Performance:** `next/image`, static generation where possible, ISR/on-demand revalidation for content, code-splitting heavy visuals.
- **Responsive:** test at 360px, 768px, 1024px, 1440px+. Touch-friendly targets; hover effects must have touch equivalents.
- **Security (if admin exists):** admin route protected server-side (middleware + server checks), allow-list my account only, rate-limit forms, never expose secrets to the client, validate all input (e.g., with Zod).
- **Code:** TypeScript strict, ESLint + Prettier, small focused components, server components by default, `"use client"` only where needed.

---

## 10. Ideas to push the site further (offer these to me; I'll choose)

1. **Morphing hero** — one object that transforms through all disciplines (gear → network node → mesh → bezier shape).
2. **"Now" page** — what I'm building, learning, reading this month.
3. **Skills as a living map** — skills connected to the projects that prove them; filter "show me projects where I used X".
4. **Learning roadmap** — visual path from "learning" → "comfortable" → "strong" with dates.
5. **Interactive 3D gallery** — rotate my real models in the browser; wireframe/solid toggle; turntable mode.
6. **Case study template** — Problem → Process → Result, with before/after sliders for design work.
7. **Startup timeline** — scroll-driven timeline of startups and events with photos and outcomes.
8. **Command palette (⌘K / Ctrl+K)** — quick navigation, language switch, theme switch.
9. **Discipline filter as a "lens"** — choosing a lens (Engineer / IT / Developer / Designer) re-themes the site and reorders projects.
10. **Auto-generated OG images** per page/post in both languages.
11. **Newsletter or "follow" option** for new vlogs/posts.
12. **Downloadable CV** per language, generated from the same content data.
13. **Contact form** with "what do you want to talk about" options (hire / collaborate / startup / speaking).
14. **Easter eggs** per world (e.g., a terminal on the IT page that accepts a few commands).
15. **Testimonials** from teammates, clients, event organizers.

---

## 11. Decision log

Keep a `DECISIONS.md` file at the repo root. After I answer any decision question, add an entry:

```
## YYYY-MM-DD — [Topic]
Options considered: A, B, C
Chosen: B
Reason: ...
```

Check it before asking a question I've already answered.

The approved architecture and content-platform plan, including the phases and their gate questions, is in `ARCHITECTURE.md`. Where it and `DECISIONS.md` differ, `DECISIONS.md` wins.

---

## 12. Suggested build phases (confirm before starting each phase)

1. **Discovery** — ask me the questions in §14; record answers in `DECISIONS.md`.
2. **Foundation** — Next.js + TypeScript setup, linting, i18n routing, fonts, layout shell, navigation, light/dark mode, deploy an empty site to Vercel early.
3. **Design system** — colors, type scale, spacing, components; show me a style page (`/[locale]/styleguide`, dev-only) before moving on.
4. **Content layer** — chosen CMS approach, schemas, sample content in both languages.
5. **Core pages** — home, about, skills, work + case studies, contact.
6. **Discipline worlds** — one themed background at a time; show me each before the next.
7. **Blog & vlog** — posts, video hosting, player, reactions/reviews.
8. **Startups & events** section.
9. **Admin / publishing flow** — if applicable.
10. **Polish** — transitions, reduced-motion versions, accessibility audit, performance pass, SEO.
11. **Launch** — domain, analytics, final checks (§13).

---

## 13. Vercel deployment

- Connect the GitHub repo to Vercel; `main` = production, every PR gets a preview deployment.
- Environment variables only in Vercel project settings and a local `.env.local` (never committed). Maintain `.env.example` listing every variable with a comment.
- Custom domain: ask me (e.g., `.ge` and/or `.com`); configure DNS + HTTPS on Vercel.
- If content is file-based, publishing = commit → automatic rebuild. If a CMS is used, set up a webhook for on-demand revalidation.
- Pre-launch checklist: both locales render everywhere; no missing translations; 404 and error pages in both languages; Lighthouse on mobile; OG images; sitemap submitted to Google Search Console; analytics working; admin route not accessible when logged out; forms protected against spam.

---

## 14. Questions to ask me in the first session

1. Placeholders in §1 (name, links, tools, engineering field).
2. Which content management option from §6?
3. Which video hosting option from §7.1 and which review system from §7.3?
4. Default language and URL structure (§8)?
5. Visual references: 3–5 websites I like, and a color direction (monochrome + one accent per discipline? fully different palette per world?).
6. Light, dark, or both — and which is default?
7. Do I have a personal logo/monogram, or should we design one?
8. Which ideas from §10 do I want, and in which phase?
9. Budget for paid services (₾/$ per month), if any.
10. Domain name.
11. Do I want a contact form, and where should messages go (email, Telegram, etc.)?
12. Which existing projects, posts, and videos should be migrated first?

---

## 15. Commands

pnpm is the package manager (installed via Homebrew; Node 25+ no longer ships corepack).

```bash
pnpm install          # install
pnpm dev              # dev server on http://localhost:3000 (/ redirects to /en or /ka)
pnpm build            # production build
pnpm lint             # ESLint
pnpm typecheck        # next typegen + tsc --noEmit
pnpm format           # Prettier (write); pnpm format:check to verify
pnpm test             # Vitest unit tests (src/**/*.test.ts)
pnpm test src/lib/seo.test.ts       # one test file
pnpm test -t "canonical"            # tests whose name matches
pnpm test:e2e         # Playwright + axe on a production build (port 3100)
pnpm test:e2e e2e/i18n.spec.ts      # one spec file
pnpm check            # lint + typecheck + format:check + unit tests
```

Next.js 16.4 ships its docs in `node_modules/next/dist/docs/`, so check them before writing Next.js code (see `AGENTS.md`).
