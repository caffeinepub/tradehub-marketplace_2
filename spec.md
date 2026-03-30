# TradeHub Marketplace

## Current State
SellModal and MyListings EditDialog use a text input for image URL. Blob-storage mixin is integrated; StorageClient exists in the frontend.

## Requested Changes (Diff)

### Add
- useStorageClient hook that creates a StorageClient from config + authenticated agent.
- Image file upload UX in SellModal: file picker with preview, uploads on submit.
- Image file upload UX in MyListings EditDialog: shows current image, allows replacement.

### Modify
- SellModal.tsx: Replace imageUrl text input with image file upload. Upload to blob storage on submit, use resulting URL as imageUrl.
- MyListings.tsx EditDialog: Replace imageUrl text input with file upload. Keep existing URL if no new file selected.

### Remove
- imageUrl text input fields from SellModal and EditDialog.

## Implementation Plan
1. Create src/frontend/src/hooks/useStorageClient.ts using loadConfig() and HttpAgent with identity.
2. Update SellModal.tsx with image upload field.
3. Update MyListings.tsx EditDialog with image upload field.
