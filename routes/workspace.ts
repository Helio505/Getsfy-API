import express from "express";
const router = express.Router();

import {
  createWorkspace,
  getWorkspacesByUserId,
  getWorkspaceById,
  updateWorkspaceById,
  deleteWorkspaceById,
  deleteAllWorkspaces,
  addMemberToWorkspace,
} from "../controller/Workspace";

router.post("/", createWorkspace);
router.get("/", getWorkspacesByUserId);
router.get("/:id", getWorkspaceById);
router.put("/:id", updateWorkspaceById);
router.delete("/:id", deleteWorkspaceById);

router.post("/member", addMemberToWorkspace);

module.exports = router;
