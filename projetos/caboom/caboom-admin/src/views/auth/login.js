import { useState } from "react";
import React from "react";
import logo from "./../../assets/img/main-logo.png";
import firebase from "./../../initFirebase";
import Loader from "react-loader-spinner";
import Snackbar from "components/Snackbar/Snackbar.js";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tr, setTR] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const login = async () => {
    setIsLoading(true);
    console.log("triggered")
    if (email === "" || password === "") {
      setMessage("Verifique o preenchimento dos campos");
      setSeverity("danger");
      setTimeout(function () {
        setTR(false);
      }, 6000);
      setIsLoading(false);
      return;
    }
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setMessage("Login efetuado com sucesso");
        setSeverity("success");
        setTimeout(function () {
          setTR(false);
        }, 6000);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        switch (e.code) {
          case "auth/user-not-found":
            setTR(true);
            setMessage("Usuário não encontrado");
            setSeverity("danger");
            setTimeout(function () {
              setTR(false);
            }, 6000);
            break;
          case "auth/wrong-password":
            setTR(true);
            setMessage("Senha incorreta");
            setSeverity("danger");
            setTimeout(function () {
              setTR(false);
            }, 6000);
            break;
          case "auth/invalid-email":
            setTR(true);
            setMessage("E-mail inválido");
            setSeverity("danger");
            setTimeout(function () {
              setTR(false);
            }, 6000);
            break;

          default:
            setMessage("Occoreu um erro, tente novamente");
            setSeverity("danger");
            setTimeout(function () {
              setTR(false);
            }, 6000);
            break;
        }
        setIsLoading(false);
      });
  };
  return (
    <>
      <Snackbar
        place="tr"
        color={severity}
        icon={severity !== "success" ? ErrorIcon : DoneIcon}
        message={message}
        open={tr}
        closeNotification={() => setTR(false)}
        close
      />
      <div className="login-page-wrapper">
        <div className="login-box-wrapper">
          <img src={logo} className="login-image" alt="" />
          <span className="login-input-label">E-mail</span>
          <input
          name="name"
            className="login-image-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="login-input-label">Senha</span>
          <input
          name="password"
          type="password"
            className="login-image-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLoading === true ? (
            <Loader
              type="MutatingDots"
              color="#fbcd00"
              secondaryColor="#F3F96E"
            />
          ) : (
            <button onClick={() => login()} className="login-submit-button">
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}
