import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/SupplierController.js";
import { verifyUser, adminOrPerlengkapan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/suppliers", verifyUser, adminOrPerlengkapan, getSuppliers);
router.get("/suppliers/:id", verifyUser, adminOrPerlengkapan, getSupplierById);
router.post("/suppliers", verifyUser, adminOrPerlengkapan, createSupplier);
router.patch("/suppliers/:id", verifyUser, adminOrPerlengkapan, updateSupplier);
router.delete(
  "/suppliers/:id",
  verifyUser,
  adminOrPerlengkapan,
  deleteSupplier
);

export default router;
