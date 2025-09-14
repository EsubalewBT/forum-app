const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createAnswer,
  listAnswers,
  deleteAnswer,
  createAnswerRoot,
  listAnswersRoot,
} = require("../controller/answer.controller");

// Answers related routes
router.post("/questions/:questionId/answers", auth, createAnswer);
router.get("/questions/:questionId/answers", listAnswers);
router.delete("/answers/:id", auth, deleteAnswer);

// Backward/compatibility routes
router.get("/answers", listAnswersRoot);
router.post("/answers", auth, createAnswerRoot);

module.exports = router;
