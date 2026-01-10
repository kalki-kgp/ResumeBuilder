.PHONY: install dev dev-web dev-api build lint clean

# Install all dependencies
install:
	pnpm install
	cd apps/api && uv sync

# Run all services in development mode
dev:
	pnpm run dev

# Run only the web frontend
dev-web:
	pnpm run dev:web

# Run only the API backend
dev-api:
	pnpm run dev:api

# Build all packages
build:
	pnpm run build

# Run linting
lint:
	pnpm run lint
	cd apps/api && uv run ruff check .

# Clean build artifacts
clean:
	pnpm run clean
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
