import express from "express";
import {
  getObats,
  getObatById,
  createObat,
  updateObat,
  deleteObat,
  getObatByName,
} from "../controllers/ObatController.js";
import { verifyUser, adminOrPerlengkapan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/obats", verifyUser, getObats);
router.get("/obats/obats", verifyUser, getObatByName);
router.get("/obats/:id", verifyUser, getObatById);
router.post("/obats", verifyUser, adminOrPerlengkapan, createObat);
router.patch("/obats/:id", verifyUser, adminOrPerlengkapan, updateObat);
router.delete("/obats/:id", verifyUser, adminOrPerlengkapan, deleteObat);

export default router;
