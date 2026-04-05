// =================================================================
//  Ass02.js  –  Assignment 02: OOP eCommerce Core
//  Classes: Product, User, Admin, Cart

// =================================================================
//  CLASS: Product
//  Private field:  #quantity
//  Getter:         get quantity()
//  Methods:        decreaseStock(qty), increaseStock(qty), describe()
// =================================================================
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

  // Decrease stock
  decreaseStock(qty) {
    if (qty <= 0) {
      return "ERROR: qty must be greater than 0.";
    }
    if (qty > this.#quantity) {
      return (
        'ERROR: not enough stock for "' +
        this.name +
        '". Requested: ' +
        qty +
        ", Available: " +
        this.#quantity
      );
    }
    this.#quantity -= qty;
    return (
      '"' +
      this.name +
      '" stock decreased by ' +
      qty +
      ". Remaining: " +
      this.#quantity
    );
  }

  // Restore stock
  increaseStock(qty) {
    if (qty <= 0) {
      return "ERROR: qty must be greater than 0.";
    }
    this.#quantity += qty;
    return (
      '"' +
      this.name +
      '" stock increased by ' +
      qty +
      ". New stock: " +
      this.#quantity
    );
  }

  describe() {
    return (
      "Product [id=" +
      this.id +
      '] "' +
      this.name +
      '" | Price: RON ' +
      this.price.toFixed(2) +
      " | Stock: " +
      this.#quantity +
      " | Category: " +
      this.category
    );
  }
}

// =================================================================
//  CLASS: User
//  Private field:  #isLoggedIn
//  Getter:         get isLoggedIn()
//  Methods:        login(), logout(), getDiscount(), describe()
// =================================================================
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
    if (this.#isLoggedIn) {
      return this.username + " is already logged in.";
    }
    this.#isLoggedIn = true;
    return this.username + " logged in successfully.";
  }

  logout() {
    if (!this.#isLoggedIn) {
      return this.username + " is already logged out.";
    }
    this.#isLoggedIn = false;
    return this.username + " logged out successfully.";
  }

  getDiscount() {
    return 0;
  }

  describe() {
    return (
      "User: " +
      this.username +
      " | Email: " +
      this.email +
      " | LoggedIn: " +
      this.#isLoggedIn +
      " | Discount: " +
      this.getDiscount() * 100 +
      "%"
    );
  }
}

// =================================================================
//  CLASS: Admin  (extends User)
//  Extra field:    role
//  Extra method:   addNewProduct(products, product)
//  Polymorphism:   getDiscount() returns 0.1 (10%)
// =================================================================
class Admin extends User {
  constructor(username, email, role) {
    super(username, email);
    this.role = role;
  }

  getDiscount() {
    return 0.1;
  }

  addNewProduct(products, product) {
    if (!(product instanceof Product)) {
      return "ERROR: argument must be a Product instance.";
    }
    const exists = products.find(function (p) {
      return p.id === product.id;
    });
    if (exists) {
      return "ERROR: product with id " + product.id + " already exists.";
    }
    products.push(product);
    return "[Admin: " + this.username + '] Added "' + product.name + '"';
  }

  describe() {
    return (
      "Admin: " +
      this.username +
      " | Email: " +
      this.email +
      " | Role: " +
      this.role +
      " | LoggedIn: " +
      this.isLoggedIn +
      " | Discount: " +
      this.getDiscount() * 100 +
      "%"
    );
  }
}

// =================================================================
//  CLASS: Cart
//  Methods: addItem(product, qty), removeItem(productId),
//           getTotalPrice(), displayCart()
// =================================================================
class Cart {
  constructor(user) {
    this.user = user;
    this.items = [];
  }

