const joi = require("joi");
const envVarsSchema = joi
  .object({
    user: joi.string().required(),
    password: joi.required(),
    database: joi.string().required(),
    PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid("development", "production")
      .default("development"),
    JWT_SECRET: joi.string().min(16).required(),
    JWT_REFRESH_SECRET: joi.string().min(16).required(),
    JWT_ISSUER: joi.string().default("my-forum-app"),
    JWT_AUDIENCE: joi.string().default("my-forum-users"),
  })
  .unknown();
module.exports = envVarsSchema;
