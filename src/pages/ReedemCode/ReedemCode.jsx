import React from "react";
import { useState } from "react";
import axios from "axios";
import classes from "./ReedemCode.module.css";
import { useNavigate, useLocation } from "react-router-dom";


const ReedemCode = () => {
    const location = useLocation();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user_email } = location.state || {};
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('As senhas não coincidem')
            return;
        }

        try{
            await axios.post(`${import.meta.env.VITE_API_URL}/login/reset-password?user_email=${encodeURIComponent(user_email)}&code=${encodeURIComponent(code)}&new_password=${encodeURIComponent(password)}`,)
            navigate('/')
        }catch(e){
            console.log(e)
        }
    }

    return (
        <div className={classes.mainContainer}>
              <div className={classes.formContainer}>
                <img src="./FaviconLight.png" alt="logo" />
                <form>
                    <p className={classes.formTitle}>Seu Email: {user_email} </p>

                    <p className={classes.formTitle}>Digite o código que você recebeu no email</p> 
                    <input type="text" id="code" name="code" onChange={(e) => setCode(e.target.value)} placeholder='Digite o código' required />

                    <p className={classes.formTitle}>Digite sua nova senha</p>
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='Digite sua nova senha' required />

                    <p className={classes.formTitle}>Confirme sua nova senha</p>
                    <input type="password" id="password" name="confirm_password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirme sua nova senha' required />
                    
                    <div className={classes.buttons}>
                     <a type="button" onClick={() => navigate("/redefinirSenha")} id={classes.cancelar}>
                         Voltar
                    </a>
                    <button type="submit" onClick={handleSubmit} id={classes.enviar}>
                        Enviar
                    </button>
                    </div>

                </form>
              </div>
        </div>
      );
}

export default ReedemCode;