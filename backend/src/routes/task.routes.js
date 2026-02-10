import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.use(protect); // Apply authentication middleware to all routes

router.get("/", getTasks);
router.post("/", createTask);

router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
