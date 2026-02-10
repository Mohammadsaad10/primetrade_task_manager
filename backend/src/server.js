import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS based on environment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["http://localhost", "http://localhost:80"]
      : ["http://localhost:5173", "http://localhost:5001"],
  credentials: true,
};

app.use(express.json()); // body parser
app.use(helmet()); // secure headers
app.use(cors(corsOptions)); // enable CORS
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // logging
}
app.use(cookieParser()); // parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
