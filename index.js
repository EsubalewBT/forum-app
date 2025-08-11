const express = require("express");
const app = express();
const config = require("./config/config");
const { createtable } = require("./Model/database.tabel");
app.get("/", async (req, res) => {
  res.send("Welcome to the My Forum App!");
});

app.listen(config.PORT, async () => {
  console.log(` Server is running on http://localhost:${config.PORT}`);
  await createtable();
});
