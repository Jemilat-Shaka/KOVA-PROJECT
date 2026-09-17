# DummyJSON — endpoints for this build

Base URL: `https://dummyjson.com` — no key, no signup, no CORS problems.
Full docs: `https://dummyjson.com/docs`

Writes (POST, PUT, PATCH, DELETE) return a realistic, correct-looking response but **nothing
persists**. Refetch and the original data is back. Cart state has to live in your app.

---

## Products

| What you need | Request |
|---|---|
| Product grid, page 1 | `GET /products?limit=12&skip=0` |
| Page N | `GET /products?limit=12&skip={(N-1)*12}` |
| One product | `GET /products/{id}` |
| Search | `GET /products/search?q=phone` |
| Sort | `GET /products?sortBy=price&order=asc` |
| Category list (with names) | `GET /products/categories` |
| Category slugs only | `GET /products/category-list` |
| Products in a category | `GET /products/category/smartphones` |
| Lighter payload | add `&select=title,price,thumbnail,rating,stock,discountPercentage` |
| Fake a slow network | add `&delay=1500` (0–5000ms) |

Every list response is wrapped the same way:

```json
{ "products": [ ... ], "total": 194, "skip": 0, "limit": 30 }
```

`total` is the count for *that* query, not the whole catalogue — `/products/search?q=phone` returns
`total: 23`. Pagination maths uses `total`, so read it from the response rather than hard-coding.

**`delay` is worth knowing about.** It's the only honest way to see your own loading skeletons on a
fast connection.

### Filtering, honestly

DummyJSON has no price or rating filter parameter. The sidebar in the mockup shows price, rating,
and availability filters — those are **client-side**, applied to the page you already fetched.
That is a real and normal constraint to design around, and worth saying out loud in a README.

Category filtering *is* server-side, via `/products/category/{slug}`.

---

## Carts

| What you need | Request |
|---|---|
| A cart | `GET /carts/{id}` |
| A user's carts (order history) | `GET /carts/user/{userId}` |
| Simulate adding | `POST /carts/add` with `{ userId, products: [{ id, quantity }] }` |
| Simulate updating | `PUT /carts/{id}` with `{ merge: true, products: [...] }` |

The response computes the money for you:

```json
{
  "products": [
    { "id": 144, "title": "Cricket Helmet", "price": 44.99, "quantity": 4,
      "total": 179.96, "discountPercentage": 11.47, "discountedTotal": 159.32,
      "thumbnail": "..." }
  ],
  "total": 4794.8,
  "discountedTotal": 4288.95,
  "totalProducts": 5,
  "totalQuantity": 20
}
```

Note `totalProducts` (distinct lines) and `totalQuantity` (units) are different numbers, and the
cart screen shows both: "3 products · 27 items".

---

## Auth

```
POST /auth/login
{ "username": "emilys", "password": "emilyspass", "expiresInMins": 30 }
```

Returns the user plus `accessToken` and `refreshToken`. Then:

```
GET /auth/me
Authorization: Bearer {accessToken}
```

Any account from `https://dummyjson.com/users` works. The password is always the first name
lowercased plus `pass` — `emilys` / `emilyspass`, `michaelw` / `michaelwpass`.

A wrong password returns **400** with `{ "message": "Invalid credentials" }`. The login mockup shows
that error state — build it.

`POST /auth/refresh` with the refresh token extends the session.

---

## Images

Products carry real image URLs:

```json
"thumbnail": "https://cdn.dummyjson.com/.../thumbnail.webp",
"images": ["https://cdn.dummyjson.com/.../1.webp"]
```

Some products have one image, some have several. The detail gallery must handle both — don't assume
`images[1]` exists.

DummyJSON also generates placeholders on demand:
`https://dummyjson.com/image/400x400/f5f6f7/101418?text=Kova`

---

## Handling the unhappy path

| Situation | What to show |
|---|---|
| Request in flight | `states/01-loading-skeletons.png` |
| `products: []` from a search | `states/03-no-search-results.png` |
| Network failure or 5xx | `states/04-api-error.png`, with a retry button that actually refetches |
| `GET /products/999999` | 404 — route to a "product not found" page, not a blank screen |
| Cart with no items | `states/02-empty-cart.png` |

A build that only works when the network is fast and the query matches is not finished.
