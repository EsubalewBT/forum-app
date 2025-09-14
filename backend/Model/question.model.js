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
  // Order by created_at if present, otherwise fallback to id DESC
  const [rows] = await db.query("SELECT * FROM questions ORDER BY id DESC");
  return rows;
};

// Get a single question by ID
const getQuestion = async (id) => {
  const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [id]);
  return rows[0];
};

// Find (exact or partial) by title
// partial=false returns first exact match (or undefined); partial=true returns array (possibly empty)
const findQuestionsByTitle = async (title, partial = false) => {
  if (!title) return partial ? [] : undefined;
  const param = partial ? `%${title}%` : title;
  const sql = partial
    ? "SELECT * FROM questions WHERE title LIKE ? ORDER BY id DESC"
    : "SELECT * FROM questions WHERE title = ? ORDER BY id DESC";
  const [rows] = await db.query(sql, [param]);
  return partial ? rows : rows[0];
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
  getQuestion,
  deleteQuestion,
  findQuestionsByTitle,
};
