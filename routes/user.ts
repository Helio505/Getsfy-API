import express from "express";
const router = express.Router();

import {
  getUsersByRole,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controller/User";

router.get("/role/:role", getUsersByRole);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
