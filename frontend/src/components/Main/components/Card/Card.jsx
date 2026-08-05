import { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import ImagePopup from "../ImagePopup/ImagePopup"; 

export default function Card(props) {

const { card, handleOpenPopup, onCardLike, onCardDelete } = props;
const { currentUser } = useContext(CurrentUserContext);
const { name, link } = card;

function handleLikeClick() {
    onCardLike(card);
}

function handleDeleteClick() {
    onCardDelete(card);
}

const imageComponent = {
    children: <ImagePopup card={card} />
};

const isLiked = card.isLiked;
const ownerId = typeof card.owner === "string" ? card.owner : card.owner?._id;
const isOwn = ownerId === currentUser?._id;

const cardLikeButtonClassName = `card__like-button ${
isLiked ? "card__like-button_is-active" : ""
}`;

return (
    <li className="card">

    <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => handleOpenPopup(imageComponent)}
    />

    {isOwn && (
      <button
          aria-label="Delete card"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
      />
    )}

    <div className="card__description">
        <h2 className="card__title">{name}</h2>

    <button
        aria-label="Like card"
        type="button"
        className={cardLikeButtonClassName}
        onClick={handleLikeClick}
        />
    </div>

    </li>
);
}
