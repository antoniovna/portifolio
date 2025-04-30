import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  Col,
} from "reactstrap";
import moment from "moment";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import firebase from "./../../initFirebase";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function UpdateStatus(props) {
  const [open, setOpen] = React.useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [newStatus, setNewStatus] = useState(props.data.status);
  const [note, setNote] = useState("");
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClickError = () => {
    setIsEmpty(true);
  };

  const submit = () => {
    if (newStatus === "") {
      handleClickError();
      return;
    }
    if (newStatus === "Feito") {
      if (props.operation === 1) {
        const ref = firebase
          .firestore()
          .collection("Chamados")
          .doc(props.data.id)
          .update({
            finalized: true,
            status: "Feito",
          })
          .then(() => {
            if (note != "") {
              makeNotes(props.data.id);
            } else {
              setNewStatus("");
              setNewStatus("");
              handleClick();
            }
          });
      } else {
        firebase
          .firestore()
          .collection("Chamados")
          .doc(props.data.id)
          .update({
            status: "Feito",
            finalDate: moment(new Date()).format("DD/MM/YYYY"),
          })
          .then(() => {
            if (note !== "") {
              makeNotes(props.data.id);
            } else {
              setNewStatus("");
              setNewStatus("");
              handleClick();
            }
          });
      }
    } else {
      firebase
        .firestore()
        .collection("Chamados")
        .doc(props.data.id)
        .update({
          status: newStatus,
          finalized: false,
          finalDate: "",
        })
        .then(() => {
          if (note !== "") {
            makeNotes(props.data.id);
          } else {
            setNewStatus("");
            setNewStatus("");
            handleClick();
          }
        });
    }
    makeNotification(props.data.id, newStatus, props.operation);
  };
  const makeNotes = async (id) => {
    var name;
    await firebase
      .firestore()
      .collection("Users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((userData) => {
        userData.forEach((doc) => {
          name = doc.data().name;
        });
      });
    firebase
      .firestore()
      .collection("Notes")
      .add({
        id: "",
        relatedId: id,
        note: note,
        timestamp: new Date(),
        user: firebase.auth().currentUser.email,
        name: name,
        anexo: "",
      })
      .then((newDOc) => {
        firebase
          .firestore()
          .collection("Notes")
          .doc(newDOc.id)
          .update({ id: newDOc.id })
          .then(() => {
            setNewStatus("");
            setNewStatus("");
            handleClick();
          });
      });
  };

  const makeNotification = async (id, status, operation) => {
    var name;
    let getName = await firebase
      .firestore()
      .collection("Users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get();
    getName.forEach((data) => {
      name = data.data().name;
    });
    var message;
    if (status === "Feito") {
      if (operation === 1) {
        message = `${name} aprovou a conclusão do chamado ${id}`;
      } else {
        message = `${name} moveu o chamado ${id} para ${status} e está aguardando sua aprovação`;
      }
    } else {
      message = `${name} moveu o chamado ${id} para ${status}`;
    }
    if (operation === 1) {
      ///notificação deve ir para os encarregados!
      props.data.encarregados.forEach((email) => {
        firebase
          .firestore()
          .collection("Notifications")
          .add({
            relatedId: "",
            userName: name,
            email: email,
            message: message,
            path: "/helpdesk/chamadosEnviados",
            isRead: false,
            id: "",
            timesTamp: new Date(),
            date: moment(new Date()).format("DD/MM/YYYY"),
          })
          .then((newDoc) => {
            firebase
              .firestore()
              .collection("Notifications")
              .doc(newDoc.id)
              .update({ id: newDoc.id });
          });
      });
    } else {
      //chamado deve ir para o dono
      firebase
        .firestore()
        .collection("Notifications")
        .add({
          relatedId: "",
          userName: name,
          email: props.data.creator,
          message: message,
          path: "/helpdesk/chamadosRecebidos",
          isRead: false,
          id: "",
          timesTamp: new Date(),
          date: moment(new Date()).format("DD/MM/YYYY"),
        })
        .then((newDoc) => {
          firebase
            .firestore()
            .collection("Notifications")
            .doc(newDoc.id)
            .update({ id: newDoc.id });
        });
    }
  };
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Status atualizado com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        open={isEmpty}
        autoHideDuration={6000}
        onClose={handleClickError}
      >
        <Alert onClose={handleClickError} severity="error">
          Status não selecionado!
        </Alert>
      </Snackbar>
      <Col>
        <div className="update-status-wrapper">
          <Card>
            <CardHeader>
              <h5 className="title">Atualizar status</h5>
            </CardHeader>
            <CardBody>
              <Form>
                <Col className="pr-md-1" md="12">
                  <label>Novo status</label>
                  <Input
                    value={newStatus}
                    type="select"
                    placeholder="Anotação"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {props.data.status === "A fazer" ? (
                      <>
                        <option value="A fazer">A fazer</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Pausado">Pausado</option>
                        <option value="Feito">Concluído</option>
                      </>
                    ) : null}
                    {props.data.status === "Em andamento" ? (
                      <>
                        <option value="Em andamento">Em andamento</option>
                        <option value="A fazer">A fazer</option>
                        <option value="Pausado">Pausado</option>
                        <option value="Feito">Concluído</option>
                      </>
                    ) : null}
                    {props.data.status === "Pausado" ? (
                      <>
                        <option value="Pausado">Pausado</option>
                        <option value="A fazer">A fazer</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Feito">Concluído</option>
                      </>
                    ) : null}
                    {props.data.status === "Concluído" ? (
                      <>
                        <option value="Feito">Concluído</option>
                        <option value="A fazer">A fazer</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Pausado">Pausado</option>
                      </>
                    ) : null}
                  </Input>
                </Col>
                <Col className="pr-md-1" md="12">
                  <label>Anotação</label>
                  <Input
                    value={note}
                    type="text"
                    placeholder="Anotação"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Col>
              </Form>
            </CardBody>
            <CardFooter>
              <Button
                onClick={() => submit()}
                className="btn-fill"
                color="success"
                type="submit"
              >
                Enviar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Col>
    </>
  );
}
