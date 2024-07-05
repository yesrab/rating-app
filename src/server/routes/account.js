import express from "express";
const router = express.Router();

import {
  testAccount,
  signUp,
  login,
  userList,
  userCount,
  getStoreTables,
  userTable,
  getUserStoreTabel,
} from "../controllers/account.js";

router.route("/test").get(testAccount);
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/count").get(userCount);
router.route("/table").get(getStoreTables);
router.route("/users").get(userTable);
router.route("/ratingTable/:userID").get(getUserStoreTabel);
router.route("/user/:type").get(userList);

export default router;
