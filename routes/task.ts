import express from "express";
const router = express.Router();

import {
    createTask,
    getTaskById,
    updateTaskById,
    deleteTaskById
} from "../controller/Task";

router.post("", createTask);
router.get("/:id", getTaskById)
router.put("/:id", updateTaskById)
router.delete("/:id", deleteTaskById)

module.exports = router