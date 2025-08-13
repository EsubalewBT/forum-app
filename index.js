const express = require("express");
const app = express();
const config = require("./config/config");
const { createtable } = require("./Model/database.tabel");
const Router = require("./Route/user.route");
const { errorHandler } = require("./middleware/error.handler");
app.use(express.json());
app.use(Router);
app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(` Server is running on http://localhost:${config.PORT}`);
  await createtable();
});
