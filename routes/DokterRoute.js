import express from "express";
import {
  getDokters,
  getDokterById,
  createDokter,
  updateDokter,
  deleteDokter,
  getDokterByName,
  getDoktersCount,
} from "../controllers/DokterController.js";
import { verifyUser, adminOrMedis } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/dokters", verifyUser, adminOrMedis, getDokters);
router.get("/dokters/doktersCount", verifyUser, getDoktersCount);
router.get("/dokters/dokters", verifyUser, adminOrMedis, getDokterByName);
router.get("/dokters/:id", verifyUser, adminOrMedis, getDokterById);
router.post("/dokters", verifyUser, adminOrMedis, createDokter);
router.patch("/dokters/:id", verifyUser, adminOrMedis, updateDokter);
router.delete("/dokters/:id", verifyUser, adminOrMedis, deleteDokter);

export default router;
