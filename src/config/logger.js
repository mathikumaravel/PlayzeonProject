const winston = require('winston');
const LogzioWinstonTransport = require('winston-logzio');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logzioWinstonTransport = new LogzioWinstonTransport({
  name: 'playzeon',
  host: config.logzio.host,
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development'
      ? winston.format.colorize({
          level: true,
          colors: { info: 'blue', error: 'red' },
        })
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    logzioWinstonTransport,
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
