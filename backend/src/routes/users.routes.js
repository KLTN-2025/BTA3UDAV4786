import express from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;