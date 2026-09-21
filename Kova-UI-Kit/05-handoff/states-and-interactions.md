# States & interactions

The mockups are still images. This is what they do when touched.

## Every interactive element

| State | Treatment |
|---|---|
| Hover | Buttons darken ~6%. Cards lift with a soft shadow and the border goes to Ink 45. Links underline. |
| Active | 1px downward nudge on buttons |
| Focus | 2px `#2563EB` ring, 2px offset, on `:focus-visible`. Never remove it. |
| Disabled | Line soft fill, Ink 45 text, `cursor: not-allowed`, keeps its label |

Anything clickable is reachable by Tab, in visual order, and activates on Enter and Space.

## Loading

- List and grid fetches → skeleton cards at the real dimensions, so nothing shifts on arrival
- A button that triggers a request → spinner replaces the label, width held fixed
- Never a full-page spinner. Keep the header and footer; swap only the region that's loading.
- `prefers-reduced-motion` → hold the skeleton's mid tone still instead of sweeping

## Forms

Validate on blur, not on every keystroke. Re-validate on submit. On error: red border, glow, and a
message below naming the problem and the fix. Move focus to the first invalid field.

Password reveal swaps the eye icon and the input type. Announce it to screen readers.

## Cart

Adding from a card or the detail page bumps the header badge and shows a brief confirmation.
Quantity respects `minimumOrderQuantity` as the floor and `stock` as the ceiling — disable the
stepper buttons at the limits rather than allowing an invalid number.

Removing an item asks for no confirmation but offers an undo. Totals recalculate immediately.

## Search

Debounce input by ~300ms. Show the skeleton grid while the request is out. Echo the query in the
results heading so it's clear what was searched. Clearing the field returns to the unfiltered list.

## Filters and pagination

Filter state lives in the URL query string so a filtered view can be shared and survives a reload.
Changing a filter resets to page one. Pagination scrolls to the top of the grid, not the page.

## Responsive behaviour

| Breakpoint | Changes |
|---|---|
| <1024 | Filter sidebar becomes a drawer behind a button; grid drops to 3 |
| <768 | Grid drops to 2; bottom tab bar appears; header nav collapses; detail and cart get sticky action bars; tables become stacked cards |

Touch targets are 44px minimum. The quantity stepper and wishlist heart are the two that most often
fail this — check them.
