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

// Compatibility: GET /answers?questionId= and POST /answers { questionId, answer }
const listAnswersRoot = catchAsync(async (req, res) => {
  const qid = Number(req.query.questionId || req.query.qid || req.query.id);
  if (!qid)
    throw new ApiError(httpStatus.BAD_REQUEST, "questionId is required");
  const answers = await answerService.getAnswersByQuestionId(qid);
  res.json({ count: answers.length, items: answers });
});

const createAnswerRoot = catchAsync(async (req, res) => {
  const userId = req.userId;
  if (!userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
  const qid = Number(
    req.body.questionId || req.body.questionid || req.body.qid
  );
  const ans = req.body.answer || req.body.content;
  if (!qid)
    throw new ApiError(httpStatus.BAD_REQUEST, "questionId is required");
  if (!ans) throw new ApiError(httpStatus.BAD_REQUEST, "answer is required");
  const created = await answerService.createAnswer(userId, qid, ans);
  res
    .status(httpStatus.CREATED)
    .json({ message: "Answer created", answer: created });
});

module.exports = {
  createAnswer,
  listAnswers,
  deleteAnswer,
  listAnswersRoot,
  createAnswerRoot,
};
