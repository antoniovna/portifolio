import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  CardFooter,
  Button,
  Row,
  Col,
} from "reactstrap";
import AddIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/Remove";
import Th from "./th";
import firebase from "./../../initfirebase";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Indicadores() {
  const [head, setHead] = useState([]);
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Contracheque");
  function hasNumber(myString) {
    return /\d/.test(myString);
  }
  const checkLetter = (str) => {
    console.log(str, /^[a-zA-Z]+$/.test(str));
    return /^[a-zA-Z]+$/.test(str);
  };
  const verifyError = (expression) => {
    for (let index = 0; index < expression.length; index++) {
      const element = expression[index];
      if (element === "L" || element === "l") {
        if (expression[index + 1]) {
          if (!hasNumber(expression[index + 1])) {
            return false;
          }
        } else {
          return false;
        }
      } else {
        if (checkLetter(element)) {
          if (element !== "l" || element !== "L") {
            return false;
          }
        }
      }
    }
    return true;
  };
  const list_th = head.map((th, index) => (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Th
        th={th}
        invalid={th.type === "calculus" ? verifyError(th.value) : true}
        delete_column={() => delete_th(index)}
        change_label={(e) => {
          setHead(
            head.map((item) =>
              item.id === th.id ? { ...item, label: e.target.value } : item
            )
          );
        }}
        change_type={() =>
          setHead(
            head.map((item) =>
              item.id === th.id
                ? {
                    ...item,
                    type: th.type === "normal" ? "calculus" : "normal",
                  }
                : item
            )
          )
        }
        change={(e) =>
          setHead(
            head.map((item) =>
              item.id === th.id ? { ...item, value: e.target.value } : item
            )
          )
        }
      />
    </div>
  ));

  const add_th = () => {
    const oldHead = [...head];
    const oldTd = [...rows];
    oldHead.push({
      value: "",
      id: oldHead.length > 0 ? oldHead[oldHead.length - 1].id + 1 : 0,
      type: "normal",
      label: "",
    });
    for (let index = 0; index < oldTd.length; index++) {
      if (oldTd[index].values.length < oldHead.length + 1) {
        oldTd[index].values.push({
          values: return_td(),
          id: oldTd.lenght > 0 ? oldTd[oldTd.length - 1].id : 0,
        });
      }
    }
    console.log(oldTd);
    setHead(oldHead);
    setRows(oldTd);
  };

  const return_td = () => {
    var newArray = [{ index: 0, value: "" }];
    for (let index = 0; index < head.length; index++) {
      newArray.push({ id: index + 1, value: "" });
    }
    return newArray;
  };
  const add_row = () => {
    const oldRows = [...rows];
    oldRows.push({
      values: return_td(),
      id: oldRows.lenght > 0 ? oldRows[oldRows.length - 1].id : 0,
    });
    console.log(oldRows);
    setRows(oldRows);
  };

  const edit_td = (index_row, index_td, value) => {
    var oldRows = [...rows];
    console.log(oldRows[index_row][index_td], index_row, index_td, rows);
    oldRows[index_row].values[index_td].value = value;

    setRows(oldRows);
  };

  const remove_tr = (index) => {
    const removed_tr = [...rows];
    removed_tr.splice(index, 1);
    setRows(removed_tr);
  };
  const delete_th = (idx) => {
    var old_th = [...head];
    var old_tr = [...rows];
    old_th.splice(idx, 1);
    for (let index = 0; index < old_tr.length; index++) {
      old_tr[index].values.splice(idx + 1, 1);
    }
    setHead(old_th);
    setRows(old_tr);
  };
  const show_rows = rows.map((tr, index) => (
    <tr key={index + "-tr-"}>
      {tr.values.map((row, idx) => (
        <td key={"index " + index + " , " + idx}>
          <Input
            placeholder="Valor"
            value={row.value}
            onChange={(e) => {
              const val = e.target.value;
              edit_td(index, idx, val);
            }}
          />
        </td>
      ))}
      <td>
        <IconButton color="secondary" onClick={() => remove_tr(index)}>
          <RemoveIcon />
        </IconButton>
      </td>
    </tr>
  ));

  const submit = () => {
    for (let index = 0; index < head.length; index++) {
      const element = head[index];
      if (!verifyError(element.value) && element.type === "calculus") {
        return;
      }
    }
    firebase
      .firestore()
      .collection("indicators")
      .add({
        name: name,
        headers: head,
        rows: [],
        id: "",
      })
      .then((newDoc) => {
        firebase
          .firestore()
          .collection("indicators")
          .doc(newDoc.id)
          .update({ id: newDoc.id })
          .then(() => {
            handleClick("Indicador cadastrado com sucesso");
            setType("success");
            setHead([]);
          });
      });
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleClick = (e) => {
    setMessage(e);
    setOpen(true);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
      <div className="content">
        <Card>
          <CardBody>
            <Row>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10px",
                  marginBottom: "10px",
                }}
              >
                <label>Nome</label>
                <Input
                  placeholder="Nome"
                  className="th-input-indicators"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10px",
                  marginBottom: "10px",
                }}
              >
                <label>Mês/ano</label>
                <Input
                  placeholder="Campo"
                  disabled
                  className="th-input-indicators"
                  value={"Mês/Ano"}
                />
              </div>
            </Row>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="list-indicators-new">{list_th}</div>
            </div>
            <IconButton color="primary" onClick={() => add_th()}>
              <AddIcon />
            </IconButton>
            {/**
               *  <Table className="table-no-scroll" responsive>
              <thead className="text-primary">
                <tr>
                  <th>Mês/Ano</th>
                  <th>
                  
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{show_rows}</tbody>
            </Table>
               */}

            <CardFooter>
              {/**
                *  <div className="add-indicators-card-footer">
                <IconButton color="primary" onClick={() => add_row()}>
                  <AddIcon />
                </IconButton>
              </div>
                */}
              <Button color="info" onClick={() => submit()}>
                Enviar
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
