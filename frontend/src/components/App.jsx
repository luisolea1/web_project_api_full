import { useState, useEffect } from "react";
import '../index.css';
import Header from "./Header/Header"
import Main from "./Main/Main"
import Footer from "./Footer/Footer"

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Login from "./Login/Login";
import Register from "./Register/Register";

import api from "../utils/api";
import CurrentUserContext from '../contexts/CurrentUserContext';

import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

import { register, login, checkToken } from "../utils/auth";

import InfoTooltip from "./InfoTooltip/InfoTooltip";


function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [popup, setPopup] = useState(null); 
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [infoTooltipMessage, setInfoTooltipMessage] = useState("");

  useEffect(() => {
    if (!loggedIn) {
      setCurrentUser(null);
      setCards([]);
      return;
    }

    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setEmail(userData.email);
        setCards(cardsData.map((card) => ({
          ...card,
          likes: card.likes || [],
          isLiked: (card.likes || []).some((like) => {
            const likeId = typeof like === "string" ? like : like._id;
            return likeId === userData._id;
          }),
        })));
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("jwt");
        setLoggedIn(false);
      });
  }, [loggedIn]);


  const handleOpenPopup = (popupData) => {
    setPopup(popupData);
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  const handleCardLike = (card) => {
    const newIsLiked = !card.isLiked;

    api.changeLikeCardStatus(card._id, newIsLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) =>
            c._id === card._id
              ? { ...newCard, isLiked: newIsLiked } 
              : c
          )
        );
      })
      .catch(console.error);
  };


  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => c._id !== card._id)
        );
      })
      .catch((err) => console.error(err));
  };


  const handleAddPlaceSubmit = (cardData) => {
    api.addNewCard(cardData)
      .then((newCard) => {
        setCards((state) => [{ ...newCard, isLiked: false }, ...state]);
        handleClosePopup(); 
      })
      .catch(console.error);
  };

  const handleUpdateUser = (data) => {
    api.setUserInfo(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        handleClosePopup();
      })
      .catch(console.error);
  };

  const handleUpdateAvatar = (data) => {
    api.setAvatarInfo(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        handleClosePopup();
      })
      .catch(console.error);
  };

const handleRegister = (email, password) => {
  register(email, password)
    .then((data) => {
      setIsSuccess(true);
      setInfoTooltipMessage("¡Correcto! Ya estás registrado.");
      setIsInfoTooltipOpen(true);

      navigate("/signin");
    })
    .catch((err) => {
      console.error(err);

      setIsSuccess(false);
      setInfoTooltipMessage(
        "Por favor, inténtalo de nuevo."
      );
      setIsInfoTooltipOpen(true);
    });
};

const handleCloseInfoTooltip = () => {
  setIsInfoTooltipOpen(false);
};

const handleLogin = (email, password) => {
  login(email, password)
    .then((data) => {
      localStorage.setItem("jwt", data.token);

      setLoggedIn(true);
      setEmail(email);

      navigate("/");
    })
    .catch((err) => {
      console.error("err", err);

      localStorage.removeItem("jwt");
      setLoggedIn(false);
      setEmail("");

      setIsSuccess(false);
      setInfoTooltipMessage("Correo o contraseña incorrectos.");
      setIsInfoTooltipOpen(true);
    });
};

const handleSignOut = () => {
  localStorage.removeItem("jwt");

  setLoggedIn(false);
  setEmail("");

  navigate("/signin");
};

useEffect(() => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    setIsCheckingToken(false);
    return;
  }

checkToken(token)
    .then((data) => {
    setLoggedIn(true);
    setCurrentUser(data);
    setEmail(data.email);
  })
    .catch((err) => {
      console.error(err);
      localStorage.removeItem("jwt");
      setLoggedIn(false);
      setEmail("");
    })
  .finally(() => {
      setIsCheckingToken(false);
    });
}, []);
  

  return (
  <CurrentUserContext.Provider
    value={{
      currentUser,
      setCurrentUser,
      handleUpdateUser,
      handleUpdateAvatar,
      handleAddPlaceSubmit,
      handleOpenPopup,
      handleClosePopup,
      cards,
    }}
  >
    <Routes>
      <Route
        path="/"
        element={
            <ProtectedRoute 
              loggedIn={loggedIn}
              isCheckingToken={isCheckingToken}>
            
            
            <div className="page">
              
            <Header 
              email={email}
              onSignOut={handleSignOut}
            />


            <Main
              popup={popup}
              onOpenPopup={handleOpenPopup}
              onClosePopup={handleClosePopup}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />


            <Footer />
          </div>
          </ProtectedRoute>
        }
      />

      <Route path="/signin" 
      element={<Login onLogin={handleLogin} />} />

      <Route path="/signup" element={<Register onRegister={handleRegister} />} />

      <Route
    path="*"
    element={
      isCheckingToken ? null : loggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <Navigate to="/signin" replace />
      )
    }
  />

    </Routes>

<InfoTooltip
  isOpen={isInfoTooltipOpen}
  isSuccess={isSuccess}
  message={infoTooltipMessage}
  onClose={handleCloseInfoTooltip}
/>

  </CurrentUserContext.Provider>
);
}

export default App
