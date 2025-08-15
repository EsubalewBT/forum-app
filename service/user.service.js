const { findUserByEmail, createUser } = require("../Model/user.model");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email, userData.username);
  if (existingUser) {
    throw new ApiError(400, "Email or Username is already taken");
  }
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);
  const userId = await createUser(userData);
  return userId;
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
