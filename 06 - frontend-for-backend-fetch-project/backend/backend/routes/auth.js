/**
 * Auth routes
 *
 * POST /api/auth/login
 *   body: { username, password }
 *   success 200: { data: { token, user } }
 *   fail 401: { error: "..." }
 *
 * Demo accounts:
 *   student / 1234  → role user
 *   admin   / 1234  → role admin
 */

const express = require("express");
const data = require("../data");

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const user = data.findUser(username, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Teaching token — not secure; shows the Bearer header pattern clearly
  const token = `token-${user.id}-${user.role}`;

  res.json({
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    },
  });
});

module.exports = router;
