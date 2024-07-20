import express from "express";
import {
  getLaporanObats,
  createLaporanObat,
  deleteLaporanObat,
} from "../controllers/LaporanObatController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/obats", verifyUser, getLaporanObats);
router.post("/obats", verifyUser, createLaporanObat);
router.delete("/obats/:id", verifyUser, deleteLaporanObat);

export default router;
