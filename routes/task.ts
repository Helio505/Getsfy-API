import express from "express";
const router = express.Router();

import {
  createTask,
  getTaskByUserId,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTaskByWorkspaceId,
} from "../controller/Task";

router.post("", createTask);
router.get("/", getTaskByUserId);
router.get("/:id", getTaskById);
router.get("/workspace/:workspaceId", getTaskByWorkspaceId);
router.put("/:id", updateTaskById);
router.delete("/:id", deleteTaskById);

module.exports = router;
