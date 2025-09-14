const db = require("../config/db");

// Create a new answer
const createAnswer = async (userId, questionId, answer) => {
  const [result] = await db.query(
    "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
    [userId, questionId, answer]
  );
  return result.insertId;
};

// Get all answers for a specific question
const getAnswersByQuestionId = async (questionId) => {
  const [rows] = await db.query(
    "SELECT * FROM answers WHERE questionid = ? ORDER BY id ASC",
    [questionId]
  );
  return rows;
};

// Delete an answer
const deleteAnswer = async (id, userId) => {
  const [result] = await db.query(
    "DELETE FROM answers WHERE id = ? AND userid = ?",
    [id, userId]
  );
  return result.affectedRows;
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
};
