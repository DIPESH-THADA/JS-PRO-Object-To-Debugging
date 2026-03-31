"use strict";
// =============== 5. LOGIN FUNCTION (login.html) =================

function login(event) {
  event.preventDefault(); // Prevent the default form submission

  let emailField = document.getElementById("username");
  let passwordField = document.getElementById("password");
  let validUsers = {
    "admin@example.com": "admin123",
    "user@example.com": "user123",
  };

  if (!emailField || !passwordField) {
    alert("Form fields not found.");
    return false;
  }

  // Remove leading and trailing spaces from both entries using trim()
  let email = emailField.value.trim();
  let password = passwordField.value.trim();

  // Check if fields are empty
  if (email === "" || password === "") {
    alert("Please enter both email and password.");
    return false;
  }

  // Case-sensitive comparison against the predefined set of key-value elements
  if (validUsers[email] !== undefined && validUsers[email] === password) {
    alert("Login successful! Welcome back, " + email + ".");
    return true;
  } else {
    alert("Invalid username or password. Please try again.");
    return false;
  }
}

// Connect Admin Check Button
let adminCheckBtn = document.getElementById("admin-check-btn");
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

    if (userInput === CORRECT_PASSWORD || userInput === USER_NAME) {
      alert("✅ Welcome back, admin!");
      break; // stop after success
    } else {
      if (attempt === MAX_ATTEMPTS) {
        alert("🚫 Account temporarily locked after 3 failed attempts.");
      } else {
        alert(
          `❌ Incorrect password. You have ${MAX_ATTEMPTS - attempt} attempt(s) left.`,
        );
      }
    }
  }
}

// Connect login form
let loginForm = document.querySelector(".login-section form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    login(event);
  });
}

// ── 3. USER OBJECT ────────────────────────────
const user = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  address: "123 Main Street",
  zip: "300001",
};

// --- user object ---
console.log("\n=== USER ===");
console.log(user);
