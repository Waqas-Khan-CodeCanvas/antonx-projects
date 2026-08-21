/**
 * Fetch & Axios Student Lab — Express API + static frontend
 *
 * Start:  npm start
 * Open:   http://localhost:3000
 */

const path = require("path");
const express = require("express");
const cors = require("cors");

const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const protectedRouter = require("./routes/protected");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Artificial delay so students can see loading states (~300ms)
app.use((req, res, next) => {
  setTimeout(next, 300);
});

// API routes
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api", protectedRouter);

// Health check (handy for demos)
app.get("/api/health", (req, res) => {
  res.json({ data: { ok: true, message: "Lab API is running" } });
});

// Static frontend (same origin → simple for beginners)
const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));

// Friendly JSON 404 for unknown /api routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log("");
  console.log("  Fetch & Axios Student Lab");
  console.log(`  Open: http://localhost:${PORT}`);
  console.log("  Demo users: student/1234  |  admin/1234");
  console.log("");
});
