import express from "express";
import {
  getBatchAlats,
  createBatchAlat,
  deleteBatchAlat,
} from "../controllers/BatchAlatController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/alats", verifyUser, getBatchAlats);
router.post("/alats", verifyUser, createBatchAlat);
router.delete("/alats/:id", verifyUser, deleteBatchAlat);

export default router;
