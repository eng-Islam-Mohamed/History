# Project Technologies

This file documents the technologies currently used in this project, based on the actual codebase and configuration in `C:\Users\ASUS TUF GAMING 15\Desktop\histo`.

## 1. Core Framework

- **Next.js 16.2.3**
  - Main application framework
  - Uses the **App Router**
  - Handles:
    - routing
    - server rendering
    - layouts
    - API route handlers
    - metadata
    - image optimization
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)
    - [`src/app`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app)
    - [`next.config.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/next.config.ts)

- **React 19.2.4**
  - UI library used by Next.js
  - Used for all client and server components
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)

- **React DOM 19.2.4**
  - DOM renderer for React
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)

## 2. Language and Type System

- **TypeScript 5**
  - Main programming language for the project
  - Strict typing is enabled
  - Path alias `@/*` is configured for `src/*`
  - Evidence:
    - [`tsconfig.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/tsconfig.json)
    - [`src/types`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/types)

## 3. Styling and UI System

- **Tailwind CSS v4**
  - Utility-first CSS framework
  - Imported globally with `@import "tailwindcss"`
  - Used throughout JSX via utility classes
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)
    - [`src/app/globals.css`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/globals.css)

- **@tailwindcss/postcss**
  - Tailwind PostCSS integration
  - Evidence:
    - [`postcss.config.mjs`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/postcss.config.mjs)

- **Custom design system via CSS variables and handcrafted components**
  - The project does not rely on a third-party component kit like shadcn/ui or Material UI
  - It uses:
    - CSS theme variables
    - custom utility patterns
    - handcrafted premium UI sections
    - custom visual systems for cards, shelves, atlas, search CTA, loaders, etc.
  - Evidence:
    - [`src/app/globals.css`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/globals.css)
    - [`src/components`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components)

- **Google Fonts via `next/font`**
  - **Fraunces** for headline typography
  - **Manrope** for body typography
  - Evidence:
    - [`src/app/layout.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/layout.tsx)

- **Lucide React 1.8.0**
  - Icon library
  - Used in navbar, profile, library, search, map, and other UI surfaces
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)
    - many files in [`src/components`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components)

- **Framer Motion 12.38.0**
  - Used for animations and transitions
  - Mainly used in interactive overlays and navigation panels
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)
    - [`src/components/layout/Navbar.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components/layout/Navbar.tsx)

## 4. Backend / Server Layer

- **Next.js Route Handlers**
  - The app uses Next App Router route handlers instead of a separate Express/Nest backend
  - Current API endpoints include:
    - `/api/search`
    - `/api/intelligence`
  - Evidence:
    - [`src/app/api/search/route.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/api/search/route.ts)
    - [`src/app/api/intelligence/route.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/api/intelligence/route.ts)

- **Server Components + SSR**
  - The app uses async server components and server-side data fetching in the App Router
  - Evidence:
    - [`src/app/[locale]/layout.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/%5Blocale%5D/layout.tsx)
    - several page files under [`src/app`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app)

## 5. Database, Auth, and Storage

- **Supabase**
  - Primary backend platform for:
    - authentication
    - PostgreSQL database
    - row-level security protected user data
    - storage bucket for avatars
  - Evidence:
    - [`src/lib/supabase/client.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/supabase/client.ts)
    - [`src/lib/supabase/server.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/supabase/server.ts)
    - [`src/lib/supabase/proxy.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/supabase/proxy.ts)
    - [`src/components/auth/AuthProvider.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components/auth/AuthProvider.tsx)

- **@supabase/supabase-js 2.103.3**
  - JavaScript client for database, auth, and storage access
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)

- **@supabase/ssr 0.10.2**
  - Used for SSR-safe Supabase integration with Next.js
  - Evidence:
    - [`package.json`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/package.json)

- **Supabase Auth**
  - Used for:
    - sign up
    - sign in
    - sign out
    - session tracking
    - profile synchronization
  - Evidence:
    - [`src/components/auth/AuthProvider.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components/auth/AuthProvider.tsx)
    - [`src/app/[locale]/login`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/%5Blocale%5D/login)
    - [`src/app/auth`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/auth)

- **Supabase Storage**
  - Used for user avatar images
  - Evidence:
    - navbar avatar download flow in [`src/components/layout/Navbar.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components/layout/Navbar.tsx)

- **PostgreSQL through Supabase**
  - The app stores structured user content in the Supabase Postgres database
  - Current stored domains include:
    - profiles
    - saved researches / library items
    - collections
    - collection items
    - saved comparisons
    - notes
    - bookmarks
    - path progress
    - activity / resume state
  - Access is handled through Supabase queries, not Prisma

## 6. AI Layer

- **DeepSeek Chat API**
  - Current AI provider used by the search and intelligence routes
  - Model currently requested: **`deepseek-chat`**
  - Base URL defaults to:
    - `https://api.deepseek.com`
  - Environment variables used:
    - `AI_API_KEY`
    - `NEXT_PUBLIC_AI_API_URL`
  - Evidence:
    - [`src/app/api/search/route.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/api/search/route.ts)
    - [`src/app/api/intelligence/route.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/api/intelligence/route.ts)

- **Custom AI prompt/service layer**
  - AI logic is organized in reusable service files instead of being hardcoded directly in components
  - Responsibilities include:
    - topic parsing
    - localized prompt instructions
    - compare mode generation
    - ask-the-era fallback generation
    - intelligence response shaping
  - Evidence:
    - [`src/lib/ai/historyService.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/ai/historyService.ts)
    - [`src/lib/experience/intelligence.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/experience/intelligence.ts)

## 7. Routing and Request Pipeline

- **App Router file-based routing**
  - Main product routes are organized under `src/app`
  - Localized routes use the pattern:
    - `src/app/[locale]/...`
  - Example pages:
    - `/search`
    - `/library`
    - `/compare`
    - `/timeline`
    - `/map`
    - `/paths`
    - `/collections`
    - `/profile`

- **Custom locale-aware proxy**
  - The project uses `proxy.ts` to:
    - enforce locale prefixes
    - set locale cookies
    - attach locale and direction headers
    - refresh Supabase sessions
  - Evidence:
    - [`proxy.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/proxy.ts)

- **Custom i18n system**
  - Not using `next-intl`
  - The project uses a custom internal localization system with:
    - locale config
    - dictionaries
    - locale provider
    - RTL/LTR direction handling
  - Supported locales:
    - English (`en`)
    - French (`fr`)
    - Arabic (`ar`)
  - Evidence:
    - [`src/i18n/config.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/i18n/config.ts)
    - [`src/components/i18n/LocaleProvider.tsx`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/components/i18n/LocaleProvider.tsx)
    - [`src/i18n/dictionaries.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/i18n/dictionaries.ts)

## 8. State Management

- **React state/hooks**
  - Primary local UI state management pattern
  - Used across most interactive components

- **Zustand 5.0.12**
  - Present in the codebase as a lightweight store
  - Used in the legacy app state layer
  - Evidence:
    - [`src/lib/store.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/store.ts)
  - Note:
    - some newer features now rely more on direct Supabase data access and component-level state than on this older store

## 9. Internal Product Systems Implemented in Code

These are not external libraries, but they are important technical systems in the project:

- **History search engine and topic shaping**
  - Topic parsing and normalization
  - Search result to dossier flow

- **Experience/intelligence system**
  - compare mode
  - timeline engine
  - world map layer
  - recommendations
  - paths
  - notes/bookmarks
  - knowledge profile
  - collections/shelves

- **Collectible visual card system**
  - deterministic visual identity logic for historical topics and paths

- **Cinematic UI layer**
  - premium navigation, cards, map surface, loader, reading and library styling

## 10. Development Tooling

- **ESLint 9**
  - Main linting tool
  - Uses:
    - `eslint-config-next/core-web-vitals`
    - `eslint-config-next/typescript`
  - Evidence:
    - [`eslint.config.mjs`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/eslint.config.mjs)

- **Type checking through Next build**
  - TypeScript is validated during build

- **npm**
  - Package manager in use
  - Evidence:
    - `package-lock.json`

## 11. Asset and Media Handling

- **Next Image**
  - Used for optimized image rendering where needed
  - `remotePatterns` currently allow:
    - `https://lh3.googleusercontent.com/aida-public/**`
  - Evidence:
    - [`next.config.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/next.config.ts)

## 12. Environment Variables Currently Referenced

The codebase currently references these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `AI_API_KEY`
- `NEXT_PUBLIC_AI_API_URL`
- `NEXT_PUBLIC_SITE_URL`

Related files:
- [`src/lib/supabase/env.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/lib/supabase/env.ts)
- [`src/app/api/search/route.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/api/search/route.ts)
- [`src/app/api/intelligence/route.ts`](C:/Users/ASUS%20TUF%20GAMING%2015/Desktop/histo/src/app/api/intelligence/route.ts)

## 13. What the Project Is Not Using

To avoid confusion, this project currently does **not** use these technologies in the main architecture:

- Prisma
- Drizzle ORM
- MongoDB
- GraphQL
- tRPC
- Redux
- Material UI
- shadcn/ui
- Chakra UI
- Express as a separate backend server

## 14. Practical Architecture Summary

In practical terms, the project is built with:

- **Next.js App Router** as the full-stack framework
- **React + TypeScript** for UI and application logic
- **Tailwind CSS v4 + custom CSS** for the premium visual system
- **Supabase** for auth, database, storage, and persisted user data
- **DeepSeek Chat API** for AI-powered history generation and intelligence features
- **Custom i18n + locale proxy** for multilingual routing and RTL/LTR behavior
- **Framer Motion + Lucide React** for motion and iconography
- **ESLint + TypeScript** for code quality

## 15. Main Technology Map by Responsibility

- **Frontend UI**
  - React
  - Next.js
  - Tailwind CSS
  - custom CSS
  - Lucide React
  - Framer Motion

- **Backend / Full-stack**
  - Next.js route handlers
  - Next.js server rendering

- **Database / Auth / Storage**
  - Supabase
  - Supabase Postgres
  - Supabase Auth
  - Supabase Storage

- **AI**
  - DeepSeek Chat API
  - custom prompt/service layer

- **Localization**
  - custom i18n config + dictionaries + locale provider
  - locale-aware request proxy

- **State**
  - React state
  - Zustand

- **Tooling**
  - TypeScript
  - ESLint
  - PostCSS
  - npm

---

Generated from the current repository state on `2026-04-17`.
