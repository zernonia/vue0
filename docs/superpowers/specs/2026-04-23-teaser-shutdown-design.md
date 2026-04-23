# Teaser Shutdown — Design

**Date:** 2026-04-23
**Status:** Approved

## Summary

Convert the vue0 app into a minimal "New vue0 is coming soon" teaser. All page routes redirect to `/`, and all `/api/*` endpoints return HTTP 503. Existing code, dependencies, DB, and environment configuration stay in place so the change is easy to revert when the new version ships.

## Goals

- A visitor landing on any URL sees a single, minimal teaser page.
- Any programmatic consumer hitting `/api/*` receives a clear 503 indicating the service is unavailable.
- The diff is small and reversible: no deletions of existing pages, API handlers, composables, DB, dependencies, or config.

## Non-Goals

- No CTA, email capture, social links, countdown, or marketing content on the teaser.
- No removal of OpenAI / Browserless / GitHub OAuth dependencies or env vars.
- No schema or data changes to the SQLite DB.
- No change to `nuxt.config.ts`, installed modules, or build pipeline.

## Scope of Changes

Three new/changed files. Nothing else is modified or deleted.

### 1. `pages/index.vue` (rewrite)

Replace the entire file with a minimal teaser:

- Uses `definePageMeta({ layout: 'blank' })` so the default layout's header (GitHub link, `UserMenu`) does not render. This avoids exposing auth-related UI that the 503-shutdown middleware would render unusable.
- Full-viewport, centered layout: `min-h-screen flex items-center justify-center`.
- Contents: `<Logo />` at a fixed size (e.g. 80–96px) and an `<h1>` with the text **"New vue0 is coming soon"**.
- `useSeoMeta({ title: 'vue0 — new version coming soon', description: 'A new version of vue0 is on the way.' })`. Keep it simple; do not carry over the old `ogImage` reference since the OG route will 503.
- Remove all imports/logic from the current `index.vue`: `PromptInput`, `useFetch('/api/component/all')`, `usePrompt`, `useToast`, `useOpenAIKey`, `useUserSession`, dialogs, `umTrackEvent`, etc. None of these should remain.

### 2. `middleware/teaser.global.ts` (new)

Nuxt route middleware, global (`.global.ts` suffix) so it runs on every navigation:

```ts
export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/')
    return navigateTo('/', { replace: true })
})
```

This catches `/faq`, `/t/:slug`, `/p/:slug`, `/s/:id`, the catch-all `[...name].vue`, and any future paths. `replace: true` avoids polluting browser history.

### 3. `server/middleware/0.shutdown.ts` (new)

Nitro server middleware. The `0.` filename prefix ensures it runs **before** the existing `openai.ts` middleware (Nitro sorts middleware by filename). This guarantees an API request returns 503 regardless of headers — including cases where `openai.ts` would otherwise short-circuit with "Missing Open AI key".

```ts
export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/')) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service unavailable — new version coming soon',
    })
  }
})
```

Covers every route under `/api/*`: `auth/*`, `component/*`, `image/*`, `init.post.ts`, `create.post.ts`, `iterate.post.ts`.

## What Stays Untouched

- `nuxt.config.ts` — no module or config changes.
- `server/api/**` — handlers remain on disk, unreachable due to middleware.
- `server/middleware/openai.ts` — left in place; dead code behind the new 503 gate, easy to re-enable.
- `pages/[...name].vue`, `pages/faq.vue`, `pages/p/[slug].vue`, `pages/s/[id].vue`, `pages/t/[slug].vue` — left on disk; redirected to `/` by the global middleware.
- `layouts/default.vue` — unused by the teaser but kept for revert.
- `components/**`, `composables/**`, `utils/**`, `db.sqlite`, `drizzle.config.ts` — untouched.
- `package.json` dependencies — untouched.
- Env vars (`OPENAI_KEY`, `BROWSERLESS_API_KEY`, GitHub OAuth, session secret) — can remain unset in the new deployment; nothing depends on them anymore once APIs return 503 before handlers run.

## Verification

- `pnpm dev`: navigate to `/`, `/faq`, `/t/anything`, `/p/anything`, `/s/anything` — all resolve to the teaser.
- `curl -i http://localhost:3000/api/component/all` → HTTP 503 with `Service unavailable — new version coming soon`.
- `curl -i -X POST http://localhost:3000/api/init` → 503.
- `curl -i http://localhost:3000/api/auth/github` → 503.
- `pnpm build` succeeds without new errors.
- Lint passes (`pnpm lint`).

## Reverting

To restore the app:
1. Delete `middleware/teaser.global.ts`.
2. Delete `server/middleware/0.shutdown.ts`.
3. Restore `pages/index.vue` from git.

No other cleanup required.
