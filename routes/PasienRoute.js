import express from "express";
import {
  getPasiens,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getPasiensThisMonth,
} from "../controllers/PasienController.js";
import { verifyUser, adminOrMedis } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/pasiens", verifyUser, adminOrMedis, getPasiens);
router.get("/pasiens/pasiensCount", verifyUser, getPasiensThisMonth);
router.get("/pasiens/:id", verifyUser, adminOrMedis, getPasienById);
router.post("/pasiens", verifyUser, adminOrMedis, createPasien);
router.patch("/pasiens/:id", verifyUser, adminOrMedis, updatePasien);
router.delete("/pasiens/:id", verifyUser, adminOrMedis, deletePasien);

export default router;
