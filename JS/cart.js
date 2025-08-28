// import { showLoading, hideLoading } from "./main.js";
import { isAuthenticated } from "./cookies.js";
import { init } from "./main.js";
window.onload = async () => {
  if (!isAuthenticated()) {
    window.location.href = "../index.html";
    return;
  }
  await init();
  const cartItemsContainer = document.getElementById("cart-items-container");
  const subtotalElement = document.getElementById("subtotal-price");
  const shippingElement = document.getElementById("shipping-price");
  const taxElement = document.getElementById("tax-price");
  const totalElement = document.getElementById("total-price");
  const emptyCartMessage = document.getElementById("empty-cart-message");

  // Function to update the cart summary
  const updateCartSummary = () => {
    const cart = getCart();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 10.0 : 0.0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  };
  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/pages/checkout.html";
  });
  // Function to render the cart items
  const renderCart = () => {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      cartItemsContainer.append(emptyCartMessage);
    } else {
      emptyCartMessage.style.display = "none";
      cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item mb-3";
        cartItem.innerHTML = `
          <div class="row">
          <div class="text-center col-12 col-lg-2">
          <img src="${item.thumbnail}" alt="${
          item.title
        }" class="cart-item-image rounded-3" />
          </div>
          <div class="col-12 col-lg-5 cart-item-details">
            <h5 class="item-title">${item.title}</h5>
            <p class="body-text">${item.description}</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="d-flex justify-content-center align-items-center col-12 col-lg-3 quantity-control ms-auto me-3">
            <button class="decrease-quantity-btn" data-id="${
              item.id
            }">-</button>
            <input type="number" class="form-control" value="${
              item.quantity
            }" min="1" readonly />
            <button class="increase-quantity-btn" data-id="${
              item.id
            }">+</button>
            <button class="bg-transparent text-danger remove-btn" data-id="${
              item.id
            }">
              <i class="bi bi-trash"></i>
            </button>
            </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
    }
    updateCartSummary();
  };

  // Event listener for quantity changes and item removal
  // Event listener for quantity changes and item removal
  cartItemsContainer.addEventListener("click", (event) => {
    const cart = getCart();
    const target = event.target;

    // Use .closest() to find the parent button for all click targets
    const removeButton = target.closest(".remove-btn");
    const increaseButton = target.closest(".increase-quantity-btn");
    const decreaseButton = target.closest(".decrease-quantity-btn");

    if (increaseButton) {
      const id = Number(increaseButton.dataset.id);
      const item = cart.find((i) => i.id == id);
      if (item) {
        item.quantity++;
        saveCart(cart);
        renderCart();
      }
    } else if (decreaseButton) {
      const id = Number(decreaseButton.dataset.id);
      const item = cart.find((i) => i.id == id);
      if (item && item.quantity > 1) {
        item.quantity--;
        saveCart(cart);
        renderCart();
      }
    } else if (removeButton) {
      const id = Number(removeButton.dataset.id);
      const newCart = cart.filter((item) => item.id != id);
      saveCart(newCart);
      renderCart();
    }
  });
  // Initial render of the cart
  renderCart();
};
// Function to get the current cart from local storage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Function to save the cart to local storage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to add or update an item in the cart
function addItemToCart(item, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find((i) => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...item, quantity: quantity });
  }
  saveCart(cart);
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: item.title + " added to cart",
    showConfirmButton: false,
    timer: 2000,
  });
}
export { getCart, saveCart, addItemToCart };
