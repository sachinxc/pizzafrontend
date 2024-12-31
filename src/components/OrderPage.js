import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderPage = () => {
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [defaultPizzas, setDefaultPizzas] = useState([]);
  const [pizzaQuantities, setPizzaQuantities] = useState({});
  const [pizzaSizes, setPizzaSizes] = useState({});
  const [extraCheese, setExtraCheese] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userEmail = "s"; // Replace with the actual logged-in user's email

  useEffect(() => {
    setLoading(true);
    fetchPizzaSizes();
    fetchDefaultPizzas();

    if (orderId) {
      console.log(`Fetching details for order ID: ${orderId}`);
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchPizzaSizes = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pizzas/sizes");
      console.log("Fetched Pizza Sizes:", response.data);
      setSizes(response.data);
    } catch (error) {
      console.error("Error fetching pizza sizes:", error);
      setError("Failed to fetch pizza sizes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultPizzas = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pizzas/default");
      console.log("Fetched Default Pizzas:", response.data);
      setDefaultPizzas(response.data);
    } catch (error) {
      console.error("Error fetching default pizzas:", error);
      setError("Failed to fetch default pizzas.");
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/orders/${id}?email=${userEmail}`
      );
      console.log("Fetched Order Details:", response.data);
      if (response.data.pizzaItems) {
        setOrderDetails(response.data);
      } else {
        setOrderDetails({ pizzaItems: [], totalPrice: 1000 });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details.");
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
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  const addPizzaToOrder = async (pizzaName) => {
    const pizzaSize = pizzaSizes[pizzaName];
    const pizzaQuantity = pizzaQuantities[pizzaName] || 1;
    const extraCheeseOption = extraCheese[pizzaName] || false;

    if (!pizzaSize) {
      setError("Please select a pizza size");
      return;
    }

    setLoading(true);
    try {
      // Fetch pizza by name and size using the new endpoint
      const response = await axios.get(
        `http://localhost:8081/pizzas/default/${pizzaName}/${pizzaSize}?extraCheese=${extraCheeseOption}`
      );
      const pizza = response.data;

      // Now, add this pizza to the order
      const data = new URLSearchParams();
      data.append("email", userEmail);
      data.append("pizzaName", pizza.name);
      data.append("pizzaSize", pizzaSize); // Send the pizza size
      data.append("quantity", pizzaQuantity);
      data.append("extraCheese", extraCheeseOption); // Include extraCheese in the request

      const addPizzaResponse = await axios.post(
        `http://localhost:8081/orders/${orderId}/addPizza`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Add Pizza Response:", addPizzaResponse.data);
      fetchOrderDetails(orderId);

      setPizzaQuantities({});
      setPizzaSizes({});
      setExtraCheese({});
    } catch (error) {
      console.error("Error adding pizza:", error);
      setError("Failed to add pizza to order.");
    } finally {
      setLoading(false);
    }
  };

  const adjustPizzaQuantity = async (pizzaName, newQuantity) => {
    const updatedQuantities = { ...pizzaQuantities, [pizzaName]: newQuantity };
    setPizzaQuantities(updatedQuantities);

    try {
      const data = new URLSearchParams();
      data.append("email", userEmail);
      data.append("pizzaName", pizzaName);
      data.append("newQuantity", newQuantity);

      await axios.post(
        `http://localhost:8081/orders/${orderId}/adjustPizzaQuantity`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      fetchOrderDetails(orderId);
    } catch (error) {
      console.error("Error adjusting pizza quantity:", error);
      setError("Failed to adjust pizza quantity.");
    }
  };

  const removePizzaFromOrder = async (pizzaName) => {
    try {
      const data = new URLSearchParams();
      data.append("email", userEmail);
      data.append("pizzaName", pizzaName);

      await axios.post(
        `http://localhost:8081/orders/${orderId}/removePizza`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      fetchOrderDetails(orderId);
    } catch (error) {
      console.error("Error removing pizza:", error);
      setError("Failed to remove pizza from order.");
    }
  };

  const handleSizeChange = (pizzaName, size) => {
    const updatedSizes = { ...pizzaSizes, [pizzaName]: size };
    setPizzaSizes(updatedSizes);
  };

  const handleExtraCheeseChange = (pizzaName) => {
    const updatedExtraCheese = {
      ...extraCheese,
      [pizzaName]: !extraCheese[pizzaName],
    };
    setExtraCheese(updatedExtraCheese);
  };

  return (
    <div className="order-page">
      <h1>Your Order</h1>

      {error && <div className="error">{error}</div>}

      {loading && <div>Loading...</div>}

      {orderId ? (
        <div>
          <h2>Order ID: {orderId}</h2>
          {orderDetails ? (
            <div>
              <h3>Order Details:</h3>
              {orderDetails.pizzaItems && orderDetails.pizzaItems.length > 0 ? (
                <ul>
                  {orderDetails.pizzaItems.map((pizza, index) => (
                    <li key={index}>
                      <strong>
                        {pizza.pizza.name} ({pizza.pizza.size})
                      </strong>{" "}
                      (Quantity: {pizza.quantity})
                      <button
                        onClick={() =>
                          adjustPizzaQuantity(
                            pizza.pizza.name,
                            pizza.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          adjustPizzaQuantity(
                            pizza.pizza.name,
                            pizza.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <button
                        onClick={() => removePizzaFromOrder(pizza.pizza.name)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pizzas in the order.</p>
              )}
              <p>Total Price: ${orderDetails.totalPrice}</p>
              <p>
                You will get {orderDetails.orderPoints} Points for this order!
              </p>
            </div>
          ) : (
            <p>Loading order details...</p>
          )}
        </div>
      ) : (
        <div>
          <button onClick={createOrder}>Create Order</button>
        </div>
      )}

      {orderId && (
        <div>
          <h3>Select Pizza and Size</h3>
          {defaultPizzas.length > 0 ? (
            <ul>
              {defaultPizzas.map((pizza, index) => (
                <li key={index}>
                  <strong>{pizza.name}</strong>
                  {sizes.length > 0 && (
                    <select
                      value={pizzaSizes[pizza.name] || sizes[0]} // Default to first size if not set
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
                  )}
                  <label>
                    <input
                      type="checkbox"
                      checked={extraCheese[pizza.name] || false}
                      onChange={() => handleExtraCheeseChange(pizza.name)}
                    />
                    Extra Cheese
                  </label>
                  <button
                    onClick={() => addPizzaToOrder(pizza.name)} // Use selected size and extra cheese
                  >
                    Add to Order
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading default pizzas...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
