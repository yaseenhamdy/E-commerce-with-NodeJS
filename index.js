import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./Modules/users/user.routes.js";

import connectDB from "./Database/connect_db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(userRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

// TODO: Register routes/modules here

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
