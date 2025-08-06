import express from "express";
import {
  getMe,
  updateMe,
  // deleteReaderController,
} from "../controllers/reader/reader.controller.js";
import { createUser } from "../controllers/create.controller.js";

const router = express.Router();

router.route("/:id").get(getMe).put(updateMe);
router.route("/register").post(createUser);

export default router;
