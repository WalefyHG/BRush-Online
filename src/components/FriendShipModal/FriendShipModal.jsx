import React from "react";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./FriendShipModal.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const FriendShipModal = ({ show, onClose }) => {

  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();
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
    if (show) {
      const fetchFriendData = async () => {
        const token = Cookies.get("token");

        if (token) {
          try {
            // Buscar amigos aceitos
            const friendsResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/friendship/accepted_friends`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setAcceptedFriends(friendsResponse.data);
            console.log(friendsResponse.data)

            // Buscar solicitações pendentes
            const requestsResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/friendship/pending_requests`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setPendingRequests(requestsResponse.data);
            console.log(requestsResponse.data);
          } catch (error) {
            console.error("Erro ao buscar dados de amizade:", error);
          }
        }
      };

      fetchFriendData();
    }
  }, [show]);

  const handleAccept = async (friendship_id) => {
    const token = Cookies.get("token");
    console.log("Aceitando a solicitação com ID:", friendship_id);
    if (token) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/friendship/accept_request/${friendship_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Toast.fire({
          icon: "success",
          title: "Solicitação aceita com sucesso!",
        })

        setPendingRequests((requests) =>
          requests.filter((request) => request.id !== friendship_id)
        );
        onClose();

      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Erro ao aceitar solicitação!",
        })
        console.error("Erro ao aceitar solicitação:", error);
      }
    }
  };

  const handleReject = async (friendship_id) => {
    const token = Cookies.get("token");

    if (token) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/friendship/reject_request/${friendship_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Toast.fire({
          icon: "success",
          title: "Solicitação rejeitada com sucesso!",
        })

        setPendingRequests((requests) =>
          requests.filter((request) => request.id !== friendship_id)
        );

        onClose();

      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Erro ao rejeitar solicitação!",
        })
        console.error("Erro ao rejeitar solicitação:", error);
      }
    }
  };

  const handleDeleteFriendship = async () => {
    const token = Cookies.get("token");

    Swal.fire({
      title: 'Tem certeza que deseja deletar sua amizade?',
      text: "Você não poderá reverter essa ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(token){
          try{
            const response = axios.delete(`${import.meta.env.VITE_API_URL}/friendship/delete_friendship`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Toast.fire({
            icon: "success",
            title: "Amizade deletada com sucesso!",
          })

          setTimeout(() => {
            onClose();
            navigate('/hub');
          }, 2000);


        }catch(error){
          Toast.fire({
            icon: "error",
            title: "Erro ao deletar amizade!",
          })
          console.log(error)
        }
      }
    }
  });
};


  if (!show) {
    return null;
  }

  return (
    <div className={classes.modalBackground}>
            <div className={classes.modalContent}>
                <h2>Solicitações de Amizade</h2>
                <button className={classes.closeButton} onClick={onClose}>
                    X
                </button>
                <div>
                    <h3>Amigos Aceitos</h3>
                    {acceptedFriends.length > 0 ? (
                        <ul className={classes.friendRequestList}>
                            {acceptedFriends.map((friend) => (
                                <li key={friend.id} className={classes.friendRequestItem}>
                                    <div className={classes.userInfo}>
                                        <p><strong>Usuário:</strong> {friend.user_name}</p>
                                        <p><strong>Jogo Preferido:</strong> {friend.user_games}</p>
                                        <p><strong>Nacionalidade:</strong> {friend.user_pais}</p>
                                    </div>
                                    <button
                                            className={classes.deleteButton}
                                            onClick={handleDeleteFriendship}
                                        ><FaRegTrashAlt/></button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum amigo aceito.</p>
                    )}
                </div>
                <div>
                    <h3>Solicitações Pendentes</h3>
                    {pendingRequests.length > 0 ? (
                        <ul className={classes.friendRequestList}>
                            {pendingRequests.map((request) => (
                                <li key={request.id} className={classes.friendRequestItem}>
                                    <div className={classes.userInfo}>
                                        <p><strong>Usuário:</strong> {request.user_name}</p>
                                        <p><strong>Jogo Preferido:</strong> {request.user_games}</p>
                                        <p><strong>Nacionalidade:</strong> {request.user_pais}</p>
                                    </div>
                                    <div className={classes.actionButtons}>
                                        <button
                                            className={classes.acceptButton}
                                            onClick={() => handleAccept(request.id_friend)}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            className={classes.rejectButton}
                                            onClick={() => handleReject(request.id_friend)}
                                        >
                                            Rejeitar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhuma solicitação de amizade pendente.</p>
                    )}
                </div>
            </div>
        </div>
  );
};

export default FriendShipModal;
