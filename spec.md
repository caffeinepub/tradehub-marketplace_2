# TradeHub Marketplace

## Current State
Product cards are displayed in a grid. Clicking "Buy Now" opens a chat modal. There is no dedicated product detail page — clicking the card itself does nothing navigational. Reviews open in a dialog. Seller profile opens in a panel.

## Requested Changes (Diff)

### Add
- `ProductDetailPage.tsx` — full-page product view with: large image, title, price, full description, seller info (verified badge, link to seller profile), star rating summary, inline reviews list, "Buy Now" button (opens chat modal), "Add to Wishlist" button, back navigation
- `selectedProduct` state in `App.tsx` to track which product is being viewed in detail

### Modify
- `ProductCard.tsx` — make the entire card clickable (navigate to detail page); "Buy Now" still opens chat as before but clicking the image/title area navigates to detail
- `ProductGrid.tsx` — add `onProductClick: (product: Product) => void` prop and pass it to each card
- `App.tsx` — add `selectedProduct` state; when set, render `ProductDetailPage` instead of the main grid; pass `onBuyNow`, `onViewSeller`, `onViewReviews` through the detail page

### Remove
- Nothing removed — all existing modals (chat, reviews panel, seller profile) remain and are triggered from the detail page

## Implementation Plan
1. Create `src/frontend/src/components/ProductDetailPage.tsx`
   - Two-column layout on desktop (image left, info right), stacked on mobile
   - Back button at top to return to grid
   - Image with category badge and sold overlay
   - Price, title, description
   - Seller row: truncated principal, verified badge, clickable to open seller profile
   - Star rating bar + review count, "See all reviews" link
   - Inline reviews list (reuse review rendering logic)
   - "Buy Now" and "Add to Wishlist" action buttons
2. Update `ProductCard.tsx` to call `onProductClick` when the card body is clicked
3. Update `ProductGrid.tsx` to accept and propagate `onProductClick`
4. Update `App.tsx` to manage `selectedProduct` state and render `ProductDetailPage` when set
