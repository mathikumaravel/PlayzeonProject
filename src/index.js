const sequelize = require("./config/dbconfig");
const app = require("./app");
const logger = require("./config/logger");
const http = require("http").Server(app);
 
let server;
sequelize.sync().then(() => {
  logger.info("Connected to POSTSQL");
  server = http.listen(3000, () => {
    logger.info(`Listening to port ${3000}`);
  });
});
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
 
const unexpectedErrorHandler = (error) => {
  console.log(error);
  logger.error(error);
  exitHandler();
};
 
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
 
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});