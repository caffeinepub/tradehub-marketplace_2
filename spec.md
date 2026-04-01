# TradeHub Marketplace

## Current State
Backend has authorization mixin with role-based access (#guest, #user, #admin). Admin panel has Stripe config, admin promotion, and verified seller management. No analytics tracking. No dedicated authorized users management UI. No bootstrap admin.

## Requested Changes (Diff)

### Add
- Bootstrap admin: hardcode principal `aic5z-horrw-4jwce-ms65y-wcupc-tori5-ojc35-pyfit-3cwqh-cvcjo-zae` as permanent admin on first initialization
- Backend: `trackVisit()` public call to increment site visit counter
- Backend: `getAnalytics()` admin-only — returns visitCount, totalSales count, totalRevenue, registeredUsers count, activeListings count
- Backend: `addAuthorizedUser(principal)` admin-only — grants #user role and adds to tracked list
- Backend: `removeAuthorizedUser(principal)` admin-only — demotes to #guest role
- Backend: `getAuthorizedUsers()` admin-only — returns list of authorized principals
- Backend: `trackSale(price)` internal — called from markProductAsSold to track revenue
- AdminPanel: Analytics dashboard section (visit count, total sales, revenue, users, active listings)
- AdminPanel: Authorized Users management section (list current users, add by principal ID, remove)
- First-login-becomes-admin logic: if no admins exist yet, first sign-in auto-promotes to admin

### Modify
- `markProductAsSold` — also increment sales counter and revenue
- `createProduct` — only authorized users (#user or #admin) can create; guests cannot
- AdminPanel — add two new sections: Analytics and Authorized Users
- App.tsx — call `trackVisit()` on load

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo`: add stable analytics vars, bootstrap admin init, analytics/authorized-user methods
2. Update AdminPanel.tsx: add Analytics dashboard, Authorized Users management sections
3. Update App.tsx: call `trackVisit()` on app load
4. Update backend.d.ts to include new function signatures
