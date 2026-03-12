# IssueHunt — Claude Guide

## Project
Tinder-style GitHub issue discovery. Users swipe on issues, save them, and track their contribution history.
Stack: Next.js 16 · React 19 · TypeScript · Tailwind 4 · Framer Motion · Supabase (PostgreSQL + GitHub OAuth)

## Key Directories
- `src/app/` — pages + API routes (App Router)
- `src/app/api/` — server-side API routes (GitHub API proxy, Supabase reads/writes)
- `src/components/{feature}/` — components scoped to a page feature
- `src/components/ui/` — shared primitives: Tag, Avatar, MonoText, StreakBadge
- `src/lib/supabase/` — Supabase clients (server.ts, client.ts, middleware.ts)
- `src/lib/hooks/` — shared React hooks
- `src/lib/design-tokens.ts` — color/font/radius constants
- `src/middleware.ts` — auth guard (protects /hunt, /saved, /history, /settings)

## Standards
See `../docs/STANDARDS.md`

## Active Tickets
See `../docs/tickets/` — one file per task, status tracked in frontmatter

## Hard Rules
- Never put GitHub API calls in client components — proxy via `/api/*` routes
- Never expose the GitHub OAuth token to the browser
- All new pages use the AppHeader + Sidebar + BottomNav shell pattern
- Components are scoped: `src/components/{feature}/ComponentName.tsx`
- Shared primitives only go in `src/components/ui/` — check there before creating new ones
- Read files before making claims about what they contain
