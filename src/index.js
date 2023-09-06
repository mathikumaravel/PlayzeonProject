const pgp = require('pg-promise')();
const socketio = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const db = pgp(config.postgres.url);
const logger = require('./config/logger');
const http = require('http').Server(app);
let server;

db.connect()
  .then(obj => {
    logger.info('Connected to PostgreSQL');

    const socket = socketio().listen(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
    });
    global.io = socket;
    global.io.on('connection', webSockets.connection);

    server = http.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });

    obj.done(); // Release the connection back to the pool when done
  })
  .catch(error => {
    logger.error('Error connecting to PostgreSQL:', error);
  });

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