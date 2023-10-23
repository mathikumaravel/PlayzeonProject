const { Sequelize } = require('sequelize');
const logger = require('./config/logger');
const config = require('./config/config');
const app =require('./app')
const {PORT}= require('./config/config');


global.sequelize = new Sequelize('postgres','postgres', 'Password@11', {
  host: 'localhost',
  dialect: 'postgres',
  port: '5432',
  schema:'playzeon'
});

let server;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

(async () => {
  try {
    app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
    try {
      await sequelize.authenticate();
      logger.info('Connection has been established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      exitHandler();
    }
  } catch (err) {
    logger.error(err);
  }
})();
