import React from "react";
import classes from "./RedefinirSenha.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";



const RedefinirSenha = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/getAllPublic`)
                setUsuarios(response.data);
            }catch(err){
                console.log(err)
            }
        }

        fetchData();

    }, [])


    const handleEmail = async (e) => {
        e.preventDefault();
        const user_email = email;
        
        if(user_email === ''){
            alert('Digite um email válido')
            return;
        }

        const user = usuarios.find(user => user.user_email === user_email);

        if(user){
            try{
                await axios.post(`${import.meta.env.VITE_API_URL}/login/password-reset-request?user_email=${encodeURIComponent(user_email)}`,)
                navigate('/reedemCode', {state: {user_email}})
            }catch(err){
                console.log(err)
            }
        }
        
    }
    

  return (
    <div className={classes.mainContainer}>
          <div className={classes.formContainer}>
            <img src="./FaviconLight.png" alt="logo" />
            <p className={classes.formTitle}>Digite seu email para redefinir a senha</p>
            <form>
              <input type="email" id="email" name="user_email" onChange={(e) => setEmail(e.target.value)} placeholder='Digite seu email' required />
              <div className={classes.buttons}>
              <a type="button" onClick={() => navigate("/")} id={classes.cancelar}>
                Voltar
              </a>
              <button type="submit" onClick={handleEmail} id={classes.enviar}>
                Enviar
              </button>
            </div>
            </form>
          </div>
    </div>
  );
}


export default RedefinirSenha;