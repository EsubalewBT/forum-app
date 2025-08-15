const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/user.controller");
const {
  createUserSchema,
  loginSchema,
} = require("../validation/user.validation");
const validate = require("../middleware/validate");

router.post("/register", validate(createUserSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
