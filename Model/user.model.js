const db = require("../config/db");

const findUserByEmailandUsername = async (email, username) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, username]
  );
  return rows[0];
};
const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
const createUser = async (userData) => {
  const { username, email, password, firstname, lastname } = userData;
  const [result] = await db.query(
    "INSERT INTO users (username, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)",
    [username, email, password, firstname, lastname]
  );
  return result.insertId;
};
module.exports = {
  findUserByEmailandUsername,
  findUserByEmail,
  createUser,
};
