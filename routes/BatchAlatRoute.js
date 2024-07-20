import express from "express";
import {
  getBatchAlats,
  createBatchAlat,
  deleteBatchAlat,
  getSupplierByName,
  addBatchAlat,
  getBatchAlatByAlatId,
  getBatchAlatById,
  getBatchAlatsMasukThisMonth,
  getBatchAlatsKeluarThisMonth,
} from "../controllers/BatchAlatController.js";
import { verifyUser, adminOrPerlengkapan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/batchAlats", verifyUser, adminOrPerlengkapan, getBatchAlats);
router.get("/batchAlats/masukCount", verifyUser, getBatchAlatsMasukThisMonth);
router.get("/batchAlats/keluarCount", verifyUser, getBatchAlatsKeluarThisMonth);
router.get(
  "/batchAlats/suppliers",
  verifyUser,
  adminOrPerlengkapan,
  getSupplierByName
);
router.get(
  "/batchAlats/id/:uuid",
  verifyUser,
  adminOrPerlengkapan,
  getBatchAlatById
);
router.get(
  "/batchAlats/:alatId",
  verifyUser,
  adminOrPerlengkapan,
  getBatchAlatByAlatId
);
router.post("/batchAlats", verifyUser, adminOrPerlengkapan, createBatchAlat);
router.post("/batchAlatsAdd", verifyUser, adminOrPerlengkapan, addBatchAlat);
router.delete(
  "/batchAlats/:id",
  verifyUser,
  adminOrPerlengkapan,
  deleteBatchAlat
);

export default router;
