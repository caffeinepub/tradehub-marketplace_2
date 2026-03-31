# TradeHub Marketplace

## Current State
All core buy/sell/chat/review/admin features are implemented. Several UI buttons exist but have no click handlers:
- Cart button on ProductCard: calls `e.stopPropagation()` only
- ShoppingCart icon in Header: no onClick
- Bell icon in Header: no onClick
- NavBar nav links (Explore Categories, Trending, Deals, Help Center): no handlers

## Requested Changes (Diff)

### Add
- Shopping cart state managed in App.tsx: `cartItems: Product[]` with `addToCart`, `removeFromCart`, `clearCart` handlers
- Cart sheet/drawer in Header (or triggered from header ShoppingCart icon): shows cart items, item count badge on the icon, remove button per item, "Buy Now" button per item (opens chat), "Clear All" button
- NavBar: wire Explore Categories to scroll to `#products` section; Trending to sort products by newest (createdAt desc); Deals to sort by lowest price; Help Center to open LiveSupportChat
- Bell icon in Header: shows unread message count badge if `hasMessages` is true, clicking it opens the seller inbox (or Messages for logged-in users)
- Pass `onCartClick`, `onTrendingClick`, `onDealsClick`, `onHelpClick`, `onExploreClick` props from App to NavBar
- Pass `onCartClick` prop from App to ProductCard (via ProductGrid)
- Pass `cartCount` and `onCartClick` to Header

### Modify
- App.tsx: add cart state, pass cart handlers to ProductCard via ProductGrid and to Header; add sort mode state (`trending` | `deals` | null) affecting displayed products order; pass Help Center open trigger to NavBar
- ProductCard: "Cart" button calls `onAddToCart()` instead of just stopping propagation
- ProductGrid: accept and forward `onAddToCart` prop
- Header: ShoppingCart icon shows badge with cart count, clicking opens CartSheet; Bell icon clicking opens messages (calls `onMessagesClick` if available)
- NavBar: accept and call all nav handler props

### Remove
- Nothing removed

## Implementation Plan
1. Add cart state (`cartItems`, `addToCart`, `removeFromCart`, `clearCart`) in App.tsx
2. Add `sortMode` state (`null | 'trending' | 'deals'`) in App.tsx; apply sort to `filteredProducts` before slice
3. Create `CartSheet` component (Sheet from shadcn) showing cart items list with remove + buy buttons and cart count
4. Wire Header ShoppingCart icon: show count badge, onClick opens CartSheet
5. Wire Header Bell icon: onClick calls `onMessagesClick` (if available)
6. Wire NavBar buttons: Explore Categories scrolls to #products; Trending sets sortMode; Deals sets sortMode; Help Center fires a callback to open LiveSupportChat
7. Wire ProductCard Cart button to call `onAddToCart`
8. Thread all new props through App → ProductGrid → ProductCard and App → Header and App → NavBar
