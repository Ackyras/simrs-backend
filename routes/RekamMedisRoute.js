import express from "express";
import {
  getRekamMedis,
  getRekamMedisById,
  getRekamMedisByPasienId,
  createRekamMedis,
  getDokterByName,
  // getObatByName,
  getRekamMedisThisMonth,
  // updateRekamMedis,
  // deleteRekamMedis,
} from "../controllers/RekamMedisController.js";
import { verifyUser, adminOrMedis } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/rekamMedis", verifyUser, adminOrMedis, getRekamMedis);
router.get("/rekamMedis/rekamMedisCount", verifyUser, getRekamMedisThisMonth);
router.get("/rekamMedis/id/:id", verifyUser, adminOrMedis, getRekamMedisById);
router.get(
  "/rekamMedis/:pasienId",
  verifyUser,
  adminOrMedis,
  getRekamMedisByPasienId
);
router.post("/rekamMedis", verifyUser, adminOrMedis, createRekamMedis);
router.get("rekamMedis/dokters", verifyUser, adminOrMedis, getDokterByName);
// router.get("rekamMedis/obats", verifyUser, adminOrMedis, getObatByName);
// router.patch("/RekamMedis/:id", verifyUser, updateRekamMedis);
// router.delete("/rekamMedis/:id", verifyUser, deleteRekamMedis);

export default router;
