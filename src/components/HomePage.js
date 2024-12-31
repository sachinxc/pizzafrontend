import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/pizzas/default")
      .then((response) => setPizzas(response.data))
      .catch((error) => console.error("Error fetching pizzas:", error));
  }, []);

  return (
    <div>
      <h2>Our Default Pizzas</h2>
      <div>
        {pizzas.map((pizza) => (
          <div key={pizza.id}>
            <h3>{pizza.name}</h3>
            <p>Size: {pizza.size}</p>
            <p>Price: {pizza.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
      <Link to="/menu">View Menu</Link>
    </div>
  );
};

export default HomePage;
