// =================================================================
//  SECTION 1: PRODUCT OBJECTS
//  Each product has: id, name, price, quantity, category
// =================================================================

const product1 = {
  id: 1,
  name: "Jens Decathlons Jacket",
  price: 299.99,
  quantity: 10,
  category: "Male",
};

const product2 = {
  id: 2,
  name: "Ladies Casual Coat",
  price: 129.99,
  quantity: 10,
  category: "Female",
};

const product3 = {
  id: 3,
  name: "Ladies Jacket",
  price: 229.99,
  quantity: 5,
  category: "Female",
};

// Full product list used by filter functions
const allProducts = [
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
  { id: 8, name: "Mens Hoodi", price: 39.99, quantity: 15, category: "Male" },
  { id: 9, name: "Mens Sweeter", price: 44.99, quantity: 10, category: "Male" },
  {
    id: 10,
    name: "Mens Leather Jacket",
    price: 229.99,
    quantity: 5,
    category: "Male",
  },
  {
    id: 11,
    name: "Ladies Sweeter",
    price: 79.99,
    quantity: 8,
    category: "Female",
  },
  {
    id: 12,
    name: "Mens Suede Shoe",
    price: 89.99,
    quantity: 12,
    category: "Male",
  },
  { id: 13, name: "Mens Short", price: 39.99, quantity: 20, category: "Male" },
  {
    id: 14,
    name: "Mens Partyware Shoe",
    price: 199.99,
    quantity: 18,
    category: "Male",
  },
  {
    id: 15,
    name: "Cheyanne - Elegant cashmere sweater for women",
    price: 129.99,
    quantity: 10,
    category: "Female",
  },
  {
    id: 16,
    name: "Guess Sneaker",
    price: 599.99,
    quantity: 10,
    category: "Female",
  },
  {
    id: 17,
    name: "Adidas Bags",
    price: 159.99,
    quantity: 13,
    category: "Female",
  },
  {
    id: 18,
    name: "Adidas Short",
    price: 259.99,
    quantity: 7,
    category: "Unisex",
  },
  {
    id: 19,
    name: "Hawkers Sunglasses",
    price: 359.99,
    quantity: 5,
    category: "Male",
  },
  {
    id: 20,
    name: "Hugo T-Shirt",
    price: 349.99,
    quantity: 10,
    category: "Male",
  },
  {
    id: 21,
    name: "AllSaints Bracelet",
    price: 159.99,
    quantity: 15,
    category: "Female",
  },
  {
    id: 22,
    name: "Armani Watch",
    price: 1259.99,
    quantity: 5,
    category: "Male",
  },
  {
    id: 23,
    name: "Dr. Martens Boots",
    price: 959.99,
    quantity: 8,
    category: "Male",
  },
  {
    id: 24,
    name: "Dr. Martens Chelsea Boots",
    price: 779.99,
    quantity: 10,
    category: "Male",
  },
  {
    id: 25,
    name: "Tommy Jeans Sneaker",
    price: 449.99,
    quantity: 12,
    category: "Male",
  },
  {
    id: 26,
    name: "Tommy Hilfiger Cap",
    price: 159.99,
    quantity: 20,
    category: "Unisex",
  },
  {
    id: 27,
    name: "Tommy Bag",
    price: 139.99,
    quantity: 15,
    category: "Unisex",
  },
  {
    id: 28,
    name: "Timberland Boots",
    price: 1249.99,
    quantity: 10,
    category: "Female",
  },
  {
    id: 29,
    name: "Polo Sneaker",
    price: 159.99,
    quantity: 18,
    category: "Unisex",
  },
  {
    id: 30,
    name: "Northface Jacket",
    price: 1559.99,
    quantity: 5,
    category: "Unisex",
  },
  {
    id: 31,
    name: "Nike Sportware",
    price: 559.99,
    quantity: 10,
    category: "Unisex",
  },
  {
    id: 32,
    name: "Nike Sneaker",
    price: 739.99,
    quantity: 12,
    category: "Unisex",
  },
  {
    id: 33,
    name: "Levi's Belt",
    price: 159.99,
    quantity: 20,
    category: "Male",
  },
  {
    id: 34,
    name: "Karl Lagerfeld Sneaker",
    price: 1149.99,
    quantity: 8,
    category: "Female",
  },
];

// =================================================================
//  SECTION 2: USER OBJECT
//  Properties required by assignment: username, email, isLoggedIn
// =================================================================

const user = {
  username: "john_doe",
  email: "john.doe@example.com",
  isLoggedIn: true,
};

// =================================================================
//  SECTION 3: CART OBJECT
//  Properties required by assignment: items, totalPrice
// =================================================================

