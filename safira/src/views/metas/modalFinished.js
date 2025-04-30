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
import Slider from "@material-ui/core/Slider";
import firebase from "./../../initfirebase";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CardFooter from "reactstrap/lib/CardFooter";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";

function valuetext(value) {
  return `${value}%`;
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
export default function Modal({ data, close, name, refresh, inicio2, fim2 }) {
  const [inicio, setInicio] = useState(inicio2);
  const [fim, setFim] = useState(fim2);
  const [open, setOpen] = useState(false);
  const [conclusao, setConclusao] = useState(data.conclusao);
  var splitDate = fim.split("/");
  var splitDate2 = inicio.split("/");
  const [listTaks, setListTaks] = useState(data.como);
  const [encarregadosData, setEncarregadosData] = useState([]);
  useEffect(() => {
    getEncarregadosData();
  }, [data]);
  const handleChange = (event, newValue) => {
    setConclusao(newValue);
    firebase
      .firestore()
      .collection("Metas")
      .doc(data.id)
      .update({ conclusao: newValue });
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
    return calculus;
  };

  const getStatus = () => {
    if (data.tipo === "Estratégico") {
      return <h2 style={{ color: "green" }}>Estratégico</h2>;
    }
    if (data.tipo === "Tático") {
      return <h2 style={{ color: "blue" }}>Tático</h2>;
    }
    if (data.tipo === "Operacional") {
      return <h2 style={{ color: "yellow" }}>Operacional</h2>;
    }
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

  const _reabrir = () => {
    firebase
      .firestore()
      .collection("Metas")
      .doc(data.id)
      .update({ finished: false })
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

  const displayTasks = listTaks.map((task, index) => (
    <>
      <tr key={index}>
        <td>
          <FormGroup disabled check>
            <Label disabled check>
              <Input
                disabled
                defaultValue={task.isChecked}
                checked={task.isChecked}
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
          <p className="title">{task.task}</p>
        </td>
      </tr>
    </>
  ));

  const getConclusao = () => {
    var percentage = 0;
    var tasksArray = [];
    for (let index = 0; index < listTaks.length; index++) {
      const element = listTaks[index];
      if (element.isChecked === true) {
        tasksArray.push(element.task);
      }
    }
    return (tasksArray.length / listTaks.length).toFixed(2);
  };
  return (
    <>
      <div className="metas-modal-wrapper">
        <Card>
          <CardHeader>
            <Row className="metas-modal-title-wrapper">
              <h3>{data.oque}</h3>
              <IconButton
                onClick={() => close(conclusao)}
                aria-label="delete"
                color="secondary"
              >
                <HighlightOffOutlinedIcon />
              </IconButton>
            </Row>
            {getStatus()}
            <div className="creator-data-wrapper">{displayEncarregados}</div>
            <Row>
              <Col md="3">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h4>Início: </h4>
                  <Input
                    type="date"
                    value={
                      splitDate2[2] + "-" + splitDate2[1] + "-" + splitDate2[0]
                    }
                    disabled
                  />
                </div>
              </Col>
              <Col md="3">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h4>Fim: </h4>
                  <Input
                    type="date"
                    value={
                      splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]
                    }
                    disabled
                  />
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <h4>Evolução: {getDiff()}%</h4>
            <h4>Conclusão: {getConclusao() * 100}%</h4>
            <Table>
              <tbody>{displayTasks}</tbody>
            </Table>
          </CardBody>
          <CardFooter>
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
                <Button onClick={() => _reabrir()} color="success">
                  Sim
                </Button>
              </div>
            ) : (
              <Button onClick={() => setOpen(true)} color="success">
                Reabrir meta
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
