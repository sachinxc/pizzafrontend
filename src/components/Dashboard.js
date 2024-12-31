import React, { useState, useEffect } from "react";
import axios from "axios";
import chickenPizza from "../assets/images/chickenpizza.jpg";
import cheesePizza from "../assets/images/cheesepizza.jpg";
import veggiePizza from "../assets/images/veggiepizza.jpg";
import "./Dashboard.css";

const Dashboard = () => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(30); // Default points, should be updated from user data
  const [favorites, setFavorites] = useState([]);
  const [defaultPizzas, setDefaultPizzas] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [pizzaPrices, setPizzaPrices] = useState({});
  const [orderId, setOrderId] = useState(null); // Order ID state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [user, setUser] = useState(null); // State to hold user data
  const [crusts, setCrusts] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [customPizza, setCustomPizza] = useState({
    name: "",
    crust: "",
    sauce: "",
    cheese: "",
    size: "",
    toppings: [],
    extraCheese: false,
  });

  const userEmail = "sachin@gmail.com"; // Replace with actual logged-in user's email

  useEffect(() => {
    fetchUserData();
    fetchPizzaSizes();
    fetchDefaultPizzas();
    fetchCustomizationOptions(); // Fetch customization options
  }, []);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/users/${userEmail}`
      );
      setUser(response.data); // Set user data in state
      setLoyaltyPoints(response.data.points); // Update loyalty points from user data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const data = new URLSearchParams();
      data.append("identifier", userEmail); // Use the user's email or identifier

      await axios.post("http://localhost:8081/users/logout", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      alert("You have been logged out successfully.");
      // Clear user data or redirect to login page
      setUser(null);
      // Optionally redirect to a login page
      // window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Fetch pizza sizes from backend
  const fetchPizzaSizes = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pizzas/sizes");
      setSizes(response.data);
    } catch (error) {
      console.error("Error fetching pizza sizes:", error);
    }
  };

  // Fetch default pizzas from backend
  const fetchDefaultPizzas = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pizzas/default");
      setDefaultPizzas(response.data);
    } catch (error) {
      console.error("Error fetching default pizzas:", error);
    }
  };

  // Fetch pizza details based on name, size, and extra cheese
  const fetchPizzaByNameAndSize = async (
    pizzaName,
    pizzaSize,
    extraCheeseOption
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/pizzas/default/${pizzaName}/${pizzaSize}?extraCheese=${extraCheeseOption}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pizza details:", error);
    }
  };

  // Handle size change for pizzas
  const handleSizeChange = async (pizzaName, size) => {
    const extraCheeseOption = pizzaPrices[pizzaName]?.extraCheese || false;
    const updatedPizza = await fetchPizzaByNameAndSize(
      pizzaName,
      size,
      extraCheeseOption
    );

    setPizzaPrices((prevPrices) => ({
      ...prevPrices,
      [pizzaName]: {
        price: updatedPizza.price,
        extraCheese: extraCheeseOption,
        size,
      },
    }));
  };

  // Handle extra cheese change for pizzas
  const handleExtraCheeseChange = async (pizzaName, isChecked) => {
    const size = pizzaPrices[pizzaName]?.size || "Small";
    const updatedPizza = await fetchPizzaByNameAndSize(
      pizzaName,
      size,
      isChecked
    );

    setPizzaPrices((prevPrices) => ({
      ...prevPrices,
      [pizzaName]: {
        price: updatedPizza.price,
        size,
        extraCheese: isChecked,
      },
    }));
  };

  // Add pizza to favorites (with API call and returning the full pizza object)
  const addFavorite = async (pizzaName) => {
    const pizzaSize = pizzaPrices[pizzaName]?.size || "Small";
    const extraCheeseOption = pizzaPrices[pizzaName]?.extraCheese || false;

    try {
      // Fetch the full pizza details from the backend
      const response = await axios.get(
        `http://localhost:8081/pizzas/default/${pizzaName}/${pizzaSize}?extraCheese=${extraCheeseOption}`
      );
      const pizza = response.data;

      // Send request to add the pizza to favorites
      await axios.post(
        `http://localhost:8081/users/${userEmail}/favorites`,
        pizza,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local favorites array with the full pizza object
      setFavorites((prevFavorites) => [...prevFavorites, pizza]);
      alert("Pizza added to your favorites! ❤️");
      return pizza; // Return the full pizza object
    } catch (error) {
      console.error("Error adding pizza to favorites:", error);
      setError("Failed to add pizza to favorites.");
      alert("Failed to add pizza to favorites.");
      return null; // Return null in case of failure
    }
  };

  // Fetch customization options (crusts, sauces, toppings, cheeses)
  const fetchCustomizationOptions = async () => {
    try {
      const crustsResponse = await axios.get(
        "http://localhost:8081/pizzas/crusts"
      );
      const saucesResponse = await axios.get(
        "http://localhost:8081/pizzas/sauces"
      );
      const toppingsResponse = await axios.get(
        "http://localhost:8081/pizzas/toppings"
      );
      const cheesesResponse = await axios.get(
        "http://localhost:8081/pizzas/cheeses"
      );

      setCrusts(Object.keys(crustsResponse.data));
      setSauces(Object.keys(saucesResponse.data));
      setToppings(Object.keys(toppingsResponse.data));
      setCheeses(Object.keys(cheesesResponse.data));
    } catch (error) {
      console.error("Error fetching customization options:", error);
    }
  };

  // Handle customization changes (e.g., crust, sauce, toppings)
  const handleCustomPizzaChange = (e) => {
    const { name, value } = e.target;
    setCustomPizza((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToppingsChange = (topping) => {
    setCustomPizza((prevState) => {
      const toppings = prevState.toppings.includes(topping)
        ? prevState.toppings.filter((t) => t !== topping) // Remove topping if already selected
        : [...prevState.toppings, topping]; // Add topping if not selected
      return { ...prevState, toppings };
    });
  };

  const createCustomPizza = async () => {
    try {
      const pizzaWithType = { ...customPizza, type: "Custom" }; // Set type to 'Custom'
      const response = await axios.post(
        `http://localhost:8081/users/${userEmail}/favorites`,
        pizzaWithType
      );
      alert("Custom Pizza created and added to favorites!");
      setCustomPizza({
        name: "",
        crust: "",
        sauce: "",
        cheese: "",
        size: "",
        toppings: [],
        extraCheese: false,
      });
    } catch (error) {
      alert("Error creating custom pizza or adding it to favorites!");
    }
  };

  const handleOrderNow = async (pizzaName) => {
    if (!orderId) {
      const orderResponse = await createOrder();
      if (orderResponse) {
        const newOrderId = orderResponse.orderId;
        await addPizzaToOrder(pizzaName, 1, newOrderId);
      }
    } else {
      await addPizzaToOrder(pizzaName, 1, orderId);
    }
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      const data = new URLSearchParams();
      data.append("email", userEmail);
      data.append("deliveryOption", "Delivery");
      data.append("pickupLocation", "Red");
      data.append("deliveryAddress", "No 101 High Level Road Pannipitiya");

      const response = await axios.post(
        "http://localhost:8081/orders/create",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Created Order:", response.data);
      setOrderId(response.data.orderId);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addPizzaToOrder = async (pizzaName, quantity = 1, orderId) => {
    if (!orderId) {
      setError("Please create an order first.");
      return;
    }

    const pizzaSize = pizzaPrices[pizzaName]?.size;
    const extraCheeseOption = pizzaPrices[pizzaName]?.extraCheese || false;

    if (!pizzaSize) {
      setError("Please select a pizza size.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/pizzas/default/${pizzaName}/${pizzaSize}?extraCheese=${extraCheeseOption}`
      );
      const pizza = response.data;

      const data = new URLSearchParams();
      data.append("email", userEmail);
      data.append("pizzaName", pizza.name);
      data.append("pizzaSize", pizzaSize);
      data.append("extraCheese", extraCheeseOption);
      data.append("quantity", quantity);

      await axios.post(
        `http://localhost:8081/orders/${orderId}/addPizza`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Added Pizza to Order:", pizza.name);
      setPizzaPrices({});
    } catch (error) {
      console.error("Error adding pizza to order:", error);
      setError("Failed to add pizza to order.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get the appropriate pizza image based on the pizza name
  const getPizzaImage = (pizzaName) => {
    switch (pizzaName.toLowerCase()) {
      case "chicken pizza":
        return chickenPizza;
      case "cheese pizza":
        return cheesePizza;
      case "veggie pizza":
        return veggiePizza;
      default:
        return chickenPizza; // Default image
    }
  };

  return (
    <div className="dashboard">
      <header>
        <div className="welcome-section">
          <h1>Welcome, {user ? user.name : "Guest"}!</h1>
        </div>
        <div className="header-info">
          <div className="loyalty-points-container">
            <span>Loyalty Points: {loyaltyPoints}</span>
          </div>
          <button className="favorites-button">My Favorites ❤️</button>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
          <button className="cart-button">🛒 Cart (0)</button>
        </div>
      </header>

      {/* Menu Section */}
      <section className="menu">
        <h2 className="subheaders">Our Menu</h2>
        <div className="pizza-menu">
          {defaultPizzas.length > 0 ? (
            defaultPizzas.map((pizza, index) => (
              <div key={index} className="pizza-card">
                <h3>{pizza.name}</h3>
                <img
                  src={getPizzaImage(pizza.name)}
                  alt={pizza.name}
                  className="pizza-image"
                />
                <div className="pizza-options">
                  <label>
                    Select Size:
                    <select
                      onChange={(e) =>
                        handleSizeChange(pizza.name, e.target.value)
                      }
                    >
                      {sizes.map((size, idx) => (
                        <option key={idx} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="extra-cheese">
                    Add Extra Cheese?
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleExtraCheeseChange(pizza.name, e.target.checked)
                      }
                    />
                  </label>
                </div>
                <p className="pizza-price">
                  Price: Rs {pizzaPrices[pizza.name]?.price || pizza.basePrice}
                </p>
                <div className="pizza-actions">
                  <button
                    className="order-button"
                    onClick={() => handleOrderNow(pizza.name)}
                  >
                    Order Now!
                  </button>
                  <button
                    className="favorite-button"
                    onClick={() => addFavorite(pizza.name)}
                  >
                    Add to ❤️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading pizzas...</p>
          )}
        </div>
      </section>
      <section className="custom-pizza">
        <h2>Create Your Custom Pizza</h2>
        <form>
          <input
            type="text"
            placeholder="Give a name for your pizza"
            value={customPizza.name}
            name="name"
            onChange={handleCustomPizzaChange}
          />

          <div className="select-group">
            <select
              name="crust"
              value={customPizza.crust}
              onChange={handleCustomPizzaChange}
            >
              <option value="">Select Crust</option>
              {crusts.map((crust) => (
                <option key={crust} value={crust}>
                  {crust}
                </option>
              ))}
            </select>

            <select
              name="sauce"
              value={customPizza.sauce}
              onChange={handleCustomPizzaChange}
            >
              <option value="">Select Sauce</option>
              {sauces.map((sauce) => (
                <option key={sauce} value={sauce}>
                  {sauce}
                </option>
              ))}
            </select>

            <select
              name="cheese"
              value={customPizza.cheese}
              onChange={handleCustomPizzaChange}
            >
              <option value="">Select Cheese</option>
              {cheeses.map((cheese) => (
                <option key={cheese} value={cheese}>
                  {cheese}
                </option>
              ))}
            </select>
          </div>

          <label>
            Add Extra Cheese?
            <input
              type="checkbox"
              name="extraCheese"
              checked={customPizza.extraCheese}
              onChange={(e) =>
                setCustomPizza({
                  ...customPizza,
                  extraCheese: e.target.checked,
                })
              }
            />
          </label>

          <select
            name="size"
            value={customPizza.size}
            onChange={handleCustomPizzaChange}
          >
            <option value="">Select Size</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <h4>Select Toppings</h4>
          <div className="toppings">
            {toppings.map((topping) => (
              <div
                key={topping}
                className={`chip ${
                  customPizza.toppings.includes(topping) ? "selected" : ""
                }`}
                onClick={() => handleToppingsChange(topping)}
              >
                {topping}
              </div>
            ))}
          </div>

          <button type="button" onClick={createCustomPizza}>
            Create Pizza!
          </button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
