import axios from "axios";

const BASE_URL = "http://localhost:8081";

export const api = {
  // Create Order - sending the parameters as query params
  createOrder: (email, deliveryOption, pickupLocation, deliveryAddress) =>
    axios.post(`${BASE_URL}/orders/create`, null, {
      params: {
        email,
        deliveryOption,
        pickupLocation,
        deliveryAddress,
      },
    }),

  register: (params) =>
    axios.post(`${BASE_URL}/users/register`, null, { params }),

  login: (params) => axios.post(`${BASE_URL}/users/login`, null, { params }),

  logout: (identifier) =>
    axios.post(`${BASE_URL}/users/logout`, null, { params: { identifier } }),

  getUser: (email) => axios.get(`${BASE_URL}/users/${email}`),

  getPizzas: () => axios.get(`${BASE_URL}/pizzas/default`),

  getCustomizationOptions: async () => {
    const [crusts, sauces, toppings, cheeses, sizes] = await Promise.all([
      axios.get(`${BASE_URL}/pizzas/crusts`),
      axios.get(`${BASE_URL}/pizzas/sauces`),
      axios.get(`${BASE_URL}/pizzas/toppings`),
      axios.get(`${BASE_URL}/pizzas/cheeses`),
      axios.get(`${BASE_URL}/pizzas/sizes`),
    ]);
    return { crusts, sauces, toppings, cheeses, sizes };
  },

  getFavorites: (email) => axios.get(`${BASE_URL}/users/${email}/favorites`),

  addToFavorites: (email, pizza) =>
    axios.post(`${BASE_URL}/users/${email}/favorites`, pizza),

  removeFromFavorites: (email, pizza) =>
    axios.delete(`${BASE_URL}/users/${email}/favorites`, { data: pizza }),

  // Add Pizza to Order
  addPizzaToOrder: (orderId, pizzaName, quantity) =>
    axios.post(`${BASE_URL}/orders/${orderId}/addPizza`, null, {
      params: { pizzaName, quantity },
    }),

  // Adjust Pizza Quantity in Order
  adjustPizzaQuantity: (orderId, pizzaName, newQuantity) =>
    axios.post(`${BASE_URL}/orders/${orderId}/adjustPizzaQuantity`, null, {
      params: { pizzaName, newQuantity },
    }),

  // Remove Pizza from Order
  removePizzaFromOrder: (orderId, pizzaName) =>
    axios.post(`${BASE_URL}/orders/${orderId}/removePizza`, null, {
      params: { pizzaName },
    }),

  // Get Order Details
  getOrderDetails: (orderId) => axios.get(`${BASE_URL}/orders/${orderId}`),
};
