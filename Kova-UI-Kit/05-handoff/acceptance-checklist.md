# Acceptance checklist

Hand this to students with the brief. It is also the marking sheet.

## Data
- [ ] Every product value on screen comes from the API — no hard-coded titles, prices, or ratings
- [ ] Pagination uses `limit` and `skip`, and reads `total` from the response
- [ ] Search hits `/products/search?q=`
- [ ] Categories come from `/products/categories`, not a typed-out array
- [ ] Cart totals use `total` and `discountedTotal` from the response, not recomputed
- [ ] Card prices apply `discountPercentage` to `price` correctly
- [ ] Products with no `brand`, or one image, render without breaking or printing "undefined"
- [ ] The README says which parts are mocked (order dates, statuses, shipping)

## States
- [ ] Skeletons match the real card dimensions — no layout shift when data lands
- [ ] Empty cart state
- [ ] No-results state, with a way back
- [ ] Error state with a retry that actually refetches
- [ ] 404 for a product id that doesn't exist
- [ ] Tested with `&delay=2000` and with the network throttled to offline

## Visual fidelity
- [ ] Three fonts loaded and used in their assigned roles
- [ ] Mono used for every price, count, SKU, and rating value
- [ ] Colours match the tokens in `03-design-system/colors.md`
- [ ] Spacing lands on the 4pt scale
- [ ] Card, button, input, and tag match the style guide
- [ ] Stock indicator shows all three states somewhere in the build

## Responsive
- [ ] Works at 1440, 1024, 768, and 390 with no horizontal scroll
- [ ] Grid steps 4 → 3 → 2 columns
- [ ] Filters collapse on tablet and below
- [ ] Mobile bottom tab bar and sticky action bars present
- [ ] Touch targets 44px or larger

## Accessibility
- [ ] Visible focus ring on every interactive element
- [ ] Full keyboard path through search, filter, add to cart, checkout
- [ ] Images have alt text from `title`; decorative placeholders have empty alt
- [ ] Colour is never the only signal — stock state carries a label, not just a dot
- [ ] `prefers-reduced-motion` respected
- [ ] Headings nest properly, one `h1` per page

## Craft
- [ ] Long titles clamp instead of breaking the grid
- [ ] `$1.29` and `$32,999.99` both render cleanly
- [ ] Images have a fixed aspect ratio so the grid doesn't jump as they load
- [ ] No console errors
- [ ] Deployed and reachable at a live URL
