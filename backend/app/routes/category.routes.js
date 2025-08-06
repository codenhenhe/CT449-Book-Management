import express from "express";
import Category from "../models/category.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thể loại" });
  }
});

router
  .route("/add")
  .post(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    async (req, res) => {
      try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  );

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({ message: "Không thể lấy thể loại sách." });
    }
  })
  .put(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    async (req, res) => {
      try {
        const updated = await Category.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        res.json(updated);
      } catch (err) {
        res.status(400).json({ message: "Lỗi khi cập nhật thể loại" });
      }
    }
  )
  .delete(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    async (req, res) => {
      try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xoá thể loại" });
      } catch (err) {
        res.status(500).json({ message: "Lỗi khi xoá thể loại" });
      }
    }
  );

export default router;
