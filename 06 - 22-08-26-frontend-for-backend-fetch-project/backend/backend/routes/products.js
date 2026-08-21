/**
 * Public product CRUD
 *
 * GET    /api/products       — list all products          → 200
 * GET    /api/products/:id   — one product                → 200 | 404
 * POST   /api/products       — create { name, price }     → 201 | 400
 * PUT    /api/products/:id   — replace full product       → 200 | 400 | 404
 * PATCH  /api/products/:id   — partial update             → 200 | 400 | 404
 * DELETE /api/products/:id   — remove product             → 200 | 404
 */

const express = require("express");
const data = require("../data");

const router = express.Router();

function parseId(param) {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateNamePrice(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      errors.push("name must be a non-empty string");
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== "number" || Number.isNaN(body.price) || body.price < 0) {
      errors.push("price must be a number >= 0");
    }
  }

  if (partial && body.name === undefined && body.price === undefined) {
    errors.push("provide at least name or price to update");
  }

  return errors;
}

// GET /api/products
router.get("/", (req, res) => {
  res.json({ data: data.getProducts() });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const product = data.getProductById(id);
  if (!product) {
    return res.status(404).json({ error: `Product ${id} not found` });
  }

  res.json({ data: product });
});

// POST /api/products  body: { name, price }
router.post("/", (req, res) => {
  const errors = validateNamePrice(req.body || {});
  if (errors.length) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  const product = data.createProduct({
    name: req.body.name.trim(),
    price: req.body.price,
  });

  res.status(201).json({ data: product });
});

// PUT /api/products/:id  body: { name, price } (full replace)
router.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const errors = validateNamePrice(req.body || {});
  if (errors.length) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  const product = data.replaceProduct(id, {
    name: req.body.name.trim(),
    price: req.body.price,
  });

  if (!product) {
    return res.status(404).json({ error: `Product ${id} not found` });
  }

  res.json({ data: product });
});

// PATCH /api/products/:id  body: { name? , price? }
router.patch("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const errors = validateNamePrice(req.body || {}, { partial: true });
  if (errors.length) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  const updates = {};
  if (req.body.name !== undefined) updates.name = req.body.name.trim();
  if (req.body.price !== undefined) updates.price = req.body.price;

  const product = data.patchProduct(id, updates);
  if (!product) {
    return res.status(404).json({ error: `Product ${id} not found` });
  }

  res.json({ data: product });
});

// DELETE /api/products/:id
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const deleted = data.deleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ error: `Product ${id} not found` });
  }

  res.json({ data: { id, deleted: true } });
});

module.exports = router;
