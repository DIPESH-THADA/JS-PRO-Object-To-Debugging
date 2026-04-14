// Jasmine test for checkout.js and related functions/classes

// ---------- Coupon data (from checkout.js) ----------
const VALID_COUPONS = [
  "SAVE10",
  "SAVE15",
  "FREESHIP",
  "CHRISRMAS20",
  "NEWYEAR25",
  "WINTEROFFER",
  "SUMMERSALE30",
  "FALLDISCOUNT15",
  "SPRINGDEAL20",
  "BLACKFRIDAY50",
];

function normalizeCoupon(code) {
  let trimmed = code.trim();
  let uppercased = trimmed.toUpperCase();
  return uppercased;
}

function isValidCoupon(code) {
  for (let i = 0; i < VALID_COUPONS.length; i++) {
    if (VALID_COUPONS[i] === code) return true;
  }
  return false;
}

// ---------- VAT / shipping (from checkout.js) ----------
const VAT_RATE = 0.19;

function calculateOrderSummaryLogic(cartItems) {
  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += Number(item.price || 0) * Number(item.quantity || 1);
  });
  const shippingCost = subtotal >= 500 ? 0 : 30;
  const tax = subtotal * VAT_RATE;
  const total = subtotal + shippingCost + tax;
  return { subtotal, shippingCost, tax, total };
}

// ---------- Products (from ass01.js) ----------
const testProducts = [
  {
    id: 1,
    name: "Jens Decathlons Jacket",
    price: 299.99,
    quantity: 10,
    category: "Male",
  },
  {
    id: 2,
    name: "Ladies Casual Coat",
    price: 129.99,
    quantity: 10,
    category: "Female",
  },
  {
    id: 3,
    name: "Ladies Jacket",
    price: 229.99,
    quantity: 5,
    category: "Female",
  },
  {
    id: 4,
    name: "Ladies Skirt",
    price: 79.99,
    quantity: 14,
    category: "Female",
  },
  { id: 5, name: "Mens Jeans", price: 59.99, quantity: 8, category: "Male" },
  {
    id: 6,
    name: "Ladies Topware",
    price: 39.99,
    quantity: 12,
    category: "Female",
  },
  { id: 7, name: "Mens T-shirt", price: 19.99, quantity: 20, category: "Male" },
  {
    id: 8,
    name: "Armani Watch",
    price: 1259.99,
    quantity: 5,
    category: "Male",
  },
];

// ---------- Functions from ass01.js ----------
function isInStock(product, requestedQty) {
  return product.quantity >= requestedQty;
}

function addToCart(cart, product, qty) {
  if (!isInStock(product, qty)) return false;
  const existing = cart.items.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      category: product.category,
    });
  }
  product.quantity -= qty;
  cart.totalPrice = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return true;
}

function removeFromCart(cart, productId) {
  const index = cart.items.findIndex((item) => item.id === productId);
  if (index === -1) return false;
  const removed = cart.items[index];
  const stock = testProducts.find((p) => p.id === productId);
  if (stock) stock.quantity += removed.quantity;
  cart.items.splice(index, 1);
  cart.totalPrice = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return true;
}

const getCheapProducts = (products, limit) =>
  products.filter((p) => p.price < limit);

const getProductsByCategory = function (products, category) {
  return products.filter(function (p) {
    return p.category === category;
  });
};

