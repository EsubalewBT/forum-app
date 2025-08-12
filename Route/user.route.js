const express = require("express");
const router = express.Router();
const { register } = require("../controller/user.controller");
const { createUserSchema } = require("../validation/user.validation");
const validate = require("../middleware/validate");

router.post("/register", validate(createUserSchema), register);

module.exports = router;
