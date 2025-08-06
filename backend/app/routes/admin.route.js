import express from "express";
// import { login } from "../controllers/login.controller.js";
import {
  getAllReader,
  getReaderByID,
  getReaderByCode,
  updateReaderController,
  deleteReaderController,
} from "../controllers/admin/reader.controller.js";
import {
  getAllStaff,
  getStaffByID,
  updateStaffController,
  deleteStaffController,
} from "../controllers/admin/staff.controller.js";
import { createUser } from "../controllers/create.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateMe } from "../controllers/admin/profile.controller.js";
const router = express.Router();

// router.post("/login", login);

// Các route cần đăng nhập mới truy cập được
router.route("/profile/:id").put(verifyToken, updateMe);

router.route("/staffs").get(getAllStaff).post(verifyToken, createUser);

router
  .route("/staff/:id")
  .get(verifyToken, getStaffByID)
  .put(verifyToken, updateStaffController)
  .delete(verifyToken, deleteStaffController);

router
  .route("/readers")
  .get(verifyToken, getAllReader)
  .post(verifyToken, createUser);

router
  .route("/reader/:id")
  .get(verifyToken, getReaderByID)
  .put(verifyToken, updateReaderController)
  .delete(verifyToken, deleteReaderController);

export default router;
