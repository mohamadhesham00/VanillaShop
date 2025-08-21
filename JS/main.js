import { isAuthenticated, removeCookie } from "./cookies.js";
const toggleBtn = document.getElementById("profileDropdown");
const menu = document.getElementById("dropdownMenu");
let viewProfileBtn = document.getElementsByClassName("view-profile-btn")[0];
const products = await loadProducts();

// Toggle dropdown on click
toggleBtn.addEventListener("click", function (e) {
  e.preventDefault();
  menu.classList.toggle("show");
});

// Close when clicking outside
document.addEventListener("click", function (e) {
  if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove("show");
  }
});

window.onload = async () => {
  // For controlling what to show and what to hide in navbar based on authenticated & guest modes
  if (isAuthenticated()) {
    let authenticated = document.getElementsByClassName("authenticated");
    [...authenticated].forEach((element) => element.classList.remove("d-none"));

    let guest = document.getElementsByClassName("guest");
    [...guest].forEach((element) => element.classList.add("d-none"));
    // Add events on logout
    let logoutBtn = document.getElementsByClassName("logout-btn")[0];
    logoutBtn.addEventListener("click", () => {
      removeCookie("email");
      removeCookie("password");
      location.reload();
    });
  } else {
    // Attach events on login
    let loginBtn = document.getElementsByClassName("login-btn")[0];

    loginBtn.addEventListener("click", () =>
      window.location.assign("auth.html")
    );
  }
};

async function loadProducts() {
  const response = await fetch("../products.json");
  const products = await response.json();
  return products;
}
