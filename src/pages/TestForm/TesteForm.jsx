import classes from './TesteForm.module.css'
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const TesteForm = () => {

    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const token = Cookies.get("token");
    const socket = io("ws://localhost:8000", {
        auth: {
            token: `Bearer ${token}`,
        },
    });

  useEffect(() => {
    try{
      const response = axios.get(`${import.meta.env.VITE_API_URL}/chat/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.status === 200){
        setMessage(response.data);
      }

      socket.on("chat_message", (message) => {
        setMessage((prevMessage) => [...prevMessage, message]);
      });

    }catch(error){
      console.log(error);
    };

    return () => {
      socket.disconnect();
    };
  }, [token, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat_message", newMessage);
    setNewMessage('')
  }


  return (
    <div className={classes.mainContainer}>
      <h2>Chat</h2>
            <div>
                {message.map((msg, index) => (
                    <div key={index}>{msg.message}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
  )
}

export default TesteForm
