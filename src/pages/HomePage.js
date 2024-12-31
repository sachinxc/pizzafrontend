import React, { useState } from "react";
import PizzaMenu from "../components/PizzaMenu";
import CustomPizzaForm from "../components/CustomPizzaForm";
import Favorites from "../components/Favorites";
import { api } from "../services/api"; // Import the API module

function HomePage(props) {
  const {
    user,
    pizzas,
    sizes,
    addToFavorites,
    customPizza,
    crusts,
    sauces,
    cheeses,
    toppings,
    handleCustomPizzaChange,
    handleToppingsChange,
    createCustomPizza,
    favorites,
    removeFromFavorites,
    onLogout, // Optional callback for parent to handle logout state
  } = props;

  const [orderId, setOrderId] = useState(null);

  const handleCreateOrder = async () => {
    if (!user) {
      alert("Please log in to place an order!");
      return;
    }
    try {
      const deliveryOption = "Delivery"; // or "Pickup"
      const pickupLocation = "Red"; // Set this if pickup
      const deliveryAddress = "123 Delivery Street"; // Set if delivery

      // Ensure params are passed correctly by calling api.createOrder directly
      const response = await api.createOrder(
        user.email,
        deliveryOption,
        pickupLocation,
        deliveryOption === "Delivery" ? deliveryAddress : null
      );

      setOrderId(response.data.id); // Assume the response contains the order ID
      alert(`Order created! Order ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleLogout = async () => {
    if (user) {
      try {
        const response = await api.logout(user.email);
        console.log(response.data); // Display "Logout successful!" or equivalent
        alert("You have been logged out.");
        if (onLogout) onLogout(); // Notify parent component, if necessary
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Failed to log out. Please try again.");
      }
    } else {
      alert("No user is currently logged in.");
    }
  };

  return (
    <div>
      <h2>Welcome, {user ? user.name : "Guest"}!</h2>
      {/* Logout button */}
      {user && (
        <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
          Logout
        </button>
      )}

      {!orderId && <button onClick={handleCreateOrder}>Create Order</button>}
      {orderId && <h3>Order ID: {orderId}</h3>}

      <PizzaMenu
        pizzas={pizzas}
        sizes={sizes}
        addToFavorites={addToFavorites}
      />
      <CustomPizzaForm
        customPizza={customPizza}
        crusts={crusts}
        sauces={sauces}
        cheeses={cheeses}
        sizes={sizes}
        toppings={toppings}
        handleCustomPizzaChange={handleCustomPizzaChange}
        handleToppingsChange={handleToppingsChange}
        createCustomPizza={createCustomPizza}
      />
      <Favorites
        favorites={favorites}
        removeFromFavorites={removeFromFavorites}
      />
    </div>
  );
}

export default HomePage;
