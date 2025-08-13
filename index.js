const http = require("http");
const config = require("./config/config");
const { createtable } = require("./Model/database.tabel");
const app = require("./server");
const httpServer = http.createServer(app);
const logger = require("./config/logger");

const server = httpServer.listen(config.PORT, async () => {
  logger.info(`Server running on http://localhost:${config.PORT}`);
  await createtable();
});

// Exit handler
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Unexpected error handler
const unExpectedErrorHandler = (error) => {
  logger.error("Unexpected error:", error);
  exitHandler();
};

process.on("uncaughtException", unExpectedErrorHandler);
process.on("unhandledRejection", unExpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
