const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error500 = require('../errors/error500');
const NotAuthorized = require('../errors/not-authorized');
const { DEV_SECRET_KEY } = require('./../config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const userNoPassword = user.toObject();
      delete userNoPassword.password;
      res.send(userNoPassword);
    })
    .catch((err) => next(new Error500(err.message)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET_KEY, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => next(new NotAuthorized(err.message)));
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id, '-_id')
    .then((user) => { res.send(user); })
    .catch((err) => next(new Error500(err.message)));
};
