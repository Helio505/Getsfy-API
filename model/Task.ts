import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
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
    type: {
      type: String,
      enum: ["Project", "Task"],
    },
    id: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    team: {
      type: String,
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
    workspace: {
      type: String,
    },
    project: {
      type: String,
    },
    tags: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("g-Task", taskSchema);
