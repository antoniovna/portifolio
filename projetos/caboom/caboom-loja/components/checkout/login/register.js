import {
  Input,
  Typography,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { styles } from "./../../../assets/styles/checkout/login.styles";
import { sign_out, register, is_email_registered } from "../../../util/api";
import { useState } from "react";
import InputMask from "react-input-mask";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export default function LoggedUser({ user, isGoogle, handleNext, goBack }) {
  const [email, setEmail] = useState(user?.email ? user.email : "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setname] = useState(user?.displayName ? user.displayName : "");
  const [phone, setphone] = useState("");
  const [errors, seterrors] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    password2: "",
  });
  const classes = styles();
  const checkForm = () => {
    var entered = false;
    if (email === "") {
      console.log(1);
      entered = true;
      seterrors({
        ...errors,
        email: "Este campo é obrigatório",
      });
    }

    if (phone === "") {
      console.log(3);

      entered = true;
      seterrors({
        ...errors,
        phone: "Este campo é obrigatório",
      });
    }
    if (!isGoogle) {
      if (password === "") {
        console.log(4);

        entered = true;
        seterrors({
          ...errors,
          password: "Este campo é obrigatório",
        });
      }
      if (password2 === "") {
        console.log(5);

        entered = true;
        seterrors({
          ...errors,
          password2: "Este campo é obrigatório",
        });
      }
    }
    return entered;
  };
  const _register = () => {
    if (!checkForm()) {
      is_email_registered(email).then((res) => {
        if (res.length > 1) {
          var data = {
            active: true,
            email: email,
            name: name,
            photo: "",
            super: false,
            type: "Cliente",
            uid: user?.uid,
            phone: phone,
          };
          if (!user?.uid) {
            data.uid = "";
            data.password = password;
          }
          if (isGoogle) {
            data.provider = "google";
          }
          register(data).then(() => {
            handleNext();
          });
        } else {
          alert("este e-mail já está em uso");
        }
      });
    } else {
      console.log("puts");
    }
  };
  console.log("phone = ", phone);
  return (
    <div>
      <div className={classes.login_register_wrapper}>
        <div className={classes.login_register_go_back_wrapper}>
          <IconButton onClick={() => goBack()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1">Voltar</Typography>
        </div>
        <FormControl
          className={classes.login_component_input}
          error={errors.email}
        >
          <Input
            variant="outlined"
            placeholder="E-mail"
            required={true}
            type="text"
            disabled={user?.email ? true : false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              seterrors({
                ...errors,
                email: "",
              });
            }}
          />
          <FormHelperText>{errors.email}</FormHelperText>
        </FormControl>
        <FormControl
          className={classes.login_component_input}
          error={errors.name}
        >
          <Input
            variant="outlined"
            placeholder="Nome"
            required={true}
            type="text"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
              seterrors({
                ...errors,
                name: "",
              });
            }}
          />
          <FormHelperText>{errors.name}</FormHelperText>
        </FormControl>
        <FormControl
          className={classes.login_component_input}
          error={errors.phone}
        >
          <InputMask
            mask="(99) 99999-9999"
            variant="outlined"
            placeholder="Número de telefone"
            required={true}
            type="text"
            value={phone}
            onChange={(e) => {
              setphone(e.target.value);
              seterrors({
                ...errors,
                phone: "",
              });
            }}
            maskChar=" "
          >
            {() => (
              <Input
                variant="outlined"
                placeholder="Número de telefone"
                required={true}
                type="text"
              />
            )}
          </InputMask>

          <FormHelperText>{errors.phone}</FormHelperText>
        </FormControl>
        {!isGoogle && (
          <>
            {" "}
            <FormControl
              className={classes.login_component_input}
              error={errors.password}
            >
              <Input
                variant="outlined"
                placeholder="Senha"
                required={true}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  seterrors({
                    ...errors,
                    password: "",
                  });
                }}
              />
              <FormHelperText>{errors.password}</FormHelperText>
            </FormControl>
            <FormControl
              className={classes.login_component_input}
              error={errors.password2}
            >
              <Input
                variant="outlined"
                placeholder="Confirmar senha"
                required={true}
                type="password"
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  seterrors({
                    ...errors,
                    password2: "",
                  });
                }}
              />
              <FormHelperText>{errors.password2}</FormHelperText>
            </FormControl>
          </>
        )}
        <button onClick={() => _register()} className={classes.register_button}>
          Registrar
        </button>
      </div>
    </div>
  );
}
