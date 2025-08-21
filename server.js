// server.js
const express = require("express");
const userRoutes = require("./Route/user.route");
const questionRoutes = require("./Route/question.route");
const answerRoutes = require("./Route/answer.route");
const { errorHandler, errorConverter } = require("./middleware/error.handler");
const ApiError = require("./utils/ApiError");
const _httpStatus = require("http-status");
const httpStatus = _httpStatus.default || _httpStatus;
const morgan = require("./config/morgan");

const app = express();
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json());
// Mount routes (kept existing base paths to avoid breaking current clients)
app.use(userRoutes);
app.use(questionRoutes);
app.use(answerRoutes);

// Handle nonexistent routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Error converter & handler
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
