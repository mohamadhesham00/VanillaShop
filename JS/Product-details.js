import { addItemToCart } from "./cart.js";
import { isAuthenticated } from "./cookies.js";
import { init, products } from "./main.js";
const productInfo = document.getElementsByClassName("product-info")[0];
const reviewsSection = document.getElementsByClassName("reviews-section")[0];
const productImages = document.getElementsByClassName("product-images")[0];
const reviewsContainer = document.getElementById("reviews-container");

window.onload = async () => {
  await init();
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));

  // 2. Find product
  const product = products.find((p) => p.id === productId);
  if (product) {
    let productAvgRating = Math.round(
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
    );
    let info = `
            <h2 class="product-title">${product.title}</h2>
            <p class="product-category text-muted">${product.category}</p>
            <div class="product-rating mb-3">
                ${`<i class="bi bi-star-fill text-warning"></i> `.repeat(
                  productAvgRating
                )}
                ${`<i class="bi bi-star text-warning"></i> `.repeat(
                  5 - productAvgRating
                )}
                <span class="ms-2">(${product.reviews.length} Reviews)</span>
            </div>
            <h3 class="product-price mb-3">$${product.price}</h3>
            <p class="product-description mb-4">${product.description}</p>
        
            <!-- Quantity & Add to Cart -->
            <div class="d-flex align-items-center mb-3 gap-3">
                <label for="quantity" class="form-label mb-0">Quantity:</label>
                <div class="input-group w-auto">
                <button class="btn btn-outline-secondary" id="decreaseQty">
                    -
                </button>
                <input
                    type="number"
                    class="form-control text-center quantity-input"
                    id="quantity"
                    value="1"
                    min="1"
                />
                <button class="btn btn-outline-secondary" id="increaseQty">
                    +
                </button>
                </div>
            </div>
        
            <button class="btn btn-dark w-100 mb-3" id="addToCartBtn" data-id="${
              product.id
            }">
                Add to Cart
            </button>
        
            <!-- Additional Info -->
            <div class="mt-4">
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Availability:</strong> ${
                  product.availabilityStatus
                }</p>
                <p><strong>SKU:</strong> ${product.sku}</p>
            </div>`;
    productInfo.innerHTML = info;
    productImages.innerHTML = "";
    let productThumbs = document.createElement("div");
    productThumbs.classList.add("product-thumbs", "d-flex", "gap-2");
    product.images.forEach((imgSrc, index) => {
      if (index == 0) {
        var mainImgDiv = `<div class="product-main-img mb-3">
                <img
                  id="mainProductImg"
                  src="${imgSrc}"
                  alt="${product.title}"
                  class="img-fluid rounded"
                />
              </div>`;
        productImages.innerHTML += mainImgDiv;
      }
      let thumb = `<img
            src="${imgSrc}"
            class="img-thumbnail thumb-img"
            alt="${product.title} Thumbnail"
          />`;
      productThumbs.innerHTML += thumb;
    });
    productImages.appendChild(productThumbs);
    const thumbnails = document.querySelectorAll(".thumb-img");
    const mainImg = document.getElementById("mainProductImg");
    // Image thumbnail click
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.src;
      });
    });
    const increaseBtn = document.getElementById("increaseQty");
    const decreaseBtn = document.getElementById("decreaseQty");
    const quantityInput = document.getElementById("quantity");
    const addToCartBtn = document.getElementById("addToCartBtn");

    if (!isAuthenticated()) {
      console.log("User not authenticated");
      addToCartBtn.disabled = true;
      addToCartBtn.innerText = "Login to Add to Cart";
    }
    // Quantity buttons
    increaseBtn.addEventListener("click", () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    decreaseBtn.addEventListener("click", () => {
      quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1);
    });
    // Add to Cart
    addToCartBtn.addEventListener("click", (e) => {
      // Only authenticated users can add to cart
      if (!isAuthenticated) {
        return;
      }
      let productId = Number(e.target.dataset.id);
      let product = products.find((product) => product.id === productId);
      let quantity = parseInt(
        document.getElementsByClassName("quantity-input")[0].value
      );
      addItemToCart(product, quantity);
    });
    product.reviews.forEach((r) => {
      const reviewDiv = document.createElement("div");
      reviewDiv.className = "mb-3 p-3 border rounded shadow-sm review-card";

      reviewDiv.innerHTML = `
              <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>${r.reviewerName}</strong>
                <div>
                  <span class="text-warning">${getStars(r.rating)}</span>
                  <small class="text-muted ms-2">(${new Date(
                    r.date
                  ).toLocaleDateString()})</small>
                </div>
              </div>
              <p class="mb-0">${r.comment}</p>
            `;

      reviewsContainer.appendChild(reviewDiv);
    });
  } else {
    reviewsSection.style.display = "none";
    productInfo.innerHTML = "<p>Product not found!</p>";
  }
};

// Helper function to convert rating number to stars
function getStars(rating) {
  return "★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating);
}
