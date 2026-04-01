# TradeHub Marketplace

## Current State
Stripe checkout sessions can be created and verified, but payment data is never persisted. The admin dashboard shows general analytics but no payment history, commission totals, or per-transaction records.

## Requested Changes (Diff)

### Add
- `PaymentTransaction` type: buyerId, productId, productTitle, amount (in cents), commission (3%), status, sessionId, date
- `recordPayment(productId, sessionId, amount)` backend method — saves transaction after verified payment; only called by authenticated users
- `getPaymentTransactions()` backend method — admin only, returns all stored transactions
- Admin Panel "Payments" section showing: total revenue, total commission earned, and a table of all transactions
- Frontend calls `recordPayment` after Stripe payment is verified in ProductDetailPage

### Modify
- `getAnalytics()` to also include total commission from stored payment records
- Admin Panel layout: add Payments section between Analytics and Authorized Users

### Remove
- Nothing removed

## Implementation Plan
1. Add `PaymentTransaction` type and stable storage to `main.mo`
2. Add `recordPayment` (shared, authenticated) and `getPaymentTransactions` (query, admin-only) to `main.mo`
3. Update `backend.d.ts` with new types and methods
4. Update `ProductDetailPage` to call `recordPayment` after `verifyStripePayment` succeeds
5. Add Payments section to `AdminPanel` — stat cards for total revenue + commission, scrollable table of all transactions
