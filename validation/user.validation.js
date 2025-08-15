const Joi = require("joi");
const { password } = require("./custom.validation");
const createUserSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).custom(password).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  }),
};
const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { createUserSchema, loginSchema };
