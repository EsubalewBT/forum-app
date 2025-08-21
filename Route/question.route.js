const express = require("express");
const router = express.Router();
const {
  createQuestion,
  listQuestions,
  getQuestion,
  deleteQuestion,
} = require("../controller/question.controller");
const auth = require("../middleware/auth");

// Routes for questions
router.post("/questions", auth, createQuestion); // create
router.get("/questions", listQuestions); // list or search
router.get("/questions/:id", getQuestion); // fetch by id
router.delete("/questions/:id", auth, deleteQuestion); // delete (auth required)

module.exports = router;
