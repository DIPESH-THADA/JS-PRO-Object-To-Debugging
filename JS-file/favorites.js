"use strict";

// =================================================================
//  favorites.js  –  Renders saved favorites on favorites.html
// =================================================================

const FAV_KEY = "dfashion_favorites";
const CART_KEY = "dfashion_cart";

// -----------------------------------------------------------------
//  Helpers
// -----------------------------------------------------------------
function getFavorites() {
  try {
    const stored = localStorage.getItem(FAV_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
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
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  badge.textContent = total;
}

function updateFavBadge() {
  const badge = document.querySelector(".fav-badge");
  if (!badge) return;
  badge.textContent = getFavorites().length;
}

// -----------------------------------------------------------------
//  Remove from favorites
// -----------------------------------------------------------------
function removeFromFavorites(productId) {
  let favs = getFavorites().filter((f) => String(f.id) !== String(productId));
  saveFavorites(favs);
  renderFavorites();
  updateFavBadge();
}

// -----------------------------------------------------------------
//  Add to cart from favorites page
// -----------------------------------------------------------------
function addToCartFromFav(product) {
  const cart = getCart();
  const productId = product.id;
  const existing = cart.find((item) => String(item.id) === String(productId));
  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image || "./assets/images/default-product.png",
      quantity: 1,
      rating: product.rating || 0,
    });
  }
  saveCart(cart);
  updateCartBadge();
  alert(product.name + " added to cart!");
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
        <i class="fa-regular fa-heart" style="font-size: 3rem; color: #ccc;"></i>
        <h3 class="mt-3">No favorites yet</h3>
        <p>Click the heart icon on any product to save it here.</p>
        <a href="./index.html" class="btn btn-primary mt-2">Browse Products</a>
      </div>`;
    updateFavBadge();
    return;
  }

  container.innerHTML = `
    <div class="fav-count mb-3">
      <span class="badge-text">${favs.length} item${favs.length > 1 ? "s" : ""} saved</span>
    </div>
    <div class="fav-grid">
      ${favs
        .map(
          (item) => `
        <div class="product-items fav-item" data-fav-id="${item.id}">
          <img class="product-img"
               src="${item.image || "./assets/images/default-product.png"}"
               alt="${item.name}">
          <div class="details">
            <span class="product-name">${item.name}</span>
            <div class="price_favorite">
              <span class="prices">RON ${Number(item.price).toFixed(2)}</span>
            </div>
            <span class="star-rating"
                  data-rating="${item.rating || 0}"
                  style="--rating: ${item.rating || 0};"></span>
          </div>
          <div class="fav-actions">
            <button class="cart-btn add-to-cart-fav"
                    data-fav-id="${item.id}">
              Add To Cart
            </button>
            <button class="btn btn-sm btn-outline-danger remove-fav mt-2"
                    data-fav-id="${item.id}">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>`;

  updateFavBadge();

  // Add to cart buttons
  container.querySelectorAll(".add-to-cart-fav").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-fav-id");
      const item = getFavorites().find((f) => String(f.id) === String(id));
      if (item) addToCartFromFav(item);
    });
  });

  // Remove buttons
  container.querySelectorAll(".remove-fav").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-fav-id");
      removeFromFavorites(id);
    });
  });
}

// -----------------------------------------------------------------
//  Theme (reuse same logic as main.js)
// -----------------------------------------------------------------
const THEME_KEY = "dfashion_theme";

function initTheme() {
  const isDark = localStorage.getItem(THEME_KEY) === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.classList.toggle("fa-sun", isDark);
    icon.classList.toggle("fa-moon", !isDark);
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark-mode");
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
      const ic = document.getElementById("theme-icon");
      if (ic) {
        ic.classList.toggle("fa-sun", dark);
        ic.classList.toggle("fa-moon", !dark);
      }
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
  //  BACK TO TOP
  // =================================================================
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Current year in footer
  const yearEl = document.querySelector(".year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
