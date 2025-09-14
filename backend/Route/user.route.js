const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controller/user.controller");
const {
  createUserSchema,
  loginSchema,
} = require("../validation/user.validation");
const validate = require("../middleware/validate");

router.post("/register", validate(createUserSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
