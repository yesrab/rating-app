import express from "express";
const router = express.Router();

import { createStore, addReview } from "../controllers/store.js";

router.route("/create").post(createStore);
router.route("/rate").put(addReview);

export default router;
