const {
  createAnswer: createAnswerModel,
  getAnswersByQuestionId: getAnswersByQuestionIdModel,
  deleteAnswer: deleteAnswerModel,
} = require("../Model/answer.model");
const ApiError = require("../utils/ApiError");

// Create an answer
const createAnswer = async (userId, questionId, answer) => {
  if (!userId) throw new ApiError(400, "userId required");
  if (!questionId) throw new ApiError(400, "questionId required");
  if (!answer || !answer.trim())
    throw new ApiError(400, "Answer cannot be empty");
  const id = await createAnswerModel(userId, questionId, answer.trim());
  return { id, questionId, userId, answer: answer.trim() };
};

// List answers for a question (optionally could paginate later)
const getAnswersByQuestionId = async (questionId) => {
  if (!questionId) throw new ApiError(400, "questionId required");
  return await getAnswersByQuestionIdModel(questionId);
};

// Delete an answer (ensures ownership in model layer)
const deleteAnswer = async (id, userId) => {
  if (!id) throw new ApiError(400, "answer id required");
  if (!userId) throw new ApiError(400, "userId required");
  const affected = await deleteAnswerModel(id, userId);
  if (!affected) throw new ApiError(404, "Answer not found or not authorized");
  return true;
};

module.exports = { createAnswer, getAnswersByQuestionId, deleteAnswer };
