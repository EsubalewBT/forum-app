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
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = new Set(
        [
          process.env.FRONTEND_URL,
          "http://localhost:5173",
          "http://localhost:5174",
        ].filter(Boolean)
      );
      if (!origin || allowed.has(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
