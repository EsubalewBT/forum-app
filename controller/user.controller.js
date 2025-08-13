const { registerUser } = require("../service/user.service");
const catchAsync = require("../utils/catchAsync");
const register = catchAsync(async (req, res) => {
  const newUser = await registerUser(req.body);
  res.status(201).json({ message: "User registered successfully" });
});

module.exports = {
  register,
};
