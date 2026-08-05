const Card = require('../models/card');

const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;
const ERROR_BAD_REQUEST = 400;
const ERROR_FORBIDDEN = 403;

const handleCardError = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(ERROR_BAD_REQUEST).json({ message: 'Invalid data provided' });
    return;
  }
  res.status(ERROR_SERVER).json({ message: 'An error has occurred on the server' });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch((err) => handleCardError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      handleCardError(err, res);
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).json({ message: 'Requested resource not found' });
        return;
      }

      if (card.owner.toString() !== req.user._id.toString()) {
        res.status(ERROR_FORBIDDEN).json({ message: 'You cannot delete another user\'s card' });
        return;
      }

      return card.deleteOne()
        .then(() => res.json({ message: 'Card deleted successfully' }))
        .catch((err) => handleCardError(err, res));
    })
    .catch((err) => handleCardError(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).json({ message: 'Requested resource not found' });
        return;
      }
      res.json(card);
    })
    .catch((err) => handleCardError(err, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).json({ message: 'Requested resource not found' });
        return;
      }
      res.json(card);
    })
    .catch((err) => handleCardError(err, res));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
