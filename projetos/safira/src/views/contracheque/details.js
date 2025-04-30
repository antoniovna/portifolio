import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import LaunchIcon from "@material-ui/icons/Launch";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "./../../initfirebase";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

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
}));
export default function Details({ data, getData, handleClick }) {
  const [modal, setModal] = useState(false);
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const classes = useStyles();

  const _delete = () => {
    firebase
      .firestore()
      .collection("Contracheque")
      .doc(data.id)
      .delete()
      .then(() => {
        getData();
        handleClick(`${data.type} excluído com sucesso!`);
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
        <Details close={() => closeModal()} data={data} />
      </Modal>
      <tr>
        <td>{data.date}</td>
        <td>
          <a href={data.file}>{data.type}</a>
        </td>
       
        <td>
          <IconButton color="secondary" onClick={() => _delete()}>
            <HighlightOffIcon />
          </IconButton>
        </td>
      </tr>
    </>
  );
}
