# Spacing & layout

## Scale

4pt base: **4, 8, 12, 16, 24, 32, 48, 64, 96**. Nothing in the mockups uses a value outside this
list. If a gap looks like 20px, it's 24px.

## Breakpoints

| Name | Width | Page padding | Product grid | Notes |
|---|---|---|---|---|
| Desktop | ≥1024 | 32px, content max 1200px | 4 columns (3 with the filter sidebar) | Sidebar 248px, gap 40px |
| Tablet | 768–1023 | 24px | 3 columns | Filters collapse into a drawer behind a button |
| Mobile | <768 | 20px | 2 columns | Bottom tab bar, sticky action bar on detail and cart |

Grid gutter is 24px at every breakpoint.

## Radius

| Value | Applied to |
|---|---|
| 6px | Buttons, inputs, chips-that-aren't-pills, small thumbnails |
| 10px | Product cards, panels, summary boxes |
| 16px | Hero feature panel |
| Pill | Category chips, cart count badge, avatars (50%) |

## Fixed heights

| Element | Height |
|---|---|
| Desktop header | 76px |
| Mobile header | 60px |
| Search field | 44px |
| Button default / small / large | 48 / 38 / 56px |
| Input | 50px |
| Quantity stepper | 44px (34px in mobile cart rows) |
| Chip | 36px |

## Product card anatomy

```
┌─────────────────────────┐
│  image, 1:1, cover      │  discount tag pinned top-left, flush to edge
│                     ♡   │  wishlist 32px circle, top-right, 10px inset
├─────────────────────────┤
│  CATEGORY               │  mono 11px, uppercase, +0.10em
│  Product title over     │  Inter 600 15px, clamp 2 lines
│  two lines              │
│  ★★★★★  4.94            │  stars 13px + mono value
│                         │
│  $9.27   $9.99          │  mono 17px 700, was-price 13px struck
│  ● In stock             │  status dot + label 11px
└─────────────────────────┘
```
Padding 16px. Border 1px Line. The price row is pushed to the bottom with `margin-top: auto` so
prices align across a row even when titles wrap differently.

## Vertical rhythm

Sections are 64px top and bottom. Section heading to content is 24px. Inside a panel, 24px padding
and 12px between stacked rows. Page title block to first content is 28px.
