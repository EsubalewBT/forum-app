const mysql2 = require("mysql2/promise");
const config = require("./config");

const connection = mysql2.createPool({
  host: "localhost",
  user: config.user,
  password: config.password,
  database: config.database,
});

module.exports = connection;
