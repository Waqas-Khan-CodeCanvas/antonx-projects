/**
 * Protected + demo routes
 *
 * GET  /api/me           — current user (Bearer)              → 200 | 401
 * POST /api/orders       — create order (Bearer)              → 201 | 400 | 401
 * GET  /api/admin/stats  — stats (Bearer + admin)             → 200 | 401 | 403
 * GET  /api/error        — always 500 (for catch demos)
 */

const express = require("express");
const data = require("../data");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/me  Header: Authorization: Bearer <token>
router.get("/me", auth, (req, res) => {
  res.json({ data: { user: req.user } });
});

// POST /api/orders  body: { productId, quantity }
// Header: Authorization: Bearer <token>
router.post("/orders", auth, (req, res) => {
  const { productId, quantity } = req.body || {};

  const pid = Number(productId);
  const qty = Number(quantity);

  if (!Number.isInteger(pid) || pid <= 0) {
    return res.status(400).json({ error: "productId must be a positive integer" });
  }
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ error: "quantity must be a positive integer" });
  }

  const product = data.getProductById(pid);
  if (!product) {
    return res.status(404).json({ error: `Product ${pid} not found` });
  }

  const order = data.createOrder({
    userId: req.user.id,
    productId: pid,
    quantity: qty,
  });

  res.status(201).json({
    data: {
      order,
      product,
      orderedBy: req.user.username,
    },
  });
});

// GET /api/admin/stats  — needs admin role
router.get("/admin/stats", auth, adminOnly, (req, res) => {
  res.json({
    data: {
      stats: data.getStats(),
      viewedBy: req.user.username,
    },
  });
});

// GET /api/error — intentional failure
router.get("/error", (req, res) => {
  res.status(500).json({ error: "Intentional server error for classroom demos" });
});

module.exports = router;
