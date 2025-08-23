import { isAuthenticated, removeCookie } from "./cookies.js";
const toggleBtn = document.getElementById("profileDropdown");
const menu = document.getElementById("dropdownMenu");
const viewProfileBtn = document.getElementsByClassName("view-profile-btn")[0];
const products = await loadProducts();
const loading = document.getElementById("page-loading");

async function init() {
  try {
    // Show/hide navbar based on authentication
    toggleNavBar();

    // Toggle profile dropdown
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("show");
      }
    });
  } finally {
    // Hide spinner after everything is loaded
    loading.style.display = "none";
  }
}

function toggleNavBar() {
  if (isAuthenticated()) {
    const authenticated = document.getElementsByClassName("authenticated");
    [...authenticated].forEach((el) => el.classList.remove("d-none"));

    const guest = document.getElementsByClassName("guest");
    [...guest].forEach((el) => el.classList.add("d-none"));

    const logoutBtn = document.getElementsByClassName("logout-btn")[0];
    logoutBtn.addEventListener("click", () => {
      removeCookie("email");
      removeCookie("password");
      location.reload();
    });
  } else {
    let loginBtn = document.getElementsByClassName("login-btn")[0];
    loginBtn.addEventListener("click", () =>
      window.location.assign("auth.html")
    );
  }
}

async function loadProducts() {
  const response = await fetch("../products.json");
  const products = await response.json();
  return products;
}

export { init, products };
