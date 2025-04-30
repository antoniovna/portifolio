import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Table,
  Button,
  Input,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import firebase from "./../../initfirebase";
import Radio from "@material-ui/core/Radio";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import List from "./list";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Contracheque() {
  const [file, setFile] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Contracheque");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const fetchUsers = () => {
    firebase
      .firestore()
      .collection("Users")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setUsers((users) => users.concat(doc.data()));
        });
      });
  };

  const fetchData = () => {
    setList([]);
    firebase
      .firestore()
      .collection("Contracheque") .orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setList((list) => list.concat(doc.data()));
        });
      });
  };
  const control = 0;
  useEffect(() => {
    fetchUsers();
    fetchData();
  }, [control]);
  const submit = () => {
    var name = "";
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (element.email === selectedUser) {
        name = element.name;
      }
    }
    firebase
      .firestore()
      .collection("Contracheque")
      .add({
        name: selectedUser === "" ? users[0].name : name,
        email: selectedUser === "" ? users[0].email : selectedUser,
        file: "",
        id: "",
        date: month + "/" + year,
        year: year,
        month: month,
        type: type,
      })
      .then((newDoc) => {
        firebase
          .firestore()
          .collection("Contracheque")
          .doc(newDoc.id)
          .update({ id: newDoc.id });
        if (file != null) {
          const storageRef = firebase.storage().ref("contracheques/");
          const fileRef = storageRef.child(
            selectedUser === "" ? users[0].name : name
          );
          var uploadTask = fileRef.put(file);
          uploadTask.on(
            "state_changed",
            function (snapshot) {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            function (error) {
              // Handle unsuccessful uploads
            },
            function () {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  let updateURL = firebase
                    .firestore()
                    .collection("Contracheque")
                    .doc(newDoc.id)
                    .update({ file: downloadURL, id: newDoc.id })
                    .then(() => {
                      handleClick(`${type} cadastrado com sucesso!`);
                      fetchData();
                    });
                });
            }
          );
        } else {
          handleClick(`${type} cadastrado com sucesso!`);
          fetchData();
        }
      });
  };

  const handleClick = (e) => {
    setMessage(e);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const listUsers = users.map((user) => (
    <option value={user.email}>{user.name}</option>
  ));

  const listData = () => {
    var newData = {};
    var names = [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (!names.includes(element.name)) {
        names.push(element.name);
        newData[element.name] = [];
        newData[element.name].push(element);
      } else {
        newData[element.name].push(element);
      }
      console.log("element", newData[element]);
    }
    console.log(names, newData);
    if (newData) {
      return (
        <>
          {names.map((item, key) => (
            <List
              getData={() => fetchData()}
              handleClick={(e) => handleClick(e)}
              name={item}
              data={newData[item]}
            />
          ))}
        </>
      );
    } else {
      return null;
    }
  };
  return (
    <div className="content">
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
      <Row>
        <Card>
          <CardHeader>
            <CardTitle tag="h2">Upload {type}</CardTitle>
          </CardHeader>
          <CardBody>
            <FormControlLabel
              value="end"
              control={
                <Radio
                  color="primary"
                  checked={type === "Contracheque"}
                  onChange={() => setType("Contracheque")}
                  value={type}
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
              }
              label="Contracheque"
            />

            <FormControlLabel
              value="end"
              control={
                <Radio
                  color="primary"
                  checked={type === "Rendimento anual"}
                  onChange={() => setType("Rendimento anual")}
                  value={type}
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
              }
              label="Rendimento anual"
            />

            <Input
              type="file"
              onChange={(e) => {
                if (e.target !== null) {
                  setFile(e.target.files[0]);
                } else {
                  setFile(null);
                }
              }}
            />
            <br />
            <Row>
              <Col md="5">
                <label>Nome</label>
                <Input
                  value={selectedUser}
                  type="select"
                  onChange={(e) => {
                    setSelectedUser(e.target.value);
                  }}
                >
                  {listUsers}
                </Input>
              </Col>
            </Row>
            <Row>
              <Col md="2">
                <label>Mês</label>
                <Input
                  value={month}
                  type="number"
                  min={0}
                  max={12}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </Col>
              <Col md="3">
                <label>Ano</label>
                <Input
                  value={year}
                  type="number"
                  min={1980}
                  max={2200}
                  onChange={(e) => setYear(e.target.value)}
                />
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button color="success" onClick={() => submit()}>
              Enviar
            </Button>
          </CardFooter>
        </Card>
      </Row>
      {list.length > 0 ? listData() : null}
    </div>
  );
}
