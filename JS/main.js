"use strict";

import { allProducts } from "./data.js";
import { calculateVAT } from "./data.js";

// =================================================================
//  GLOBAL CONSTANTS
// =================================================================
const CART_KEY = "dfashion_cart";
const THEME_KEY = "dfashion_theme";
const FAV_KEY = "dfashion_favorites";

// =================================================================
//  HAMBURGER MENU TOGGLE
// =================================================================
const hamburgerBtn = document.querySelector(".hamburger-btn");
const headerNav = document.querySelector(".header__nav");

if (hamburgerBtn && headerNav) {
  hamburgerBtn.addEventListener("click", function () {
    hamburgerBtn.classList.toggle("active");
    headerNav.classList.toggle("mobile-open");
  });

  const navLinks = headerNav.querySelectorAll(".menu a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburgerBtn.classList.remove("active");
      headerNav.classList.remove("mobile-open");
    });
  });
}

// =================================================================
//  BACK TO TOP
// =================================================================
const scrollBtn = document.querySelector(".back-to-top");
const backToTop = () => {
  if (window.scrollY > 400) {
    scrollBtn.style.visibility = "visible";
  } else {
    scrollBtn.style.visibility = "hidden";
  }
};
document.addEventListener("scroll", () => {
  backToTop();
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// =================================================================
//  CURRENT YEAR
// =================================================================
const yearEl = document.querySelector(".year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =================================================================
//  CHECKBOX COLOR CHANGE
// =================================================================
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("click", function () {
    const zaraEl = this.closest(".zara");
    if (!zaraEl) return;
    const span = zaraEl.querySelector("span");
    if (!span) return;
    if (this.checked) {
      span.style.color = "#00ccdd";
      span.style.fontWeight = "500";
    } else {
      span.style.color = "#4b5563";
      span.style.fontWeight = "400";
    }
  });
});

// =================================================================
// ── Helpers ──────────────────────────────────────────────────────
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

function saveFavorites(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  if (!cartBadge) return;
  const cart = getCart();
  cartBadge.textContent = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
}

// =================================================================
//  DARK-MODE THEME
// =================================================================
function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById("theme-icon");
  if (!themeIcon) return;
  if (isDark) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  updateThemeIcon(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

function initTheme() {
  const isDark = localStorage.getItem(THEME_KEY) === "dark";
  applyTheme(isDark);
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(!document.body.classList.contains("dark-mode"));
    });
  }
}

initTheme();

// =================================================================
//  RENDER PRODUCTS
// =================================================================
const itemContainer = document.querySelector(".product-section");

const renderItems = function (items) {
  if (!itemContainer) return;
  itemContainer.innerHTML = "";
  items.forEach(function (item, index) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("product-items");
    const priceWithVAT = (item.price * (1 + VAT_RATE)).toFixed(2);
    itemDiv.innerHTML =
      '<a href="./product.html?id=' +
      item.id +
      '" class="pd-card-link">' +
      '<img class="product-img" src="' +
      item.image +
      '" alt="' +
      item.name +
      '">' +
      "</a>" +
      '<div class="details">' +
      '<a href="./product-details.html?id=' +
      item.id +
      '" class="pd-card-link">' +
      '<span class="product-name">' +
      item.name +
      "</span>" +
      "</a>" +
      '<div class="price_favorite">' +
      '<span class="prices">RON ' +
      item.price.toFixed(2) +
      " <small>(incl. VAT: RON " +
      priceWithVAT +
      ")</small></span>" +
      '<button class="heart"><img src="' +
      item.favorite +
      '" alt="add to favorite"></button>' +
      "</div>" +
      '<span class="star-rating" data-rating="' +
      item.rating +
      '" style="--rating: ' +
      item.rating +
      ';"></span>' +
      "</div>" +
      '<button class="cart-btn" data-product-index="' +
      index +
      '" data-product-name="' +
      item.name +
      '">Add To Cart</button>';
    itemContainer.appendChild(itemDiv);
  });
};

renderItems(allProducts);

// =================================================================
//  ADD TO CART
// =================================================================
function addToCart(productRef) {
  const cart = getCart();
  let product = null;

  if (typeof productRef === "string" && productRef.trim() !== "") {
    const idx = Number(productRef);
    if (!Number.isNaN(idx) && idx >= 0 && idx < allProducts.length) {
      product = allProducts[idx];
    }
    if (!product) {
      const normalizedName = productRef.trim().toLowerCase();
      product = allProducts.find(
        (p) => p.name && p.name.toLowerCase() === normalizedName,
      );
    }
  }

  if (!product) {
    return alert("Product not found in cart list");
  }

  const productId = product.id || product.name;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      rating: product.rating,
    });
  }

  saveCart(cart);
  updateCartBadge();
  alert(
    "Item added to cart! " +
      product.name +
      " (RON " +
      product.price.toFixed(2) +
      ")",
  );
}

// Delegated click listener on product grid
if (itemContainer) {
  itemContainer.addEventListener("click", function (e) {
    if (!e.target.matches(".cart-btn")) return;
    const index = e.target.getAttribute("data-product-index");
    const name = e.target.getAttribute("data-product-name");
    if (index) {
      addToCart(index);
    } else if (name) {
      addToCart(name);
    }
  });
}

updateCartBadge();

// =================================================================
//  SEARCH
// =================================================================
const form = document.querySelector("#search-form");
const search = document.querySelector("#search-input");

function searchItemsByName(term) {
  if (!itemContainer) return;
  const inputName = term.trim().toLowerCase();
  if (!inputName) {
    renderItems(allProducts);
    return;
  }
  const results = allProducts.filter((result) =>
    result.name.toLowerCase().includes(inputName),
  );
  if (results.length) {
    renderItems(results);
  } else {
    itemContainer.innerHTML = '<p class="no-results">No items found.</p>';
  }
}

