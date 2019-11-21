const winston = require('winston');
const expressWinston = require('express-winston');
const { LOG_REQUEST, LOG_ERROR } = require('./../config');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: LOG_REQUEST }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: LOG_ERROR }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
