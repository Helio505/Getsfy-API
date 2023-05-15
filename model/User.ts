import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    password: {
      type: String,
      min: 8,
      max: 64,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("g-User", userSchema);
