# TradeHub Marketplace

## Current State
- `useProductMessages` polls every 3000ms with `staleTime: 5000`
- `ProductChatModal` and `SellerInbox` both use polling for messages
- `Header` has `hasMessages` prop but App.tsx never computes or passes it — the notification dot is always off
- Seller inbox lists conversations but there's no real-time badge update at the header level

## Requested Changes (Diff)

### Add
- `useMyMessageCount` hook in `useQueries.ts` that fetches all of the signed-in seller's products and checks total message count, polling every 2 seconds
- Compute `hasMessages` in `App.tsx` using `useMyMessageCount` and pass it to `Header`

### Modify
- `useProductMessages`: reduce `refetchInterval` to 2000 and `staleTime` to 0 so new messages appear quickly for both buyer and seller
- `useSupportMessages`: reduce `refetchInterval` to 3000 and `staleTime` to 0
- App.tsx: pass computed `hasMessages` to `<Header>`

### Remove
- Nothing removed

## Implementation Plan
1. In `useQueries.ts`, lower `refetchInterval` to 2000 and `staleTime` to 0 for `useProductMessages`
2. Add `useMyMessageCount` hook that: fetches `getMyProducts()`, then for each product fetches `getMarketPlaceMessagesByProduct`, returns total message count. Poll every 5 seconds.
3. In `App.tsx`, call `useMyMessageCount` and pass `hasMessages={myMessageCount > 0}` to `<Header>`
