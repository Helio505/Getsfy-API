import express from "express";
const router = express.Router();

import {
  createSubtask,
  getSubtaskById,
  updateSubtaskById,
  deleteSubtaskById,
} from "../controller/Subtask";

router.post("", createSubtask);
router.get("/:id", getSubtaskById);
router.put("/:id", updateSubtaskById);
router.delete("/:id", deleteSubtaskById);

module.exports = router;
