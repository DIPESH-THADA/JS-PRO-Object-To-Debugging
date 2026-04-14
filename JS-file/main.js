"use strict";

import { allProducts } from "./data.js";
import { calculateVAT } from "./data.js";

// =================================================================
//  GLOBAL CONSTANTS
// =================================================================
const CART_KEY = "dfashion_cart";
const THEME_KEY = "dfashion_theme";

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
const backToTopBtn = document.querySelector(".back-to-top");
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

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
//  CART HELPERS  (localStorage-based, for the live browser UI)
// =================================================================
function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading cart from localStorage", error);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage", error);
  }
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
    const priceWithVAT = (  item.price + calculateVAT(item.price)).toFixed(2);
    itemDiv.innerHTML =
      '<img class="product-img" src="' +
      item.image +
      '" alt="' +
      item.name +
      '">' +
      '<div class="details">' +
      '<span class="product-name">' +
      item.name +
      "</span>" +
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

  // apply star ratings
  document.querySelectorAll(".star-rating").forEach(function (el) {
    let rating = parseFloat(el.getAttribute("data-rating")) || 0;
    el.style.setProperty("--rating", rating);
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
//  FILTER BY PRICE
// =================================================================
function filterItemsByPrice(range) {
  let filteredProducts = [];
  if (range === "low") {
    filteredProducts = allProducts.filter((p) => p.price < 300);
  } else if (range === "medium") {
    filteredProducts = allProducts.filter(
      (p) => p.price >= 300 && p.price <= 1000,
    );
  } else if (range === "high") {
    filteredProducts = allProducts.filter((p) => p.price > 1000);
  } else {
    filteredProducts = allProducts;
  }
  console.log(
    "Filter '" + range + "': " + filteredProducts.length + " products found",
  );
  renderItems(filteredProducts);
}

const sortSelect = document.getElementById("sort-price");
if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    filterItemsByPrice(this.value);
  });
}

// =================================================================
//  FILTER BY CATEGORY
// =================================================================
function filterItemsBySex(sex) {
  let filteredProducts = [];
  if (sex === "male") {
    filteredProducts = allProducts.filter((p) => p.category === "Male");
  } else if (sex === "female") {
    filteredProducts = allProducts.filter((p) => p.category === "Female");
  } else if (sex === "unisex") {
    filteredProducts = allProducts.filter((p) => p.category === "Unisex");
  } else {
    filteredProducts = allProducts;
  }
  console.log(
    "Filter '" + sex + "': " + filteredProducts.length + " products found",
  );
  renderItems(filteredProducts);
}

const selectCategories = document.getElementById("sort-categories");
if (selectCategories) {
  selectCategories.addEventListener("change", function () {
    filterItemsBySex(this.value);
  });
}

// star ratings are applied inside renderItems() above
