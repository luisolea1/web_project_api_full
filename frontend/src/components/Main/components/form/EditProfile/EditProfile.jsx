import { useState, useContext } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

export default function EditProfile() {
  const { currentUser, handleUpdateUser} = useContext(CurrentUserContext);

  // ✅ Inicializar directamente con los valores de currentUser
  const [name, setName] = useState(currentUser?.name || "");
  const [description, setDescription] = useState(currentUser?.about || "");

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="popup__form"
      name="edit-profile"
      id="edit-profile-form"
      noValidate
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_name"
          id="profile-name-input"
          maxLength="40"
          minLength="2"
          name="name"
          placeholder="Nombre"
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="popup__error" id="profile-name-input-error"></span>
      </label>

      <label className="popup__field">
        <input
          className="popup__input popup__input_type_description"
          id="profile-description-input"
          maxLength="200"
          minLength="2"
          name="about"
          placeholder="Acerca de mí"
          required
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <span className="popup__error" id="profile-description-input-error"></span>
      </label>

      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
  }