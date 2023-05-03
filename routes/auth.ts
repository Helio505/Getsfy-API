import express from "express";
const router = express.Router();

import { 
    createUser,
    loginUser
} from "../controller/Auth";

router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;