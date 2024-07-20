import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkOldPassword,
} from "../controllers/UserController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyUser, adminOnly, getUserById);
router.post("/users", verifyUser, adminOnly, createUser);
router.post("/users/check-password", verifyUser, adminOnly, checkOldPassword);
router.patch("/users/:id", verifyUser, adminOnly, updateUser);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);

export default router;
