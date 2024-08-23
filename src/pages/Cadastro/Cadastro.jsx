import React, {useState} from "react";
import classes from "./Cadastro.module.css";
import Name  from "../../formSteps/Name";
import Upload  from "../../formSteps/Upload";
import Password from "../../formSteps/Password";
import Games from "../../formSteps/Games";
import {
  FaChevronRight,
  FaChevronLeft
} from "react-icons/fa";
import { RiSendPlane2Fill } from "react-icons/ri";
import Steps from "../../formSteps/Steps";
import { useForm } from "react-hook-form";
import { useForm as FormsData} from "../../hooks/useForm";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const formsTemplate = {
  user_name: "", 
  user_lastName: "",
  user_birthday: "",
  user_email: "",
  password: "",
  confirm_password: "",
  user_firstName: "",
  user_idioma: "Português",
  user_games: "CS:GO",
  user_pais: "Brasil",
  tipo: "atleta",
  is_confirmed: false,
}

const Cadastro = () => {

  const { register, handleSubmit, reset } = useForm();
  const [data, setData] = useState(formsTemplate);
  const [response, setResponse] = useState(null);
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
  })

  const updateFieldHandler = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const formsComponents = [
  <Name data={data} updateFieldHandler={updateFieldHandler} />, 
  <Upload data={data} updateFieldHandler={updateFieldHandler} />, 
  <Password data={data} updateFieldHandler={updateFieldHandler} />,
  <Games data={data} updateFieldHandler={updateFieldHandler} />]

  const {currentStep, currentComponent, changeSteps, isLastStep, isFirstStep} = FormsData(formsComponents);



    const validadeFields = () => {
      if(currentStep === 0 && (!data.user_name || !data.user_lastName)){
        Toast.fire({
          icon: 'error',
          title: 'Nome e Sobrenome são obrigatórios!'
        })
        return false;
      }

      if(currentStep === 2){
        if(data.password !== data.confirm_password){
          Toast.fire({
            icon: 'error',
            title: 'Senhas não conferem!'
          })
          return false;
        }

        if(data.password.length < 8){
          Toast.fire({
            icon: 'error',
            title: 'Senha deve ter no mínimo 8 caracteres!'
          })
          return false;
        }
      }
      return true;
    }



  const handleFormSubmission = (e) => {
    e.preventDefault(); // Impede que o formulário seja enviado prematuramente
  
    if(!validadeFields()) return;


    if (!isLastStep) {
      // Se não for a última etapa, avance para a próxima etapa
      changeSteps(currentStep + 1);
    } else {
      // Se for a última etapa, envie o formulário
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async () =>{
    const formData = new FormData();
    const dataImagem = data.image
    delete data.image
    formData.append('user', JSON.stringify(data));
    formData.append("image", dataImagem);

    let loadingToast;

    try{

      loadingToast = Toast.fire({
        title: "Carregando...",
        icon: "info",
        timer: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })


      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/criando`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      

      if(response.status === 200){
        Toast.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!'
        })
        setTimeout(() => {
          navigate('/notification')
        }, 3000)
        reset();
      }
      }
    catch(error){
        if(error.response.data.detail === "Email já cadastrado"){
          Toast.fire({
            icon: 'error',
            title: 'Email já cadastrado!'
          })
          changeSteps(1);
        }
        else{
          Toast.fire({
            icon: 'error',
            title: 'Nome de usuário já cadastrado!'
          })
          changeSteps(0);
        }
      }finally{
        if(loadingToast){
          loadingToast.close();
        }
      }
  }

  return (
    <>
      <div className={classes.mainContainer}>
        <div className={classes.container}>
          <div className={classes.formContainer}>
          <div className={classes.header}>
            <img src="./FaviconLight.png" alt="" />
            <p>Faça Aqui o Seu Cadastro no B-Rush</p>
          </div>
            <Steps currentStep={currentStep} />
            <form onSubmit={handleFormSubmission}>
              <div className={classes.inputsContainer}>{currentComponent}</div>
              <div className={classes.action}>
                {!isFirstStep && (
                  <button type="button" onClick={() => changeSteps(currentStep - 1)}>
                  <FaChevronLeft />
                  <span>Voltar</span>
                  </button>
                )}
                {!isLastStep ? (
                    <button type="submit">
                    <span>Avançar</span>
                    <FaChevronRight />
                    </button>
                ) : (
                  <button type="submit">
                  <span>Enviar</span>
                  <RiSendPlane2Fill />
                  </button>
                )}
              </div>
            </form>

          </div>


        </div>

      </div>
    </>
  );
};

export default Cadastro;
