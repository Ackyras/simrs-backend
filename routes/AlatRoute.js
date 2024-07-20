import express from "express";
import {
  getAlats,
  getAlatById,
  createAlat,
  updateAlat,
  deleteAlat,
} from "../controllers/AlatController.js";
import { verifyUser, adminOrPerlengkapan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/alats", verifyUser, adminOrPerlengkapan, getAlats);
router.get("/alats/:id", verifyUser, adminOrPerlengkapan, getAlatById);
router.post("/alats", verifyUser, adminOrPerlengkapan, createAlat);
router.patch("/alats/:id", verifyUser, adminOrPerlengkapan, updateAlat);
router.delete("/alats/:id", verifyUser, adminOrPerlengkapan, deleteAlat);

export default router;
