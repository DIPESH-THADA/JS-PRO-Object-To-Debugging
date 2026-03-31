import { Product } from "./text";

// let tShirt = {
//   name: "Denim Shirt",
//   price: 34,
//   quantity: 1,
//   Description: "Casual shirt, comfortable fit.",
// };

// console.log(
//   `this is ${tShirt.name} it cost ${tShirt.price} lei we have ${tShirt.quantity} piece and its ${tShirt.Description}`,
// );

// console.log(tShirt.Description.length);

// let tShirt = new Object();
// tShirt.name = "Denim Shirt";
// tShirt.price = 34;
// tShirt.quantity = 1;
// tShirt.description = "Casual shirt, comfortable fit.";

// console.log(tShirt);
// console.log(typeof tShirt.name);

/* let resistrationForm = {
  name: "Dipesh Thada Magar",
  email: "dipeshthada30@gmail.com",
  password: 12345,
  dateOfBirth: "1997/02/17",
};

console.log(
  resistrationForm.name,
  resistrationForm.email,
  resistrationForm.password,
  resistrationForm.dateOfBirth,
);

console.log(typeof resistrationForm.dateOfBirth);

let tShirt = Object();
tShirt.name = "Denim Shirt";
tShirt.price = 34;
tShirt.quantity = 2;
tShirt.description = "Casual shirt, comfortable fit.";
tShirt.getTotalWithDiscount = function (discountPercent) {
  let discount = discountPercent / 100;
  let totalWithDiscount = this.price * (1 - discount);
  return totalWithDiscount;
};

console.log(tShirt.getTotalWithDiscount(10)); // 10% reducer
console.log(this.name); //not working
console.log(tShirt.description); */

// function calculateTotalPrice(price, quantity) {
//   return price * quantity;
// }

// console.log(calculateTotalPrice(100, 5));

/* let totalPrice = calculateTotalPrice(500, 12);
console.log(`The total price of the quantity is ${totalPrice}`);

let discountedTotal = totalPrice * 0.9;
console.log("Discounted Price:", discountedTotal);

function calculateDiscountedPrice(price, discountPercent) {
  return price * discountPercent;
}

let discountValue = calculateDiscountedPrice(500, 0.9);

console.log(`discounted value of the items is ${discountValue}`);

function showWelcomeMessage(username) {
  console.log("Welcome back, " + username + "!");
}
showWelcomeMessage("Menuka");

function showQuantity(quantity) {
  const message = quantity > 0 ? "we have product" : "we don't have product";
  console.log(message);
}

console.log(showQuantity(0)); */

// Write a function that generates a message for the user after purchase. The function receives the username as an input argument and displays an alert to the user with the message "Thank you for your purchase, username!" tag.

// function showPurchaseMessage(username) {
//   alert(`Thank you for your purchase, ${username}!`);
// }

// // Example usage
// showPurchaseMessage("Dipesh");

/* function getCheapProducts(prices) {
  return prices.filter((price) => price < 50);
}

console.log(getCheapProducts([40, 60, 20, 50, 70, 10, 80]));

function canCheckout(isLoggedIn, cartItemsCount) {
  return isLoggedIn && cartItemsCount > 0;
}

console.log(canCheckout(0, 3));
console.log(canCheckout(3, 3));
console.log(canCheckout(4, 3));
console.log(canCheckout(0, 4));

function calculateDiscount(total) {
  if (total > 100) {
    return total * 0.9;
  } else {
    return total;
  }
}

console.log(calculateDiscount(200));
console.log(calculateDiscount(90));
console.log(calculateDiscount(300)); */

/* function sum(...values) {
  let returnValue = 0;
  for (let i = 0; i < values.length; i++) {
    returnValue += values[i];
  }
  return returnValue;
}

let sumResult = sum(10, 14, 15);
console.log(sumResult); // 39

function sum(...values) {
  return values.reduce((a, b) => a + b);
}

let total = sum(10, 20, 30);
console.log(total);
 */

// constructor function
/* function Product(name, price, quantity, description) {
  this.name = name;
  this.price = price;
  this.quantity = quantity;
  this.description = description;
}

// create a new product
let p1 = new Product("Tshirt", 125, 1, "best summer hoody");
console.log(
  `this ${p1.name} const ${p1.price} lei you orderd ${p1.quantity} peice and this is ${p1.description} !`,
); // "Tricou" console.log(p1.price); // 25

// email
// password
// birthDate
// receivePromos (true/false)
// agreeTerms (true/false)
function User(email, password, birthdate, receivePromos, agreeTerms) {
  this.email = email;
  this.password = password;
  this.birthdate = birthdate;
  this.receivePromos = receivePromos;
  this.agreeTerms = agreeTerms;
}

const user1 = new User(
  "user134@example.com",
  "123455",
  "1997/02/17",
  false,
  true,
);
console.log(
  `user email is ${user1.email} password is ${user1.password} bithdate is ${user1.birthdate}, he have ${user1.receivePromos} and he admited ${user1.agreeTerms}`,
);

const use2 = new User(
  "user134@example.com",
  "123455",
  "1997/02/17",
  false,
  true,
);
console.log(
  `user email is ${use2.email} password is ${use2.password} bithdate is ${use2.birthdate}, he have ${use2.receivePromos} and he admited ${use2.agreeTerms}`,
);
 */