  addItem(product, qty) {
    if (!(product instanceof Product)) {
      return "ERROR: first argument must be a Product instance.";
    }
    if (qty <= 0) {
      return "ERROR: qty must be greater than 0.";
    }
    if (product.quantity < qty) {
      return (
        'ERROR: not enough stock for "' +
        product.name +
        '". Requested: ' +
        qty +
        ", Available: " +
        product.quantity
      );
    }

    const existing = this.items.find(function (item) {
      return item.product.id === product.id;
    });

    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ product: product, quantity: qty });
    }

    product.decreaseStock(qty);

    return (
      'Added "' +
      product.name +
      '" x' +
      qty +
      " to cart [" +
      this.user.username +
      "]." +
      " Total: RON " +
      this.getTotalPrice().toFixed(2)
    );
  }

  removeItem(productId) {
    const index = this.items.findIndex(function (item) {
      return item.product.id === productId;
    });
    if (index === -1) {
      return "ERROR: product id " + productId + " not found in cart.";
    }
    const removed = this.items[index];
    removed.product.increaseStock(removed.quantity); // BONUS: restore stock
    this.items.splice(index, 1);
    return (
      'Removed "' +
      removed.product.name +
      '" from cart [' +
      this.user.username +
      "]." +
      " Total: RON " +
      this.getTotalPrice().toFixed(2)
    );
  }

  // Applies the discount
  getTotalPrice() {
    const subtotal = this.items.reduce(function (sum, item) {
      return sum + item.product.price * item.quantity;
    }, 0);
    return subtotal * (1 - this.user.getDiscount());
  }

  displayCart() {
    if (this.items.length === 0) {
      return "Cart [" + this.user.username + "] is empty.";
    }
    let output = "--- Cart: " + this.user.username + " ---\n";
    this.items.forEach(function (item) {
      output +=
        '  "' +
        item.product.name +
        '" x' +
        item.quantity +
        " = RON " +
        (item.product.price * item.quantity).toFixed(2) +
        "\n";
    });
    output += "  Discount: " + this.user.getDiscount() * 100 + "%\n";
    output += "  Total: RON " + this.getTotalPrice().toFixed(2);
    return output;
  }
}

// =================================================================
//  CREATE OBJECTS
// =================================================================

const product1 = new Product(1, "Jens Decathlons Jacket", 299.99, 10, "Male");
const product2 = new Product(2, "Ladies Casual Coat", 129.99, 10, "Female");
const product3 = new Product(3, "Ladies Jacket", 229.99, 5, "Female");
const product4 = new Product(4, "Mens T-shirt", 19.99, 20, "Male");
const product5 = new Product(5, "Armani Watch", 1259.99, 5, "Male");

const products = [product1, product2, product3, product4, product5];

const user1 = new User("john_doe", "john.doe@example.com");
const admin1 = new Admin("admin_sara", "sara@dfashion.com", "store_manager");

const cart1 = new Cart(user1); // regular user cart – 0% discount
const cart2 = new Cart(admin1); // admin cart – 10% discount

// =================================================================
//  TESTS – all console.log()
// =================================================================

// -----------------------------------------------------------------
//  TEST 1 – Product
// -----------------------------------------------------------------
console.log("=== TEST 1 – Product ===");
console.log(product1.describe());
console.log(product2.describe());
console.log(product3.describe());

// decrease stock
console.log("\n-- decreaseStock (normal) --");
console.log(product1.decreaseStock(3));
console.log(product3.decreaseStock(5));

// not enough stock
console.log("\n-- decreaseStock  not enough stock) --");
console.log(product3.decreaseStock(1));

// invalid qty
console.log("\n-- decreaseStock  invalid qty) --");
console.log(product1.decreaseStock(0));
console.log(product1.decreaseStock(-2));

// NORMAL – increaseStock
console.log("\n-- increaseStock (normal) --");
console.log(product3.increaseStock(5));
console.log(product3.describe());

// Encapsulation check
console.log("\n-- Encapsulation: direct #quantity access --");
console.log("Via getter product1.quantity:", product1.quantity);
console.log("Direct product1['#quantity']:", product1["#quantity"]);

