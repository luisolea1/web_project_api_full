import { useState } from "react";
import { Link } from "react-router-dom";
import Vector__Header from "../../images/Vector__Header.svg";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin(email, password);
  };

  return (
    <>
      <header className="auth__header">
        <img
          src={Vector__Header}
          alt="Around the U.S."
          className="auth__logo-image"
        />

        <Link className="auth__header-link" to="/signup">
          Regístrate
        </Link>
      </header>

      <section className="auth">
        <h2 className="auth__title">Inicia sesión</h2>

        <form className="auth__form" onSubmit={handleSubmit}>

          <input
            className="auth__input"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth__input"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          

          <button type="submit" className="auth__submit">
            Iniciar sesión
          </button>
        </form>

        <p className="auth__redirect">
          ¿Aún no eres miembro?{" "}
          <Link
            className="auth__link"
            to="/signup">
            Regístrate aquí
          </Link>
        </p>
      </section>
    </>
  );
}

export default Login;