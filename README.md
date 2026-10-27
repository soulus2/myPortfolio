# Portfolio

Bilingual (English / Georgian) personal portfolio built with Next.js 16 (App Router), next-intl and Tailwind CSS v4, deployed on Vercel.

- Project brief and working rules: [CLAUDE.md](CLAUDE.md)
- Decision log: [DECISIONS.md](DECISIONS.md)

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000 redirects to /en or /ka
pnpm check      # lint, typecheck, format check, unit tests
pnpm test:e2e   # end-to-end and accessibility tests
```

Environment variables are documented in [.env.example](.env.example).
