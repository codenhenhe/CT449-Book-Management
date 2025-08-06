import express from "express";
import * as bookController from "../controllers/book.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/").get(bookController.getAllBooks);
router.route("/add").post(
  verifyToken,
  (req, res, next) => {
    if (req.user.vaiTro !== "nhanvien" || req.user.vaiTro !== "quantrivien") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    next();
  },
  bookController.createNewBook
);
router
  .route("/:id")
  .get(bookController.getBookByID)
  .delete(verifyToken, bookController.deleteBookService)
  .put(verifyToken, bookController.updateBookService);
export default router;
