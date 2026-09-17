# Typography

Three families, three jobs. Mixing them up is the fastest way to make the build look wrong.

- **Bricolage Grotesque** — display. Weight 700. Tight tracking. Headings only.
- **Inter** — interface. 400/500/600/650. All body, labels, buttons, nav.
- **JetBrains Mono** — data. 600/700. Anything that came from the API as a number or code.

## Scale

| Name | Family / weight | Size | Line height | Letter spacing | Used on |
|---|---|---|---|---|---|
| Display 1 | Bricolage 700 | 56px | 1.02 | −0.028em | Home hero headline |
| Display 2 | Bricolage 700 | 40px | 1.06 | −0.024em | Page titles (Your cart, Sign in, Beauty) |
| Display 3 | Bricolage 700 | 30px | 1.12 | −0.020em | Section headings (Top rated right now) |
| Heading 1 | Bricolage 700 | 22px | 1.20 | −0.015em | Panel titles (Summary, Delivery address) |
| Heading 2 | Inter 650 | 18px | 1.30 | −0.010em | Cart row product name, review author |
| Heading 3 | Inter 600 | 16px | 1.35 | 0 | Filter group titles, list item titles |
| Body | Inter 400 | 15px | 1.60 | 0 | Paragraphs, descriptions |
| Small | Inter 400 | 13px | 1.50 | 0 | Meta, helper text, counts |
| Micro | Inter 400 | 11px | 1.40 | 0 | Timestamps, fine print |
| Eyebrow | JetBrains Mono 600 | 11px | 1.40 | +0.14em, uppercase | Section kickers |
| Price | JetBrains Mono 700 | 17px | 1 | −0.02em | Card price |
| Price large | JetBrains Mono 700 | 38px | 1 | −0.02em | Detail page price |

Mobile: Display 1 drops to 34px, Display 2 to 30px, Display 3 to 26px. Body and below stay put.

## Where mono is mandatory

Price, was-price, cart totals, `rating` value, stock count, SKU, barcode, product and cart counts,
pagination numbers, order IDs, dates in reviews, and any query string shown in the UI
(`?limit=12&skip=0`). Everything else is Inter.

## Card titles

Two lines maximum, clamped with ellipsis. DummyJSON titles run long
("Apple MacBook Pro 14 Inch Space Grey") so reserve the height — the card body has a `min-height`
on the title so a one-line title and a two-line title produce the same card height in a grid.
