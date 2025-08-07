import express from "express";
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
// import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router.put("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
