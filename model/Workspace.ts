import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    name: {
      type: String,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    memberIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "g-User", // Substitua pelo nome do modelo de usuário, se necessário
      },
    ],
    pendingInvitations: [
      {
        userId: {
          required: true,
          type: mongoose.Types.ObjectId,
          ref: "g-User", // Substitua pelo nome do modelo de usuário, se necessário
        },
        invitationStatus: {
          type: String,
          enum: ["pending", "accepted"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("g-Workspace", workspaceSchema);