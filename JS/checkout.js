import { calculateVAT } from "./data.js";
import { allProducts } from "./data.js";

const CART_KEY = "dfashion_cart";

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading cart", err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart", err);
  }
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;
  const cart = getCart();
  const totalQty = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  badge.textContent = totalQty;
}

function renderCartItems() {
  const cartArea = document.querySelector(".review-cart");
  if (!cartArea) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartArea.innerHTML =
      '<p class="empty-cart">Your cart is empty. Add products from Home.</p>';
    calculateOrderSummary();
    return;
  }

  cartArea.innerHTML = cart
    .map((item) => {
      const qty = item.quantity || 1;
      const unitPrice = Number(item.price);
      const vatPrice = (unitPrice * 1.15).toFixed(2);
      const itemTotal = (unitPrice * qty).toFixed(2);
      // Show original price if item was added at discounted price
      const origPrice = item.originalPrice ? Number(item.originalPrice).toFixed(2) : null;
      const priceDisplay = origPrice
        ? `<span class="cart-orig-price">RON ${origPrice}</span> <span class="cart-disc-price">RON ${unitPrice.toFixed(2)}</span> <small>(incl. VAT: RON ${vatPrice})</small>`
        : `RON ${unitPrice.toFixed(2)} <small>(incl. VAT: RON ${vatPrice})</small>`;
      return `
      <div class="items-one" data-product-id="${item.id}">
        <img src="${item.image || "./assets/images/default-product.png"}" alt="${item.name}" width="80" height="auto">
        <div class="item-details">
          <table>
            <tr><td class="product-name">${item.name}</td></tr>
            <tr><td>Quantity: <span class="display-qty">${qty}</span></td></tr>
            <tr><td>Price: ${priceDisplay}</td></tr>
          </table>
          <div class="qty-control_remove">
          <div class="qty-control" role="group" aria-label="Quantity">
            <button class="qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>
            <input class="qty-input" type="number" min="1" value="${item.quantity || 1}" aria-live="polite" />
            <button class="qty-btn" data-action="increase" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-item btn btn-sm btn-outline-danger mt-2">Remove</button>
        </div>
        </div>
        <div class="item-price">
          <span>RON ${itemTotal}</span>
          
        </div>
      </div>
      <hr />`;
    })
    .join("");

  initQuantityControls();
  calculateOrderSummary();
  updateCartBadge();
}

function areIdsEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  // compare numbers or strings in a robust way
  return String(a).trim() === String(b).trim();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => !areIdsEqual(item.id, productId));
  saveCart(cart);
  renderCartItems();
  updateCartBadge();
}

function initQuantityControls() {
  const qtyButtons = document.querySelectorAll(".qty-btn");
  qtyButtons.forEach((btn) => {
    btn.removeEventListener("click", handleQtyButton);
    btn.addEventListener("click", handleQtyButton);
  });

  const qtyInputs = document.querySelectorAll(".qty-input");
  qtyInputs.forEach((input) => {
    input.removeEventListener("change", handleQtyInputChange);
    input.addEventListener("change", handleQtyInputChange);
  });

  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach((btn) => {
    btn.removeEventListener("click", handleRemoveItem);
    btn.addEventListener("click", handleRemoveItem);
  });
}

function handleQtyButton(e) {
  const action = e.currentTarget.getAttribute("data-action");
  const itemElem = e.currentTarget.closest(".items-one");
  if (!itemElem) return;
  const qtyInput = itemElem.querySelector(".qty-input");
  if (!qtyInput) return;

  let value = parseInt(qtyInput.value, 10);
  if (action === "increase") {
    value += 1;
  } else if (action === "decrease" && value > 1) {
    value -= 1;
  }

  qtyInput.value = value;
  syncCartQuantities();
  calculateOrderSummary();
}

function handleQtyInputChange(e) {
  const value = parseInt(e.target.value, 10);
  if (Number.isNaN(value) || value < 1) {
    e.target.value = 1;
  }
  syncCartQuantities();
  calculateOrderSummary();
}

function handleRemoveItem(e) {
  const itemElem = e.currentTarget.closest(".items-one");
  if (!itemElem) return;
  const productId =
    itemElem.dataset.productId || itemElem.getAttribute("data-product-id");
  removeFromCart(productId);
}

function syncCartQuantities() {
  const cart = getCart();
  const updated = cart.map((item) => {
    const itemElem = document.querySelector(
      `.items-one[data-product-id="${item.id}"]`,
    );
    if (!itemElem) return item;
    const qtyInput = itemElem.querySelector(".qty-input");
    const quantity = Math.max(1, parseInt(qtyInput?.value, 10) || 1);
    return { ...item, quantity };
  });
  saveCart(updated);
  updateCartBadge();
}

