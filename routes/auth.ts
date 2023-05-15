import express from "express";
const router = express.Router();

import { 
    createUser,
    login
} from "../controller/Auth";

router.post("/register", createUser);
router.post("/login", login);

module.exports = router;