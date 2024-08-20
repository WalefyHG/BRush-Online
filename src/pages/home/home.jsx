import classes from "./Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loggedIn, setLoggedIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    const savedEmail = Cookies.get("user_email");
    if(savedEmail){
      reset({user_email: savedEmail});
      setRememberMe(true);
    }
  }, [reset])


  const onSubmit = async (data) => {
    const formsData = {
      user_email: data.user_email,
      password: data.password,
    };

    let loadingToast;



    try {
      
      loadingToast = Toast.fire({
        title: "Carregando...",
        icon: "info",
        timer: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/login`,
        formsData
      );
      
      console.log(response.data)

      if (response.status === 200) {
        const token = response.data.access;
        Cookies.set("token", token);

        if(rememberMe){
          Cookies.set("user_email", data.user_email, {expires: 30});
        }else{
          Cookies.remove("user_email");
        }


        if (response.data.mensagem === "Logado com sucesso") {
          setLoggedIn(true);
          navigate("/hub");
        } 
        reset();
      }


    } catch (error) {
      console.log(error);
      if(error.response){
        if (error.response.status === 401) {
          Toast.fire({
            icon: "error",
            title: "Email ou senha incorretos",
          })
        }
        if(error.response.status === 404){
          Toast.fire({
            icon: "error",
            title: "Usuario não encontrado",
          })
        }
        
        if(error.response.status === 500){
          Toast.fire({
            icon: "error",
            title: "Erro interno do servidor",
          })
        }
      }
      
    }finally{
      if(loadingToast){
        loadingToast.close()
      }
    }
  };
  return (
    <>
      <div className={classes.mainContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.forms}>
          <img src="/FaviconLight.png" alt="B-Rush" id={classes.icon} />
          <input
            type="text"
            name="user_email"
            {...register("user_email", { required: true })}
            className={classes.inputText}
            placeholder="Email"
          />
          {errors.username && <p>{errors.username.message}</p>}
          <br />
          <input
            type="password"
            name="password"
            {...register("password", { required: true })}
            className={classes.inputText}
            placeholder="Senha"
          />
          {errors.password && <p>{errors.password.message}</p>}
          <br />
          <div className={classes.sideButtons}>
            <a
              href="/cadastro"
              className={classes.button}
              id={classes.cancelar}
            >
              Criar Conta
            </a>
            <button className={classes.button}>Entrar</button>
          </div>
          <div className={classes.select}>
            <input type="checkbox" name="lembrar" id={classes.lembrar} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="lembrar">Lembrar-me</label>
          </div>
          <div className={classes.select}>
            <p id={classes.esqueceu}>
              Esqueceu sua senha?{" "}
              <a href="#">Clique aqui para recuperar senha</a>
            </p>
          </div>
        </form>
        {loggedIn && <Navigate to="/perfil" />}
      </div>
    </>
  );
};

export default home;
