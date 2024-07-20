import express from "express";
import {
  getBatchObats,
  createBatchObat,
  deleteBatchObat,
  getSupplierByName,
  addBatchObat,
  getBatchObatByObatId,
  getBatchObatById,
  getBatchObatsMasukThisMonth,
  getBatchObatsKeluarThisMonth,
} from "../controllers/BatchObatController.js";
import { verifyUser, adminOrPerlengkapan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/batchObats", verifyUser, getBatchObats);
router.get("/batchObats/masukCount", verifyUser, getBatchObatsMasukThisMonth);
router.get("/batchObats/keluarCount", verifyUser, getBatchObatsKeluarThisMonth);
router.get(
  "/batchObats/suppliers",
  verifyUser,
  adminOrPerlengkapan,
  getSupplierByName
);
router.get("/batchObats/id/:uuid", verifyUser, getBatchObatById);
router.get("/batchObats/:obatId", verifyUser, getBatchObatByObatId);
router.post("/batchObats", verifyUser, adminOrPerlengkapan, createBatchObat);
router.post("/batchObatsAdd", verifyUser, adminOrPerlengkapan, addBatchObat);
router.delete(
  "/batchObats/:id",
  verifyUser,
  adminOrPerlengkapan,
  deleteBatchObat
);

export default router;
