import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    description: {
      type: String,
    },
    id: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    taskIdBelongsTo: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export default mongoose.model("g-Subtask", subtaskSchema);
