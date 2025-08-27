import { isAuthenticated, removeCookie } from "./cookies.js";
const navToggleBtn = document.getElementsByClassName("navbar-toggler")[0];
const navMenu = document.getElementById("navbarNav");
const profileToggleBtn = document.getElementById("profileDropdown");
const menu = document.getElementById("dropdownMenu");
const viewProfileBtn = document.getElementsByClassName("view-profile-btn")[0];
const products = await loadProducts();
const loading = document.getElementById("page-loading");
const searchForm = document.getElementsByClassName("search-form")[0];
const searchInput = document.getElementsByClassName("search-input")[0];
const scrollTopBtn = document.getElementById("scrollTopBtn");

async function init() {
  try {
    // Show/hide navbar based on authentication
    toggleNavBar();

    // Toggle menu dropdown
    navToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navMenu.classList.toggle("show");
    });

    // Close menu if clicked outside
    document.addEventListener("click", (e) => {
      if (!navToggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("show");
      }
    });
    // Toggle profile dropdown
    profileToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("show");
    });
    // Close menu if clicked outside
    document.addEventListener("click", (e) => {
      if (!profileToggleBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("show");
      }
    });

    searchForm.onsubmit = (e) => {
      e.preventDefault();

      let query = searchInput.value.trim();
      if (query) {
        window.location.assign(`products.html?name=${query}`);
      }
    };
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
      localStorage.clear();
      location.reload();
    });
  } else {
    let loginBtn = document.getElementsByClassName("login-btn")[0];
    loginBtn.addEventListener("click", () =>
      window.location.assign("auth.html")
    );
  }
}
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    // Show the button
    scrollTopBtn.style.display = "block";
    scrollTopBtn.style.opacity = "1";
  } else {
    // Hide the button
    scrollTopBtn.style.opacity = "0";
    setTimeout(() => {
      scrollTopBtn.style.display = "none";
    }, 500); // Wait for the fade-out transition to complete
  }
}

// When the user clicks on the button, scroll to the top of the document
scrollTopBtn.addEventListener("click", () => {
  // For a smooth scroll effect
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

async function loadProducts() {
  const response = await fetch("../products.json");
  const products = await response.json();
  return products;
}
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}
function attachEventOnProductCard() {
  const images = document.querySelectorAll(".product-img");
  images.forEach((img) => {
    let interval;
    let product = products.find((product) => product.id == img.dataset.id);
    img.addEventListener("mouseover", () => {
      let i = 0;
      interval = setInterval(() => {
        img.src = product.images[i++];
        i = i % product.images.length;
      }, 850);
    });

    img.addEventListener("mouseout", () => {
      clearInterval(interval);
      img.src = product.thumbnail;
    });
  });

  const viewDetailsBtns = document.querySelectorAll(".view-details");
  viewDetailsBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = e.target.dataset.id;
      window.location.href = `product-details.html?id=${productId}`;
    });
  });
}

export {
  init,
  products,
  getQueryParam,
  searchForm,
  searchInput,
  attachEventOnProductCard,
};
