# TradeHub Marketplace

## Current State
Full-stack marketplace app with Motoko backend + React frontend. Backend implements products, reviews, chat, auth, Stripe, and user profiles. Frontend renders header, hero, product grid, and multiple panels/modals. Build passes but user reports things "not showing" — logo, sign-in, and content are invisible or broken at runtime.

## Requested Changes (Diff)

### Add
- ErrorBoundary wrapping at the root level in main.tsx
- Defensive error handling for `getMyProducts` (unauthenticated users hitting protected methods)
- Explicit fallback rendering for when actor is still loading

### Modify
- main.tsx: wrap App with ErrorBoundary
- useMyMessageCount: add .catch() to prevent unhandled rejection crashing the query
- Header: ensure logo and Sign In / Sign Up buttons render unconditionally and are never hidden by CSS
- App.tsx: fix any race conditions between actor loading and data fetching that cause blank states
- Ensure backend.d.ts types align with useQueries.ts for getCallerUserProfile returning optional

### Remove
- Nothing to remove

## Implementation Plan
1. Wrap App in ErrorBoundary in main.tsx
2. Add catch blocks to useMyMessageCount query
3. Audit Header.tsx to ensure logo and auth buttons are always visible at all viewport sizes
4. Audit App.tsx to ensure it handles isFetching state gracefully and never shows blank page
5. Validate and build
