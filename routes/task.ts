import express from "express";
const router = express.Router();

import {
  createTask,
  getTaskByUserId,
  updateTaskById,
  deleteTaskById,
} from "../controller/Task";

router.post("", createTask);
router.get("/", getTaskByUserId);
router.put("/:id", updateTaskById);
router.delete("/:id", deleteTaskById);

module.exports = router;
