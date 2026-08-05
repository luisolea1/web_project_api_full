import { useRef } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

export default function EditAvatar({ onUpdateAvatar }) {
  const avatarInputRef = useRef(null); // ✅ Crear ref para el input

  function handleSubmit(e) {
    e.preventDefault();

    // ✅ Obtener el valor usando la ref
    onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });

    // ✅ Limpiar el input
    avatarInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="popup__form"
      name="edit-avatar"
      id="edit-avatar-form"
      noValidate
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_avatar"
          id="profile-avatar-input"
          name="avatar"
          placeholder="URL de la imagen"
          required
          type="url"
          ref={avatarInputRef} // ✅ Conectar la ref
        />
        <span className="popup__error" id="profile-avatar-input-error"></span>
      </label>

      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
}