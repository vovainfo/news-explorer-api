const usersRouter = require('express').Router();
const {
  getUserMe,
} = require('../controllers/users');

usersRouter.get('/me', getUserMe);


module.exports = usersRouter;
