import express from "express";
import * as AuthorController from "../controllers/author.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    AuthorController.getAll
  )
  .post(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    AuthorController.create
  );
router
  .route("/:id")
  .get(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    AuthorController.getById
  )
  .put(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    AuthorController.update
  )
  .delete(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    AuthorController.remove
  );

export default router;
