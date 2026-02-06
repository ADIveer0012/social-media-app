/* =========================
   SERVER.JS - Social Media App Backend
========================= */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post"); // posts CRUD

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json()); // Parse JSON requests

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/posts", postRoutes); // Posts routes

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

/* =========================
   404 FALLBACK
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
