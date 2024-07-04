import express from "express";
const router = express.Router();

import { createStore } from "../controllers/store.js";

router.route("/create").post(createStore);

export default router;
