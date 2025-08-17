const {
  findUserByEmailandUsername,
  createUser,
  findUserByEmail,
} = require("../Model/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./token.service");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const cleanUser = require("../utils/cleanUser");

// Register a new user and issue initial token pair
const registerUser = async (userData) => {
  // check if user already exists
  const existingUser = await findUserByEmailandUsername(
    userData.email,
    userData.username
  );
  if (existingUser) {
    throw new ApiError(400, "Email or Username is already taken");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  // save user
  const userId = await createUser(userData);

  // generate tokens
  const access = generateAccessToken(userId);
  const refresh = await generateRefreshToken(userId);

  const savedUser = { userid: userId, ...userData };

  return {
    user: cleanUser(savedUser),
    tokens: {
      access,
      refresh,
    },
  };
};

// Authenticate user credentials and issue new token pair
const loginUser = async (email, password) => {
  // find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // generate tokens
  const access = generateAccessToken(user.userid);
  const refresh = await generateRefreshToken(user.userid);

  return { user: cleanUser(user), tokens: { access, refresh } };
};

module.exports = {
  registerUser,
  loginUser,
};
