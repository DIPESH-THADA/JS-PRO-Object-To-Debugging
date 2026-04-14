"use strict";

// =================================================================
//  login.js
//  The plain function approach has been replaced by classes.
// =================================================================

class Authenticator {
  authenticate(email, password) {
    throw new Error("Method 'authenticate()' must be implemented by subclass.");
  }
}
//-----------------------------------------------------------------
class LocalAuthenticator extends Authenticator {
  constructor() {
    super();
    this.validUsers = {
      "admin@example.com": "admin123",
      "user@example.com": "user123",
    };
  }

  authenticate(email, password) {
    return this.validUsers[email] === password;
  }
}

class FormValidator {
  // Email must contain @ and a period (.)
  validateEmail(email) {
    return email.includes("@") && email.includes(".");
  }

  // Password must be at least 8 characters,
  // contain at least one uppercase letter (A-Z),
  // and contain at least one digit (0-9)
  validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  }

  // Returns an object: { valid: bool, message: string }
  validate(email, password) {
    if (email.trim() === "" || password.trim() === "") {
      return { valid: false, message: "Please enter both email and password." };
    }
    if (!this.validateEmail(email)) {
      return {
        valid: false,
        message: "Invalid email address. Must contain '@' and '.'.",
      };
    }
    if (!this.validatePassword(password)) {
      return {
        valid: false,
        message:
          "Password must be at least 8 characters, contain at least one uppercase letter (A-Z) and at least one digit (0-9).",
      };
    }
    return { valid: true, message: "" };
  }
}

// -----------------------------------------------------------------
//  login(event, authenticator, validator)
// -----------------------------------------------------------------
function login(event, authenticator, validator) {
  event.preventDefault();

  const emailField = document.getElementById("username");
  const passwordField = document.getElementById("password");

  if (!emailField || !passwordField) {
    alert("Form fields not found.");
    return false;
  }

  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  const validation = validator.validate(email, password);
  if (!validation.valid) {
    alert(validation.message);
    return false;
  }

  if (authenticator.authenticate(email, password)) {
    alert("Login successful! Welcome back, " + email + ".");
    return true;
  } else {
    alert("Invalid username or password. Please try again.");
    return false;
  }
}

const myAuthenticator = new LocalAuthenticator();
const myValidator = new FormValidator();

const loginForm = document.querySelector(".login-section form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    login(event, myAuthenticator, myValidator);
  });
}

// -----------------------------------------------------------------
//  Admin password check
// -----------------------------------------------------------------
const adminCheckBtn = document.getElementById("admin-check-btn");
if (adminCheckBtn) {
  adminCheckBtn.addEventListener("click", function () {
    checkPassword();
  });
}

function checkPassword() {
  const MAX_ATTEMPTS = 3;
  const CORRECT_PASSWORD = "admin12345";
  const USER_NAME = "admin";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const userInput = prompt("Enter admin password:");

    if (userInput === CORRECT_PASSWORD && USER_NAME === "admin") {
      alert("Welcome back, admin!");
      break;
    } else {
      if (attempt === MAX_ATTEMPTS) {
        alert("Account temporarily locked after 3 failed attempts.");
      } else {
        alert(
          "Incorrect password. You have " +
            (MAX_ATTEMPTS - attempt) +
            " attempt(s) left.",
        );
      }
    }
  }
}

// -----------------------------------------------------------------
//  Console tests
// -----------------------------------------------------------------
console.log("=== LOGIN TESTS ===");

// Test LocalAuthenticator directly
const testAuth = new LocalAuthenticator();
console.log(
  "NORMAL – valid credentials:",
  testAuth.authenticate("admin@example.com", "admin123"),
);
console.log(
  "NORMAL – valid credentials:",
  testAuth.authenticate("user@example.com", "user123"),
);
console.log(
  "  – wrong password:",
  testAuth.authenticate("admin@example.com", "wrongpass"),
);
console.log(
  "  – unknown email:",
  testAuth.authenticate("unknown@example.com", "admin123"),
);

// Test FormValidator directly
const testValidator = new FormValidator();
// FormValidator tests
console.log("\n=== FormValidator TESTS ===");

// NORMAL – valid email and strong password
console.log(
  "NORMAL – valid email + strong password:",
  testValidator.validate("test@example.com", "Mypass1").valid,
); // true

// BAD – email missing @
console.log(
  "BAD – email missing @:",
  testValidator.validate("testexample.com", "Mypass1").message,
); // error msg

// BAD – email missing period
console.log(
  "BAD – email missing period:",
  testValidator.validate("test@examplecom", "Mypass1").message,
); // error msg

// BAD – password too short (less than 8 chars)
console.log(
  "BAD – password too short:",
  testValidator.validate("test@example.com", "My1").message,
); // error msg

// BAD – password no uppercase letter
console.log(
  "BAD – password no uppercase:",
  testValidator.validate("test@example.com", "mypass1").message,
); // error msg

// BAD – password no digit
console.log(
  "BAD – password no digit:",
  testValidator.validate("test@example.com", "Mypassword").message,
); // error msg

// BAD – empty email
console.log(
  "BAD – empty email:",
  testValidator.validate("", "Mypass1").message,
); // error msg

// BAD – empty password
console.log(
  "BAD – empty password:",
  testValidator.validate("test@example.com", "").message,
); // error msg

// Polymorphism demo – base class throws, subclass works
const baseAuth = new Authenticator();
try {
  baseAuth.authenticate("x", "y");
} catch (e) {
  console.log(e.message);
}
