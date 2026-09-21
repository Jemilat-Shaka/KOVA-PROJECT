# Components

Every component that appears more than once. Build these first — the pages are mostly assembly.

---

## Price tag

The signature element. A rectangle with a notch cut into its left edge, like a paper price tag.

- Notch: 7px triangle cut from the left edge, vertically centred
- Fill Signal `#FFD400`, text Ink, JetBrains Mono 700, 11px, +0.04em
- Padding: 5px 10px 5px 16px (the extra left padding clears the notch)
- A 4px Ink dot sits at the start of the label at 55% opacity
- Reverse variant: Ink fill, Signal text and dot

**Rule: a price tag only ever contains a number that came from the API.** `-13%` from
`discountPercentage`, `194 PRODUCTS` from `total`. Never a marketing word on its own.

Where it appears: product card (top-left of the image, when `discountPercentage >= 5`), detail page
next to the price, hero eyebrow, cart rows.

---

## Buttons

| Variant | Fill | Text | Border |
|---|---|---|---|
| Primary | Signal | Ink | 1.5px Signal deep |
| Dark | Ink | White | none |
| Ghost | transparent | Ink | 1.5px Line |
| Disabled | Line soft | Ink 45 | 1.5px Line soft |

Heights 48 / 38 / 56. Radius 6px. Inter 600 15px. Icon + label gap 8px.

States: hover darkens the fill ~6%; active drops 1px; focus shows the blue ring. Disabled buttons
keep their label — never replace it with a spinner without also keeping the width fixed.

---

## Product card

See the anatomy diagram in `spacing-and-layout.md`. Used on home, listing, search, detail
(related products), and account (wishlist) — five screens. Build it once as a real component.

Behaviour:
- Whole card is one link to the product detail page
- The wishlist heart is a separate control inside it — stop the click from bubbling
- Discount tag renders only when `discountPercentage >= 5`; below that the was-price is hidden too
- Out of stock: the card stays fully legible. Do not grey it out. The red status label does the job.

---

## Rating

Five 13px stars, filled to `Math.round(rating)`, then the exact value in mono. Filled star is Ink,
empty is `#D3D7DC`. On the detail page, stars are 17px and the review count follows.

Do not invent half-stars — the design uses whole stars plus the printed number.

---

## Stock indicator

6px dot plus label, 11px, weight 600, coloured by state. Derived from `stock`:

```
stock === 0        →  "Out of stock"           Stock out
stock <= 10        →  "Low stock · {n} left"   Stock low
stock > 10         →  "In stock"               Stock in
```

DummyJSON also sends `availabilityStatus` as a string. Either source is fine, but pick one and be
consistent — don't show "Low Stock" on one screen and "Low stock · 5 left" on another.

---

## Quantity stepper

44px tall, 1.5px Line border, radius 6. Minus and plus are 44px squares; the value sits between
them in a 46px cell with 1.5px dividers either side, mono 700.

Minimum is `minimumOrderQuantity` (not 1 — product 1 has a minimum of 24). Maximum is `stock`.
Disable the minus at minimum and the plus at maximum rather than letting the number go invalid.

---

## Inputs

50px tall, 1.5px Line, radius 6, 14px horizontal padding, Inter 15px.

- Focus: border Ink, 3px `rgba(16,20,24,.10)` glow
- Error: border Stock out, 3px `rgba(163,18,28,.10)` glow, message below at 13px with a warning icon
- Label above at 13px/600, 8px gap
- Password fields carry the eye icon inset 15px from the right

Error text names what's wrong and what to do. "Username or password is incorrect." Not "Invalid input."

---

## Chips

36px pill, 1.5px Line, 14px padding, Inter 550 13px. Selected state inverts to Ink fill, white text.
A selected filter chip carries a 13px close icon.

---

## Header

76px, 1px bottom border. Left to right: logo, nav links, search field (flexes to fill), account
icon, cart icon with count badge. The active nav link gets a 2px Signal underline via inset
box-shadow so it doesn't shift the text.

Cart badge: 19px min-width pill, Ink fill, white mono 10px, 2px white border, offset into the icon's
top-right corner. Hide it at zero rather than showing "0".

Mobile: 60px, logo left, search and cart icons right, plus a fixed bottom tab bar
(Shop / Search / Cart / Account) where the active item is Ink and the rest Ink 45.

---

## Skeletons

Match the real component's dimensions exactly so nothing jumps when data arrives. Background is a
three-stop gradient `#EDEFF1 → #F6F7F8 → #EDEFF1` sweeping left to right over ~1.4s.

Respect `prefers-reduced-motion` — hold the mid tone still instead of animating.

---

## Empty, error, and no-results blocks

Centred column: 74px rounded square in Canvas holding a 30px icon, then Display 3 heading, then one
line of body at max 440px, then one or two buttons.

Copy pattern: say what happened, then give the way out. "Your cart is empty" → "Nothing here yet.
Browse 194 products across 24 categories and add something you like." → *Browse products*.
