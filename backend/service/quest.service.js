const {
  createQuestion: createQuestionModel,
  getAllQuestions: getAllQuestionsModel,
  getQuestion: getQuestionByIdModel,
  deleteQuestion: deleteQuestionModel,
  findQuestionsByTitle,
} = require("../Model/question.model");
const ApiError = require("../utils/ApiError");

// Create a question
const createQuestion = async (userId, title, description, tag) => {
  if (!title || !description)
    throw new ApiError(400, "Title and description are required");
  return await createQuestionModel(
    userId,
    title.trim(),
    description.trim(),
    tag || null
  );
};

// List all questions
const getAllQuestions = async () => getAllQuestionsModel();

const getQuestion = async (params = {}) => {
  const { id, title, options = {} } = params;
  if (!id && !title) throw new ApiError(400, "Provide id or title");

  if (id) {
    const q = await getQuestionByIdModel(id);
    if (!q) throw new ApiError(404, `Question not found with id: ${id}`);
    return q;
  }

  const partial = Boolean(options.partial);
  const search = title.trim();
  if (!search) throw new ApiError(400, "Title cannot be empty");

  const result = await findQuestionsByTitle(search, partial);
  if (partial) {
    if (!result.length)
      throw new ApiError(404, `No questions match "${search}"`);
    return result; // array
  }
  if (!result)
    throw new ApiError(404, `Question not found with title: "${search}"`);
  return result; // single object
};

// Delete question (ensures ownership by userId)
const deleteQuestion = async (id, userId) => {
  const affected = await deleteQuestionModel(id, userId);
  if (!affected)
    throw new ApiError(404, "Question not found or not authorized");
  return true;
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestion,
  deleteQuestion,
};
