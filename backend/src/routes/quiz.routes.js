import { Router } from "express";
import {
  listQuestions,
  createQuestion,
  deleteQuestion,
} from "../controllers/quiz.controller.js";

const router = Router();

// Định nghĩa các route cho quiz
router.get("/", listQuestions);
router.post("/", createQuestion);
router.delete("/:id", deleteQuestion);

export default router;