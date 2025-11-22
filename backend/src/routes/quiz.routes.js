import { Router } from "express";
import {
  listQuestions,
  createQuestion,
  deleteQuestion,
  saveResult,    
  getMyHistory,  
  getLeaderboard  
} from "../controllers/quiz.controller.js";

const router = Router();

router.get("/", listQuestions);
router.post("/", createQuestion);
router.delete("/:id", deleteQuestion);

router.post("/result", saveResult);    
router.get("/history", getMyHistory);   
router.get("/leaderboard", getLeaderboard); 

export default router;