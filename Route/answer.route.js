const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createAnswer,
  listAnswers,
  deleteAnswer,
} = require("../controller/answer.controller");

// Answers related routes
router.post("/questions/:questionId/answers", auth, createAnswer);
router.get("/questions/:questionId/answers", listAnswers);
router.delete("/answers/:id", auth, deleteAnswer);

module.exports = router;