/* // anonymous feature
let calculatePriceWithVAT = function (price, vatPercent) {
  return price + (price * vatPercent) / 100;
};
//  Variable Function Calling
console.log(calculatePriceWithVAT(100, 20)); // 120 console.log(calculatePriceWithVAT(50, 10)); // 55
console.log(calculatePriceWithVAT(500, 13));

// A function that receives a string and a function
function greetUsers(users, greetFunction) {
  for (let i = 0; i < users.length; i++) {
    greetFunction(users[i]);
  }
}
// Name string
let names = ["Ana", "Mihai", "Elena"]; //We pass an ANONYMOUS function as a parameter
greetUsers(names, function (name) {
  console.log("Hello " + name);
}); */

// ARROW FUNCTION
// let square = (x) => x * x;
// console.log(square(5));

// When we use {}, we need to add 'return' for the function to return the value.
/* let square = (x) => {
  return x * x;
};
console.log(square(5)); // 25

let prices = [100, 250, 400];
let discountedPrices = prices.map((price) => price * 0.7);
console.log(discountedPrices);

let startingPrice = [650, 430, 780, 849, 211];
let afterDiscountPrice = startingPrice.map((price) => Math.round(price * 0.85));
console.log(afterDiscountPrice);

let a = (x, y) => {
  x++;
  return y + x;
};

let user = {
  name: "Ana",
  regularFunc: function () {
    console.log("Regular function this:", this.name);
  },
  arrowFunc: () => {
    console.log("Arrow function this:", this.name);
  },
};

user.regularFunc();
user.arrowFunc(); */

// FUNCTION WITHIN ANOTHER FUNCTION
/* let shopName = "Fashion Store"; // variabilă globală
function showShop() {
  console.log(shopName); //function can use shop Name
}

function addToCart() {
  let product = "Blazer"; // variabilă locală
  console.log(product);
}

addToCart();

let saleActive = true;
if (saleActive) {
  let discount = 10; //it exists only inside this block if
  console.log("Discount:", discount, "%"); //It works
}

function setShopMode() {
  mode = "DIRTY"; //it becomes global variable
}
setShopMode();
console.log(mode);

(function () {
  var cartTotal = 120;
  console.log("Cart total is:", cartTotal);
})();
// console.log(cartTotal); // Uncaught ReferenceError: cartTotal is not defined

(() => {
  const promoCode = "WELCOME10";
  const storageKey = "savedPromoCode";
  // Check if the promo code is already saved
  if (!localStorage.getItem(storageKey)) {
    alert(
      " Welcome to our shop!\n\n" +
        "Your promo code is: " +
        promoCode +
        "\n" +
        "Save it and use it at checkout.",
    );
    // Save promo code for later use
    localStorage.setItem(storageKey, promoCode);
  }
})();
 */

// CLOUSER
// function generateCoupon(firstName, lastName) {
//   let code = "ABC123";
//   return "Hello " + firstName + " " + lastName;
// }

// // console.log(code) //error
// const clouser = generateCoupon("John", "Lord");
// console.log(clouser);

// function createCoupon() {
//   let code = "ABC123"; // variabilă privată
//   return function () {
//     return code;
//   };
// }

// let getCouponCode = createCoupon();
// console.log(getCouponCode()); // ABC123

// Handbook: functions and scope in practice

/* function calculatePrice(price, vatPercent) {
  return price + price * (vatPercent / 100);
}
console.log(calculatePrice(100, 20)); // 120

// Calculul prețului final cu reducere și TVA
function calculateFinalPrice(price, discountPercent, vatPercent) {
  let discountedPrice = price * (1 - discountPercent / 100);
  return discountedPrice + discountedPrice * (vatPercent / 100);
}

console.log(calculateFinalPrice(100, 10, 20)); // 108

function checkout() {
  let productPrice = 100;
  function calculateVat() {
    let vatPercent = 20;
    return productPrice + productPrice * (vatPercent / 100);
  }
  console.log("Price with TVA:", calculateVat());
}

checkout(); */
// console.log(calculateVat()); // eroare – funcția nu este disponibilă în afara checkout()

// (function () {
//   let productPrice = 100;
//   let vatPercent = 20;
//   console.log(
//     "Preț cu TVA (IIFE):",
//     productPrice + productPrice * (vatPercent / 100),
//   );
// })();

// let prices = [100, 200, 300];
// let discounted = prices.map((price) => price * 0.9);
// console.log(discounted); // [90, 180, 270]

// let finalPrices = prices.map((price) => {
//   let vat = price * 0.2; // 20% TVA
//   let discounted = (price + vat) * 0.9; // 10% reducere
//   return discounted;
// });
// console.log(finalPrices); // [108, 216, 324]

// function createPriceCalculator(basePrice) {
//   let price = basePrice; // variabilă privată

//   return function (vatPercent) {
//     return price + price * (vatPercent / 100);
//   };
// }

// let calculatePrice = createPriceCalculator(100);

// console.log(calculatePrice(20)); // 120
// console.log(calculatePrice(10)); // 110
