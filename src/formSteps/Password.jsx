
import classes from "./Upload.module.css";

const Password = ({ data, updateFieldHandler }) => {



  return (
    <div className={`${classes.formControl}`}>
      <label htmlFor="">Senha</label>
      <input
        type="password"
        name="password"
        value={data.password || ""}
        onChange={(e) => updateFieldHandler("password", e.target.value)}
        placeholder="Digite sua senha"
      />
      <label htmlFor="">Confirme sua Senha</label>
      <input type="password" name="confirm_password" placeholder="Confirme sua senha" onChange={(e) => updateFieldHandler("confirm_password", e.target.value)} />
    </div>
  );
};

export default Password;
