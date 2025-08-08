import express from "express";
import {
  getMe,
  updateMe,
  // deleteReaderController,
} from "../controllers/reader/reader.controller.js";
import { createUser } from "../controllers/create.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router.route("/:id").get(getMe).put(verifyToken, updateMe);
router.route("/register").post(createUser);

export default router;
