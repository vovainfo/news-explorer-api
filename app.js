const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

require('dotenv').config();

const {
  MONGO_SERVER, DEF_PORT, RATELIMIT_WINDOW, RATELIMIT_MAX,
} = require('./config');
const { SERVER_ERROR, ERROR_404 } = require('./error-text');


const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({ windowMs: RATELIMIT_WINDOW, max: RATELIMIT_MAX }); // 100 за 15 минут


// Слушаем 3000 порт
const { PORT = DEF_PORT } = process.env;

const app = express();

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_SERVER, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(requestLogger);

/*
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
*/

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser);


app.use(auth);

app.use('/articles', articlesRouter);
app.use('/users', usersRouter);

app.use(errors()); // обработчик ошибок celebrate
app.use(errorLogger);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    // eslint-disable-next-line no-unneeded-ternary
    .send({ message: (message ? message : SERVER_ERROR) });
});
app.use('*', (req, res) => res.status(404).send({ message: ERROR_404 }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
