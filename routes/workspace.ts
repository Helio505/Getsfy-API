import express from "express";
const router = express.Router();

import {
    createWorkspace,
    getWorkspaceById,
    updateWorkspaceById,
    deleteWorkspaceById
} from "../controller/Workspace";

router.post("", createWorkspace);
router.get("/:id", getWorkspaceById)
router.put("/:id", updateWorkspaceById)
router.delete("/:id", deleteWorkspaceById)

module.exports = router