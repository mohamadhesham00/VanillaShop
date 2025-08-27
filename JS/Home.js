import { attachEventOnProductCard, init, products } from "./main.js";
const stats = document.getElementsByClassName("stats");
const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");

window.onload = async () => {
  try {
    await init();
    await handleCarousel();
  } finally {
    // Animate numbers and other page initialization
    animateNumbers();
  }
};

function animateNumbers() {
  document.getElementsByClassName("stats-div")[0].classList.remove("d-none");
  [...stats].forEach((element) => {
    const value = parseInt(element.innerHTML);
    const duration = 2000;
    const stepTime = 20;
    let current = 0;
    const increment = Math.ceil(value / (duration / stepTime));

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        element.innerHTML = value + "+";
        clearInterval(interval);
      } else {
        element.innerHTML = current + "+";
      }
    }, stepTime);
  });
}

function initializeCarousel() {}

async function loadNewArrivals() {
  carousel.innerHTML = ""; // Clear placeholder

  products.forEach((product) => {
    const card = `
      <div class="card product-div">
        <div class="img">
          <img src="${product.images[0]}" class="card-img-top product-img" alt="${product.title}" data-id="${product.id}" />
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">$${product.price}</p>
          <a href="#" class="btn btn-primary bg-black rounded-pill view-details" data-id="${product.id}">See Details</a>
        </div>
      </div>
    `;
    carousel.innerHTML += card;
  });
  // Attach event listeners to new cards
  attachEventOnProductCard();

  // Initialize autoplay after cards are loaded
  initializeCarousel();
}
async function handleCarousel() {
  // Start loading products and initialize carousel
  await loadNewArrivals();
  const firstCard = carousel.querySelector(".card");
  let firstCardWidth = firstCard.offsetWidth;
  let interval;
  let isScrollingForward = true;

  const autoPlay = () => {
    // Stop if window is smaller than 800px or no cards
    if (window.innerWidth < 800 || !firstCardWidth) {
      clearInterval(interval);
      return;
    }

    // Calculate total and max scroll
    const totalCardWidth = carousel.scrollWidth;
    const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

    // Clear existing interval
    if (interval) clearInterval(interval);

    // Scroll every 500ms
    interval = setInterval(() => {
      if (isScrollingForward) {
        // Scroll forward
        if (carousel.scrollLeft >= maxScrollLeft - 1) {
          isScrollingForward = false;
        } else {
          carousel.scrollLeft += firstCardWidth;
        }
      } else {
        // Scroll backward
        if (carousel.scrollLeft <= 1) {
          isScrollingForward = true;
        } else {
          carousel.scrollLeft -= firstCardWidth;
        }
      }
    }, 1500);
  };

  // Add pause on hover
  if (wrapper) {
    wrapper.addEventListener("mouseenter", () => clearInterval(interval));
    wrapper.addEventListener("mouseleave", autoPlay);
  }

  // Re-run autoplay on window resize
  window.addEventListener("resize", () => {
    clearInterval(interval);
    const firstCard = carousel.querySelector(".card");
    if (firstCard) {
      firstCardWidth = firstCard.offsetWidth; // Recalculate on resize
    }
    autoPlay();
  });
}
