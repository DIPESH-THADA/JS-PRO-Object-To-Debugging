//how to declare function

//how to declare variable in js

// cele doua funtii sunt echivalente

// var x = 0.1;
// var y = 0.3;
// var z = x + y;
// console.log(z);

// let a = (b = 3);
// console.log(b);
// console.log(a);

// function plus() {
//   let counter = 0;
//   function plus() {
//     counter += 1;
//   }
//   plus();
//   return counter;
// }

// console.log("first", plus());
// // console.log("first", plus());
// // console.log("first", plus());

// function add() {
//   let counter = 0;
//   return function () {
//     counter += 1;
//     return counter;
//   };
// }

// let myAdd2 = add();
// console.log(myAdd2());

// var b = 10;
// function outer() {
//   var b2 = 20;
//   function inner() {
//     b2++;
//     console.log("a 2 lea b", b2);
//     var b = 3;
//     console.log(b);
//   }
//   inner();
// }
// outer();

// let x = 0.1;
// let y = 0.14;
// let z = x + y;
// console.log(z);

// let x1 = 0.1;
// let y1 = 0.14;
// let z1 = x1 + y1;
// console.log(Number(z1.toFixed(2)));

let a = 10;
let b = a;

a = 25;
console.log(a, b);

let myObj = {
  name: "dipesh",
  age: 29,
};

let myObject2 = myObj;
myObj.name = "menuka";
myObject2.age = 21;
console.log(myObj, myObject2);

function MasinaNau(name, color, speed) {
  this.name = name;
  this.color = color;
  this.spped = speed;
  this.addProduct = function () {
    console.log(`product is ${this.name} ${this.color} ${this.speed}`);
  };
  this.purchase = function () {
    if (this.stoc > 0) {
      console.log(`product ${this.name} added to the cart`);
    }
  };
}
let car = new MasinaNau("audi", "black", 300);
console.log(car);

class Product {
  constructor(name, price, stock, dateExpire) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.dateExpire = dateExpire;
  }
  deschisCartea() {
    console.log("you have create page 15");
  }
  randonIntFormat(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

export { Product };

console.log(Product);
