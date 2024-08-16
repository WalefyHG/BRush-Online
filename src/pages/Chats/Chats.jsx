import React, { useState, useEffect, useRef } from "react";
// import EmojiPicker from "emoji-picker-react";
import Picker from "@emoji-mart/react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Container,
  Card,
  Form,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import data from "@emoji-mart/data"


import style from "./Chats.module.css";

function Chats({roomName, selectUser}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const token = Cookies.get("token");
  const [currentUser, setCurrentUser] = useState(null);
  const ws = useRef(null);
  const typingTimeout = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectionUser, setSelectionUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.startsWith("https://") ? apiUrl.slice(8) : apiUrl;

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/messages`, {
        params: { room_name: roomName },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const messages = response.data;

      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectUser = async () =>{
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/usuario/${parseInt(selectUser)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectionUser(response.data);


    }catch(e){
      console.log(e);
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setCurrentUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    fetchCurrentUser();

  }, [token]);

  useEffect(() => {
    if (currentUser) {
      fetchMessages();
      fetchSelectUser();
      ws.current = new WebSocket(
        `wss://${import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '')}/ws/chat/${roomName}/?user_id=${currentUser.id}`
      );

      ws.current.onopen = () => {
        console.log("Websocket connected");
      };

      ws.current.onmessage = (e) => {
        const message = JSON.parse(e.data);
        console.log("Received message:", message);
        if (message.type === "previous_messages") {
          const unreadMsgsCount = message.messages.filter(
            (msg) => !msg.read
          ).length;
          setMessages(message.messages);
          setUnreadCount(unreadMsgsCount);
        } else if (message.type === "typing") {
          setTypingUsers((prev) => [...prev, message.username]);
        } else if (message.type === "stop_typing") {
          setTypingUsers((prev) =>
            prev.filter((username) => username !== message.username)
          );
        } else if (message.type === "mark_as_read") {
          const { message_id } = message;
          console.log(`Marking message ${message_id} as read`);
          setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                  msg.id === message.message_id ? { ...msg, read: true } : msg
              )
          );
      } else {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      ws.current.onclose = () => {
        console.log("Websocket closed");
      };

      ws.current.onerror = (e) => {
        console.error(e);
      };

      return () => {
        ws.current.close();
      };
    }
  }, [roomName, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        type: "message",
        message: newMessage,
        sender_id: currentUser.id,
      };

      ws.current.send(JSON.stringify(messageData));
      setNewMessage("");
      handleStopTyping();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    } else {
      ws.current.send(JSON.stringify({ type: "typing" }));
    }

    typingTimeout.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
    ws.current.send(JSON.stringify({ type: "stop_typing" }));
  };

  const handleMarkAsRead = (messageId) => {
    if (ws.current) {
        const id = parseInt(messageId, 10);
        if (Number.isInteger(id)) {
            ws.current.send(JSON.stringify({
                type: 'mark_as_read',
                message_id: id
            }));
        }
    }
};

const handleMarkAllAsRead = () => {
  messages
    .filter((msg) => !msg.read)
    .forEach((msg) => handleMarkAsRead(msg.id));
  setUnreadCount(0);
};

useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);


const onEmojiSelect = (emoji) => {
  setNewMessage((prevMessage) => prevMessage + emoji.native);
};

  if (loading) {
    return (
      <Container>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className={style.chat} id="chat">
      <div className={style.chatHeader} id="chatHeader">
        <img src={`${baseUrl}${selectionUser.user_image}`} className={style.chatFoto} id="chatFoto" alt="Foto de Perfil" />
        <p className={style.chatNome} id="chatNome">{selectionUser.user_name}</p>
      </div>
      <div className={style.chatMensagens} id="chatMensagens" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${style.message} ${msg.username === currentUser.user_name ? style.sent : style.received}`}
            onClick={() => handleMarkAsRead(msg.id)}
          >
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {typingUsers.length > 0 && (
        <p className={style.typing}>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'estão' : 'está'} digitando...</p>
      )}
      <div className={style.chatInput}>
      <button className={style.emojiButton} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😀
        </button>
        {showEmojiPicker && (
          <div className={style.emojiPicker}>
            <Picker data={data} onEmojiSelect={onEmojiSelect} />
          </div>
        )}
        <input
          type="text"
          className={style.mensagemInput}
          placeholder="Escreva algo..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onFocus={() => {handleMarkAllAsRead()}}
        />
        <button className={style.sendMessage} onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chats;
