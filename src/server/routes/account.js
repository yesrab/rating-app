import express from "express";
const router = express.Router();

import { testAccount, signUp, login } from "../controllers/account.js";

router.route("/test").get(testAccount);
router.route("/signup").post(signUp);
router.route("/login").post(login);

export default router;
