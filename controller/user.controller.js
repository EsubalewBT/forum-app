const { registerUser, loginUser } = require("../service/user.service");
const catchAsync = require("../utils/catchAsync");
const register = catchAsync(async (req, res) => {
  const newUser = await registerUser(req.body);
  res.status(201).json({ message: "User registered successfully" });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  res.status(200).json({ message: "User logged in successfully", user });
});

module.exports = {
  register,
  login,
};
