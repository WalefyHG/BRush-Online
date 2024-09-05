import classes from './TesteForm.module.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const TesteForm = () => {

  const navigate = useNavigate();

  return (
    <div className={classes.mainContainer}>
          <div className={classes.formContainer}>
            <img src="./FaviconLight.png" alt="logo" />
            <p className={classes.formTitle}>Digite seu email para redefinir a senha</p>
            <form>
              <input type="email" id="email" name="email" placeholder='Digite seu email' required />
              <div className={classes.buttons}>
              <a type="button" onClick={() => navigate("/")} id={classes.cancelar}>
                Voltar
              </a>
              <button type="submit" id={classes.enviar}>
                Enviar
              </button>
            </div>
            </form>
          </div>
    </div>
  );
}

export default TesteForm
