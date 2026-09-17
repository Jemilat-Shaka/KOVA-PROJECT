# Kova — E-commerce UI Kit

A complete visual specification for a storefront built on **DummyJSON** (`https://dummyjson.com`).
Everything here is design material: screens, assets, tokens, and the data contract. There is no
starter code — writing the HTML, CSS, and JavaScript is the assignment.

Kova is a fictional general marketplace. It sells the real DummyJSON catalogue: 194 products
across 24 categories, from mascara to a Dodge Charger.

---

## What's in the box

```
Kova-UI-Kit/
├── README.md                      ← you are here
│
├── 01-screens/                    ← the mockups to build from
│   ├── desktop/                   1440px wide, @2x
│   │   ├── 01-home.png
│   │   ├── 02-product-listing.png
│   │   ├── 03-search-results.png
│   │   ├── 04-product-detail.png
│   │   ├── 05-cart.png
│   │   ├── 06-checkout.png
│   │   ├── 07-login.png
│   │   └── 08-account-orders.png
│   ├── mobile/                    390px wide, @2x
│   │   ├── 01-home.png
│   │   ├── 02-product-listing.png
│   │   ├── 03-product-detail.png
│   │   ├── 04-cart.png
│   │   └── 05-login.png
│   └── states/                    the screens people forget
│       ├── 01-loading-skeletons.png
│       ├── 02-empty-cart.png
│       ├── 03-no-search-results.png
│       └── 04-api-error.png
│
├── 02-assets/
│   ├── icons/                     23 SVG icons, 24×24, stroke 1.7
│   ├── logo/                      mark + lockup, light and reverse
│   ├── product-placeholders/      12 tinted JPGs — use ONLY until the API images load
│   └── avatars/                   reviewer + user avatars
│
├── 03-design-system/
│   ├── style-guide.png            every token, rendered
│   ├── colors.md
│   ├── typography.md
│   ├── spacing-and-layout.md
│   └── components.md
│
├── 04-data/                       real DummyJSON response shapes
│   ├── api-reference.md           endpoints students will need
│   ├── ui-data-mapping.md         which field feeds which pixel
│   ├── sample-product.json
│   ├── sample-products-list.json
│   ├── sample-cart.json
│   ├── sample-categories.json
│   └── sample-auth-login.json
│
└── 05-handoff/
    ├── screen-inventory.md        what each screen must contain
    ├── states-and-interactions.md hover, focus, loading, error, empty
    └── acceptance-checklist.md    how the work gets marked
```

---

## Fonts

Three free Google Fonts. Link them in the `<head>`:

| Role | Family | Where it's used |
|---|---|---|
| Display | **Bricolage Grotesque** | Page headings, section headings, logo, totals |
| Interface | **Inter** | Everything else — body, labels, buttons, nav |
| Data | **JetBrains Mono** | Prices, SKU, barcode, counts, query strings |

```
https://fonts.google.com/specimen/Bricolage+Grotesque
https://fonts.google.com/specimen/Inter
https://fonts.google.com/specimen/JetBrains+Mono
```

Using mono for anything that came out of the database is a deliberate rule, not decoration.
It's the fastest way for a marker to see that a number is real API data and not hard-coded.

---

## About the product images

The tinted shapes in `02-assets/product-placeholders/` are **not** the final images. Real photos
come from the API on every product:

```json
"thumbnail": "https://cdn.dummyjson.com/.../thumbnail.webp",
"images": ["https://cdn.dummyjson.com/.../1.webp"]
```

Use `thumbnail` in cards and cart rows, `images[]` in the detail gallery. The placeholders exist
so the layout has something to sit on before the fetch resolves, and as an `onerror` fallback.

---

## Assignment scope

**Minimum:** home, listing with category filter and pagination, search, product detail, cart.
Plus the four states — a build with no loading and no empty state is not finished.

**Stretch:** login against `/auth/login`, account and order history, checkout, wishlist, sort
controls, price and rating filters.

Start at `03-design-system/style-guide.png`. Set up the tokens first, then build the product card,
then the listing page. The card is used on five of the eight screens — get it right once.
