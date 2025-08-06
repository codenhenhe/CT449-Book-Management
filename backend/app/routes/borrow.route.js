import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";
import checkExpiredBorrows from "../middlewares/checkExpiredBorrow.middleware.js";
import checkOverdueBorrows from "../middlewares/checkOverdueBorrows.middleware.js";
import {
  createBorrow,
  getByUser,
  cancel,
  getAll,
  updateStatus,
} from "../controllers/borow.controller.js";

const router = express.Router();

router
  .route("/")
  .post(createBorrow)
  .get(
    verifyToken,
    verifyRole(["nhanvien"]),
    checkExpiredBorrows,
    checkOverdueBorrows,
    getAll
  );
router.get("/user/:id", getByUser);
router.patch("/:id/cancel", checkExpiredBorrows, checkOverdueBorrows, cancel);
router
  .route("/:id/status")
  .put(
    verifyToken,
    verifyRole(["nhanvien"]),
    checkExpiredBorrows,
    checkOverdueBorrows,
    updateStatus
  );

export default router;
