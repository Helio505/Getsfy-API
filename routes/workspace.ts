import express from "express";
const router = express.Router();

import {
  createWorkspace,
  getWorkspacesByUserId,
  getWorkspaceById,
  updateWorkspaceById,
  deleteWorkspaceById,
  getWorkspaceMembersById,
  deleteAllWorkspaces,
  addMemberToWorkspace,
  getPendingInvitations,
  acceptInvitationAndAddMember,
  declineInvitation
} from "../controller/Workspace";

router.post("/", createWorkspace);
router.get("/", getWorkspacesByUserId);
router.get("/:id", getWorkspaceById);
router.put("/:id", updateWorkspaceById);
router.delete("/:id", deleteWorkspaceById);
router.post("/all", deleteAllWorkspaces);

router.get("/:id/members", getWorkspaceMembersById);
router.get("/:id/invite/:invitationId", addMemberToWorkspace);
router.post("/membership/:id", addMemberToWorkspace);
router.get("/membership/pending", getPendingInvitations);
router.post("/membership/:invitationId/accept", acceptInvitationAndAddMember);
router.post("/membership/:invitationId/decline", declineInvitation);

module.exports = router;
