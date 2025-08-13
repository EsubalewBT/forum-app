const { findUserByEmail, createUser } = require("../Model/user.model");
const ApiError = require("../utils/ApiError");
const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email, userData.username);
  if (existingUser) {
    throw new ApiError(400, "Email or Username is already taken");
  }
  const userId = await createUser(userData);
  return userId;
};
module.exports = {
  registerUser,
};
