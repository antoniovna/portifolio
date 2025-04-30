import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  Button,
  Table,
  Label,
  FormGroup,
} from "reactstrap";
import moment from "moment";
import firebase from "./../../initfirebase";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CardFooter from "reactstrap/lib/CardFooter";
import { withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/HighlightOff";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
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
export default function ModalContent({
  data,
  close,
  name,
  refresh,
  inicio2,
  fim2,
}) {
  const [inicio, setInicio] = useState(inicio2);
  const [oque, setOque] = useState(data.oque);
  const [status, setStatus] = useState(data.tipo);
  const [fim, setFim] = useState(fim2);
  const [conclusao, setConclusao] = useState(data.conclusao);
  var splitDate = fim.split("/");
  var splitDate2 = inicio.split("/");
  const [listTasks, setlistTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [encarregadosData, setEncarregadosData] = useState([]);
  const [message, setMessage] = useState("");
  const [prioridade, setPrioridade] = useState(data.prioridade);
  useEffect(() => {
    getEncarregadosData();
    treatTasks();
  }, [data]);
  const handleClick = (e) => {
    setMessage(e);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const treatTasks = () => {
    for (let index = 0; index < data.como.length; index++) {
      const element = data.como[index];
      setlistTasks((listTasks) =>
        listTasks.concat({
          isChecked: element.isChecked,
          task: element.task,
          id: index,
        })
      );
    }
  };
  const getDiff = () => {
    var split1 = data.inicio.split("/");
    var split2 = data.fim.split("/");
    const date1 = new Date(split1[1] + "/" + split1[0] + "/" + split1[2]);
    const date2 = new Date(split2[1] + "/" + split2[0] + "/" + split2[2]);
    const date3 = new Date();
    const diffTime2 = Math.abs(date1 - date3);
    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var calculus = 0;
    if (date1 < date3) {
      calculus = ((diffDays2 / diffDays) * 100).toFixed(2);
    }
    if (calculus > 100) {
      calculus = 100;
    }
    return calculus;
  };

  const getEncarregadosData = () => {
    data.quem.forEach((email) => {
      firebase
        .firestore()
        .collection("Users")
        .where("name", "==", email)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log("foto não encontrada");
          }
          snapshot.forEach((encarregado) => {
            setEncarregadosData((encarregadosData) =>
              encarregadosData.concat(encarregado.data())
            );
          });
        });
    });
  };

  const notify = (id, date) => {
    const message = `${name} redefiniu a ${data.oque} para ${date}`;
    for (let index = 0; index < data.quem.length; index++) {
      firebase
        .firestore()
        .collection("Users")
        .where("name", "==", data.quem[index])
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const ref = firebase
              .firestore()
              .collection("Notifications")
              .add({
                relatedId: id,
                userName: data.quem[index],
                email: doc.data().email,
                message: message,
                path: "/helpdesk/metas",
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
        });
    }
  };

  const _concluir = () => {
    firebase
      .firestore()
      .collection("Metas")
      .doc(data.id)
      .update({ finished: true, evolucao: getDiff() })
      .then(() => {
        refresh();
        close();
      });
  };

  const displayEncarregados = encarregadosData.map((user, key) => (
    <>
      <div className="avatar-wrapper">
        <div className="avatar-badge-wrapper">
          {user.status === "Disponível" ? (
            <Online
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt={user.name} src={user.photo} />
            </Online>
          ) : null}
          {user.status === "Offline" ? (
            <Offline
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt={user.name} src={user.photo} />
            </Offline>
          ) : null}
          {user.status === "Indisponível" ? (
            <Unavailable
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt={user.name} src={user.photo} />
            </Unavailable>
          ) : null}
          {user.status === "Não perturbe" ? (
            <DontDisturb
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt={user.name} src={user.photo} />
            </DontDisturb>
          ) : null}
          {user.status === undefined ? (
            <>
              {user.photo === "" ? (
                <Avatar alt={user.name.substr(0, 1)}>
                  {user.name.substr(0, 1)}
                </Avatar>
              ) : (
                <Avatar alt={user.name} src={user.photo} />
              )}
            </>
          ) : null}
        </div>
        <p>{user.name}</p>
      </div>
    </>
  ));
  const handleChangeTasks = (e, index) => {
    setlistTasks(
      listTasks.map((item) => (item.id === index ? { ...item, task: e } : item))
    );
  };
  const displayTasks = listTasks.map((task, index) => (
    <>
      <tr key={index}>
        <td>
          <FormGroup check>
            <Label check>
              <Input
                defaultValue={task.isChecked}
                checked={task.isChecked}
                onChange={(e) => {
                  var newTasks = listTasks;
                  newTasks[index].isChecked = !task.isChecked;
                  setlistTasks(
                    listTasks.map((item) =>
                      item.task === task.task
                        ? { ...item, isChecked: e.target.checked }
                        : item
                    )
                  );
                }}
                name={task.task}
                type="checkbox"
              />
              <span className="form-check-sign">
                <span className="check" />
              </span>
            </Label>
          </FormGroup>
        </td>
        <td>
          <Input
            value={task.task}
            onChange={(e) => handleChangeTasks(e.target.value, task.id)}
          />
        </td>
        <td>
          <IconButton
            color="secondary"
            onClick={() => {
              const values = [...listTasks];
              values.splice(task.id, 1);
              for (let index = 0; index < values.length; index++) {
                const element = values[index];
                element.id = index;
              }
              setlistTasks(values);
            }}
          >
            <CloseIcon />
          </IconButton>
        </td>
      </tr>
    </>
  ));

  const getConclusao = () => {
    var tasksArray = [];
    for (let index = 0; index < listTasks.length; index++) {
      const element = listTasks[index];
      if (element.isChecked === true) {
        tasksArray.push(element.task);
      }
    }
    return (tasksArray.length / listTasks.length).toFixed(2);
  };

  const update = () => {
    firebase
      .firestore()
      .collection("Metas")
      .doc(data.id)
      .update({
        como: listTasks,
        conclusao: conclusao,
        fim: fim,
        inicio: inicio,
        oque: oque,
        prioridade: prioridade,
        tipo: status,
      })
      .then(() => {
        refresh();
        close();
      });
  };
  return (
    <>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={"success"}>
          {message}
        </Alert>
      </Snackbar>
      <div className="metas-modal-wrapper">
        <Card>
          <CardHeader>
            <Row className="metas-modal-title-wrapper">
              <IconButton
                onClick={() => close(conclusao)}
                aria-label="delete"
                color="secondary"
              >
                <HighlightOffOutlinedIcon />
              </IconButton>
            </Row>
            <div className="creator-data-wrapper">{displayEncarregados}</div>
            <Row>
              <Col md="7">
                {" "}
                <span>O quê?</span>
                <Input value={oque} onChange={(e) => setOque(e.target.value)} />
              </Col>{" "}
              <Col md="3">
                <span>Tipo</span>
                <Input
                  type="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Operacional</option>
                  <option>Tático</option>
                  <option>Estratégico</option>
                </Input>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <span>Prioridade</span>
                <Input
                  type="select"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                >
                  <option>Pode esperar</option>
                  <option>Pouco urgente</option>
                  <option>Urgente</option>
                  <option>Muito urgente</option>
                  <option>Imediatamente</option>
                </Input>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>Início</span>
                  <Input
                    type="date"
                    value={
                      splitDate2[2] + "-" + splitDate2[1] + "-" + splitDate2[0]
                    }
                    onChange={async (e) => {
                      var selectedDate = e.target.value;
                      setInicio(moment(e.target.value).format("DD/MM/yyyy"));
                      await firebase
                        .firestore()
                        .collection("Metas")
                        .doc(data.id)
                        .update({
                          inicio: moment(selectedDate).format("DD/MM/yyyy"),
                          isReajustado: true,
                        });
                      notify(
                        data.id,
                        moment(selectedDate).format("DD/MM/yyyy")
                      );
                    }}
                  />
                </div>
              </Col>
              <Col md="3">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>Fim: </span>
                  <Input
                    type="date"
                    value={
                      splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]
                    }
                    onChange={async (e) => {
                      var selectedDate = e.target.value;
                      setFim(moment(e.target.value).format("DD/MM/yyyy"));
                      await firebase
                        .firestore()
                        .collection("Metas")
                        .doc(data.id)
                        .update({
                          fim: moment(selectedDate).format("DD/MM/yyyy"),
                          isReajustado: true,
                        });
                      notify(
                        data.id,
                        moment(selectedDate).format("DD/MM/yyyy")
                      );
                    }}
                  />
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <h4>Evolução: {getDiff()}%</h4>
            <h4>Conclusão: {getConclusao() * 100}%</h4>
            <Table>
              <tbody>
                {displayTasks}
                <tr>
                  <IconButton
                    style={{ height: "40px", width: "40px" }}
                    color="primary"
                    onClick={() => {
                      var data = {
                        task: "",
                        isChecked: false,
                        id: 0,
                      };
                      if (listTasks.length >= 1) {
                        data.id = listTasks[listTasks.length - 1].id + 1;
                      }
                      setlistTasks(listTasks.concat(data));
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </tr>
              </tbody>
            </Table>
          </CardBody>
          <CardFooter>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {open === true ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "baseline",
                  }}
                >
                  {" "}
                  <Button onClick={() => setOpen(false)} color="danger">
                    Não
                  </Button>
                  <Button onClick={() => _concluir()} color="success">
                    Sim
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setOpen(true)} color="success">
                  Concluir meta
                </Button>
              )}
              <Button onClick={() => update()} color="info">
                Atualizar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
