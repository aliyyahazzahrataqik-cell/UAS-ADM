const API_URL = 'http://localhost:3000/api';

let cart = [];
let categories = [];
let products = [];
let appliedCoupon = null;
const SHIPPING_COST = 25000;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
  loadCart();
  document.getElementById('checkout-form').addEventListener('submit', submitOrder);
});

// Utilities
function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value);
}

function scrollTo(selector) {
  document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
}

// Load Categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    categories = await response.json();
    renderCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

function renderCategories() {
  const container = document.getElementById('categories-list');
  if (categories.length === 0) {
    container.innerHTML = '<p>Tidak ada kategori</p>';
    return;
  }

  container.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterByCategory(${cat.id})">
      <h3>${cat.name}</h3>
      <p>${cat.description || ''}</p>
    </div>
  `).join('');
}

// Load Products
async function loadProducts(categoryId = null) {
  try {
    let url = `${API_URL}/products`;
    if (categoryId) url += `?category_id=${categoryId}`;

    const response = await fetch(url);
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function renderProducts() {
  const container = document.getElementById('products-list');

  if (products.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Tidak ada produk tersedia</p></div>';
    return;
  }

  container.innerHTML = products.map(product => {
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const displayPrice = hasDiscount ? product.discount_price : product.price;

    return `
      <div class="product-card">
        <div class="product-image">🌹</div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${formatCurrency(displayPrice)}</div>
          ${hasDiscount ? `<div style="color: #888; text-decoration: line-through;">${formatCurrency(product.price)}</div>` : ''}
          <div class="product-stock">Stok: ${product.stock}</div>
          <button
            class="add-to-cart-btn"
            onclick="addToCart(${product.id}, '${product.name}', ${displayPrice})"
            ${product.stock === 0 ? 'disabled' : ''}
          >
            ${product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterByCategory(categoryId) {
  loadProducts(categoryId);
  scrollTo('#products');
}

// Cart Management
function addToCart(productId, productName, price) {
  const existing = cart.find(item => item.product_id === productId);

  if (existing) {
    existing.quantity += 1;
    existing.subtotal = existing.quantity * existing.price;
  } else {
    cart.push({
      product_id: productId,
      product_name: productName,
      price: price,
      quantity: 1,
      subtotal: price
    });
  }

  saveCart();
  updateCartUI();
  showAlert('Produk ditambahkan ke keranjang!', 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product_id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, quantity) {
  const item = cart.find(i => i.product_id === productId);
  if (item && quantity > 0) {
    item.quantity = quantity;
    item.subtotal = item.quantity * item.price;
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) cart = JSON.parse(saved);
  updateCartUI();
}

function updateCartUI() {
  updateCartCount();
  renderCartItems();
  calculateTotal();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function renderCartItems() {
  const container = document.getElementById('cart-items');

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Keranjang belanja kosong</p></div>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div style="color: #888;">${formatCurrency(item.price)} × ${item.quantity}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button onclick="updateQuantity(${item.product_id}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.product_id}, ${item.quantity + 1})">+</button>
        </div>
        <div style="min-width: 100px; text-align: right;">
          <div style="font-weight: bold;">${formatCurrency(item.subtotal)}</div>
          <button class="remove-btn" onclick="removeFromCart(${item.product_id})">Hapus</button>
        </div>
      </div>
    </div>
  `).join('');
}

function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = subtotal * (appliedCoupon.value / 100);
      if (appliedCoupon.max_discount) {
        discount = Math.min(discount, appliedCoupon.max_discount);
      }
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total = subtotal + SHIPPING_COST - discount;

  document.getElementById('subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('shipping').textContent = formatCurrency(SHIPPING_COST);
  document.getElementById('total').textContent = formatCurrency(Math.max(0, total));
}

async function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim();

  if (!code) {
    showAlert('Masukkan kode kupon', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/coupons/${code}`);
    if (!response.ok) throw new Error('Kupon tidak ditemukan');

    const coupon = await response.json();
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

    if (subtotal < coupon.min_purchase) {
      showAlert(`Minimum pembelian ${formatCurrency(coupon.min_purchase)}`, 'error');
      return;
    }

    appliedCoupon = coupon;
    let discount = 0;

    if (coupon.type === 'percent') {
      discount = subtotal * (coupon.value / 100);
      if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
    } else {
      discount = coupon.value;
    }

    document.getElementById('discount-info').textContent =
      `Diskon: -${formatCurrency(discount)}`;
    calculateTotal();
    showAlert('Kupon diterapkan!', 'success');
  } catch (error) {
    showAlert('Kupon tidak valid', 'error');
    appliedCoupon = null;
    document.getElementById('discount-info').textContent = '';
    calculateTotal();
  }
}

function checkout() {
  if (cart.length === 0) {
    showAlert('Keranjang belanja kosong', 'error');
    return;
  }

  document.getElementById('checkout').style.display = 'block';
  scrollTo('#checkout');
}

function cancelCheckout() {
  document.getElementById('checkout').style.display = 'none';
  document.getElementById('checkout-form').reset();
  scrollTo('#cart');
}

async function submitOrder(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percent'
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value;
    if (appliedCoupon.max_discount) {
      discount = Math.min(discount, appliedCoupon.max_discount);
    }
  }

  const orderData = {
    customer_id: 1,
    recipient_name: formData.get('recipient_name'),
    recipient_phone: formData.get('recipient_phone'),
    address_street: formData.get('address_street'),
    address_city: formData.get('address_city'),
    address_province: formData.get('address_province'),
    address_postal: formData.get('address_postal'),
    card_message: formData.get('card_message'),
    delivery_date: formData.get('delivery_date'),
    delivery_time: formData.get('delivery_time'),
    subtotal: subtotal,
    shipping_cost: SHIPPING_COST,
    discount_amount: discount,
    total: subtotal + SHIPPING_COST - discount,
    coupon_code: appliedCoupon ? appliedCoupon.code : null,
    items: cart
  };

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error('Gagal membuat pesanan');

    const result = await response.json();
    cart = [];
    appliedCoupon = null;
    saveCart();
    updateCartUI();
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('checkout-form').reset();
    document.getElementById('coupon-code').value = '';

    showAlert(`Pesanan berhasil dibuat! No. Pesanan: ${result.order_number}`, 'success');
    scrollTo('#home');
  } catch (error) {
    showAlert('Gagal membuat pesanan: ' + error.message, 'error');
  }
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  document.body.insertBefore(alertDiv, document.body.firstChild);

  setTimeout(() => alertDiv.remove(), 4000);
}
