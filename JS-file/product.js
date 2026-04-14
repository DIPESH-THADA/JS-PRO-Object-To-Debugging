"use strict";

import { allProducts, calculateVAT } from "./data.js";

// =================================================================
//  product.js  –  Renders product details + description tabs
// =================================================================

const CART_KEY  = "dfashion_cart";
const FAV_KEY   = "dfashion_favorites";
const THEME_KEY = "dfashion_theme";

function getCart() {
  try { const d = localStorage.getItem(CART_KEY); const p = d ? JSON.parse(d) : []; return Array.isArray(p) ? p : []; } catch { return []; }
}
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function getFavorites() {
  try { const d = localStorage.getItem(FAV_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveFavorites(f) { localStorage.setItem(FAV_KEY, JSON.stringify(f)); }

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

// ── Theme ─────────────────────────────────────────────────────────
function initTheme() {
  const isDark = localStorage.getItem(THEME_KEY) === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  const icon = document.getElementById("theme-icon");
  if (icon) { icon.classList.toggle("fa-sun", isDark); icon.classList.toggle("fa-moon", !isDark); }
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

function getProductIdFromURL() {
  return Number(new URLSearchParams(window.location.search).get("id"));
}

// ── Render product info panel ─────────────────────────────────────
function renderProduct(product) {
  if (!product) {
    const info = document.querySelector(".pd-info");
    if (info) info.innerHTML = '<p style="color:red;padding:40px">Product not found. <a href="./index.html">Go back</a></p>';
    return;
  }

  document.title = product.name + " – D Fashion Hub";

  const bc = document.getElementById("pd-breadcrumb-name");
  if (bc) bc.textContent = product.name;

  const mainImg = document.getElementById("pd-main-image");
  if (mainImg) { mainImg.src = product.image; mainImg.alt = product.name; }

  // Thumbnails
  const thumbsContainer = document.getElementById("pd-thumbs");
  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    const images = product.imageDetails ? Object.values(product.imageDetails) : [product.image, product.image, product.image, product.image];
    images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = product.name + " view " + (i + 1);
      img.className = "pd-thumb" + (i === 0 ? " active" : "");
      img.addEventListener("click", () => {
        document.getElementById("pd-main-image").src = src;
        document.querySelectorAll(".pd-thumb").forEach((t) => t.classList.remove("active"));
        img.classList.add("active");
      });
      thumbsContainer.appendChild(img);
    });
  }

  const nameEl = document.getElementById("pd-name");
  if (nameEl) nameEl.textContent = product.name;

  const starsEl = document.getElementById("pd-stars");
  if (starsEl) { starsEl.style.setProperty("--rating", product.rating || 0); starsEl.setAttribute("data-rating", product.rating || 0); }

  const reviewsEl = document.getElementById("pd-reviews");
  if (reviewsEl) reviewsEl.textContent = Math.round((product.rating || 0) * 10) + " reviews";

  // Price (with or without discount)
  const priceEl = document.getElementById("pd-price");
  if (priceEl) {
    if (product.discountPercent) {
      const disc = (product.price * (1 - product.discountPercent / 100)).toFixed(2);
      priceEl.innerHTML =
        '<span class="pd-original-price">RON ' + product.price.toFixed(2) + '</span> ' +
        '<span class="pd-discounted-price">RON ' + disc + '</span> ' +
        '<span class="pd-discount-badge-inline">-' + product.discountPercent + '%</span>';
    } else {
      priceEl.textContent = "RON " + product.price.toFixed(2);
    }
  }

  const vatEl = document.getElementById("pd-vat");
  if (vatEl) {
    const base = product.discountPercent ? product.price * (1 - product.discountPercent / 100) : product.price;
    vatEl.textContent = "(incl. VAT: RON " + (base + calculateVAT(base)).toFixed(2) + ")";
  }

  const stockEl = document.getElementById("pd-stock-qty");
  const availEl = document.getElementById("pd-availability");
  if (stockEl) stockEl.textContent = "Only " + product.quantity + " left";
  if (availEl) {
    availEl.textContent = product.quantity > 0 ? "Available: In Stock" : "Out of Stock";
    availEl.className = product.quantity > 0 ? "pd-availability" : "pd-out-of-stock";
  }

  // Description (short intro — used in the main info panel)
  const descEl = document.getElementById("pd-description");
  if (descEl) {
    descEl.textContent = product.description
      ? product.description.intro
      : product.name + " — a premium " + (product.category || "").toLowerCase() + " fashion item from D Fashion Hub.";
  }

  // Color selector — dynamically built from data
  const colorsContainer = document.getElementById("pd-colors");
  if (colorsContainer && product.colors && product.colors.length) {
    colorsContainer.innerHTML = "";
    product.colors.forEach((color, i) => {
      const btn = document.createElement("button");
      btn.className = "pd-color-btn" + (i === 0 ? " selected" : "");
      btn.style.background = color;
      btn.setAttribute("data-color", color);
      btn.title = color;
      btn.addEventListener("click", () => {
        colorsContainer.querySelectorAll(".pd-color-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      colorsContainer.appendChild(btn);
    });
  }

  // Size selector — dynamically built from data
  const sizesContainer = document.getElementById("pd-sizes");
  if (sizesContainer && product.sizes && product.sizes.length) {
    sizesContainer.innerHTML = "";
    product.sizes.forEach((size, i) => {
      const btn = document.createElement("button");
      btn.className = "pd-size-btn" + (i === 0 ? " selected" : "");
      btn.textContent = size;
      btn.setAttribute("data-size", size);
      btn.addEventListener("click", () => {
        sizesContainer.querySelectorAll(".pd-size-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      sizesContainer.appendChild(btn);
    });
  }

  const skuEl = document.getElementById("pd-sku");
  if (skuEl) skuEl.textContent = "#DFH" + String(product.id).padStart(4, "0");

  const tagsEl = document.getElementById("pd-tags");
  if (tagsEl) {
    const tags = ["fashion", (product.category || "").toLowerCase(), "dfashionhub"];
    tagsEl.innerHTML = tags.map((t) => '<a href="#">' + t + '</a>').join(", ");
  }

  // Favourite button
  const favBtn = document.getElementById("pd-fav-btn");
  if (favBtn) {
    const isFav = getFavorites().some((f) => f.id === product.id);
    updateFavIcon(favBtn, isFav);
    favBtn.addEventListener("click", () => {
      let favs = getFavorites();
      const exists = favs.some((f) => f.id === product.id);
      favs = exists ? favs.filter((f) => f.id !== product.id) : [...favs, product];
      saveFavorites(favs);
      updateFavIcon(favBtn, !exists);
      updateFavBadge();
    });
  }
}

function updateFavIcon(btn, isFav) {
  const icon = btn.querySelector("i");
  btn.classList.toggle("active", isFav);
  if (icon) icon.className = isFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
}

// ── Quantity controls ─────────────────────────────────────────────
function initQtyControls() {
  let qty = 1;
  const qtyEl    = document.getElementById("pd-qty");
  const minusBtn = document.getElementById("pd-qty-minus");
  const plusBtn  = document.getElementById("pd-qty-plus");
  if (minusBtn) minusBtn.addEventListener("click", () => { if (qty > 1) { qty--; qtyEl.textContent = qty; } });
  if (plusBtn)  plusBtn.addEventListener("click",  () => { qty++;     qtyEl.textContent = qty; });
  return () => qty;
}

// ── Add to cart ───────────────────────────────────────────────────
function initAddToCart(product, getQty) {
  const btn = document.getElementById("pd-add-cart");
  if (!btn || !product) return;
  btn.addEventListener("click", () => {
    if (product.quantity < 1) { alert("Sorry, this product is out of stock."); return; }
    const qty  = getQty();
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id);
    if (existing) { existing.quantity += qty; } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty, rating: product.rating });
    }
    saveCart(cart);
    updateCartBadge();
    alert(product.name + " (×" + qty + ") added to cart!");
  });
}

// ── Description TABS — fully dynamic ─────────────────────────────
function renderDescriptionTabs(product) {
  if (!product) return;

  // ── TAB 1: Product Description ──
  const descPanel = document.getElementById("tab-description");
  if (descPanel) {
    descPanel.innerHTML = "";

    if (product.description) {
      // Intro paragraph
      const intro = document.createElement("p");
      intro.className = "pd-tab-intro";
      intro.textContent = product.description.intro;
      descPanel.appendChild(intro);

      // Bullet details list
      if (product.description.details && product.description.details.length) {
        const ul = document.createElement("ul");
        ul.className = "pd-tab-details-list";
        product.description.details.forEach((detail) => {
          const li = document.createElement("li");
          li.textContent = detail;
          ul.appendChild(li);
        });
        descPanel.appendChild(ul);
      }
    } else {
      const p = document.createElement("p");
      p.className = "pd-tab-intro";
      p.textContent = product.name + " — a premium fashion item from D Fashion Hub.";
      descPanel.appendChild(p);
    }
  }

  // ── TAB 2: Reviews ──
  const reviewsPanel = document.getElementById("tab-reviews");
  if (reviewsPanel) {
    reviewsPanel.innerHTML = "";

    const title = document.createElement("h3");
    title.className = "pd-tab-subtitle";
    title.textContent = "Customer Reviews";
    reviewsPanel.appendChild(title);

    // Generate some example reviews based on rating
    const fakeReviews = [
      { author: "Maria D.", rating: 5, text: "Absolutely love this product! Great quality and fast delivery." },
      { author: "Alex P.", rating: product.rating >= 4 ? 4 : 3, text: "Good product, fits true to size. Would recommend." },
      { author: "Ioana M.", rating: product.rating >= 4.5 ? 5 : 4, text: "Beautiful design and very comfortable. Worth every penny." },
    ];

    fakeReviews.forEach((review) => {
      const reviewCard = document.createElement("div");
      reviewCard.className = "pd-review-card";

      const header = document.createElement("div");
      header.className = "pd-review-header";

      const stars = document.createElement("span");
      stars.className = "star-rating pd-review-stars";
      stars.style.setProperty("--rating", review.rating);
      stars.setAttribute("data-rating", review.rating);

      const author = document.createElement("span");
      author.className = "pd-review-author";
      author.textContent = review.author;

      header.appendChild(stars);
      header.appendChild(author);
      reviewCard.appendChild(header);

      const text = document.createElement("p");
      text.className = "pd-review-text";
      text.textContent = review.text;
      reviewCard.appendChild(text);

      reviewsPanel.appendChild(reviewCard);
    });
  }

  // ── TAB 3: Tags ──
  const tagsPanel = document.getElementById("tab-tags");
  if (tagsPanel) {
    tagsPanel.innerHTML = "";

    const title = document.createElement("h3");
    title.className = "pd-tab-subtitle";
    title.textContent = "Product Tags";
    tagsPanel.appendChild(title);

    const tags = ["fashion", (product.category || "").toLowerCase(), "dfashionhub", "style", "trending", product.name.split(" ")[0].toLowerCase()];
    const tagContainer = document.createElement("div");
    tagContainer.className = "pd-tag-cloud";
    tags.forEach((tag) => {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "pd-tag-pill";
      a.textContent = "#" + tag;
      tagContainer.appendChild(a);
    });
    tagsPanel.appendChild(tagContainer);
  }

  // ── TAB 4: Additional Information ──
  const addPanel = document.getElementById("tab-additional");
  if (addPanel) {
    addPanel.innerHTML = "";

    const title = document.createElement("h3");
    title.className = "pd-tab-subtitle";
    title.textContent = "Additional Information";
    addPanel.appendChild(title);

    const table = document.createElement("table");
    table.className = "pd-info-table";

    const rows = [
      ["Category",  product.category || "—"],
      ["Available sizes", (product.sizes || []).join(", ") || "—"],
      ["Available colours", product.colors ? product.colors.length + " colours" : "—"],
      ["SKU", "#DFH" + String(product.id).padStart(4, "0")],
      ["Rating", (product.rating || 0) + " / 5"],
      ["Stock", product.quantity > 0 ? product.quantity + " units available" : "Out of stock"],
    ];

    if (product.discountPercent) {
      rows.push(["Discount", "-" + product.discountPercent + "% off"]);
    }

    rows.forEach(([label, value]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = label;
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(th);
      tr.appendChild(td);
      table.appendChild(tr);
    });

    addPanel.appendChild(table);
  }

  // ── Tab switching logic ───────────────────────────────────────
  const tabBtns   = document.querySelectorAll(".pd-tab-btn");
  const tabPanels = document.querySelectorAll(".pd-tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const panel = document.getElementById("tab-" + target);
      if (panel) panel.classList.add("active");
    });
  });
}

// ── Back to top / year ────────────────────────────────────────────
function initUtils() {
  const btn = document.querySelector(".back-to-top");
  if (btn) btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const yr = document.querySelector(".year");
  if (yr) yr.textContent = new Date().getFullYear();
}

// ── Boot ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateCartBadge();
  updateFavBadge();
  initUtils();

  const id      = getProductIdFromURL();
  const product = allProducts.find((p) => p.id === id);

  renderProduct(product);
  renderDescriptionTabs(product);   // ← renders all 4 tabs dynamically

  const getQty = initQtyControls();
  initAddToCart(product, getQty);
});
