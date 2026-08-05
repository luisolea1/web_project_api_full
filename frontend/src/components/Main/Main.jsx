import { useContext } from "react";
import profile__photo from "../../images/profile__photo.jpg"
import Edit__Button from "../../images/Edit__Button.svg" 
import Popup from "./components/Popup/Popup";
import NewCard from "./components/form/NewCard/NewCard";
import EditProfile from "./components/form/EditProfile/EditProfile";
import EditAvatar from "./components/form/EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Main({ popup, onOpenPopup, onClosePopup, cards, onCardLike, onCardDelete }) { 

    const { currentUser, handleUpdateAvatar, handleAddPlaceSubmit } = useContext(CurrentUserContext);

    const newCardPopup = {
    title: "Nuevo Lugar",
    children: <NewCard onAddPlaceSubmit={handleAddPlaceSubmit} /> 
    };

    const editProfilePopup = {
    title: "Editar Perfil",
    children: <EditProfile />
    }; 

    const editAvatarPopup = {
    title: "Cambiar Foto de Perfil",
    children: <EditAvatar onUpdateAvatar={handleUpdateAvatar} /> 
    };

return (
    <main className="content">
    
        <section className="profile">
        <div className="profile__container-photo">
        <img 
        src={currentUser?.avatar || profile__photo}
        alt="profile photo" 
            className="profile__photo"
            />
            <button 
            className="profile__avatar-edit" 
            type="button"
            onClick={() => onOpenPopup(editAvatarPopup)}
            >
            </button>
        </div>

        <div className="profile__info">
            <h1 className="profile__title">{currentUser?.name || ""}</h1>
            <button 
            className="profile__button" 
            type="button"
            onClick={() => onOpenPopup(editProfilePopup)}
            >
            <img src={Edit__Button} 
                alt="Edit Button" 
                className="profile__button-edit"
            />
            </button>
            <h2 className="profile__subtitle">{currentUser?.about || ""}</h2>
        </div>

        <button 
            className="profile__button-add" 
            type="button"
            onClick={() => onOpenPopup(newCardPopup)}
        >
        </button>
        </section>

        <section className="elements">
        <ul className="cards__list">
            {cards.map((card) =>
            card._id ? (
                <Card
                key={card._id}
                card={card}
                handleOpenPopup={onOpenPopup}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
                />
            ) : null
            )}
        </ul>
        </section>
        
        {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
            {popup.children}
        </Popup>
        )}

    </main>
    );
}

export default Main;