// -----------------------------------------------------------------
//  TEST 2 – User
// -----------------------------------------------------------------
console.log("\n=== TEST 2 – User ===");
console.log(user1.describe());

// NORMAL – login / logout
console.log("\n-- login (normal) --");
console.log(user1.login());
console.log("isLoggedIn:", user1.isLoggedIn);

// login again
console.log("\n-- login  already logged in) --");
console.log(user1.login());

// NORMAL – logout
console.log("\n-- logout (normal) --");
console.log(user1.logout());
console.log("isLoggedIn:", user1.isLoggedIn);

// logout again
console.log("\n-- logout  already logged out) --");
console.log(user1.logout());

// getDiscount
console.log("\n-- getDiscount --");
console.log("User discount:", user1.getDiscount());

// -----------------------------------------------------------------
//  TEST 3 – Admin
// -----------------------------------------------------------------
console.log("\n=== TEST 3 – Admin ===");
console.log(admin1.describe());

console.log("\n-- login/logout (inherited from User) --");
console.log(admin1.login());
console.log("Admin isLoggedIn:", admin1.isLoggedIn);
console.log("Admin isLoggedIn:", admin1.isLoggedIn);

// POLYMORPHISM
console.log("\n-- getDiscount polymorphism --");
console.log("User  getDiscount():", user1.getDiscount());
console.log("Admin getDiscount():", admin1.getDiscount());

// addNewProduct – NORMAL
console.log("\n-- addNewProduct (normal) --");
const product6 = new Product(6, "Nike Sneaker", 739.99, 12, "Unisex");
console.log(admin1.addNewProduct(products, product6));
console.log("Products count:", products.length);

// addNewProduct – duplicate id
console.log("\n-- addNewProduct  duplicate id) --");
const dupProduct = new Product(1, "Fake Jacket", 99.99, 5, "Male");
console.log(admin1.addNewProduct(products, dupProduct));

// addNewProduct – not a Product instance
console.log("\n-- addNewProduct  not a Product instance) --");
console.log(admin1.addNewProduct(products, { id: 99, name: "Not a product" }));

// instanceof checks
console.log("\n-- instanceof (inheritance check) --");
console.log("admin1 instanceof Admin:", admin1 instanceof Admin);
console.log("admin1 instanceof User:", admin1 instanceof User);
console.log("user1  instanceof Admin:", user1 instanceof Admin);

// -----------------------------------------------------------------
//  TEST 4 – Cart
// -----------------------------------------------------------------
console.log("\n=== TEST 4 – Cart ===");

user1.login();
admin1.login();

// NORMAL – add items to user cart
console.log("\n-- addItem (normal) --");
console.log(cart1.addItem(product1, 2));
console.log(cart1.addItem(product2, 1));
console.log(cart1.addItem(product4, 3));

// not enough stock
console.log("\n-- addItem  not enough stock) --");
console.log(cart1.addItem(product3, 10));

// invalid qty
console.log("\n-- addItem  invalid qty) --");
console.log(cart1.addItem(product1, 0));
console.log(cart1.addItem(product1, -1));

// not a Product instance
console.log("\n-- addItem  not a Product instance) --");
console.log(cart1.addItem({ id: 99 }, 1));

// Display user cart (0% discount)
console.log("\n-- displayCart (user – 0% discount) --");
console.log(cart1.displayCart());

// Admin cart automatically gets 10% discount
console.log("\n-- addItem to admin cart (10% discount applied) --");
console.log(cart2.addItem(product5, 1));
console.log(cart2.displayCart());

// NORMAL – removeItem
console.log("\n-- removeItem (normal) --");
console.log(cart1.removeItem(1));
console.log(cart1.displayCart());

// id not in cart
console.log("\n-- removeItem  id not in cart) --");
console.log(cart1.removeItem(99));

// Empty cart
console.log("\n-- empty cart display --");
const emptyCart = new Cart(user1);
console.log(emptyCart.displayCart());
