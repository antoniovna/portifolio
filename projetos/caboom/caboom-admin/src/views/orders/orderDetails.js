import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Label,
  CardHeader,
  FormGroup,
  Table,
  CardTitle,
} from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import firebase from "./../../initFirebase";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import Update from "./updateStatus";
import Chat from "./makeNotes";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Online = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);
const Offline = withStyles((theme) => ({
  badge: {
    backgroundColor: "grey",
    color: "grey",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);
const Unavailable = withStyles((theme) => ({
  badge: {
    backgroundColor: "red",
    color: "red",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);
const DontDisturb = withStyles((theme) => ({
  badge: {
    backgroundColor: "yellow",
    color: "yellow",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  size_element: {
    border: "1px solid lightgray",
    padding: "3px",
    borderRadius: "5px",
  },
}));
export default function Details(props) {
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [alert, setAlert] = React.useState(false);
  const [reason, setReason] = useState("");
  const [cancel, setCancel] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  const data = props.data.data;
  console.log("data - ", data);
  const orderTotal = () => {
    var total = 0;
    data.pieces.forEach((piece) => {
      total += piece.amount * piece.piece.price;
    });
    return total;
  };
  const listPieces = data.pieces.map((piece, idx) => (
    <>
      <div className="order-details-list-pieces-element">
        <div className="order-details-list-pieces-element-image-wrapper">
          <img src={piece.piece.images[0]} alt="" />
        </div>
        <div className="order-details-list-pieces-element-content">
          <Typography>{piece.piece.name}</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {piece.sizes.map((size, index) => (
              <>
                {size.amount > 0 && (
                  <Typography
                    key={"cart size" + piece.piece.id + index + size.size}
                    className={classes.size_element}
                  >
                    {size.amount}x {size.size.toUpperCase()}
                  </Typography>
                )}
              </>
            ))}
          </div>
          <Typography style={{ fontWeight: "bold" }}>
            {(piece.amount * piece.piece.price).toLocaleString("en-US", {
              style: "currency",
              currency: "BRL",
            })}
          </Typography>
        </div>
      </div>
    </>
  ));
  const cancelOrder = () => {
    firebase
      .firestore()
      .collection("purchases")
      .doc(data.id)
      .update({ paymentStatus: "Cancelado", reason: reason })
      .then(() => {
        closeModal();
      })
      .catch((e) => {
        alert("Ocorreu um erro ao cancelar o pedido");
      });
  };
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className="details-card-body">
          <Card>
            <div className="title-wrapper">
              <div>
                <IconButton onClick={() => closeModal()} color="secondary">
                  <HighlightOffIcon />
                </IconButton>
              </div>
              <CardHeader>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* <Chat id={data?.id} /> */}
                </div>
              </CardHeader>
            </div>

            <CardBody style={{ padding: "15px" }}>
              <CardTitle>
                {" "}
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  component="h4"
                >
                  {data?.user?.name}
                </Typography>
                <Typography variant="h6">
                  {orderTotal().toLocaleString("en-US", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Typography>
                <Typography variant="h6">{data?.data}</Typography>
              </CardTitle>
              {listPieces}
              <Button onClick={() => setCancel(true)}>Cancelar pedido</Button>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={cancel}
                onClose={() => setCancel(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    padding: "15px",
                  }}
                >
                  <Typography variant="h6">
                    Confirmar cancelamento do pedido
                  </Typography>
                  <FormControl style={{ margin: "0px 10px" }}>
                    <InputLabel id="label">Razão do cancelamento</InputLabel>
                    <Select
                      labelId="label"
                      id="select"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <MenuItem value="Pagamento não identificado">
                        Pagamento não identificado
                      </MenuItem>
                      <MenuItem value="Produto fora de estoque">
                        Produto fora de estoque
                      </MenuItem>
                      <MenuItem value="Outro">Outro</MenuItem>
                    </Select>
                  </FormControl>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                      justifyContent: "space-between",
                      marginTop: "8px",
                    }}
                  >
                    <Button
                      onClick={() => setCancel(false)}
                      color="secondary"
                      variant="outlined"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => cancelOrder()}
                      disabled={reason === ""}
                      color="primary"
                      variant="outlined"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </Modal>
            </CardBody>
          </Card>
        </div>
      </Modal>
      <IconButton color="primary" onClick={() => openModal()}>
        <MoreVertIcon />
      </IconButton>
    </>
  );
}
