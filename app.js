const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

require('dotenv').config();

const {
  DEV_MONGO_SERVER, DEF_PORT, RATELIMIT_WINDOW, RATELIMIT_MAX,
} = require('./config');
const { SERVER_ERROR, ERROR_404 } = require('./errors/error-text');
const Error404 = require('./errors/error404');


const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({ windowMs: RATELIMIT_WINDOW, max: RATELIMIT_MAX }); // 100 за 15 минут


// Слушаем 3000 порт
const { PORT = DEF_PORT, MONGO_SERVER, NODE_ENV } = process.env;

const app = express();

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? MONGO_SERVER : DEV_MONGO_SERVER, {
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


app.use('*', (req, res, next) => next(new Error404(ERROR_404)));

app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500, нет мессаджа - ставим дефолтный
  const { statusCode = 500, message = SERVER_ERROR } = err;
  res
    .status(statusCode)
    .send({ message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
