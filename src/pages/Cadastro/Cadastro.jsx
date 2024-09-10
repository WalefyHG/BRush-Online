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
  confirm_email: "",
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

      if(currentStep === 0 ){
        if(data.user_name.length < 3){
          Toast.fire({
            icon: 'error',
            title: 'Nome deve ter no mínimo 3 caracteres!'
          })
          return false;
        }

        if(data.user_lastName.length < 3){
          Toast.fire({
            icon: 'error',
            title: 'Sobrenome deve ter no mínimo 3 caracteres!'
          })
          return false;
        }

        if(data.user_birthday === ""){
          Toast.fire({
            icon: 'error',
            title: 'Data de nascimento é obrigatória!'
          })
          return false;
        }

        if(data.user_birthday.length < 10){
          Toast.fire({
            icon: 'error',
            title: 'Data de nascimento inválida!'
          })
          return false;
        }	

        if(data.user_birthday.length > 10){
          Toast.fire({
            icon: 'error',
            title: 'Data de nascimento inválida!'
          })
          return false;
        }

        const date = new Date(data.user_birthday)
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if(year < 1900){
          Toast.fire({
            icon: 'error',
            title: 'Ano inválido!'
          })
          return false;
        }

        if(year > new Date().getFullYear()){
          Toast.fire({
            icon: 'error',
            title: 'Ano inválido!'
          })
          return false;
        }

        if(month < 1 || month > 12){
          Toast.fire({
            icon: 'error',
            title: 'Mês inválido!'
          })
          return false;
        }

        if(day < 1 || day > 31){
          Toast.fire({
            icon: 'error',
            title: 'Dia inválido!'
          })
          return false;
        }



        

      }

      if(currentStep === 1 ){
        
        if(!data.image){
          Toast.fire({
            icon: 'error',
            title: 'Imagem é obrigatória!'
          })
          return false;
        }

        const maxSizeInMB = 9;
        const maxSize = maxSizeInMB * 1024 * 1024;

        if(data.image.size > maxSize){
          Toast.fire({
            icon: 'error',
            title: `Imagem deve ter no máximo ${maxSizeInMB}MB!`
          })
          return false;
        }

        if(!data.user_email){
          Toast.fire({
            icon: 'error',
            title: 'Email é obrigatório!'
          })
          return false;
        }

        if(data.user_email.indexOf('@') === -1 || data.user_email.indexOf('.') === -1){
          Toast.fire({
            icon: 'error',
            title: 'Email inválido!'
          })
          return false;

        }

        if(data.user_email !== data.confirm_email){
          Toast.fire({
            icon: 'error',
            title: 'Emails não conferem!'
          })
          return false;
        }

        if(data.confirm_email.indexOf('@') === -1 || data.confirm_email.indexOf('.') === -1){
          Toast.fire({
            icon: 'error',
            title: 'Email inválido!'
          })
          return false;
        }

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
