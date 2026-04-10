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
  validate(email, password) {
    return email.trim() !== "" && password.trim() !== "";
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

  if (!validator.validate(email, password)) {
    alert("Please enter both email and password.");
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
console.log(
  "NORMAL – both fields filled:",
  testValidator.validate("test@example.com", "mypass"),
);
console.log("  – empty email:", testValidator.validate("", "mypass"));
console.log(
  "  – empty password:",
  testValidator.validate("test@example.com", ""),
);
console.log("  – both empty:", testValidator.validate("", ""));

// Polymorphism demo – base class throws, subclass works
const baseAuth = new Authenticator();
try {
  baseAuth.authenticate("x", "y");
} catch (e) {
  console.log(e.message);
}
