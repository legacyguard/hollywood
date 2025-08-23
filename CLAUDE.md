# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React application built with Vite, TypeScript, and modern web technologies for LegacyGuard - a secure document management platform.

### Key Technologies
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Authentication**: Clerk (OAuth Google + password auth)
- **Database**: Supabase with Row Level Security (RLS)
- **Encryption**: Client-side encryption using TweetNaCl
- **Routing**: React Router v6 with v7 future flags enabled
- **State Management**: TanStack Query for server state

### Application Structure

#### Authentication Flow
- Clerk handles authentication with both Google OAuth and password strategies
- All routes except `/sign-in/*` and `/sign-up/*` are protected via `ProtectedRoute`
- Authentication state is managed through `ClerkProvider` with custom styling

#### Main Application Pages
- `/` - Dashboard (Index page)
- `/onboarding` - Multi-scene onboarding flow
- `/vault` - Document storage and management
- `/guardians` - Guardian management features
- `/legacy` - Legacy planning features

#### Security Architecture
- **Client-side encryption**: Files are encrypted using TweetNaCl before upload to Supabase
- **User isolation**: Each user's encryption keys stored in localStorage with user ID prefix
- **Supabase RLS**: Row Level Security ensures users only access their own data
- **Secure file storage**: Encrypted files stored in Supabase Storage with user-based folder structure

#### Component Organization
- `src/components/ui/` - shadcn/ui components with custom styling
- `src/components/features/` - Feature-specific components (DocumentUploader, DocumentList)
- `src/components/auth/` - Authentication-related components
- `src/pages/` - Route components organized by feature area
- `src/integrations/supabase/` - Supabase client and type definitions

#### Key Integrations

**Supabase Setup:**
- Documents metadata stored in `documents` table with automatic `user_id` population via `auth.uid()`
- Private storage bucket `user_documents` with RLS policies
- See `supabase/README.md` and `supabase/QUICK_FIX.md` for setup details

**Encryption Implementation:**
- Each user gets unique encryption keys stored locally
- Files encrypted client-side before upload using public/private key pairs
- Metadata includes nonce, ephemeral keys, and file information

## Environment Configuration

Copy `env.template` to `.env.local` and configure:
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

**Important**: Never commit environment files - they're blocked by `.gitignore` and pre-commit hooks.

## Code Style & Conventions

- TypeScript with strict mode enabled
- ESLint configured with React hooks and TypeScript rules
- Unused variables rule disabled (`@typescript-eslint/no-unused-vars: "off"`)
- shadcn/ui component patterns with Tailwind CSS
- Path aliases configured: `@/*` maps to `src/*`
- File naming: PascalCase for components, camelCase for utilities

## Database Migrations

Located in `supabase/migrations/`:
- `001_create_documents_table.sql` - Main documents table with RLS
- `002_disable_rls_for_dev.sql` - Development RLS configuration
- `003_storage_policies.sql` - Storage bucket security policies

## UI System & Layout Architecture

### Layout Components
- `DashboardLayout.tsx` - App shell with left sidebar + main content using SidebarProvider
- `AppSidebar.tsx` - Navigation sidebar with React Router NavLink active states
- `components/ui/sidebar.tsx` - Composable sidebar primitives with context
  - Persists expanded/collapsed state to cookie ("sidebar:state")
  - Mobile: Sheet overlay, Desktop: fixed/inset/floating variants
  - Keyboard shortcut: Ctrl/Cmd + b toggles sidebar

### Design System
- `src/index.css` - Design tokens with CSS variables (HSL format)
- Brand colors, sidebar palette, status/progress tokens, radii, shadows
- `tailwind.config.ts` - Maps CSS variables to Tailwind theme keys
- shadcn/ui primitives in `components/ui/*` extended for design system
- Uses class-variance-authority and cn utility from `src/lib/utils`

### Notifications System
- Dual toast system: `components/ui/toaster` + `components/ui/sonner`
- `hooks/use-toast.ts` - Lightweight in-memory toast store
- Both mounted in App.tsx for global availability

## Product & User Experience

### Guardian of Memories Narrative
**Theme**: User becomes a "Guardian of Memories" guided by a friendly "Firefly"
**Tone**: Calming, dignified, celebratory of care and love (not fear or loss)

### Onboarding Flow (Act 1)
- Scene 1 – Promise of calm: Firefly animation over night scene, CTA: "Start writing my story"
- Scene 2 – The Box of Certainty: Emotional prompt about items for loved ones, visual box animation
- Scene 3 – The Key of Trust: Name entry with key engraving update (e.g., "For Martina")
- Scene 4 – Preparing the path: Firefly light trail animation, redirect to dashboard

### Progress System (Act 2)
- First document upload: "Great! You've placed the first stone in your family's mosaic of certainty"
- Document expiry notifications: "A small reminder from your memory guardian"
- Pillar unlocks: After 5-7 TODAY items, unlock TOMORROW – Family Protection pillar

### Premium Features (Act 3)
- Time Capsule: Video messages as letter writing ("For my daughter Anna" → "On her 18th birthday")
- Annual ritual: Progress summary email with reflective nudge
- Legacy complete: Box of Certainty glow animation when all pillars ~90%+

## Implementation Guidelines

### Visual Language
- Prefer subtle motion (firefly trails) over spinners
- Use existing design tokens from CSS variables
- Dark mode friendly animations and interactions

### Progress & Gating
- Use existing pillar cards (isActive/isLocked) for unlocks
- Drive from simple heuristics (count of secured items)
- Supportive, non-intrusive notification copy

### Data Flow
- Initial onboarding inputs can be ephemeral (client state)
- Use typed Supabase interactions via provided client for persistence
- TanStack Query for server state management

## Language Policy (Critical)

- **All code, comments, and UI strings must be written in English**
- Even if tasks/prompts are in Slovak/Czech, implement in English
- If localization needed, extend i18n resources but keep English defaults
- Replace any Slovak/Czech text outside i18n with English

## Development Notes

- The application uses React Router v7 future flags for forward compatibility
- Clerk authentication appearance is heavily customized to match the application's design system
- All file operations include client-side encryption before storage
- Document uploads automatically refresh the document list via TanStack Query
- Import alias "@" preferred for intra-project imports
- No test runner currently configured
- Vite dev server runs on IPv6 all interfaces (host "::"), port 8080