const express = require("express");
const app = express();
const config = require("./config/config");
const { createtable } = require("./Model/database.tabel");
const Router = require("./Route/user.route");
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("Welcome to the My Forum App!");
});
app.use(Router);

app.listen(config.PORT, async () => {
  console.log(` Server is running on http://localhost:${config.PORT}`);
  await createtable();
});
