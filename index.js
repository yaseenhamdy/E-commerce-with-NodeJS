import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./Modules/users/user.routes.js";
import cartRoutes from "./Modules/carts/cart.routes.js";

import connectDB from "./Database/connect_db.js";
import { runSeedUsers } from "./seed_data/seedUsers.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(userRoutes);
app.use(cartRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

// TODO: Register routes/modules here

(async () => {
  await connectDB();

  try {
    await runSeedUsers();
  } catch (err) {
    console.error("Seed failed:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
