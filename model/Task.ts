import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
    },
    workspaceId: {
      type: mongoose.Types.ObjectId,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
    },
    dueDate: {
      type: String,
    },
    assignee: {
      type: String,
    },
    tags: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("g-Task", taskSchema);
