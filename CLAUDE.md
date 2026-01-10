# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm monorepo for a SaaS application with a Next.js frontend and FastAPI backend.

## Tech Stack

**Frontend (`apps/web`):**
- Next.js 15 with App Router (Turbopack enabled for dev)
- TypeScript with strict mode
- Tailwind CSS with CSS variables (neutral base color)
- shadcn/ui components (new-york style, RSC-enabled)
- Path alias: `@/*` maps to `./src/*`
- React 19

**Backend (`apps/api`):**
- Python 3.11+ with FastAPI
- Pydantic v2 for validation
- uv for package management
- Async-first architecture
- Ruff for linting (line-length: 88)
- mypy for type checking (strict mode)
- pytest with async support

**Shared (`packages/shared`):**
- TypeScript utilities shared between apps
- Internal package: `@repo/shared`

## Project Structure

```
apps/
├── web/                      # Next.js frontend
│   ├── src/
│   │   ├── app/              # App Router pages & layouts
│   │   ├── components/       # Custom components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── landing/      # Landing page components
│   │   │   └── pricing/      # Pricing components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/utils.ts      # cn() utility for className merging
│   └── components.json       # shadcn/ui configuration
│
├── api/                      # FastAPI backend
│   ├── app/
│   │   ├── api/v1/           # API route handlers (versioned)
│   │   ├── core/config.py    # Environment settings (Pydantic)
│   │   ├── models/           # Database/domain models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic layer
│   │   └── main.py           # FastAPI app entry point
│   └── tests/                # pytest tests
│       └── conftest.py       # TestClient fixture
│
└── packages/
    └── shared/               # Shared TypeScript code
```

## Development Commands

**Root-level (uses Makefile or pnpm scripts):**
```bash
make install        # Install all dependencies (pnpm + uv)
make dev            # Run both frontend and backend in parallel
make dev-web        # Frontend only (localhost:3000)
make dev-api        # Backend only (localhost:8000)
make build          # Build all packages
make lint           # Lint frontend (Next.js) and backend (ruff)
make clean          # Clean build artifacts and caches
```

**Frontend-specific (`apps/web`):**
```bash
pnpm dev                        # Next.js dev server with Turbopack
pnpm build                      # Production build
pnpm start                      # Start production server
pnpm lint                       # Run ESLint
pnpm type-check                 # TypeScript type checking (no emit)
npx shadcn@latest add <name>    # Add shadcn/ui component
```

**Backend-specific (`apps/api`):**
```bash
uv run uvicorn app.main:app --reload    # Dev server (or pnpm dev)
uv run pytest                           # Run all tests
uv run pytest tests/test_foo.py         # Run specific test file
uv run pytest -k test_name              # Run specific test by name
uv run ruff check .                     # Lint (or pnpm lint)
uv run ruff check . --fix               # Auto-fix lint issues
uv run mypy app                         # Type check
uv add <package>                        # Add dependency
uv add --dev <package>                  # Add dev dependency
```

**Workspace-specific:**
```bash
pnpm --filter web <command>     # Run command in web app only
pnpm --filter api <command>     # Run command in api app only
pnpm run --parallel <command>   # Run command in all workspaces
```

## Architecture Patterns

**Frontend:**
- **Server Components First**: Use React Server Components by default. Only add `"use client"` when needed (interactivity, hooks, browser APIs)
- **Route Organization**: Pages go in `app/<route>/page.tsx`, layouts in `app/<route>/layout.tsx`
- **Component Location**: Reusable components in `src/components/`, NOT in the app directory
- **Styling**: Use `cn()` from `@/lib/utils` for conditional className merging
- **API Integration**: Create service functions for API calls, don't call fetch directly in components

**Backend:**
- **Layered Architecture**: Routes → Services → Models/Schemas
  - Routes (`app/api/v1/`): Handle HTTP, validation via Pydantic
  - Services (`app/services/`): Business logic, dependency injection
  - Schemas (`app/schemas/`): Request/response models (Pydantic v2)
  - Models (`app/models/`): Domain/database models
- **Async Everywhere**: All endpoints and service methods should be async
- **Configuration**: Environment vars via `app/core/config.py` (Pydantic Settings)
- **API Versioning**: Routes under `/api/v1`, configured via `settings.API_V1_STR`

**API Communication:**
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- API base path: `/api/v1`
- Health check: `GET /health`
- CORS pre-configured for localhost:3000

**Testing:**
- Backend tests use `TestClient` fixture from `conftest.py`
- pytest runs in async mode by default
- Test files: `tests/test_*.py`

## Design System

shadcn/ui with "new-york" style variant:
- Neutral base color palette
- CSS variables in `apps/web/src/app/globals.css`
- RSC-compatible components
- Tailwind prefix: none (default)
- Generous whitespace, professional SaaS aesthetic

## Common Workflows

**Adding a new API endpoint:**
1. Define schemas in `apps/api/app/schemas/`
2. Implement business logic in `apps/api/app/services/`
3. Create route handler in `apps/api/app/api/v1/`
4. Add route to router in `apps/api/app/api/v1/__init__.py`
5. Write tests in `apps/api/tests/`

**Adding a new page:**
1. Create `apps/web/src/app/<route>/page.tsx`
2. Add layout if needed: `apps/web/src/app/<route>/layout.tsx`
3. Create components in `apps/web/src/components/`
4. Use shadcn/ui components as base, customize as needed

**Adding shared code:**
1. Add to `packages/shared/src/`
2. Export from `packages/shared/src/index.ts`
3. Use in apps via `@repo/shared` import
