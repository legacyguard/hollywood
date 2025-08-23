# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview
- Stack: Vite + React + TypeScript, Tailwind CSS, shadcn/ui primitives, React Router, TanStack Query, Supabase client
- Path alias: "@" -> ./src (configured in vite.config.ts and tsconfig)

Common commands
- Install dependencies
  - npm install
- Start development server (Vite)
  - npm run dev
  - Server config: host "::" (IPv6 all interfaces), port 8080 (see vite.config.ts)
- Build
  - Production build: npm run build
  - Development-mode build: npm run build:dev
- Preview the production build locally
  - npm run preview
- Lint
  - npm run lint
- Tests
  - No test runner is configured in this repository as of now.

High-level architecture
- Tooling and config
  - Vite (vite.config.ts)
    - Plugins: @vitejs/plugin-react-swc; development-only: lovable-tagger
    - Resolve alias: "@" -> ./src
    - Dev server: host "::", port 8080
  - TypeScript
    - tsconfig.app.json for app code, tsconfig.node.json for tooling, tsconfig.json sets baseUrl and paths
  - Tailwind
    - tailwind.config.ts extends theme to map CSS variables (tokens), uses tailwindcss-animate plugin
    - postcss.config.js enables tailwindcss and autoprefixer
  - ESLint
    - Flat config (eslint.config.js) with typescript-eslint, react-hooks, and react-refresh

- Entry and application shell
  - src/main.tsx mounts <App /> to #root
  - src/App.tsx wraps the app with providers and routing:
    - QueryClientProvider (TanStack Query)
    - TooltipProvider (shadcn/ui)
    - Toaster (shadcn/ui) and Sonner notifications
    - BrowserRouter with routes:
      - "/" -> src/pages/Index.tsx
      - "*" -> src/pages/NotFound.tsx

- Routing and pages
  - src/pages/Index.tsx composes the dashboard page using the shared layout (DashboardLayout) and feature content (DashboardContent)
  - src/pages/NotFound.tsx logs 404s to console.error and renders a simple fallback with a link back to "/"

- Layout system
  - src/components/DashboardLayout.tsx
    - Provides the app shell: left sidebar + main content
    - Uses SidebarProvider/SidebarTrigger from the local sidebar implementation
  - src/components/AppSidebar.tsx
    - Sidebar nav built with components from components/ui/sidebar
    - Uses React Router NavLink for active states; renders navigation items and a simple user block
  - src/components/ui/sidebar.tsx
    - Local, composable sidebar primitives with context
    - Persists expanded/collapsed state to a cookie ("sidebar:state")
    - Mobile behavior uses a Sheet overlay; desktop uses fixed/inset/floating variants
    - Keyboard shortcut: Ctrl/Cmd + b toggles the sidebar

- UI primitives and theming
  - components/ui/* contains shadcn-style primitives extended for this design system (e.g., button.tsx uses class-variance-authority and cn from src/lib/utils)
  - src/index.css defines the design tokens with CSS variables (HSL), including brand colors, sidebar palette, status/progress tokens, radii, and shadows
  - tailwind.config.ts maps those variables to Tailwind theme keys (colors, shadows, radii) and enables class-based dark mode

- State, data, and notifications
  - TanStack Query is pre-wired via QueryClientProvider (no queries shown yet)
  - Notifications
    - components/ui/toaster and components/ui/sonner are mounted in App
    - hooks/use-toast.ts implements a lightweight in-memory toast store compatible with shadcn/ui Toast

- Supabase integration
  - src/integrations/supabase/client.ts creates a typed Supabase client with SSR-safe configuration and Clerk integration
  - The client is ready for use via: import { supabase, useSupabaseClient } from "@/integrations/supabase/client"
  - Includes useSupabaseClient hook for Clerk authentication integration

Development notes
- Import alias "@" is preferred for intra-project imports (e.g., "@/components/...", "@/lib/utils")
- To add a routed page, create a component under src/pages and register a <Route> in src/App.tsx
- The dashboard UI is composed from reusable primitives in components/ui and higher-level pieces in components/* (e.g., DashboardLayout, AppSidebar, PillarCard, ProgressBar)

Important README context
- Local development: ensure Node.js and npm are installed; use npm install and npm run dev
- The project was scaffolded via Lovable; publishing can be initiated from Lovable’s UI (Share -> Publish)

Product onboarding narrative (Guardian of Memories)
- Theme: The user becomes a "Guardian of Memories" guided by a friendly "Firefly". Tone is calming, dignified, celebratory of care and love (not fear or loss). All UI copy must reflect this.

- Act 1: Invitation to the journey (Onboarding)
  - Scene 1 – Promise of calm: Subtle firefly animation over a calm night scene (dark theme). CTA: "Start writing my story".
  - Scene 2 – The Box of Certainty: Assistant asks an emotional prompt about what would go into a single box for loved ones. Large free-form input; entered items gently animate into a visual box.
  - Scene 3 – The Key of Trust: Assistant asks for the one trusted person’s name; the key engraving updates with that name (e.g., "For Martina").
  - Scene 4 – Preparing the path: Thank you message; firefly draws a light trail (logo-like) as a loading animation and then redirect to the dashboard.

- Act 2: Building the legacy (First month)
  - Scene 1 – First mosaic stone: On first successful document upload and extraction, show a tasteful notification with a mosaic icon: "Great! You’ve placed the first stone in your family’s mosaic of certainty." Reinforce meaning over mechanics.
  - Scene 2 – Quiet guardian: For documents approaching expiry (e.g., passport in 3 months), send a gentle notification/email. Example subject: "A small reminder from your memory guardian." Body emphasizes reassurance and discretion.
  - Scene 3 – Unlocking the next chamber: After securing 5–7 items in the TODAY pillar, on next sign-in present a light unlock moment; make the TOMORROW – Family Protection pillar active.

- Act 3: Message to the future (Long-term)
  - Scene 1 – Time Capsule (Premium): Video messages presented like letter writing (e.g., "For my daughter Anna" → "On her 18th birthday"). After upload, animate sealing into an envelope and placing it into the Box of Certainty.
  - Scene 2 – Annual ritual: One year after registration, send a dignified summary email with progress metrics and a reflective nudge to review and update.
  - Scene 3 – Legacy complete: When all three pillars reach ~90%+, celebrate with a brief, tasteful animation: the Box of Certainty glows warmly; the engraved key meets the box. Assistant copy acknowledges completion and continued guardianship.

Implementation pointers (non-prescriptive)
- Routing and flow: Implement onboarding as a short multi-step flow (e.g., /onboarding) that collects non-sensitive, emotionally framed inputs. On completion, redirect to "/".
- Visual language: Prefer subtle motion (firefly trails) over spinners; use existing design tokens (CSS variables) for colors and elevation; dark mode friendly.
- Progress and gating: Use existing pillar cards (isActive/isLocked) to reflect unlocks; drive from simple heuristics (e.g., count of secured items) until backend rules exist.
- Notifications: Keep copy supportive and non-intrusive. Use the example subject/body as tone references. Prefer in-app toast for instant feedback; email/push for time-based reminders.
- Data handling: Initial onboarding inputs can be ephemeral (client state) unless explicitly persisted. When persistence is introduced, prefer typed Supabase interactions via the provided client.

Language policy (critical)
- All code, comments, and UI strings must be written in English.
- Even if tasks or prompts are provided in Slovak or Czech, implement UI copy and identifiers in English. If localization is needed, add/extend i18n resources but keep defaults in English.
- If any Slovak/Czech text is discovered outside i18n resources, replace it with English.
