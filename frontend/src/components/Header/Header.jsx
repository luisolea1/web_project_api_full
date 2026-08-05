
import Vector__Header from "../../images/Vector__Header.svg"


function Header({ email, onSignOut }) {
    return (

        <header className="header">

        <img
        src={Vector__Header} 
        alt="Around the U.S." 
        className="header__image"
        />


        <div className="header__user">
        <span className="header__email">{email}</span>

        <button
        className="header__logout"
        type="button"
        onClick={onSignOut}
        >
        Cerrar sesión
        </button>
    </div>

    </header>
    );
}

export default Header;