import React, { useState, useEffect } from "react";
import { useHistory, Link, Redirect } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import firebase from "./../../initfirebase";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import logo from "./../../assets/img/Logos/safira.png";
import capa from "./../../assets/videos/capa.mp4";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isloggedIn, setIsloggedIn] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const history = useHistory();
  const login = async () => {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false);
        history.push("/helpdesk/chamadosRecebidos");
      })
      .catch((e) => {
        setLoginError(true);
        setIsLoading(false);
        setTimeout(() => {
          setLoginError(false);
        }, 2000);
        console.log(e);
      });
  };
  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setIsFetching(false);
          setIsloggedIn(true);
          // User is signed in.
        } else {
          setIsFetching(false);
          setIsloggedIn(false);
          // No user is signed in.
        }
      }),
    []
  );
  return (
    <div className="wrap-home-page">
      <Snackbar
        open={loginError}
        autoHideDuration={2000}
        onClose={() => setLoginError(true)}
      >
        <Alert onClose={() => setLoginError(true)} severity="error">
          Email e/ou senha incorretos
        </Alert>
      </Snackbar>
      {isFetching === true ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ClipLoader color="#000000" size={45} />
        </div>
      ) : (
        <>
          {isloggedIn === true ? (
            <Redirect from="/auth/login" to="admin/dashboard" />
          ) : (
            <>
              <div className="flex-wrapper-div">
                <div className="flex-div-left">
                  <div className="div-image-wrapper">
                    <img src={logo} alt="" />
                  </div>
                  <label style={{ paddingLeft: 5 }}>E-mail</label>
                  <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    className="login-input"
                  />
                  <label style={{ paddingLeft: 5 }}>Senha</label>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="login-input"
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginTop: -10,
                      marginBottom: 30,
                    }}
                  >
                    <Link style={{ color: "grey" }} to="/auth/redefinir">
                      Esqueci a minha senha
                    </Link>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={() => login()} className="login-button">
                      Enviar
                      <>
                        {isLoading === true ? (
                          <div style={{ marginLeft: 7, marginRight: 7 }}>
                            <ClipLoader color="#FFFFFF" size={25} />
                          </div>
                        ) : null}
                      </>
                    </button>
                  </div>
                </div>
                <div className="flex-div-right">
                  <video  loop muted playsinline autoPlay >
                    <source
                      src={capa}
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
