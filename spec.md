# TradeHub Marketplace

## Current State
When a buyer clicks "Buy Now" on a product card, a `ProductChatModal` opens. The buyer must manually type their name before they can chat. No auto-message is sent. Sellers have no dedicated inbox — they can only see product messages if they manually open the same product's chat. There's no notification or count badge for unread seller messages.

## Requested Changes (Diff)

### Add
- Auto-send an initial purchase inquiry message when a buyer opens chat via "Buy Now": "Hi! I'm interested in buying [product title]. Is it still available?"
- A **Seller Inbox** panel accessible from My Listings (or header dropdown) showing all conversations for a seller's products, grouped by product, with unread count badge
- Sellers can open any conversation from the inbox and reply directly

### Modify
- `ProductChatModal`: accept an optional `identity` prop. If the user is authenticated, pre-fill the sender name with their principal (short form) and skip the name entry step. If `fromBuyNow` prop is true, auto-send the purchase inquiry message on first open.
- `App.tsx`: pass `identity` and `fromBuyNow={true}` to `ProductChatModal` when opened via "Buy Now" button
- `Header` or `MyListings`: add a "Messages" button/badge showing unread count for sellers

### Remove
- Nothing removed

## Implementation Plan
1. Update `ProductChatModal` to:
   - Accept `identity?: Identity` and `fromBuyNow?: boolean` props
   - If `identity` is present, skip the name-entry screen and use a short principal string as the sender
   - If `fromBuyNow` is true and messages are empty (first open), auto-send "Hi! I'm interested in buying [product title]. Is it still available?" immediately
2. Update `App.tsx` to pass `identity` and `fromBuyNow` to `ProductChatModal`
3. Create `SellerInbox` component:
   - Fetches all products owned by the logged-in seller
   - For each product, fetches messages and shows the latest plus count
   - Allows clicking a product conversation to open `ProductChatModal` in seller reply mode
4. Add "Messages" link in header dropdown (when logged in) that opens `SellerInbox`
5. Show unread badge count on Messages link (messages with last activity)
