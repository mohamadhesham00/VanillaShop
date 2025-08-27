import {
  init,
  products,
  getQueryParam,
  searchForm,
  searchInput,
  attachEventOnProductCard,
} from "./main.js";
let productContainer = document.getElementsByClassName("product-container")[0];
let categoriesFilterList = document.getElementsByClassName(
  "category-filter-list"
)[0];
let priceRange = document.getElementsByClassName("price-range")[0];
let startPriceSpan = document.getElementsByClassName("start-price")[0];
let endPriceSpan = document.getElementsByClassName("end-price")[0];
let filterBtn = document.getElementsByClassName("filter-btn")[0];
let clearBtn = document.getElementsByClassName("clear-btn")[0];
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.getElementById("filterToggleBtn");

window.onload = async () => {
  try {
    await init();
    searchForm.onsubmit = (e) => {
      e.preventDefault();
      applyFiltering();
    };
    searchInput.oninput = (e) => {
      applyFiltering();
    };

    const searchTerm = getQueryParam("name");

    if (searchTerm) {
      let filtered = filterByName(searchTerm);
      loadProducts(filtered);
    } else {
      loadProducts();
    }

    let categories = loadProductCategories();
    categories.forEach((category) => {
      let box = `<label class="filter-option d-block"
      ><input type="checkbox" name="category" value = "${category}" /> ${category}</label
      >`;
      categoriesFilterList.innerHTML += box;
    });
    let minPrice = getMinPrice();
    let maxPrice = getMaxPrice();
    priceRange.setAttribute("min", minPrice);
    priceRange.setAttribute("max", maxPrice);
    priceRange.setAttribute("value", maxPrice);
    startPriceSpan.innerHTML = "$" + minPrice;
    endPriceSpan.innerHTML = "$" + maxPrice;
  } finally {
  }
};

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("show") &&
    !sidebar.contains(e.target) &&
    e.target !== toggleBtn
  ) {
    sidebar.classList.remove("show");
  }
});
priceRange.addEventListener("change", function () {
  endPriceSpan.innerHTML = priceRange.value;
});

filterBtn.addEventListener("click", () => {
  applyFiltering();
});
clearBtn.addEventListener("click", () => {
  clearAllFilters();
});

function loadProducts(filtered = products) {
  productContainer.innerHTML = "";
  filtered.forEach((product) => {
    const card = `
  <div class="col-6 col-md-4 col-lg-3">
    <div class="card h-100 shadow-sm border-0">
      <img src="${product.thumbnail}" class="card-img-top img-fluid product-img" alt="${product.title}"  />
      <div class="card-body d-flex flex-column">
        <h6 class="card-title">${product.title}</h6>
        <p class="card-text mb-2 fw-bold">$${product.price}</p>
        <div class="mt-auto">
          <a href="#" class="btn btn-dark rounded-pill w-100 view-details" data-id="${product.id}">See Details</a>
        </div>
      </div>
    </div>
  </div>
`;
    productContainer.innerHTML += card;
  });
  // Attach event listeners to new cards
  attachEventOnProductCard();
}

function loadProductCategories() {
  return [...new Set(products.map((product) => product.category))];
}
function getMinPrice() {
  let prices = products.map((product) => Number(product.price));
  return Math.min(...prices);
}
function getMaxPrice() {
  let prices = products.map((product) => Number(product.price));
  return Math.max(...prices);
}
function filterByCategory(categories, filtered = products) {
  return filtered.filter((product) => categories.includes(product.category));
}
function filterByPrice(maxPrice, filtered = products) {
  return filtered.filter((product) => product.price <= maxPrice);
}
function filterByName(name, filtered = products) {
  return filtered.filter((product) => product.title.includes(name));
}
function applyFiltering() {
  let filtered = products;
  let query = searchInput.value.trim();
  filtered = filterByName(query, filtered);
  const checkedBoxes = document.querySelectorAll(
    'input[name="category"]:checked'
  );
  if (checkedBoxes.length)
    filtered = filterByCategory(
      [...checkedBoxes].map((box) => box.value),
      filtered
    );
  filtered = filterByPrice(priceRange.value, filtered);
  loadProducts(filtered);
}
function clearAllFilters() {
  searchInput.value = "";
  const checkedBoxes = document.querySelectorAll(
    'input[name="category"]:checked'
  );
  if (checkedBoxes.length)
    [...checkedBoxes].forEach((box) => (box.checked = false));
  priceRange.value = getMaxPrice();
  endPriceSpan.innerHTML = "$" + getMaxPrice();
  if (document.querySelectorAll(".card").length != products.length)
    loadProducts();
}