const cart = {
  items: [],
  totalPrice: 0,
};

// Helper – recalculates and updates cart.totalPrice
function updateTotalPrice(cart) {
  cart.totalPrice = cart.items.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
}

// -----------------------------------------------------------------
//  isInStock(product, requestedQty)
// -----------------------------------------------------------------
function isInStock(product, requestedQty) {
  return product.quantity >= requestedQty;
}

// -----------------------------------------------------------------
//  addToCart(cart, product, qty)
// -----------------------------------------------------------------
function addToCart(cart, product, qty) {
  // Step 1 – check stock using isInStock
  if (!isInStock(product, qty)) {
    console.log(
      'NOT ADDED – "' +
        product.name +
        '": requested ' +
        qty +
        ", available " +
        product.quantity,
    );
    return;
  }

  // Step 2 – already in cart? increase qty, else push new entry
  let existing = cart.items.find(function (item) {
    return item.id === product.id;
  });

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

  // Step 3 – decrease warehouse stock by qty
  product.quantity -= qty;

  // Step 4 – update totalPrice
  updateTotalPrice(cart);

  console.log(
    'ADDED – "' +
      product.name +
      '" x' +
      qty +
      " | Cart qty: " +
      (existing ? existing.quantity : qty) +
      " | Stock left: " +
      product.quantity +
      " | Cart total: RON " +
      cart.totalPrice.toFixed(2),
  );
}

// -----------------------------------------------------------------
//  removeFromCart(cart, productId)
//  Removes item by id. Shows message if not found.
//  BONUS: restores quantity back to product stock.
// -----------------------------------------------------------------
function removeFromCart(cart, productId) {
  let index = cart.items.findIndex(function (item) {
    return item.id === productId;
  });

  // If not found, show message and exit
  if (index === -1) {
    console.log("NOT FOUND – product id " + productId + " is not in the cart.");
    return;
  }

  let removed = cart.items[index];

  // Restore stock quantity back to product
  let stockProduct = allProducts.find(function (p) {
    return p.id === productId;
  });
  if (stockProduct) {
    stockProduct.quantity += removed.quantity;
    console.log(
      'REMOVED – "' +
        removed.name +
        '" | Stock restored to: ' +
        stockProduct.quantity,
    );
  } else {
    console.log('REMOVED – "' + removed.name + '"');
  }

  // Remove from cart array and update total
  cart.items.splice(index, 1);
  updateTotalPrice(cart);
  console.log("Cart total after removal: RON " + cart.totalPrice.toFixed(2));
}

// -----------------------------------------------------------------
//  getCheapProducts(products, limit)  ← arrow function + filter
const getCheapProducts = (products, limit) =>
  products.filter((p) => p.price < limit);

// -----------------------------------------------------------------
//  getProductsByCategory(products, category)  ← anonymous function
const getProductsByCategory = function (products, category) {
  return products.filter(function (p) {
    return p.category === category;
  });
};

// -----------------------------------------------------------------
//  createDiscountTracker()  ← closure
function createDiscountTracker() {
  let discountCount = 0;

  return function (discountPercent) {
    discountCount += 1;
    console.log(
      "Discount #" + discountCount + " applied: " + discountPercent + "% off",
    );
    return discountCount;
  };
}

// =================================================================
//  SECTION 5: TESTS

//  TEST 1 – Objects
console.log("=== TEST 1 – Objects ===");

console.log(product1);

console.log(product2);

console.log(product3);

console.log(user);

console.log("items:", cart.items);
console.log("totalPrice: RON", cart.totalPrice.toFixed(2));

// -----------------------------------------------------------------
//  TEST 2 – isInStock

console.log(
  "NORMAL: Request 5 of product1 (stock 10) →",
  isInStock(product1, 5),
); // true
console.log(
  "NORMAL: Request 10 of product1 (stock 10) →",
  isInStock(product1, 10),
); // true (equal)
console.log(
  "NORMAL: Request 3 of product3 (stock 5) →",
  isInStock(product3, 3),
);

// if requested quantity exceeds stock, should return false
console.log(
  "BAD:    Request 15 of product1 (stock 10) →",
  isInStock(product1, 15),
);
console.log(
  "BAD:    Request 6 of product3 (stock 5) →",
  isInStock(product3, 6),
);

// -----------------------------------------------------------------
//  TEST 3 – addToCart

//product1 stock is 10, product2 stock is 10, product3 stock is 5 at the start of these tests
console.log(
  "\nNORMAL 3a) Add 3 x product1 (Jens Decathlons Jacket, stock: 10)",
);
addToCart(cart, product1, 3);

