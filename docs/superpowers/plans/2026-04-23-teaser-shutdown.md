# Teaser Shutdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the vue0 Nuxt app into a minimal "New vue0 is coming soon" teaser. All page routes redirect to `/`, and all `/api/*` endpoints return HTTP 503.

**Architecture:** Three isolated files. A rewritten `pages/index.vue` acts as the static teaser using the existing `blank` layout. A new global Nuxt route middleware redirects any non-`/` path to `/`. A new Nitro server middleware (prefixed `0.` so it sorts before the existing `openai.ts`) returns 503 for every `/api/*` request. No other files, config, or dependencies are touched.

**Tech Stack:** Nuxt 3, Nitro, Vue 3 `<script setup>`, TypeScript. Lint: `@antfu/eslint-config` (single quotes, no semicolons).

**Project notes:**
- No test framework is set up. Verification is manual via `pnpm dev` + `curl`, plus `pnpm lint` and `pnpm build`.
- Commit style from recent history: lowercase conventional-style prefix (`feat:`, `chore:`, `docs:`).
- Existing server middleware lives at `server/middleware/openai.ts` and validates an `x-openai-key` header for `/api/create|init|iterate`. Nitro scans `server/middleware/` alphabetically, so the new shutdown middleware must sort before `openai.ts` (hence the `0.` prefix).
- The existing `layouts/blank.vue` is literally `<template><slot /></template>` — good fit for the teaser.
- The existing `components/Logo.vue` is an auto-imported SVG component. Use it directly as `<Logo />`.

---

## File Structure

**Created files:**

- `middleware/teaser.global.ts` — Nuxt global route middleware: redirect any non-`/` path to `/`.
- `server/middleware/0.shutdown.ts` — Nitro server middleware: return 503 for every `/api/*` request.

**Modified files:**

- `pages/index.vue` — rewritten as a minimal centered teaser using the `blank` layout.

**Untouched (but affected):**

- `pages/faq.vue`, `pages/[...name].vue`, `pages/t/[slug].vue`, `pages/p/[slug].vue`, `pages/s/[id].vue` — remain on disk, redirected to `/` by the global middleware.
- `server/api/**` — remain on disk, unreachable because the shutdown middleware fires first.
- `server/middleware/openai.ts` — remains on disk as dead code.

---

## Task 1: Rewrite the landing page as the teaser

**Files:**
- Modify: `pages/index.vue` (full rewrite)

- [ ] **Step 1: Overwrite `pages/index.vue` with the teaser content**

Replace the entire contents of [pages/index.vue](pages/index.vue) with:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

