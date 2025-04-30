import { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  OutlinedInput as Input,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { styles } from "./../../assets/styles/checkout/login.styles";
import {
  googleLogin,
  is_user_registered,
  is_email_registered,
  login,
} from "./../../util/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoggedUser from "./login/loggedUserCard";
import Register from "./../../components/checkout/login/register";
import { Rings } from "react-loader-spinner";
export default function Login({ handleNext, handleBack, handleLoggedIn }) {
  const classes = styles();
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [register, setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [password, setPassword] = useState("");
  const [isGoogle, setIsGoogle] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const checkForm = () => {
    var found = false;
    if (!email) {
      found = true;
      setErrors({ ...errors, [email]: "Este campo é obrigatório" });
    }
    if (!password) {
      found = true;
      setErrors({ ...errors, [password]: "Este campo é obrigatório" });
    }
    return found;
  };
  const _login = () => {
    if (!checkForm()) {
      setLoading(true);
      is_email_registered(email)
        .then((res) => {
          if (res[0].uid) {
            login(email, password)
              .then((res) => {
                setLoading(false);
                handleLoggedIn(true);
                setLoggedIn(true);
                handleNext();
              })
              .catch((e) => {
                setLoading(false);

                alert("erro no login");
              });
          } else {
            setLoading(false);
            alert("usuário não registrado");
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        if (_user.providerData[0].providerId === "google.com") {
          setIsGoogle(true);
        }
        is_user_registered(_user.uid)
          .then((res) => {
            handleLoggedIn(true);
            setIsRegistered(true);
          })
          .catch((e) => {
            setIsRegistered(false);
          });
        setUser(_user);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, [loggedIn]);
  return (
    <>
      <div className={classes.login_component_wrapper}>
        <Typography variant="h4">Login</Typography>

        {!register ? (
          <>
            {!user ? (
              <>
                {" "}
                <div className={classes.login_component_input_wrapper}>
                  <FormControl
                    className={classes.login_component_input}
                    error={errors.email}
                  >
                    <Input
                      variant="outlined"
                      placeholder="E-mail"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <FormHelperText>{errors.email}</FormHelperText>
                  </FormControl>
                  <FormControl
                    className={classes.login_component_input}
                    error={errors.password}
                  >
                    <Input
                      type="password"
                      placeholder="Senha"
                      variant="outlined"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <FormHelperText>{errors.password}</FormHelperText>
                  </FormControl>
                  <div style={{  cursor: "pointer", marginBottom:"10px" }}>
                    <Typography
                      onClick={() => setRegister(true)}
                      variant="body2"
                      color="primary.opaque_black"
                    >
                      Registre-se aqui
                    </Typography>
                  </div>
                  <br />
                  {loading ? (
                    <Rings
                      height="80"
                      width="80"
                      color="#ff5a23"
                      radius="6"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="rings-loading"
                    />
                  ) : (
                    <button
                      onClick={() => _login()}
                      className={classes.login_component_login_button}
                    >
                      <Typography variant="body2">Login</Typography>
                    </button>
                  )}
                </div>
                <div className={classes.login_component_or_wrapper}>
                  <div />
                  <Typography color="primary.light_gray" variant="body2">
                    OU
                  </Typography>
                  <div />
                </div>
                <div className={classes.login_component_or_wrapper}>
                  <button
                    onClick={() =>
                      googleLogin().then((result) => {
                        handleLoggedIn(true);
                        // handleNext();
                      })
                    }
                    className={classes.google_login_component_or_wrapper}
                  >
                    <img alt="" src="./../../public/google.png" />
                    <Typography color="primary.light_gray" variant="body2">
                      Login com google
                    </Typography>
                  </button>
                </div>
              </>
            ) : !isRegistered ? (
              <Register
                isGoogle={isGoogle}
                goBack={() => handleBack()}
                handleNext={() => handleNext()}
                logged={true}
                user={user}
              />
            ) : (
              <LoggedUser
                handleLoggedIn={(value) => handleLoggedIn(value)}
                signed_out={() => setLoggedIn(false)}
                user={user}
              />
            )}{" "}
          </>
        ) : (
          <Register
            goBack={() => setRegister(false)}
            isGoogle={false}
            handleNext={() => handleNext()}
            logged={false}
          />
        )}
      </div>
    </>
  );
}
