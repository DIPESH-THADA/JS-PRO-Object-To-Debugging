"use strict";

// =================================================================
//  shop.js  –  Renders all products from data.js on shop.html
//  Uses ES module import — shop.html must load this as type="module"
// =================================================================

import { allProducts, calculateVAT } from "./data.js";

// ── Cart & favourite helpers ─────────────────────────────────────
const CART_KEY = "dfashion_cart";
const FAV_KEY = "dfashion_favorites";
const THEME_KEY = "dfashion_theme";

function getCart() {
  try {
    const d = localStorage.getItem(CART_KEY);
    const p = d ? JSON.parse(d) : [];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function getFavorites() {
  try {
    const d = localStorage.getItem(FAV_KEY);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
}
function saveFavorites(f) {
  localStorage.setItem(FAV_KEY, JSON.stringify(f));
}

function updateCartBadge() {
  document.querySelectorAll(".cart-badge").forEach((b) => {
    b.textContent = getCart().reduce((s, i) => s + Number(i.quantity || 0), 0);
  });
}
function updateFavBadge() {
  document.querySelectorAll(".fav-badge").forEach((b) => {
    b.textContent = getFavorites().length;
  });
}

// ── Theme ────────────────────────────────────────────────────────
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

// ── Variant state ────────────────────────────────────────────────
let selectedProductId = null;
let selectedColor = null;
let selectedSize = null;

function renderColors(colors, container) {
  container.innerHTML = "";
  colors.forEach((color) => {
    const btn = document.createElement("button");
    btn.className = "shop-color-btn";
    btn.style.backgroundColor = color;
    btn.title = color;
    btn.setAttribute("data-color", color);
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".shop-color-btn")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedColor = color;
    });
    container.appendChild(btn);
  });
}

function renderSizes(sizes, container) {
  container.innerHTML = "";
  sizes.forEach((size) => {
    const btn = document.createElement("button");
    btn.className = "shop-size-btn";
    btn.textContent = size;
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".shop-size-btn")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = size;
    });
    container.appendChild(btn);
  });
}

function openVariantPanel(product) {
  selectedProductId = product.id;
  selectedColor = null;
  selectedSize = null;
  const panel = document.getElementById("variant-panel");
  document.getElementById("variant-product-name").textContent = product.name;
  renderColors(
    product.colors || ["#1e293b", "#fff"],
    document.getElementById("color-options"),
  );
  renderSizes(
    product.sizes || ["S", "M", "L"],
    document.getElementById("size-options"),
  );
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── Render all products via DOM (no manual HTML cards) ───────────
let currentProducts = allProducts; // track current visible list

function renderProducts(list) {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (list.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-results";
    msg.textContent = "No products found.";
    grid.appendChild(msg);
    return;
  }

  list.forEach((product) => {
    const priceWithVAT = (product.price + calculateVAT(product.price)).toFixed(
      2,
    );

    // Card wrapper
    const card = document.createElement("div");
    card.className = "shop-card product-items";
    card.setAttribute("data-id", product.id);

    // ── Image wrap ──
    const imgWrap = document.createElement("div");
    imgWrap.className = "shop-card-img-wrap";

    // Discount badge (red) — only on items that have discountPercent
    if (product.discountPercent) {
      const badge = document.createElement("span");
      badge.className = "shop-discount-badge";
      badge.textContent = "-" + product.discountPercent + "%";
      imgWrap.appendChild(badge);
    }

    // Product image → links to product.html
    const imgLink = document.createElement("a");
    imgLink.href = "./product.html?id=" + product.id;
    imgLink.className = "pd-card-link";
    const img = document.createElement("img");
    img.className = "product-img shop-card-img";
    img.src = product.image;
    img.alt = product.name;
    imgLink.appendChild(img);
    imgWrap.appendChild(imgLink);

    // Favourite button (top-right overlay)
    const favBtn = document.createElement("button");
    favBtn.className = "shop-fav-btn";
    const isFav = getFavorites().some(
      (f) => String(f.id) === String(product.id),
    );
    favBtn.innerHTML = isFav
      ? '<i class="fa-solid fa-heart" style="color:#ef4444"></i>'
      : '<i class="fa-regular fa-heart"></i>';
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let favs = getFavorites();
      const exists = favs.some((f) => String(f.id) === String(product.id));
      if (exists) {
        favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      } else {
        favs.push(product);
        favBtn.innerHTML =
          '<i class="fa-solid fa-heart" style="color:#ef4444"></i>';
      }
      saveFavorites(favs);
      updateFavBadge();
    });
    imgWrap.appendChild(favBtn);

    // Hover "Add To Cart" — HIDDEN by default, shown on card:hover via CSS
    const hoverCartBtn = document.createElement("button");
    hoverCartBtn.className = "shop-hover-cart-btn";
    hoverCartBtn.textContent = "Add To Cart";
    hoverCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openVariantPanel(product);
    });
    imgWrap.appendChild(hoverCartBtn);

    card.appendChild(imgWrap);

    // ── Info section ──
    const info = document.createElement("div");
    info.className = "details shop-card-info";

    // Stars
    const starsRow = document.createElement("div");
    starsRow.className = "shop-card-stars-row";
    const stars = document.createElement("span");
    stars.className = "star-rating";
    stars.style.setProperty("--rating", product.rating || 0);
    stars.setAttribute("data-rating", product.rating || 0);
    const reviews = document.createElement("span");
    reviews.className = "shop-review-count";
    reviews.textContent = "(" + (product.rating || 0).toFixed(1) + ")";
    starsRow.appendChild(stars);
    starsRow.appendChild(reviews);
    info.appendChild(starsRow);

    // Product name → links to product.html
    const nameLink = document.createElement("a");
    nameLink.href = "./product.html?id=" + product.id;
    nameLink.className = "product-name pd-card-link";
    nameLink.textContent = product.name;
    info.appendChild(nameLink);

    // Price row
    const priceRow = document.createElement("div");
    priceRow.className = "price_favorite";

    const priceSpan = document.createElement("span");
    priceSpan.className = "prices";

    if (product.discountPercent) {
      // Show original crossed-out + discounted price
      const discountedPrice = (
        product.price *
        (1 - product.discountPercent / 100)
      ).toFixed(2);
      priceSpan.innerHTML =
        '<span class="shop-orig-price">RON ' +
        product.price.toFixed(2) +
        "</span> " +
        '<span class="shop-disc-price">RON ' +
        discountedPrice +
        "</span>" +
        "<small>(incl. VAT: RON " +
        (discountedPrice * 1.15).toFixed(2) +
        ")</small>";
    } else {
      priceSpan.innerHTML =
        "RON " +
        product.price.toFixed(2) +
        " <small>(incl. VAT: RON " +
        priceWithVAT +
        ")</small>";
    }

    // Heart / favourite icon in price row
    const heartBtn = document.createElement("button");
    heartBtn.className = "heart";
    heartBtn.addEventListener("click", () => {
      let favs = getFavorites();
      const exists = favs.some((f) => String(f.id) === String(product.id));
      if (!exists) {
        favs.push(product);
        saveFavorites(favs);
        updateFavBadge();
      }
    });

    priceRow.appendChild(priceSpan);
    priceRow.appendChild(heartBtn);
    info.appendChild(priceRow);
    card.appendChild(info);
    grid.appendChild(card);
  });
}

