import express from "express";
import {
  createBorrow,
  getByUser,
  cancel,
} from "../controllers/borow.controller.js";

const router = express.Router();

router.post("/", createBorrow);
router.get("/user/:id", getByUser);
router.patch("/:id/cancel", cancel);

export default router;