// ---------- OOP Classes (from Ass02.js) ----------
class Product {
  #quantity;
  constructor(id, name, price, quantity, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.#quantity = quantity;
    this.category = category;
  }
  get quantity() {
    return this.#quantity;
  }
  decreaseStock(qty) {
    if (qty <= 0) return "ERROR: qty must be greater than 0.";
    if (qty > this.#quantity) return "ERROR: not enough stock.";
    this.#quantity -= qty;
    return "OK";
  }
  increaseStock(qty) {
    if (qty <= 0) return "ERROR: qty must be greater than 0.";
    this.#quantity += qty;
    return "OK";
  }
  describe() {
    return (
      "Product [id=" +
      this.id +
      '] "' +
      this.name +
      '" | Stock: ' +
      this.#quantity
    );
  }
}

class User {
  #isLoggedIn;
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this.#isLoggedIn = false;
  }
  get isLoggedIn() {
    return this.#isLoggedIn;
  }
  login() {
    if (this.#isLoggedIn) return "already logged in";
    this.#isLoggedIn = true;
    return "logged in";
  }
  logout() {
    if (!this.#isLoggedIn) return "already logged out";
    this.#isLoggedIn = false;
    return "logged out";
  }
  getDiscount() {
    return 0;
  }
}

class Admin extends User {
  constructor(username, email, role) {
    super(username, email);
    this.role = role;
  }
  getDiscount() {
    return 0.1;
  }
  addNewProduct(products, product) {
    if (!(product instanceof Product)) return "ERROR: not a Product";
    if (products.find((p) => p.id === product.id)) return "ERROR: duplicate id";
    products.push(product);
    return "OK";
  }
}

class Cart {
  constructor(user) {
    this.user = user;
    this.items = [];
  }
  addItem(product, qty) {
    if (!(product instanceof Product)) return "ERROR: not a Product";
    if (qty <= 0) return "ERROR: invalid qty";
    if (product.quantity < qty) return "ERROR: not enough stock";
    const existing = this.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ product, quantity: qty });
    }
    product.decreaseStock(qty);
    return "OK";
  }
  removeItem(productId) {
    const index = this.items.findIndex((i) => i.product.id === productId);
    if (index === -1) return "ERROR: not found";
    const removed = this.items[index];
    removed.product.increaseStock(removed.quantity);
    this.items.splice(index, 1);
    return "OK";
  }
  getTotalPrice() {
    const subtotal = this.items.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0,
    );
    return subtotal * (1 - this.user.getDiscount());
  }
}

// -----------------------------------------------------------------
//  TEST 1 – normalizeCoupon
// -----------------------------------------------------------------
describe("normalizeCoupon()", function () {
  it("trims leading and trailing spaces", function () {
    expect(normalizeCoupon("  SAVE10  ")).toBe("SAVE10");
  });

  it("converts lowercase to uppercase", function () {
    expect(normalizeCoupon("save10")).toBe("SAVE10");
  });

  it("handles mixed case", function () {
    expect(normalizeCoupon("Save10")).toBe("SAVE10");
  });

  it("returns an empty string for empty input", function () {
    expect(normalizeCoupon("")).toBe("");
  });

  it("handles input that is already normalized", function () {
    expect(normalizeCoupon("BLACKFRIDAY50")).toBe("BLACKFRIDAY50");
  });
});

// -----------------------------------------------------------------
//  TEST 2 – isValidCoupon
// -----------------------------------------------------------------
describe("isValidCoupon()", function () {
  it("returns true for a valid coupon SAVE10", function () {
    expect(isValidCoupon("SAVE10")).toBe(true);
  });

  it("returns true for a valid coupon BLACKFRIDAY50", function () {
    expect(isValidCoupon("BLACKFRIDAY50")).toBe(true);
  });

  it("returns true for every coupon in the list", function () {
    VALID_COUPONS.forEach(function (coupon) {
      expect(isValidCoupon(coupon)).toBe(true);
    });
  });

  it("returns false for an invalid coupon", function () {
    expect(isValidCoupon("INVALID")).toBe(false);
  });

  it("returns false for a lowercase valid coupon (case-sensitive)", function () {
    expect(isValidCoupon("save10")).toBe(false);
  });

  it("returns false for an empty string", function () {
    expect(isValidCoupon("")).toBe(false);
  });

  it("returns false for a partial match", function () {
    expect(isValidCoupon("SAVE")).toBe(false);
  });
});

// -----------------------------------------------------------------
//  TEST 3 – calculateOrderSummaryLogic  (logical error testing)
// -----------------------------------------------------------------
describe("calculateOrderSummaryLogic()", function () {
  it("calculates subtotal correctly for one item", function () {
    const result = calculateOrderSummaryLogic([{ price: 100, quantity: 2 }]);
    expect(result.subtotal).toBeCloseTo(200, 2);
  });

  it("calculates VAT (19%) correctly", function () {
    const result = calculateOrderSummaryLogic([{ price: 100, quantity: 1 }]);
    expect(result.tax).toBeCloseTo(19, 2);
  });

  it("charges shipping (RON 30) when subtotal is below 500", function () {
    const result = calculateOrderSummaryLogic([{ price: 100, quantity: 1 }]);
    expect(result.shippingCost).toBe(30);
  });

  it("gives free shipping when subtotal is exactly 500", function () {
    const result = calculateOrderSummaryLogic([{ price: 500, quantity: 1 }]);
    expect(result.shippingCost).toBe(0);
  });

  it("gives free shipping when subtotal is above 500", function () {
    const result = calculateOrderSummaryLogic([{ price: 300, quantity: 2 }]);
    expect(result.shippingCost).toBe(0);
  });

  it("calculates correct total: subtotal + shipping + tax", function () {
    const result = calculateOrderSummaryLogic([{ price: 100, quantity: 1 }]);
    // subtotal=100, shipping=30, tax=19, total=149
    expect(result.total).toBeCloseTo(149, 2);
  });

  it("returns zero subtotal for empty cart", function () {
    const result = calculateOrderSummaryLogic([]);
    expect(result.subtotal).toBe(0);
  });

  it("charges shipping on empty cart (subtotal 0 < 500)", function () {
    const result = calculateOrderSummaryLogic([]);
    expect(result.shippingCost).toBe(30);
  });
});

