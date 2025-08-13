require("dotenv").config();
const envVarsSchema = require("../validation/env.validation");
const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(` config validation error: ${error.message}`);
}

module.exports = {
  user: envVars.user,
  password: envVars.password,
  database: envVars.database,
  PORT: envVars.PORT,
  env: envVars.NODE_ENV,
};
