import classes from "./NavBar.module.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaDoorOpen, FaRegNewspaper } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FaRocketchat } from "react-icons/fa6";
import FriendShipModal from "../FriendShipModal/FriendShipModal";

const NavBar = ({ user }) => {
  const [user_firstName, setUserFirstName] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const modalRef = useRef();

  const handleLogout = () => {
    // Limpe os cookies e tokens
    Cookies.remove("token");

    // Redirecione o usuário para a página de login (ou qualquer outra página desejada)
    navigate("/");
  };

  const handleSearch = () => {
    navigate(`/pesquisar/${user_firstName}`);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleCloseModalNavBar = () => {
    setModalShow(true);
    setIsModalOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        isModalOpen
      ) {
        handleCloseModal();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      // Remova o ouvinte de clique ao desmontar o componente
      document.removeEventListener("click", handleClickOutside);
    };
  }, [!isModalOpen]);

  return (
    {user} && (
      <div>
      <nav>
        <div className={classes.navContainer}>
          <div className={classes.search}>
            <img
              src="./FaviconLight.png"
              id={classes.logoBrush}
              alt="Logo B-Rush"
            />
            <input
              type="text"
              id={classes.texto}
              value={user_firstName}
              name="user_firstName"
              onChange={(e) => setUserFirstName(e.target.value)}
              placeholder="Pesquise Aqui Pelo Nome "
            />
            <button type="submit" onClick={handleSearch} id={classes.pesquisa}>
              Pesquisar
            </button>
          </div>
          <div className={classes.links}>
            <ul className={classes.link}>
              <li ref={modalRef}>
                <a onClick={handleModal}>
                  <img
                    src={user?.user_image ? `${user.user_image}` : "./Perfil/logo.png"}
                    id={classes.profile}
                    alt="Icone de Perfil"
                  />
                  <p>{user?.user_firstName}</p>
                </a>
                {isModalOpen && (
                  <div className={classes.modal}>
                    <div className={classes.conteudo}>
                      <button onClick={() => navigate("/perfil")}>
                        <IoPersonCircle /> Perfil
                      </button>
                      <button onClick={handleCloseModalNavBar}>
                        <FaUserFriends /> Amigos
                      </button>
                      <button onClick={() => navigate("/chat")}>
                        <FaRocketchat /> Chat
                      </button>
                      <button onClick={() => navigate("/hub")}>
                        <FaRegNewspaper /> Hub
                      </button>
                      <button id={classes.config} onClick={() => navigate("/config")}>
                        <IoIosSettings id={classes.svgConfig} />Configu-
                        rações
                      </button>
                      <button id={classes.logout} onClick={handleLogout}>
                        <FaDoorOpen /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <FriendShipModal show={modalShow} onClose={() => setModalShow(false)} />

      </nav>
    </div>
    )
  );
};

export default NavBar;
