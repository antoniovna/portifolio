import { Typography } from "@mui/material";
import { styles } from "./../../../assets/styles/checkout/login.styles";
import { sign_out } from "../../../util/api";
export default function LoggedUser({ user, signed_out, handleLoggedIn }) {
  const classes = styles();
  return (
    <div className={classes.logged_user_wrapper}>
      <div className={classes.logged_user_card}>
        <img
          style={{ zIndex: "100" }}
          height="70px"
          width="auto"
          src="./logo.png"
        />
        <div className={classes.logged_user_card_text}>
          <Typography variant="body1">{user.email}</Typography>
          <Typography variant="body2" color="primary.light_gray">
            Usuário conectado
          </Typography>
        </div>
      </div>
      <div className={classes.login_component_or_wrapper}>
        <div />
        <Typography color="primary.light_gray" variant="body2">
          OU
        </Typography>
        <div />
      </div>
      <button
        onClick={() => {
          sign_out().then(() => {
            handleLoggedIn(false);
            signed_out();
          });
        }}
        className={classes.logged_user_logout_button}
      >
        <Typography>Fazer login em outra conta</Typography>
      </button>
    </div>
  );
}
