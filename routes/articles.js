const { celebrate, Joi } = require('celebrate');
const articlesRouter = require('express').Router();
const {
  getAllArticles, postArticle, delArticle,
} = require('../controllers/articles');


articlesRouter.get('/', getAllArticles);
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }),
}), postArticle);

articlesRouter.delete('/:id', delArticle);

module.exports = articlesRouter;
