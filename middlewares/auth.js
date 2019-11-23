const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/not-authorized');
const { DEV_SECRET_KEY } = require('./../config');
const { NOT_AUTORIZED } = require('../errors/error-text');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthorized(NOT_AUTORIZED));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET_KEY);
  } catch (err) {
    next(new NotAuthorized(NOT_AUTORIZED));
    return;
  }

  req.user = payload;
  next();
};