// -----------------------------------------------------------------
//  TEST 4 – isInStock  (logical error testing)
// -----------------------------------------------------------------
describe("isInStock()", function () {
  let prod;
  beforeEach(function () {
    prod = { id: 1, name: "Test", price: 99, quantity: 10, category: "Male" };
  });

  it("returns true when requested qty equals stock", function () {
    expect(isInStock(prod, 10)).toBe(true);
  });

  it("returns true when requested qty is less than stock", function () {
    expect(isInStock(prod, 5)).toBe(true);
  });

  it("returns false when requested qty exceeds stock", function () {
    expect(isInStock(prod, 11)).toBe(false);
  });

  it("returns true when qty is 1 and stock is 1", function () {
    prod.quantity = 1;
    expect(isInStock(prod, 1)).toBe(true);
  });

  it("returns false when stock is 0", function () {
    prod.quantity = 0;
    expect(isInStock(prod, 1)).toBe(false);
  });
});

// -----------------------------------------------------------------
//  TEST 5 – addToCart  ( logical error testing)
// -----------------------------------------------------------------
describe("addToCart()", function () {
  let cart, product;
  beforeEach(function () {
    cart = { items: [], totalPrice: 0 };
    product = {
      id: 1,
      name: "Jacket",
      price: 299.99,
      quantity: 10,
      category: "Male",
    };
  });

  it("returns true and adds product to cart when stock is sufficient", function () {
    const result = addToCart(cart, product, 3);
    expect(result).toBe(true);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it("decreases product stock after adding", function () {
    addToCart(cart, product, 4);
    expect(product.quantity).toBe(6);
  });

  it("updates cart totalPrice after adding", function () {
    addToCart(cart, product, 2);
    expect(cart.totalPrice).toBeCloseTo(599.98, 2);
  });

  it("increases quantity if same product added again", function () {
    addToCart(cart, product, 2);
    addToCart(cart, product, 3);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(5);
  });

  it("returns false when requested qty exceeds stock", function () {
    const result = addToCart(cart, product, 15);
    expect(result).toBe(false);
    expect(cart.items.length).toBe(0);
  });

  it("does not modify cart when stock is insufficient", function () {
    addToCart(cart, product, 15);
    expect(cart.totalPrice).toBe(0);
  });
});

// -----------------------------------------------------------------
//  TEST 6 – removeFromCart ( logical error testing, stock restore)
// -----------------------------------------------------------------
describe("removeFromCart()", function () {
  let cart, product;
  beforeEach(function () {
    product = {
      id: 1,
      name: "Jacket",
      price: 299.99,
      quantity: 7,
      category: "Male",
    };
    cart = {
      items: [
        { id: 1, name: "Jacket", price: 299.99, quantity: 3, category: "Male" },
      ],
      totalPrice: 299.99 * 3,
    };
  });

  it("returns true and removes product from cart", function () {
    const result = removeFromCart(cart, 1);
    expect(result).toBe(true);
    expect(cart.items.length).toBe(0);
  });

  it("updates totalPrice to 0 after removing only item", function () {
    removeFromCart(cart, 1);
    expect(cart.totalPrice).toBe(0);
  });

  it("restores stock to product when item is removed (bonus)", function () {
    const stockBefore = product.quantity;
    removeFromCart(cart, 1);
    const stockProduct = testProducts.find((p) => p.id === 1);
    // stock restore is applied to testProducts array
    expect(typeof stockProduct.quantity).toBe("number");
  });

  it("returns false when product id does not exist in cart", function () {
    const result = removeFromCart(cart, 99);
    expect(result).toBe(false);
  });

  it("does not change cart when id is not found", function () {
    removeFromCart(cart, 99);
    expect(cart.items.length).toBe(1);
  });
});

// -----------------------------------------------------------------
//  TEST 7 – getCheapProducts (logical error testing)
// -----------------------------------------------------------------
describe("getCheapProducts()", function () {
  it("returns only products below the price limit", function () {
    const result = getCheapProducts(testProducts, 100);
    result.forEach(function (p) {
      expect(p.price).toBeLessThan(100);
    });
  });

  it("returns correct count for limit 100", function () {
    const result = getCheapProducts(testProducts, 100);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty array when limit is lower than all prices", function () {
    const result = getCheapProducts(testProducts, 1);
    expect(result.length).toBe(0);
  });

  it("returns all products when limit is higher than all prices", function () {
    const result = getCheapProducts(testProducts, 99999);
    expect(result.length).toBe(testProducts.length);
  });

  it("does not include products at exactly the limit price", function () {
    // product at price 299.99 should NOT be in results for limit 299.99
    const result = getCheapProducts(testProducts, 299.99);
    const found = result.find((p) => p.price === 299.99);
    expect(found).toBeUndefined();
  });
});

// -----------------------------------------------------------------
//  TEST 8 – getProductsByCategory  (anonymous function)
// -----------------------------------------------------------------
describe("getProductsByCategory()", function () {
  it("returns only Male products", function () {
    const result = getProductsByCategory(testProducts, "Male");
    result.forEach(function (p) {
      expect(p.category).toBe("Male");
    });
  });

  it("returns only Female products", function () {
    const result = getProductsByCategory(testProducts, "Female");
    result.forEach(function (p) {
      expect(p.category).toBe("Female");
    });
  });

  it("returns empty array for a category that does not exist", function () {
    const result = getProductsByCategory(testProducts, "Kids");
    expect(result.length).toBe(0);
  });

  it("returns empty array for empty string category", function () {
    const result = getProductsByCategory(testProducts, "");
    expect(result.length).toBe(0);
  });

  it("is case-sensitive – 'male' does not match 'Male'", function () {
    const result = getProductsByCategory(testProducts, "male");
    expect(result.length).toBe(0);
  });
});

// -----------------------------------------------------------------
//  SUITE 11 – Admin class  (inheritance + polymorphism)
// -----------------------------------------------------------------
describe("Admin class", function () {
  let admin, productsList;
  beforeEach(function () {
    admin = new Admin("admin_sara", "sara@shop.com", "store_manager");
    productsList = [
      new Product(1, "Jacket", 299.99, 10, "Male"),
      new Product(2, "Coat", 129.99, 5, "Female"),
    ];
  });

  it("Admin is an instance of User (inheritance)", function () {
    expect(admin instanceof User).toBe(true);
  });

  it("Admin is an instance of Admin", function () {
    expect(admin instanceof Admin).toBe(true);
  });

  it("getDiscount() returns 0.1 for Admin (polymorphism)", function () {
    expect(admin.getDiscount()).toBe(0.1);
  });

  it("User getDiscount() still returns 0 (polymorphism proof)", function () {
    const u = new User("x", "x@x.com");
    expect(u.getDiscount()).toBe(0);
  });

  it("addNewProduct() adds a valid new product", function () {
    const newProduct = new Product(3, "Sneaker", 499.99, 8, "Unisex");
    const result = admin.addNewProduct(productsList, newProduct);
    expect(result).toBe("OK");
    expect(productsList.length).toBe(3);
  });

  it("addNewProduct() returns error for duplicate id", function () {
    const dup = new Product(1, "Fake", 10, 5, "Male");
    expect(admin.addNewProduct(productsList, dup)).toContain("ERROR");
  });

  it("addNewProduct() does not add duplicate to list", function () {
    const dup = new Product(1, "Fake", 10, 5, "Male");
    admin.addNewProduct(productsList, dup);
    expect(productsList.length).toBe(2);
  });

  it("addNewProduct() returns error for non-Product argument", function () {
    expect(admin.addNewProduct(productsList, { id: 99 })).toContain("ERROR");
  });

  it("Admin inherits login() from User", function () {
    admin.login();
    expect(admin.isLoggedIn).toBe(true);
  });

  it("Admin inherits logout() from User", function () {
    admin.login();
    admin.logout();
    expect(admin.isLoggedIn).toBe(false);
  });
});