function calculateOrderSummary() {
  const cart = getCart();
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += Number(item.price || 0) * Number(item.quantity || 1);
  });

  const shippingCost = cart.length > 0 ? (subtotal >= 500 ? 0 : 30) : 0;
  const tax = calculateVAT(subtotal) + calculateVAT(shippingCost * 0.15);
  const total = subtotal + shippingCost + tax;

  const subtotalEl = document.querySelector(".subtotal");
  const shippingEl = document.querySelector(".shipping");
  const taxEl = document.querySelector(".tax");
  const totalEl = document.querySelector(".total-price");

  if (subtotalEl) subtotalEl.textContent = "RON " + subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = "RON " + shippingCost.toFixed(2);
  if (taxEl) taxEl.textContent = "RON " + tax.toFixed(2);
  if (totalEl) totalEl.textContent = "RON " + total.toFixed(2);
}

renderCartItems();

// Raw coupon
const VALID_COUPONS = [
  "SAVE10",
  "SAVE15",
  "FREESHIP",
  "CHRISTMAS20",
  "NEWYEAR25",
  "WINTEROFFER",
  "SUMMERSALE30",
  "FALLDISCOUNT15",
  "SPRINGDEAL20",
  "BLACKFRIDAY50",
];

// =============== 2. NORMALIZE COUPON FUNCTION =================
function normalizeCoupon(code) {
  let trimmed = code.trim();
  let uppercased = trimmed.toUpperCase();
  return uppercased;
}

function isValidCoupon(code) {
  for (let i = 0; i < VALID_COUPONS.length; i++) {
    if (VALID_COUPONS[i] === code) {
      return true;
    }
  }
  return false;
}

// Console self-checking examples
console.log("isValidCoupon('SAVE10'):", isValidCoupon("SAVE10"));
console.log("isValidCoupon('SAVE15'):", isValidCoupon("SAVE15"));
console.log("isValidCoupon('FREESHIP'):", isValidCoupon("FREESHIP"));
console.log("isValidCoupon('INVALID'):", isValidCoupon("INVALID"));

// =============== 4. VALIDATE AND NOTIFY (coupon validation on checkout.html) =================

function validateAndNotify() {
  const promoInput = document.getElementById("promo-input");
  if (!promoInput) return;

  const normalizedInput = normalizeCoupon(promoInput.value);

  switch (normalizedInput) {
    case "SAVE10":
      alert("Coupon applied successfully! You saved 10% on your order.");
      break;
    case "SAVE15":
      alert("Coupon applied successfully! You saved 15% on your order.");
      break;
    case "FREESHIP":
      alert(
        "Coupon applied successfully! You get free shipping on your order.",
      );
      break;
    case "CHRISTMAS20":
      alert("Coupon applied successfully! You saved 20% on your order.");
      break;
    case "NEWYEAR25":
      alert("Coupon applied successfully! You saved 25% on your order.");
      break;
    case "WINTEROFFER":
      alert("Coupon applied successfully! You can get 1 free item.");
      break;
    case "SUMMERSALE30":
      alert("Coupon applied successfully! You saved 30% on your order.");
      break;
    case "FALLDISCOUNT15":
      alert("Coupon applied successfully! You saved 15% on your order.");
      break;
    case "SPRINGDEAL20":
      alert("Coupon applied successfully! You saved 20% on your order.");
      break;
    case "BLACKFRIDAY50":
      alert("Coupon applied successfully! You saved 50% on your order.");
      break;
    default:
      alert("Invalid coupon code. Please try again.");
  }
  // clear input after validation
  promoInput.value = "";
}

const applyBtn = document.getElementById("apply-btn");
if (applyBtn) {
  applyBtn.addEventListener("click", validateAndNotify);
}

// =============== CHECKOUT FORM VALIDATION (checkout.html) =================
function validateCheckoutForm() {
  // Get form fields
  let firstName = document.getElementById("first-name");
  let lastName = document.getElementById("last-name");
  let address = document.getElementById("address");
  let zip = document.getElementById("zip");
  let cardholderName = document.getElementById("cardholder-name");
  let cardNumber = document.getElementById("card-number");
  let cvv = document.getElementById("cvv");

  // Check if required fields are filled
  if (
    !firstName ||
    !lastName ||
    !address ||
    !zip ||
    !cardholderName ||
    !cardNumber ||
    !cvv
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  if (firstName.value.trim() === "" || lastName.value.trim() === "") {
    alert("Please fill in your first and last name.");
    return;
  }

  if (address.value.trim() === "") {
    alert("Please fill in your address.");
    return;
  }

  if (zip.value.trim() === "") {
    alert("Please fill in your zip code.");
    return;
  }

  if (cardholderName.value.trim() === "") {
    alert("Please fill in the cardholder name.");
    return;
  }

  if (cardNumber.value.trim() === "") {
    alert("Please fill in the card number.");
    return;
  }

  if (cvv.value.trim() === "") {
    alert("Please fill in the CVV.");
    return;
  }

  // If all fields are valid
  alert("Order placed successfully! Thank you for your purchase.");
}

// Connect Pay With Card button
let payBtn = document.getElementById("pay");
if (payBtn) {
  payBtn.addEventListener("click", function () {
    validateCheckoutForm();
  });
}

// Connect Proceed to Checkout button
let checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    validateCheckoutForm();
  });
}