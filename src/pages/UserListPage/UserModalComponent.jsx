import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import style from "./UserModalComponent.module.css";
import Chats from "../Chats/Chats";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const UserModalComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [chatModal, setChatModal] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [selectUser, setSelectUser] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    const fetchUsers = async (currentUser) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/pegarAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Filtra os usuários, excluindo o usuário atual
        const filteredUsers = response.data.filter(
          (user) => user.id !== currentUser?.id
        );
        setUsers(filteredUsers);

        const unreadCounts = await Promise.all(
          filteredUsers.map(async (user) => {
            try {
              const unreadResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/read_count`,
                {
                  params: { user_id: user.id },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return { userId: user.id, count: unreadResponse.data.count };
            } catch (error) {
              console.error("Error fetching unread messages count:", error);
              return { userId: user.id, count: 0 };
            }
          })
        );

        const unreadCountsMap = unreadCounts.reduce((acc, curr) => {
          acc[curr.userId] = curr.count;
          return acc;
        }, {});

        setUnreadCounts(unreadCountsMap);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser().then((user) => {
      if (user) {
        fetchUsers(user);
      }
    });
  }, [token]);

  const handleSelectUser = (selectedUserId) => {
    if (!currentUser) return;
    setRoomName(`${[currentUser.id, selectedUserId].sort().join("_")}`);
    setChatModal(true);
    setSelectUser(selectedUserId);
  };

  return (
    <>
    {currentUser && <NavBar user={currentUser} />}
      <div className={style.mainContainer}>
        <div className={style.listaContatos}>
          {loading && <p>Carregando...</p>}
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className={style.contato}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className={style.foto}>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.user_image}`}
                    alt={user.name}
                    className={style.foto}
                  />
                </div>
                <div className={style.contatoInfo}>
                  <h2 className={style.nomeContato}>{user.user_name}</h2>
                  <p>{user.user_email}</p>
                </div>
                <div className={`${style.unreadCount} ${unreadCounts > 0 ? style.visible : ''}`}>
                  {unreadCounts[user.id] > 0 && (
                    <span>{unreadCounts[user.id]}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {chatModal && (
          <Chats roomName={roomName} selectUser={selectUser}/>
      )}
      </div>
      <Footer />
    </>
  );
};

export default UserModalComponent;