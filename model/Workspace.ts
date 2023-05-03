import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        name: {
            type: String
        }
    }, {timestamps: true}
);

export default mongoose.model("g-Workspace", workspaceSchema);