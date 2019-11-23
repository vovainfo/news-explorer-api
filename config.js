const DEV_SECRET_KEY = 'dev-secret-key';
const DEV_MONGO_SERVER = 'mongodb://localhost:27017/newsdb';
const DEF_PORT = 3000;
const LOG_REQUEST = 'request.log';
const LOG_ERROR = 'error.log';
const RATELIMIT_WINDOW = 15 * 60 * 1000;
const RATELIMIT_MAX = 100;


module.exports = {
  // eslint-disable-next-line max-len
  DEV_SECRET_KEY, DEV_MONGO_SERVER, DEF_PORT, LOG_REQUEST, LOG_ERROR, RATELIMIT_WINDOW, RATELIMIT_MAX,
};
