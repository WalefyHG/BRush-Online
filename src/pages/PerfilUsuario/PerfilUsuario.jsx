import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaEnvelope,
  FaUserCircle,
  FaKeyboard,
  FaTrophy,
  FaVideo,
  FaArrowCircleRight,
  FaUserPlus,
  FaUserCheck,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import classes from "./PerfilUsuario.module.css";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import FriendShipModal from "../../components/FriendShipModal/FriendShipModal";

const Perfil = () => {
  const [perfilData, setPerfilData] = useState(undefined);
  const [usuarioLogado, setUsuarioLogado] = useState(undefined);
  const { user_name } = useParams();
  const navigate = useNavigate();
  const [status, setFriendStatus] = useState(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    background: "#555",
    color: "#fff",
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/perfil/${user_name}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setPerfilData(response.data);
          setFriendStatus(response.data.friendship_status);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/perfil`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUsuarioLogado(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleSendFriendRequest = async () => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/friendship/send_request/${
            perfilData.id
          }`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (
          response.data.mensagem ==
          "Solicitação de amizade enviada com sucesso."
        ) {
          Toast.fire({
            icon: "success",
            title: "Solicitação de amizade enviada com sucesso!",
          });
          setTimeout(() => {
            navigate("/hub");
          }, 2000);

          setFriendStatus("pending");
        }
      } catch (e) {
        if (
          e.response.data.detail ==
          "Você não pode enviar solicitação de amizade para si mesmo."
        ) {
          Toast.fire({
            icon: "error",
            title: "Você não pode enviar solicitação de amizade para si mesmo.",
          });
        }
        if (e.response.data.detail == "Solicitação de amizade já enviada.") {
          Toast.fire({
            icon: "error",
            title: "Solicitação de amizade já enviada.",
          });
        }
        console.log(e);
      }
    }
  };

  const handleOpenFriendModal = () => {
    setShowFriendModal(true);
  };

  const handleCloseFriendModal = () => {
    setShowFriendModal(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleDeleteFriendship = async () => {
    const token = Cookies.get("token");

    Swal.fire({
      title: "Tem certeza que deseja deletar sua amizade?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (token) {
          try {
            const response = axios.delete(
              `${import.meta.env.VITE_API_URL}/friendship/delete_friendship`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Toast.fire({
              icon: "success",
              title: "Amizade deletada com sucesso!",
            });

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: "Erro ao deletar amizade!",
            });
            console.log(error);
          }
        }
      }
    });
  };

  const openSocialMediaLink = (link) => {
    if (link) {
      const formattedLink = /^https?:\/\//i.test(link)
        ? link
        : `http://${link}`;
      window.open(formattedLink, "_blank");
    }
  };

  const formatData = (perfil) => {
    const data = perfil;
    const dataFormatada = data.split("T")[0].split("-").reverse().join("/");
    return dataFormatada;
  };

  const idade = (perfil) => {
    const data = perfil;
    const dataFormatada = data.split("T")[0].split("-").reverse().join("/");
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const anoNascimento = dataFormatada.split("/")[2];
    const idade = anoAtual - anoNascimento;
    return idade;
  };

  const isCurrentUser = perfilData?.id === usuarioLogado?.id;

  if (!perfilData) {
    return <Loading />;
  }

  return (
    <div className={classes.mainContainer}>
      <NavBar user={usuarioLogado} />
      <main className={classes.main}>
        <section>
          <div className={classes.bannerContainer}>
            <div className={classes.imgbanner}>
              {perfilData.user_banner ? (
                <img
                  src={`${perfilData.user_banner}`}
                  className={classes.bannerimg}
                />
              ) : (
                <img
                  src={"./Perfil/banner2.png"}
                  className={classes.bannerimg}
                />
              )}
            </div>
            <div className={classes.profileImage}>
              <img
                src={`${perfilData.user_image} `}
                id={classes.profile2}
                alt="Icone de Perfil"
              />
              <a href="#" className={classes.iconCsgo}>
                {perfilData.user_games === "CS:GO" && (
                  <img
                    src="./4737387_counter strike_cs_csgo_games_gaming_icon.svg"
                    alt="Counter-Strike icon"
                  />
                )}
                {perfilData.user_games === "Valorant" && (
                  <img src="./download.jpg" alt="Valorant icon" />
                )}
                {perfilData.user_games === "League of Legends" && (
                  <img
                    src="./lol-league-of-Legends-logo-5.png"
                    alt="League Of Legends icon"
                  />
                )}
              </a>
              <div className={classes.card}>
                <h1>{perfilData.user_name}</h1>
                <h2>
                  <img
                    src="./Perfil/logo.png"
                    className={classes.imm}
                    alt="Logo"
                  />{" "}
                  Imperial Sports
                </h2>
              </div>
            </div>
            <div className={classes.socialMedias}>
              <ul>
                <li>
                  <div>
                    {!isCurrentUser && (
                      <>
                        {status === null && (
                          <button
                            onClick={handleSendFriendRequest}
                            className={classes.amigo_button}
                          >
                            <FaUserPlus /> Adicionar Amigo
                          </button>
                        )}

                        {status === "pending" && (
                          <button
                            className={classes.amigo_button}
                            id={classes.solicitacao_button}
                            onClick={handleOpenFriendModal}
                          >
                            <IoMdSend /> Solicitação pendente
                          </button>
                        )}

                        {status === "accepted" && (
                          <button
                            className={classes.amigo_button}
                            id={classes.amigos_button}
                            onClick={handleDeleteFriendship}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {isHovering ? <FaRegTrashAlt /> : <FaUserCheck />}
                            {isHovering ? "Deixar de seguir" : "Amigos"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </li>
                <li>
                  <a
                    onClick={() =>
                      openSocialMediaLink(perfilData.user_instagram)
                    }
                  >
                    <img src="./logos/instagram.png" alt="Instagram" />
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => openSocialMediaLink(perfilData.user_twitter)}
                  >
                    <img src="./logos/twitter.png" alt="Twitter" />
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => openSocialMediaLink(perfilData.user_twitch)}
                  >
                    <img src="./logos/twitch.png" alt="Twitch" />
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => openSocialMediaLink(perfilData.user_youtube)}
                  >
                    <img src="./logos/youtube.png" alt="Youtube" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className={classes.sidebar}>
          <div className={classes.infoPlayerContainer}>
            <div className={classes.profilePicture}>
              <img
                src={`${perfilData.user_image}`}
                alt="Banner"
                id={classes.fallen}
              />
            </div>
            <div className={classes.text}>
              <h2>Usuario: {perfilData.user_name}</h2>
              <h2>Game: {perfilData.user_games}</h2>
              <h2>
                Data de Nascimento: {formatData(perfilData.user_birthday)}
              </h2>
              <h2>Nacionalidade: {perfilData.user_pais}</h2>
              <h2>Idade: {idade(perfilData.user_birthday)} anos </h2>
              {perfilData.is_confirmed ? (
                <h2>Status: Ativa</h2>
              ) : (
                <h2>Status: Inativa</h2>
              )}
            </div>
          </div>
        </section>
      </main>

      <FriendShipModal
        show={showFriendModal}
        onClose={handleCloseFriendModal}
      />

      <Footer />
    </div>
  );
};

export default Perfil;
