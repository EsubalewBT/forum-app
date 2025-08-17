const db = require("../config/db");

// Save a hashed refresh token in DB
const saveToken = async (userId, hashedToken, expires) => {
  await db.query(
    `INSERT INTO tokens (user_id, token, expires) VALUES (?, ?, ?)`,
    [userId, hashedToken, expires]
  );
};

// Find token row (hashed) - caller will compare hash with candidate
const findToken = async (hashedToken) => {
  const [rows] = await db.query(`SELECT * FROM tokens WHERE token = ?`, [
    hashedToken,
  ]);
  return rows[0];
};

// Delete token by hashed value (logout or rotation)
const deleteToken = async (hashedToken) => {
  await db.query(`DELETE FROM tokens WHERE token = ?`, [hashedToken]);
};

module.exports = {
  saveToken,
  findToken,
  deleteToken,
};