//add same product again → quantity in cart increases
console.log("Add 2 more x product1 (stock now: 7)");
addToCart(cart, product1, 2);

//add a different product
console.log("Add 2 x product2 (Ladies Casual Coat, stock: 10)");
addToCart(cart, product2, 2);

// if request more than available stock
console.log(" Add 10 x product1 (stock now: 5) – should fail");
addToCart(cart, product1, 10);

//if request exactly 0 stock left
console.log("Add 5 x product3 (Ladies Jacket, stock: 5) – exact limit");
addToCart(cart, product3, 5);

console.log("Add 1 x product3 (stock now: 0) – should fail");
addToCart(cart, product3, 1);

console.log(" Cart after addToCart tests --");
console.log("items:", cart.items);
console.log("totalPrice: RON", cart.totalPrice.toFixed(2));

// -----------------------------------------------------------------
//  TEST 4 – removeFromCart
// -----------------------------------------------------------------
console.log("TEST 4 – removeFromCart(cart, productId) ===");

//remove product that IS in cart
console.log("Remove product1 (id 1) – is in cart");
removeFromCart(cart, 1);

// if remove same product again → should show NOT FOUND message, since it was already removed
console.log(" Remove product1 (id 1) again – not in cart");
removeFromCart(cart, 1);

// if remove product that was never in cart → should show NOT FOUND message
console.log("Remove product with id 99 – never existed");
removeFromCart(cart, 99);

// remove another product that is in cart
console.log("Remove product2 (id 2) – is in cart");
removeFromCart(cart, 2);

console.log("Cart after removeFromCart tests --");
console.log("items:", cart.items);
console.log("totalPrice: RON", cart.totalPrice.toFixed(2));

// -----------------------------------------------------------------
//  TEST 5 – getCheapProducts (arrow function)
// -----------------------------------------------------------------
console.log("TEST 5 – getCheapProducts(products, limit) ===");

// products under RON 100
let under100 = getCheapProducts(allProducts, 100);
console.log(
  "NORMAL: Products under RON 100 (" + under100.length + "):",
  under100.map(function (p) {
    return p.name + " – RON " + p.price;
  }),
);

//products under RON 500
let under500 = getCheapProducts(allProducts, 500);
console.log(
  "NORMAL: Products under RON 500 (" + under500.length + "):",
  under500.map(function (p) {
    return p.name + " – RON " + p.price;
  }),
);

// limit so low nothing qualifies
let under1000 = getCheapProducts(allProducts, 1000);
console.log(
  "BAD: Products under RON 1000 (" + under1000.length + "):",
  under1000.length === 0 ? "No products found" : under1000,
);

// limit covers all products
let underAll = getCheapProducts(allProducts, 9999);
console.log(
  "BAD: Products under RON 9999 (should be all):",
  underAll.length,
  "products",
);

// -----------------------------------------------------------------
//  TEST 6 – getProductsByCategory (anonymous function)
// -----------------------------------------------------------------
console.log(" TEST 6 – getProductsByCategory(products, category) ===");

// existing categories
let maleProducts = getProductsByCategory(allProducts, "Male");
console.log(
  "NORMAL: Male products (" + maleProducts.length + "):",
  maleProducts.map(function (p) {
    return p.name;
  }),
);

let femaleProducts = getProductsByCategory(allProducts, "Female");
console.log(
  "NORMAL: Female products (" + femaleProducts.length + "):",
  femaleProducts.map(function (p) {
    return p.name;
  }),
);

let unisexProducts = getProductsByCategory(allProducts, "Unisex");
console.log(
  "NORMAL: Unisex products (" + unisexProducts.length + "):",
  unisexProducts.map(function (p) {
    return p.name;
  }),
);

// category that doesn't exist
let kidsProducts = getProductsByCategory(allProducts, "Kids");
console.log(
  "BAD: 'Kids' category (" + kidsProducts.length + "):",
  kidsProducts.length === 0 ? "No products found" : kidsProducts,
);

// -----------------------------------------------------------------
//  TEST 7 – createDiscountTracker (closure)
// -----------------------------------------------------------------
console.log("TEST 7 – createDiscountTracker() closure ===");

let applyDiscount = createDiscountTracker();

// applying discounts, counter increases
console.log("NORMAL) Applying discounts:");
applyDiscount(10); // Discount #1 – 10% off
applyDiscount(15); // Discount #2 – 15% off
applyDiscount(20); // Discount #3 – 20% off

console.log("typeof discountCount:", typeof discountCount);

let applyDiscount2 = createDiscountTracker();
console.log("NORMAL ) Second discount tracker:");
applyDiscount2(5); // Discount #1 for this tracker
applyDiscount2(25); // Discount #2 for this tracker
