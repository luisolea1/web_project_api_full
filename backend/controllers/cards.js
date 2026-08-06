const Card = require('../models/card');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors');

const handleCardError = (err, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequestError('Invalid data provided'));
    return;
  }
  next(err);
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.json(cards))
  .catch((err) => handleCardError(err, next));

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      handleCardError(err, next);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Requested resource not found');
      }

      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You cannot delete another user\'s card');
      }

      return card.deleteOne()
        .then(() => res.json({ message: 'Card deleted successfully' }));
    })
    .catch((err) => handleCardError(err, next));
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Requested resource not found');
    }
    return res.json(card);
  })
  .catch((err) => handleCardError(err, next));

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Requested resource not found');
    }
    return res.json(card);
  })
  .catch((err) => handleCardError(err, next));

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
