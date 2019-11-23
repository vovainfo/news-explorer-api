const Article = require('../models/article');
const Error500 = require('../errors/error500');
const Error404 = require('../errors/error404');
const { ERROR_404_ARTICLE } = require('../errors/error-text');

module.exports.getAllArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.postArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.delArticle = (req, res, next) => {
  Article.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
    .then((article) => {
      if (!article) {
        next(new Error404(ERROR_404_ARTICLE));
      } else res.send(article);
    })
    .catch((err) => next(new Error500(err.message)));
};
