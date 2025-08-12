const Joi = require("joi");

const createUserSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  }),
};

module.exports = { createUserSchema };
