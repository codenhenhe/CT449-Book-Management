import express from "express";
import * as PublisherController from "../controllers/publisher.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    PublisherController.getAll
  )
  .post(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    PublisherController.create
  );
router
  .route("/:id")
  .get(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    PublisherController.getById
  )
  .put(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    PublisherController.update
  )
  .delete(
    verifyToken,
    verifyRole(["quantrivien", "nhanvien"]),
    PublisherController.remove
  );

export default router;
