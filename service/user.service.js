const { findUserByEmail, createUser } = require("../Model/user.model");

const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email, userData.username);
  if (existingUser) {
    throw new Error("User already exists");
  }
  const userId = await createUser(userData);
  return userId;
};
module.exports = {
  registerUser,
};
