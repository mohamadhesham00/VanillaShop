// import { showLoading, hideLoading } from "./main.js";
import { isAuthenticated } from "./cookies.js";
import { init } from "./main.js";
window.onload = async () => {
  if (!isAuthenticated()) {
    window.location.href = "Home.html";
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

  // Function to render the cart items
  const renderCart = () => {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
    } else {
      emptyCartMessage.style.display = "none";
      cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <img src="${item.thumbnail}" alt="${
          item.title
        }" class="cart-item-image rounded-3" />
          <div class="cart-item-details">
            <h5 class="item-title">${item.title}</h5>
            <p class="body-text">${item.description}</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="quantity-control ms-auto me-3">
            <button class="decrease-quantity-btn" data-id="${
              item.id
            }">-</button>
            <input type="number" class="form-control" value="${
              item.quantity
            }" min="1" readonly />
            <button class="increase-quantity-btn" data-id="${
              item.id
            }">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
    }

    updateCartSummary();
    // hideLoading();
  };

  // Event listener for quantity changes and item removal
  cartItemsContainer.addEventListener("click", (event) => {
    const cart = getCart();
    const target = event.target;

    if (target.classList.contains("increase-quantity-btn")) {
      const id = target.dataset.id;
      const item = cart.find((i) => i.id == id);
      if (item) {
        item.quantity++;
        saveCart(cart);
        renderCart();
      }
    } else if (target.classList.contains("decrease-quantity-btn")) {
      const id = target.dataset.id;
      const item = cart.find((i) => i.id == id);
      if (item && item.quantity > 1) {
        item.quantity--;
        saveCart(cart);
        renderCart();
      }
    } else if (target.classList.contains("remove-btn")) {
      const id = target.dataset.id;
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
}
export { getCart, saveCart, addItemToCart };
