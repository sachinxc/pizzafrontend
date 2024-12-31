import React, { useState, useEffect } from "react";
import axios from "axios";

const PizzaCustomization = () => {
  const [crusts, setCrusts] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [name, setName] = useState("");
  const [crust, setCrust] = useState("");
  const [sauce, setSauce] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [size, setSize] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/pizzas/crusts")
      .then((response) => setCrusts(response.data));
    axios
      .get("http://localhost:8081/pizzas/sauces")
      .then((response) => setSauces(response.data));
    axios
      .get("http://localhost:8081/pizzas/toppings")
      .then((response) => setToppings(response.data));
    axios
      .get("http://localhost:8081/pizzas/sizes")
      .then((response) => setSizes(response.data));
  }, []);

  const handleSubmit = () => {
    const customPizza = {
      name,
      crust,
      sauce,
      toppings: selectedToppings,
      size,
    };

    axios
      .post("http://localhost:8081/pizzas/custom", customPizza)
      .then((response) => alert("Custom Pizza Created!"))
      .catch((error) => console.error("Error creating pizza:", error));
  };

  return (
    <div>
      <h2>Customize Your Pizza</h2>
      <form>
        <input
          type="text"
          value={name}
          placeholder="Pizza Name"
          onChange={(e) => setName(e.target.value)}
        />
        <select value={crust} onChange={(e) => setCrust(e.target.value)}>
          <option value="">Select Crust</option>
          {crusts.map((crustOption) => (
            <option key={crustOption} value={crustOption}>
              {crustOption}
            </option>
          ))}
        </select>
        <select value={sauce} onChange={(e) => setSauce(e.target.value)}>
          <option value="">Select Sauce</option>
          {sauces.map((sauceOption) => (
            <option key={sauceOption} value={sauceOption}>
              {sauceOption}
            </option>
          ))}
        </select>
        <select
          multiple
          value={selectedToppings}
          onChange={(e) =>
            setSelectedToppings(
              [...e.target.selectedOptions].map((option) => option.value)
            )
          }
        >
          {toppings.map((topping) => (
            <option key={topping} value={topping}>
              {topping}
            </option>
          ))}
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">Select Size</option>
          {sizes.map((sizeOption) => (
            <option key={sizeOption} value={sizeOption}>
              {sizeOption}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleSubmit}>
          Create Pizza
        </button>
      </form>
    </div>
  );
};

export default PizzaCustomization;
