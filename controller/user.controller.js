const { registerUser } = require("../service/user.service");

const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
};
