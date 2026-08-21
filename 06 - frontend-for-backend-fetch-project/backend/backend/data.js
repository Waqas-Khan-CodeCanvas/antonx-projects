/**
 * In-memory seed data.
 * Restarts of the server reset products and orders — fine for classroom demos.
 */

let products = [
  { id: 1, name: "Notebook", price: 5 },
  { id: 2, name: "Pen", price: 2 },
  { id: 3, name: "Backpack", price: 30 },
];

let nextProductId = 4;

// Demo users (passwords are intentionally simple for teaching)
const users = [
  { id: 1, username: "student", password: "1234", role: "user" },
  { id: 2, username: "admin", password: "1234", role: "admin" },
];

let orders = [];
let nextOrderId = 1;

function getProducts() {
  return products;
}

function getProductById(id) {
  return products.find((p) => p.id === id);
}

function createProduct({ name, price }) {
  const product = { id: nextProductId++, name, price };
  products.push(product);
  return product;
}

function replaceProduct(id, { name, price }) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { id, name, price };
  return products[index];
}

function patchProduct(id, updates) {
  const product = products.find((p) => p.id === id);
  if (!product) return null;
  if (updates.name !== undefined) product.name = updates.name;
  if (updates.price !== undefined) product.price = updates.price;
  return product;
}

function deleteProduct(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

function findUser(username, password) {
  return users.find((u) => u.username === username && u.password === password);
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function createOrder({ userId, productId, quantity }) {
  const order = {
    id: nextOrderId++,
    userId,
    productId,
    quantity,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
}

function getOrders() {
  return orders;
}

function getStats() {
  return {
    productCount: products.length,
    orderCount: orders.length,
    userCount: users.length,
  };
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  replaceProduct,
  patchProduct,
  deleteProduct,
  findUser,
  findUserById,
  createOrder,
  getOrders,
  getStats,
};
