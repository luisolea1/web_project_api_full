import { useState } from "react";
import { Link } from "react-router-dom";
import Vector__Header from "../../images/Vector__Header.svg";

function Register({ onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
    e.preventDefault();

    onRegister(email, password);
};

    return (
        <>
            <header className="auth__header">
                <img
                    src={Vector__Header}
                    alt="Around the U.S."
                    className="auth__logo-image"
                />

                <Link className="auth__header-link" to="/signin">
                    Inicia sesión
                </Link>
            </header>

            <section className="auth">
                <h2 className="auth__title">Regístrate</h2>

        <form className="auth__form" onSubmit={handleSubmit}>
            <input
            type="email"
            className="auth__input"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <input
            type="password"
            className="auth__input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <button type="submit" className="auth__submit">
            Registrarse
            </button>
        </form>

        <p className="auth__redirect">
            ¿Ya eres miembro?{" "}
            <Link to="/signin" className="auth__link">
            Inicia sesión aquí
            </Link>
        </p>
        </section>
        </>
    );
}

export default Register;