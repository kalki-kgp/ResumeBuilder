# Project Context

This is a monorepo for a SaaS application.

## Tech Stack

**Frontend (`apps/web`):**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS with CSS variables
- shadcn/ui components (new-york style)
- Path alias: `@/*` maps to `./src/*`

**Backend (`apps/api`):**
- Python 3.11+ with FastAPI
- Pydantic v2 for validation
- uv for package management
- Async-first architecture

## Project Structure

```
apps/
├── web/                      # Next.js frontend
│   └── src/
│       ├── app/              # App Router pages (use folders for routes)
│       ├── components/ui/    # shadcn/ui components
│       ├── components/       # Custom components go here
│       ├── hooks/            # Custom React hooks
│       └── lib/utils.ts      # cn() utility for className merging
│
└── api/                      # FastAPI backend
    └── app/
        ├── api/v1/           # API route handlers
        ├── core/config.py    # Environment settings
        ├── models/           # Database/domain models
        ├── schemas/          # Pydantic request/response schemas
        ├── services/         # Business logic layer
        └── main.py           # FastAPI app entry point
```

## Conventions

**Frontend:**
- Use `cn()` from `@/lib/utils` for conditional classes
- Add shadcn/ui components with: `npx shadcn@latest add <component>`
- Create pages as `app/<route>/page.tsx`
- Create layouts as `app/<route>/layout.tsx`
- Keep components in `src/components/` (not in app/)
- Use server components by default, add "use client" only when needed

**Backend:**
- Create route handlers in `app/api/v1/`
- Define request/response models in `app/schemas/`
- Keep business logic in `app/services/`
- Use dependency injection for services
- All endpoints should be async

**API Communication:**
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- API base path: `/api/v1`
- CORS is pre-configured for localhost:3000

## Commands

```bash
# Development
make dev          # Run both frontend and backend
make dev-web      # Frontend only (port 3000)
make dev-api      # Backend only (port 8000)

# Frontend specific
cd apps/web
npx shadcn@latest add button    # Add UI components
pnpm build                      # Production build

# Backend specific
cd apps/api
uv add <package>                # Add Python dependency
uv run pytest                   # Run tests
```

## Design System

The UI follows a professional SaaS aesthetic (Stripe/Linear/Notion-level):
- Neutral color palette with subtle accents
- Generous whitespace
- Clear typography hierarchy
- CSS variables defined in `apps/web/src/app/globals.css`
- Use shadcn/ui components as the base, customize as needed

## When Implementing Pages

1. **Routes** - Create in `apps/web/src/app/<route>/page.tsx`
2. **Layouts** - Shared layouts go in `apps/web/src/app/<route>/layout.tsx`
3. **Components** - Reusable components in `apps/web/src/components/`
4. **API calls** - Create service functions, don't call fetch directly in components
5. **State** - Prefer server components; use React hooks for client state
