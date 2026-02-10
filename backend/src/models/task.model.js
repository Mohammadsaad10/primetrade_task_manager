import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: "String",
    required: [true, "Please add a title"],
    trim: true, // Remove whitespace
    maxlength: [50, "Title cannot be more than 50 characters"],
  },
  description: {
    type: "String",
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  status: {
    type: "String",
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: "Date",
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
