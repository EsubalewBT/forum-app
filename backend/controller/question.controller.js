const questionService = require("../service/quest.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const _httpStatus = require("http-status");
const httpStatus = _httpStatus.default || _httpStatus;

// POST /questions
const createQuestion = catchAsync(async (req, res) => {
  const { title, description, tag } = req.body;
  const userId = req.userId; // set by auth middleware
  if (!userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
  const questionId = await questionService.createQuestion(
    userId,
    title,
    description,
    tag
  );
  res
    .status(httpStatus.CREATED)
    .json({ message: "Question created", questionId });
});

// GET /questions (list or search by title, optional partial + pagination)
const listQuestions = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, title, partial } = req.query;
  if (title) {
    const result = await questionService.getQuestion({
      title,
      options: { partial: partial === "true" },
    });
    if (Array.isArray(result))
      return res.json({ count: result.length, items: result });
    return res.json({ item: result });
  }
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const all = await questionService.getAllQuestions();
  const start = (p - 1) * l;
  const items = all.slice(start, start + l);
  res.json({ page: p, limit: l, total: all.length, items });
});

// GET /questions/:id
const getQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Question id required");
  const question = await questionService.getQuestion({ id: Number(id) });
  res.json({ item: question });
});

// DELETE /questions/:id
const deleteQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
  await questionService.deleteQuestion(Number(id), userId);
  res.json({ message: "Question deleted" });
});

module.exports = { createQuestion, listQuestions, getQuestion, deleteQuestion };