useSeoMeta({
  title: 'vue0 — new version coming soon',
  description: 'A new version of vue0 is on the way.',
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
    <div class="h-20 w-20 md:h-24 md:w-24">
      <Logo />
    </div>
    <h1 class="text-center text-2xl font-black md:text-4xl">
      New vue0 is coming soon
    </h1>
  </div>
</template>
```

Notes:
- `definePageMeta({ layout: 'blank' })` opts out of `layouts/default.vue` (which renders the GitHub button and `UserMenu`).
- `<Logo />` is auto-imported from `components/Logo.vue` by Nuxt — no manual import needed.
- All previous logic (`PromptInput`, `useFetch('/api/component/all')`, `usePrompt`, `useToast`, `useOpenAIKey`, `useUserSession`, dialogs, `umTrackEvent`) is removed. None of it should remain in the file.
- The old `useSeoMeta` referenced `${runtimeConfig.public.siteUrl}/og.png`; we drop that since the OG image route will 503.

- [ ] **Step 2: Run the dev server and visually verify `/`**

Run: `pnpm dev`
Open: `http://localhost:3000/`
Expected:
- Viewport-centered layout, no header (no GitHub button, no user menu).
- The vue0 logo is visible at ~80–96px.
- Text "New vue0 is coming soon" directly below the logo.
- Browser tab title reads "vue0 — new version coming soon".
- No network calls to `/api/component/all` in the DevTools Network tab.

Leave the dev server running for the next task.

- [ ] **Step 3: Commit**

```bash
git add pages/index.vue
git commit -m "feat: rewrite landing as 'new vue0 coming soon' teaser"
```

---

## Task 2: Add global route middleware to redirect all non-`/` pages

**Files:**
- Create: `middleware/teaser.global.ts`

- [ ] **Step 1: Create the `middleware/` directory**

Run: `mkdir -p middleware`

This directory does not exist yet in the project. Nuxt auto-registers files ending in `.global.ts` inside it as global route middleware.

- [ ] **Step 2: Create `middleware/teaser.global.ts`**

Full file contents:

```ts
export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/')
    return navigateTo('/', { replace: true })
})
```

Notes:
- `.global.ts` suffix makes it run on every route navigation without any page-level opt-in.
- `replace: true` avoids adding a history entry per redirect.
- `defineNuxtRouteMiddleware` and `navigateTo` are Nuxt auto-imports; no explicit import.

- [ ] **Step 3: Verify redirects manually**

Make sure the dev server from Task 1 is still running (restart with `pnpm dev` if not).

In the browser, visit each of these URLs and confirm each redirects to `/` and shows the teaser:
- `http://localhost:3000/faq`
- `http://localhost:3000/t/anything`
- `http://localhost:3000/p/anything`
- `http://localhost:3000/s/anything`
- `http://localhost:3000/anything-random`

Expected in each case: URL bar ends at `/`, teaser is visible, no 404.

- [ ] **Step 4: Commit**

```bash
git add middleware/teaser.global.ts
git commit -m "feat: redirect all non-root routes to teaser"
```

---

## Task 3: Add Nitro server middleware to return 503 for all `/api/*`

**Files:**
- Create: `server/middleware/0.shutdown.ts`

- [ ] **Step 1: Create `server/middleware/0.shutdown.ts`**

Full file contents:

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

Notes:
- The `0.` filename prefix guarantees this middleware runs before `server/middleware/openai.ts` (Nitro sorts `server/middleware/` alphabetically). This means requests without an OpenAI key still get 503 instead of the "Missing Open AI key" error.
- `event.path` is Nitro's normalized request path; starts with `/` and excludes the query string.
- `defineEventHandler` and `createError` are Nitro auto-imports; no explicit import.
- The `/api/` prefix (with trailing slash) covers `/api/init`, `/api/create`, `/api/iterate`, `/api/auth/*`, `/api/component/*`, `/api/image/*`, and anything added in future. It deliberately does not match non-API routes.

- [ ] **Step 2: Restart the dev server**

Stop the currently running `pnpm dev` (Ctrl-C) and run it again:

```bash
pnpm dev
```

Nitro server-middleware changes sometimes require a restart; don't rely on HMR here.

- [ ] **Step 3: Verify 503 responses with curl**

Run each of these and check the response:

```bash
curl -i http://localhost:3000/api/component/all
curl -i -X POST http://localhost:3000/api/init
curl -i -X POST http://localhost:3000/api/create
curl -i -X POST http://localhost:3000/api/iterate
curl -i http://localhost:3000/api/auth/github
```

Expected for each: `HTTP/1.1 503 Service Unavailable` with a body containing `Service unavailable — new version coming soon`.

Also confirm the root page is still fine:

```bash
curl -i http://localhost:3000/
```

Expected: `HTTP/1.1 200 OK` with HTML containing `New vue0 is coming soon`.

- [ ] **Step 4: Commit**

```bash
git add server/middleware/0.shutdown.ts
git commit -m "feat: return 503 for all api routes during shutdown"
```

---

## Task 4: Final verification (lint + build)

**Files:** none (verification only).

- [ ] **Step 1: Run the linter**

Run: `pnpm lint`
Expected: exits 0, no errors introduced by the three new/changed files. If the linter complains about quote style or semicolons in the new files, run `pnpm lint:fix` and re-run `pnpm lint` to confirm clean.

- [ ] **Step 2: Run the production build**

Run: `pnpm build`
Expected: build completes successfully. Warnings about unused imports in the now-unreachable pages/APIs are acceptable — do not "fix" them, those files stay on disk for easy revert.

- [ ] **Step 3: Quick smoke test of the built output (optional but recommended)**

Run: `pnpm preview`
Visit `http://localhost:3000/` and `http://localhost:3000/faq` — teaser in both cases.
Run: `curl -i http://localhost:3000/api/component/all` — expect 503.

Stop the preview server when done.

- [ ] **Step 4: No commit needed**

This task produces no file changes. If `pnpm lint:fix` auto-fixed style in the new files from Task 1–3, amend into the relevant task's commit or create a tiny follow-up commit:

```bash
git status
# if there are lint-fix changes:
git add -u
git commit -m "style: lint fix"
```

---

## Reverting (for future reference)

When v2 is ready to ship:

1. `rm middleware/teaser.global.ts`
2. `rm server/middleware/0.shutdown.ts`
3. `git checkout <pre-teaser-commit> -- pages/index.vue`

No other cleanup needed.
