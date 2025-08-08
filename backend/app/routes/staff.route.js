import express from "express";
import { updateMe } from "../controllers/admin/profile.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/profile/:id").put(verifyToken, updateMe);

export default router;
