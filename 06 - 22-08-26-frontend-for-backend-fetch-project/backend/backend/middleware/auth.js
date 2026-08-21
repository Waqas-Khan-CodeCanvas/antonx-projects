/**
 * Teaching auth (NOT production security)
 *
 * Login returns a fake token like: token-1-user  or  token-2-admin
 * Clients send:  Authorization: Bearer token-1-user
 */

const data = require("../data");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized - missing or invalid Authorization header. Use: Bearer <token>",
    });
  }

  const token = header.slice(7).trim();
  // Expected format: token-<userId>-<role>
  const parts = token.split("-");
  if (parts.length < 3 || parts[0] !== "token") {
    return res.status(401).json({ error: "Unauthorized - invalid token format" });
  }

  const id = Number(parts[1]);
  const role = parts.slice(2).join("-"); // allow roles that contain hyphens later

  const user = data.findUserById(id);
  if (!user || user.role !== role) {
    return res.status(401).json({ error: "Unauthorized - token does not match a user" });
  }

  req.user = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  next();
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - admin only" });
  }
  next();
}

module.exports = { auth, adminOnly };
