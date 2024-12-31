import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MenuPage = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/pizzas/default")
      .then((response) => setMenu(response.data))
      .catch((error) => console.error("Error fetching menu:", error));
  }, []);

  return (
    <div>
      <h2>Pizza Menu</h2>
      {menu.map((pizza) => (
        <div key={pizza.id}>
          <h3>{pizza.name}</h3>
          <p>Size: {pizza.size}</p>
          <p>Price: {pizza.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
      <Link to="/customize">Customize a Pizza</Link>
    </div>
  );
};

export default MenuPage;
