# Colour

Values are exact. Sample the PNGs if you're unsure — they were rendered from these tokens.

## Core

| Token | Hex | Used for |
|---|---|---|
| Ink | `#101418` | Headings, dark surfaces (footer, dark button), icon strokes |
| Ink 70 | `#4A525C` | Body copy, secondary labels |
| Ink 45 | `#7C858F` | Captions, placeholders, disabled text, breadcrumb separators |
| Line | `#E2E5E9` | Card borders, input borders, dividers |
| Line soft | `#EFF1F3` | Inner dividers inside a panel (spec rows, list rows) |
| Paper | `#FFFFFF` | Page and card background |
| Canvas | `#F5F6F7` | Section backgrounds, search field fill, image wells |

## Accent

| Token | Hex | Used for |
|---|---|---|
| Signal | `#FFD400` | Primary button, discount tag, active nav underline, active sidebar marker |
| Signal deep | `#E5BE00` | 1.5px border on the primary button only |

Signal is the only saturated colour on the page. If you find yourself reaching for it a third time
in one viewport, one of those uses is decoration — cut it.

## Status — driven by `availabilityStatus` and `stock`

| Token | Hex | Condition |
|---|---|---|
| Stock in | `#128A5B` | `stock > 10` — "In stock" |
| Stock low | `#B84A08` | `1 ≤ stock ≤ 10` — "Low stock · N left" |
| Stock out | `#A3121C` | `stock === 0` — "Out of stock". Also form error text and borders. |

Stock colour appears as a 6px dot plus label at 11px/600. Never as a background fill.

## Focus

| Token | Hex | Used for |
|---|---|---|
| Focus | `#2563EB` | Keyboard focus ring, 2px offset 2px |

Focus blue is used nowhere else. Do not remove `:focus-visible` outlines — it's marked.

## Contrast

Ink on Paper is 17.4:1. Ink on Signal is 12.1:1. Ink 45 on Paper is 4.0:1, so it is only used at
13px and above for non-essential text. Never put white text on Signal.
