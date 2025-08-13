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
  })
  .unknown();
module.exports = envVarsSchema;
