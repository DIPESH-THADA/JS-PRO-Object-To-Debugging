"use strict";

// =================================================================
//  favorites.js  –  Renders saved favorites on favorites.html
//  Matches shop.html card style: hover cart, discount price,
//  VAT display, star ratings, and correct fav badge updates.
// =================================================================

const FAV_KEY  = "dfashion_favorites";
const CART_KEY = "dfashion_cart";
const THEME_KEY = "dfashion_theme";
const VAT_RATE  = 0.15;

// -----------------------------------------------------------------
//  Helpers
// -----------------------------------------------------------------
function getFavorites() {
  try {
    const stored = localStorage.getItem(FAV_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
}

function saveFavorites(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update ALL cart badges on the page
function updateCartBadge() {
  const total = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll(".cart-badge").forEach((b) => { b.textContent = total; });
}

// Update ALL fav badges on the page — called after every fav change
function updateFavBadge() {
  const count = getFavorites().length;
  document.querySelectorAll(".fav-badge").forEach((b) => { b.textContent = count; });
}

// -----------------------------------------------------------------
//  Remove from favorites
// -----------------------------------------------------------------
function removeFromFavorites(productId) {
  let favs = getFavorites().filter((f) => String(f.id) !== String(productId));
  saveFavorites(favs);
  updateFavBadge();   // ← update badge immediately
  renderFavorites();
}

// -----------------------------------------------------------------
//  Add to cart from favorites page
// -----------------------------------------------------------------
function addToCartFromFav(product) {
  const cart     = getCart();
  const productId = product.id;
  const existing  = cart.find((item) => String(item.id) === String(productId));

  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + 1;
  } else {
    // Use discounted price if available
    const salePrice = product.discountPercent
      ? parseFloat((product.price * (1 - product.discountPercent / 100)).toFixed(2))
      : product.price;
    cart.push({
      id:       productId,
      name:     product.name,
      price:    salePrice,
      image:    product.image || "./assets/images/default-product.png",
      quantity: 1,
      rating:   product.rating || 0,
    });
  }
  saveCart(cart);
  updateCartBadge();
  alert(product.name + " added to cart!");
}

// -----------------------------------------------------------------
//  Build a single fav card DOM element — matches shop.html card style
// -----------------------------------------------------------------
function buildFavCard(item) {
  const card = document.createElement("div");
  card.className = "shop-card fav-item";
  card.setAttribute("data-fav-id", item.id);

  // ── Image wrap ──
  const imgWrap = document.createElement("div");
  imgWrap.className = "shop-card-img-wrap";

  // Discount badge (red) — only shown if product has discountPercent
  if (item.discountPercent) {
    const badge = document.createElement("span");
    badge.className = "shop-discount-badge";
    badge.textContent = "-" + item.discountPercent + "%";
    imgWrap.appendChild(badge);
  }

  // Product image
  const imgLink = document.createElement("a");
  imgLink.href  = "./product.html?id=" + item.id;
  imgLink.className = "pd-card-link";
  const img = document.createElement("img");
  img.className = "shop-card-img product-img";
  img.src = item.image || "./assets/images/default-product.png";
  img.alt = item.name;
  imgLink.appendChild(img);
  imgWrap.appendChild(imgLink);

  // Hover "Add To Cart" button — hidden by CSS, slides up on hover
  const hoverCart = document.createElement("button");
  hoverCart.className = "shop-hover-cart-btn add-to-cart-fav";
  hoverCart.setAttribute("data-fav-id", item.id);
  hoverCart.textContent = "Add To Cart";
  hoverCart.addEventListener("click", function (e) {
    e.stopPropagation();
    const current = getFavorites().find((f) => String(f.id) === String(item.id));
    if (current) addToCartFromFav(current);
  });
  imgWrap.appendChild(hoverCart);

  card.appendChild(imgWrap);

  // ── Info section ──
  const info = document.createElement("div");
  info.className = "details shop-card-info";

  // Star rating row
  const starsRow = document.createElement("div");
  starsRow.className = "shop-card-stars-row";
  const stars = document.createElement("span");
  stars.className = "star-rating";
  stars.style.setProperty("--rating", item.rating || 0);
  stars.setAttribute("data-rating", item.rating || 0);
  const reviewCount = document.createElement("span");
  reviewCount.className = "shop-review-count";
  reviewCount.textContent = "(" + (item.rating || 0).toFixed(1) + ")";
  starsRow.appendChild(stars);
  starsRow.appendChild(reviewCount);
  info.appendChild(starsRow);

  // Product name
  const nameLink = document.createElement("a");
  nameLink.href = "./product.html?id=" + item.id;
  nameLink.className = "product-name pd-card-link";
  nameLink.textContent = item.name;
  info.appendChild(nameLink);

  // Price row — show discount + VAT exactly like shop.html
  const priceRow = document.createElement("div");
  priceRow.className = "price_favorite";

  const priceSpan = document.createElement("span");
  priceSpan.className = "prices";

  if (item.discountPercent) {
    const discountedPrice = (item.price * (1 - item.discountPercent / 100)).toFixed(2);
    const vatPrice = (parseFloat(discountedPrice) * (1 + VAT_RATE)).toFixed(2);
    priceSpan.innerHTML =
      '<span class="shop-orig-price">RON ' + item.price.toFixed(2) + '</span> ' +
      '<span class="shop-disc-price">RON ' + discountedPrice + '</span>' +
      '<small>(incl. VAT: RON ' + vatPrice + ')</small>';
  } else {
    const vatPrice = (item.price * (1 + VAT_RATE)).toFixed(2);
    priceSpan.innerHTML =
      'RON ' + Number(item.price).toFixed(2) +
      ' <small>(incl. VAT: RON ' + vatPrice + ')</small>';
  }

  priceRow.appendChild(priceSpan);
  info.appendChild(priceRow);
  card.appendChild(info);

  // ── Action buttons below card ──
  const actions = document.createElement("div");
  actions.className = "fav-actions";

  // "Add To Cart" button (visible, below card)
  const cartBtn = document.createElement("button");
  cartBtn.className = "cart-btn add-to-cart-fav";
  cartBtn.setAttribute("data-fav-id", item.id);
  cartBtn.textContent = "Add To Cart";
  cartBtn.addEventListener("click", function () {
    const current = getFavorites().find((f) => String(f.id) === String(item.id));
    if (current) addToCartFromFav(current);
  });
  actions.appendChild(cartBtn);

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-fav btn btn-sm btn-outline-danger mt-2";
  removeBtn.setAttribute("data-fav-id", item.id);
  removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Remove';
  removeBtn.addEventListener("click", function () {
    removeFromFavorites(item.id);
  });
  actions.appendChild(removeBtn);

  card.appendChild(actions);

  return card;
}

// -----------------------------------------------------------------
//  Render favorites list
// -----------------------------------------------------------------
function renderFavorites() {
  const container = document.querySelector(".favorites-section");
  if (!container) return;

  const favs = getFavorites();

  if (favs.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites text-center py-5">
        <i class="fa-regular fa-heart" style="font-size:3rem;color:#ccc;"></i>
        <h3 class="mt-3">No favorites yet</h3>
        <p>Click the heart icon on any product to save it here.</p>
        <a href="./index.html" class="btn btn-primary mt-2">Browse Products</a>
      </div>`;
    updateFavBadge();
    return;
  }

  container.innerHTML = "";

  // Count header
  const countDiv = document.createElement("div");
  countDiv.className = "fav-count mb-3";
  const countSpan = document.createElement("span");
  countSpan.className = "badge-text";
  countSpan.textContent = favs.length + " item" + (favs.length > 1 ? "s" : "") + " saved";
  countDiv.appendChild(countSpan);
  container.appendChild(countDiv);

  // Grid
  const grid = document.createElement("div");
  grid.className = "fav-grid";

  favs.forEach((item) => {
    grid.appendChild(buildFavCard(item));
  });

  container.appendChild(grid);
  updateFavBadge();
}

// -----------------------------------------------------------------
//  Theme
// -----------------------------------------------------------------
function initTheme() {
  const isDark = localStorage.getItem(THEME_KEY) === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.classList.toggle("fa-sun",  isDark);
    icon.classList.toggle("fa-moon", !isDark);
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark-mode");
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
      const ic = document.getElementById("theme-icon");
      if (ic) { ic.classList.toggle("fa-sun", dark); ic.classList.toggle("fa-moon", !dark); }
    });
  }
}

// -----------------------------------------------------------------
//  Init
// -----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  renderFavorites();
  updateCartBadge();
  updateFavBadge();

  // Back to top
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Current year
  const yearEl = document.querySelector(".year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});