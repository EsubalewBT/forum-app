const db = require("../config/db");

// Create a new question
const createQuestion = async (userId, title, description, tag) => {
  const [result] = await db.query(
    "INSERT INTO questions (userid, title, description, tag) VALUES (?, ?, ?, ?)",
    [userId, title, description, tag]
  );
  return result.insertId;
};

// Get all questions
const getAllQuestions = async () => {
  const [rows] = await db.query(
    "SELECT * FROM questions ORDER BY created_at DESC"
  );
  return rows;
};

// Get a single question by ID
const getQuestionById = async (id) => {
  const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [id]);
  return rows[0];
};

// Delete a question
const deleteQuestion = async (id, userId) => {
  const [result] = await db.query(
    "DELETE FROM questions WHERE id = ? AND userid = ?",
    [id, userId]
  );
  return result.affectedRows;
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestion,
};
