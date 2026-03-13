# Gulmohar Vatika

## Current State
A plant nursery website with plant cards, detail dialog (modal), cart system, WhatsApp ordering, and footer. Outdoor flowering/foliage plants only. Cart shows unique item count. Cart dialog has no shipping logic. Footer 'Gulmohar Vatika' text is green. No search or filter/sort.

## Requested Changes (Diff)

### Add
- Back button and Share button (browser native Web Share API) in plant detail view
- Floating sticky "Add to Cart" card at bottom of plant detail page, always visible on scroll. Hover → dark yellow background.
- Search button/bar in plants section to filter plants by name
- Floating Filter + Sort buttons on the plants page with dropdown panels:
  - Filter: Plant Type (All, Flowering, Foliage, Indoor), Price Range (All, Under ₹200, ₹200-₹400, Above ₹400)
  - Sort: Name A-Z, Price Low to High, Price High to Low
- 10 indoor plants with 54% discount and custom MRP/price:
  - Money Plant: MRP ₹300, price ₹138
  - Snake Plant: MRP ₹600, price ₹276
  - Areca Palm: MRP ₹900, price ₹414
  - Spider Plant: MRP ₹250, price ₹115
  - Peace Lily: MRP ₹350, price ₹161
  - ZZ Plant: MRP ₹500, price ₹230
  - Syngonium: MRP ₹350, price ₹161
  - Jade Plant: MRP ₹400, price ₹184
  - Aglaonema: MRP ₹1000, price ₹460
  - Philodendron: MRP ₹800, price ₹368
  - Category: foliage (indoor)
- Shipping logic in cart: if bill amount > ₹499 → shipping ₹0, else shipping ₹59
- Grand total section breakdown: Bill Amount + Shipping + Grand Total

### Modify
- Plant detail: convert Dialog to full-screen scrollable panel/sheet. Top row: back button (left) + share button (right). Add to Cart section moved to floating sticky bottom card.
- Cart dialog title: show total quantity (sum of all item.quantity) not unique count (cart.length)
- Cart items: plus/minus buttons should NOT navigate to plant page. Only item name and image clicks should navigate.
- WhatsApp message: add total quantity and shipping charges
- Footer: "Gulmohar Vatika" text next to logo → color black (#000000)
- Cart items area: explicitly scrollable (max-h with overflow-y-auto)

### Remove
- Nothing removed

## Implementation Plan
1. Add 10 indoor plants to FALLBACK_PLANTS with PlantCategory.foliage, add custom PLANT_PRICES map and PLANT_MRP map for per-plant pricing
2. Add images for indoor plants to PLANT_IMAGES
3. Add PLANT_INFO entries for all 10 indoor plants
4. Convert PlantDetailDialog from Dialog to full-screen Sheet/panel with: scrollable content, back button, share button (navigator.share), floating Add to Cart sticky at bottom with hover dark yellow
5. Add search state + filtered plant list in AppInner
6. Add floating Filter + Sort UI with state for active filters/sort
7. Fix CartDialog: title shows sum of quantities, items section scrollable, shipping logic, breakdown in grand total
8. Fix cart item click: only name/image navigates, plus/minus stops propagation
9. Update WhatsApp message to include shipping and total quantity
10. Fix footer Gulmohar Vatika text color to black
