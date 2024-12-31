import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import PizzaCustomization from "./components/PizzaCustomization";
import OrderPage from "./components/OrderPage";
import OrderSummary from "./components/OrderSummary";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/customize" element={<PizzaCustomization />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/summary" element={<OrderSummary />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