if (form && search) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchItemsByName(search.value);
    search.value = "";
  });
  search.addEventListener("input", (e) => {
    if (e.target.value === "") renderItems(allProducts);
  });
}

// =================================================================
//  CALCULATE TOTAL STOCK VALUE
// =================================================================
function calculateTotalStockValue() {
  let totalValue = 0;
  let totalQuantity = 0;
  const lowStock = [];

  allProducts.forEach((item) => {
    totalValue += item.price * item.quantity;
    totalQuantity += item.quantity;
    if (item.quantity < 10) lowStock.push(item.name);
  });

  const mostExpensive = allProducts.reduce((max, item) =>
    item.price > max.price ? item : max,
  );

  console.log("Total stock value: RON " + totalValue.toFixed(2));
  console.log("Low stock products: " + lowStock.join(", "));
  console.log("Total number of products: " + allProducts.length);
  console.log(
    "Average price per product: RON " +
      (totalValue / allProducts.length).toFixed(2),
  );
  console.log(
    "Average price per item: RON " + (totalValue / totalQuantity).toFixed(2),
  );
  console.log(
    "Most expensive: " +
      mostExpensive.name +
      " (RON " +
      mostExpensive.price.toFixed(2) +
      ")",
  );
  console.log("Total quantity in stock: " + totalQuantity);
  console.log(
    totalValue > 100000 ? "Stock value is high." : "Stock value is manageable.",
  );
}
calculateTotalStockValue();

// =================================================================
//  RENDER DISCOUNTED PRODUCTS
// =================================================================
function renderDiscountedProducts() {
  const grid = document.getElementById("discount-grid");
  if (!grid) return;

  // Filter products that have a discountPercent — read directly from allProducts
  const discounted = allProducts.filter((p) => p.discountPercent);

  if (discounted.length === 0) {
    grid.innerHTML = "<p>No discounted products available right now.</p>";
    return;
  }

  grid.innerHTML = "";

  discounted.forEach((product) => {
    const discountedPrice = (
      product.price *
      (1 - product.discountPercent / 100)
    ).toFixed(2);
    const savedAmount = (product.price - discountedPrice).toFixed(2);

    // Card — built via DOM, no manual HTML
    const card = document.createElement("div");
    card.className = "dc-card";
    card.setAttribute("data-id", product.id);

    // Image wrap
    const imgWrap = document.createElement("div");
    imgWrap.className = "dc-img-wrap";

    // Discount badge (RED)
    const badge = document.createElement("span");
    badge.className = "dc-badge";
    badge.textContent = "-" + product.discountPercent + "%";
    imgWrap.appendChild(badge);

    // Image → clicks to product.html
    const img = document.createElement("img");
    img.className = "dc-img";
    img.src = product.image;
    img.alt = product.name;
    img.addEventListener("click", function () {
      window.location.href = "./product.html?id=" + product.id;
    });
    imgWrap.appendChild(img);

    // Favourite button
    const favBtn = document.createElement("button");
    favBtn.className = "dc-fav";
    favBtn.innerHTML = "<i class='fa-regular fa-heart'></i>";
    favBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      let favs = getFavorites();
      const exists = favs.some((f) => String(f.id) === String(product.id));
      if (exists) {
        favs = favs.filter((f) => String(f.id) !== String(product.id));
        favBtn.innerHTML = "<i class='fa-regular fa-heart'></i>";
      } else {
        favs.push(product);
        favBtn.innerHTML =
          "<i class='fa-solid fa-heart' style='color:#ef4444'></i>";
      }
      saveFavorites(favs);
      updateFavBadge();
    });
    imgWrap.appendChild(favBtn);

    // Hover "Add to Cart" — hidden by default via CSS, shown on hover
    const hoverCart = document.createElement("button");
    hoverCart.className = "dc-hover-cart";
    hoverCart.textContent = "Add To Cart";
    hoverCart.addEventListener("click", function (e) {
      e.stopPropagation();
      const cart = getCart();
      const existing = cart.find((i) => String(i.id) === String(product.id));
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: parseFloat(discountedPrice),
          image: product.image,
          quantity: 1,
          rating: product.rating,
        });
      }
      saveCart(cart);
      updateCartBadge();
      alert(
        product.name +
          " added to cart at discounted price RON " +
          discountedPrice +
          "!",
      );
    });
    imgWrap.appendChild(hoverCart);

    card.appendChild(imgWrap);

    // Info section
    const info = document.createElement("div");
    info.className = "dc-info";

    const name = document.createElement("a");
    name.href = "./product.html?id=" + product.id;
    name.className = "dc-name";
    name.textContent = product.name;
    info.appendChild(name);

    const priceRow = document.createElement("div");
    priceRow.className = "dc-price-row";

    const price = document.createElement("span");
    price.className = "dc-price";
    price.textContent = "RON " + discountedPrice;
    priceRow.appendChild(price);

    const orig = document.createElement("span");
    orig.className = "dc-orig";
    orig.textContent = "RON " + product.price.toFixed(2);
    priceRow.appendChild(orig);

    info.appendChild(priceRow);

    // Saving text in RED
    const saving = document.createElement("span");
    saving.className = "dc-saving";
    saving.textContent =
      "Save RON " + savedAmount + " (" + product.discountPercent + "% off)";
    info.appendChild(saving);

    card.appendChild(info);
    grid.appendChild(card);
  });

  document.querySelectorAll(".star-rating").forEach(function (el) {
    let rating = parseFloat(el.getAttribute("data-rating")) || 0;
    el.style.setProperty("--rating", rating);
  });
}

renderDiscountedProducts();
