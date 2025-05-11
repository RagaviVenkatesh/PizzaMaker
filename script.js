document.addEventListener("DOMContentLoaded", function () {
  // Pizza state
  const pizzaState = {
    crust: null,
    sauce: null,
    toppings: [],
  };

  // DOM elements
  const crustOptions = document.querySelectorAll("[data-crust]");
  const sauceOptions = document.querySelectorAll("[data-sauce]");
  const toppingOptions = document.querySelectorAll(".topping-option");
  const pizzaCrust = document.querySelector(".pizza-crust");
  const pizzaSauce = document.querySelector(".pizza-sauce");
  const pizzaDisplay = document.querySelector(".pizza-display");
  const crustSummary = document.getElementById("crust-summary");
  const sauceSummary = document.getElementById("sauce-summary");
  const toppingsSummary = document.getElementById("toppings-summary");

  // Topping images mapping
  const toppingImages = {
    pepperoni: "images/pepperoni.png",
    mushroom: "images/mushroom.png",
    olive: "images/olive.png",
    onion: "images/onion.png",
    pepper: "images/pepper.png",
    sausage: "images/sausage.png",
    bacon: "images/bacon.png",
    pineapple: "images/pineapple.png",
    basil: "images/basil.png",
    garlic: "images/garlic.png",
    ham: "images/ham.png",
    chicken: "images/chicken.png",
    spinach: "images/spinach.png",
    jalapeno: "images/jalapeno.png",
  };

  // Price configuration
  const prices = {
    crust: {
      regular: 2.0,
      thin: 1.5,
      thick: 2.5,
      cheese: 3.0,
    },
    sauce: {
      tomato: 1.0,
      pesto: 1.5,
      white: 1.25,
      none: 0,
    },
    toppings: {
      pepperoni: 0.75,
      mushroom: 0.5,
      olive: 0.5,
      onion: 0.5,
      pepper: 0.6,
      sausage: 0.8,
      bacon: 0.9,
      pineapple: 0.65,
      basil: 0.4,
      garlic: 0.4,
      ham: 0.7,
      chicken: 0.85,
      spinach: 0.55,
      jalapeno: 0.6,
    },
  };

  // Crust selection
  crustOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      crustOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Update pizza state
      pizzaState.crust = this.dataset.crust;

      // Update crust display
      pizzaCrust.className = "pizza-crust";
      pizzaCrust.classList.add(`${pizzaState.crust}-crust`);

      // Update summary
      crustSummary.textContent = this.querySelector("span").textContent;

      // Update price
      updatePrice();
    });
  });

  // Sauce selection
  sauceOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      sauceOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Update pizza state
      pizzaState.sauce = this.dataset.sauce;

      // Update sauce display
      pizzaSauce.className = "pizza-sauce";
      if (pizzaState.sauce !== "none") {
        pizzaSauce.classList.add(`${pizzaState.sauce}-sauce`);
      }

      // Update summary
      sauceSummary.textContent = this.querySelector("span").textContent;

      // Update price
      updatePrice();
    });
  });

  // Toppings selection
  toppingOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const topping = this.dataset.topping;

      // Toggle selected class
      this.classList.toggle("selected");

      // Check if topping is already added
      const toppingIndex = pizzaState.toppings.indexOf(topping);

      if (toppingIndex === -1) {
        // Add topping
        pizzaState.toppings.push(topping);
        addToppingToPizza(topping);
      } else {
        // Remove topping
        pizzaState.toppings.splice(toppingIndex, 1);
        removeToppingFromPizza(topping);
      }

      // Update summary and price
      updateToppingsSummary();
      updatePrice();
    });
  });

  // Reset functionality
  document.getElementById("reset-btn").addEventListener("click", function () {
    // Reset state
    pizzaState.crust = null;
    pizzaState.sauce = null;
    pizzaState.toppings = [];

    // Reset UI
    crustOptions.forEach((opt) => opt.classList.remove("selected"));
    sauceOptions.forEach((opt) => opt.classList.remove("selected"));
    toppingOptions.forEach((opt) => opt.classList.remove("selected"));

    // Reset pizza display
    pizzaCrust.className = "pizza-crust";
    pizzaSauce.className = "pizza-sauce";
    document.querySelectorAll(".topping").forEach((el) => el.remove());

    // Reset summaries
    crustSummary.textContent = "Not selected";
    sauceSummary.textContent = "Not selected";
    toppingsSummary.textContent = "None";
    updatePrice();
  });

  // Add a topping visually to the pizza
  function addToppingToPizza(topping) {
    const toppingElement = document.createElement("div");
    toppingElement.className = `topping topping-${topping}`;
    toppingElement.dataset.topping = topping;

    // Set random position
    const posX = Math.random() * 60 + 20; // 20-80% of width
    const posY = Math.random() * 60 + 20; // 20-80% of height

    toppingElement.style.left = `${posX}%`;
    toppingElement.style.top = `${posY}%`;

    // Create image element for the topping
    const img = document.createElement("img");
    img.src = toppingImages[topping];
    img.alt = topping;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    toppingElement.appendChild(img);

    // Add click event to remove topping
    toppingElement.addEventListener("click", function (e) {
      e.stopPropagation();
      removeToppingFromPizza(topping);

      // Update the option button state
      const optionBtn = document.querySelector(
        `.topping-option[data-topping="${topping}"]`
      );
      optionBtn.classList.remove("selected");

      // Update pizza state
      const index = pizzaState.toppings.indexOf(topping);
      if (index !== -1) {
        pizzaState.toppings.splice(index, 1);
      }

      // Update summary and price
      updateToppingsSummary();
      updatePrice();
    });

    pizzaDisplay.appendChild(toppingElement);
  }

  // Remove a topping visually from the pizza
  function removeToppingFromPizza(topping) {
    const toppingElements = document.querySelectorAll(`.topping-${topping}`);
    toppingElements.forEach((element) => element.remove());
  }

  // Update the toppings summary text
  function updateToppingsSummary() {
    if (pizzaState.toppings.length === 0) {
      toppingsSummary.textContent = "None";
    } else {
      const toppingsList = pizzaState.toppings
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(", ");
      toppingsSummary.textContent = toppingsList;
    }
  }

  // Price calculation
  function updatePrice() {
    let total = 0;

    if (pizzaState.crust) {
      total += prices.crust[pizzaState.crust];
    }

    if (pizzaState.sauce) {
      total += prices.sauce[pizzaState.sauce];
    }

    pizzaState.toppings.forEach((topping) => {
      total += prices.toppings[topping];
    });

    document.getElementById("price-summary").textContent = total.toFixed(2);
  }
});
