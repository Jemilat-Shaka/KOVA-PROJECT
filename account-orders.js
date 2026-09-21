// ---------- Data ----------
// In a real app these would come from the API (dummyjson.com).
// Kept as plain data here so the rendering logic is easy to see.

const orders = [
  { cart: '#51', date: '23 May 2024', items: 5, total: 4288.95, status: 'delivered' },
  { cart: '#42', date: '11 May 2024', items: 2, total: 1899.94, status: 'shipped' },
  { cart: '#19', date: '02 Apr 2024', items: 5, total: 2140.00, status: 'delivered' },
];

const wishlist = [
  {
    category: 'Groceries',
    name: 'Green Bell Pepper',
    rating: 4.28,
    price: 1.18,
    originalPrice: 1.29,
    discount: 8,
    stock: { level: 'low', label: 'Low stock · 8 left' },
    image: './02-assets/product-placeholders/ph-groceries.jpg',
  },
  {
    category: 'Womens-bags',
    name: 'Marc Jacobs Shoulder Bag',
    rating: 4.31,
    price: 166.43,
    originalPrice: 189.99,
    discount: 12,
    stock: { level: 'in', label: 'In stock' },
    image: './02-assets/product-placeholders/ph-womens-bags.jpg',
  },
  {
    category: 'Womens-jewellery',
    name: 'Green Emerald Earring',
    rating: 4.62,
    price: 951.29,
    originalPrice: null,
    discount: null,
    stock: { level: 'in', label: 'In stock' },
    image: './02-assets/product-placeholders/ph-womens-jewellery.jpg',
  },
];

// ---------- Helpers ----------

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusLabel = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
};

function starsMarkup(rating) {
  const fullStars = Math.round(rating); // out of 5
  let html = '<span class="stars">';
  for (let i = 0; i < 5; i++) {
    const filled = i < fullStars;
    const icon = filled
      ? './02-assets/icons/star-filled.svg'
      : './02-assets/icons/star-empty.svg';
    html += `<img src="${icon}" alt="">`;
  }
  html += `</span> ${rating.toFixed(2)}`;
  return html;
}

// ---------- Render: order history ----------

function renderOrders() {
  const table = document.getElementById('orders-table');
  const cartsCount = document.getElementById('carts-count');

  cartsCount.textContent = `${orders.length} cart${orders.length !== 1 ? 's' : ''}`;

  orders.forEach((order) => {
    const row = document.createElement('div');
    row.className = 'orders-row';
    row.innerHTML = `
      <span class="cart-id">${order.cart}</span>
      <span>${order.date}</span>
      <span>${order.items} product${order.items !== 1 ? 's' : ''}</span>
      <span class="total">${formatCurrency(order.total)}</span>
      <span class="status ${order.status}">${statusLabel[order.status] || order.status}</span>
    `;
    table.appendChild(row);
  });
}

// ---------- Render: wishlist ----------

function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');

  wishlist.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'wishlist-card';

    const discountTag = product.discount
      ? `<div class="discount-tag">−${product.discount}%</div>`
      : '';

    const originalPrice = product.originalPrice
      ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>`
      : '';

    const stockClass = product.stock.level === 'in' ? 'in' : 'low';

    card.innerHTML = `
      <div class="wishlist-thumb">
        ${discountTag}
        <img src="${product.image}" alt="${product.name}" class="wishlist-img">
      </div>
      <div class="wishlist-body">
        <p class="wishlist-category">${product.category}</p>
        <h3 class="wishlist-name">${product.name}</h3>
        <div class="wishlist-rating">${starsMarkup(product.rating)}</div>
        <div class="wishlist-price">${formatCurrency(product.price)}${originalPrice}</div>
        <span class="stock ${stockClass}">${product.stock.label}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- Interactions ----------

function bindAccountNav() {
  document.querySelectorAll('.account-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.account-nav-link').forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function bindSignOut() {
  document.getElementById('signout-btn').addEventListener('click', () => {
    // Placeholder: wire this up to real sign-out logic.
    console.log('Sign out clicked');
  });
}

// ---------- Init ----------

document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  renderWishlist();
  bindAccountNav();
  bindSignOut();
});