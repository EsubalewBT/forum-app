const answerService = require("../service/ans.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const _httpStatus = require("http-status");
const httpStatus = _httpStatus.default || _httpStatus;

// POST /questions/:questionId/answers
const createAnswer = catchAsync(async (req, res) => {
  const { questionId } = req.params;
  const { answer } = req.body;
  const userId = req.userId; // from auth middleware
  if (!userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
  const created = await answerService.createAnswer(
    userId,
    Number(questionId),
    answer
  );
  res
    .status(httpStatus.CREATED)
    .json({ message: "Answer created", answer: created });
});

// GET /questions/:questionId/answers
const listAnswers = catchAsync(async (req, res) => {
  const { questionId } = req.params;
  const answers = await answerService.getAnswersByQuestionId(
    Number(questionId)
  );
  res.json({ count: answers.length, items: answers });
});

// DELETE /answers/:id
const deleteAnswer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
  await answerService.deleteAnswer(Number(id), userId);
  res.json({ message: "Answer deleted" });
});

module.exports = { createAnswer, listAnswers, deleteAnswer };