// ── Search — input event ─────────────────────────────────────────
function initSearch() {
  const input = document.getElementById("search-input");
  const form = document.getElementById("search-form");
  if (!input) return;
  input.addEventListener("input", function () {
    const term = this.value.trim().toLowerCase();
    currentProducts = term
      ? allProducts.filter((p) => p.name.toLowerCase().includes(term))
      : allProducts;
    renderProducts(currentProducts);
  });
  if (form) form.addEventListener("submit", (e) => e.preventDefault());
}

// ── Price filter — change event ──────────────────────────────────
function initPriceFilter() {
  const sel = document.getElementById("sort-price");
  if (!sel) return;
  sel.addEventListener("change", function () {
    const val = this.value;
    let filtered = allProducts;
    if (val === "low") filtered = allProducts.filter((p) => p.price < 300);
    else if (val === "medium")
      filtered = allProducts.filter((p) => p.price >= 300 && p.price <= 1000);
    else if (val === "high")
      filtered = allProducts.filter((p) => p.price > 1000);
    currentProducts = filtered;
    renderProducts(filtered);
  });
}

// ── Category filter ──────────────────────────────────────────────
function initCategoryFilter() {
  const sel = document.getElementById("sort-categories");
  if (!sel) return;
  sel.addEventListener("change", function () {
    const val = this.value;
    let filtered = allProducts;
    if (val === "male")
      filtered = allProducts.filter((p) => p.category === "Male");
    else if (val === "female")
      filtered = allProducts.filter((p) => p.category === "Female");
    else if (val === "unisex")
      filtered = allProducts.filter((p) => p.category === "Unisex");
    currentProducts = filtered;
    renderProducts(filtered);
  });
}

// ── Variant confirm — click event ───────────────────────────────
function initVariantConfirm() {
  const btn = document.getElementById("variant-confirm-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!selectedColor) {
      alert("Please select a colour.");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    const product = allProducts.find((p) => p.id === selectedProductId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find((i) => String(i.id) === String(product.id));
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        rating: product.rating,
      });
    }
    saveCart(cart);
    updateCartBadge();

    document.getElementById("variant-panel").style.display = "none";
    alert(
      "Added to cart! " +
        product.name +
        " | Colour: " +
        selectedColor +
        " | Size: " +
        selectedSize,
    );
    selectedProductId = selectedColor = selectedSize = null;
  });
}

// ── Back to top / year ───────────────────────────────────────────
function initUtils() {
  const btn = document.querySelector(".back-to-top");
  if (btn)
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  const yr = document.querySelector(".year");
  if (yr) yr.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateCartBadge();
  updateFavBadge();
  renderProducts(allProducts);
  initSearch();
  initPriceFilter();
  initCategoryFilter();
  initVariantConfirm();
  initUtils();
});
