// server.js
const express = require("express");
const Router = require("./Route/user.route");
const { errorHandler, errorConverter } = require("./middleware/error.handler");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");
const morgan = require("./config/morgan");

const app = express();
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json());
app.use(Router);

// Handle nonexistent routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Error converter & handler
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
