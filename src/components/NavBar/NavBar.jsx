import classes from "./NavBar.module.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaDoorOpen, FaRegNewspaper } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const NavBar = ({ user }) => {
  const [user_firstName, setUserFirstName] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              src="/FaviconLight.png"
              id={classes.logoBrush}
              alt="Logo B-Rush"
            />
            <input
              type="text"
              id={classes.texto}
              value={user_firstName}
              name="user_firstName"
              onChange={(e) => setUserFirstName(e.target.value)}
              placeholder="Pesquise Aqui"
            />
            <button type="submit" onClick={handleSearch} id={classes.pesquisa}>
              Search
            </button>
          </div>
          <div className={classes.links}>
            <ul className={classes.link}>
              <li ref={modalRef}>
                <a onClick={handleModal}>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.user_image}`}
                    id={classes.profile}
                    alt="Icone de Perfil"
                  />
                  <p>{user.user_firstName}</p>
                </a>
                {isModalOpen && (
                  <div className={classes.modal}>
                    <div className={classes.conteudo}>
                      <button onClick={() => navigate("/perfil")}>
                        <IoPersonCircle /> Perfil
                      </button>
                      <button onClick={() => navigate("/chat")}>
                        <FaUserFriends /> Amigos
                      </button>
                      <button onClick={() => navigate("/hub")}>
                        <FaRegNewspaper /> Hub
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
      </nav>
    </div>
    )
  );
};

export default NavBar;
