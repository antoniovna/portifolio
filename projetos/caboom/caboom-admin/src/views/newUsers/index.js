import React, { useState, useEffect } from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "components/CustomButtons/Button.js";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "components/Snackbar/Snackbar.js";
import Loader from "react-loader-spinner";
import firebase from "./../../initFirebase";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import stylesTable from "assets/jss/material-dashboard-react/components/tableStyle.js";
import Row from "./row";
import { makeStyles } from "@material-ui/core/styles";

export default function Lancamento() {
  const useStylesTable = makeStyles(stylesTable);
  const classesTable = useStylesTable();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tr, setTR] = React.useState(false);
  const [severity, setSeverity] = useState("");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const submit = () => {
    if (!name || !email || !type) {
      setSeverity("danger");
      setMessage("Verifique o preenchimento de todos os campos");
      setTR(true);
      return;
    }
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().email === email) {
            setSeverity("danger");
            setMessage("Usuário já cadastrado no sistema");
            setTR(true);
            setIsLoading(false);
            return;
          }
        });
      })
      .then(() => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, "conechaoafro")
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            firebase
              .firestore()
              .collection("users")
              .doc(userCredential.user.uid)
              .set({
                name: name,
                email: email,
                uid: userCredential.user.uid,
                admin: true,
                type: type,
                photo: "",
                super: true,
                active: false,
              })
              .then(() => {
                if (photo) {
                  let storageRef = firebase.storage().ref();
                  let fileRef = storageRef.child(userCredential.user.uid);
                  var uploadTask = fileRef.put(photo);
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
                          firebase
                            .firestore()
                            .collection("users")
                            .doc(userCredential.user.uid)
                            .update({ photo: downloadURL });
                          var user = firebase.auth().currentUser;

                          user
                            .updateProfile({
                              displayName: name,
                              photoURL: downloadURL,
                            })
                            .then(function () {
                              setSeverity("success");
                              setMessage("Usuário cadastrado com sucesso");
                              setTR(true);
                              setIsLoading(false);
                            })
                            .catch(function (error) {
                              setSeverity("danger");
                              setMessage("Erro ao cadastrar o usuário");
                              setTR(true);
                              setIsLoading(false);
                            });
                        });
                    }
                  );
                } else {
                  var user = firebase.auth().currentUser;

                  user
                    .updateProfile({
                      displayName: name,
                    })
                    .then(function () {
                      setSeverity("success");
                      setMessage("Usuário cadastrado com sucesso");
                      setTR(true);
                      setIsLoading(false);
                    })
                    .catch(function (error) {
                      setSeverity("danger");
                      setMessage("Erro ao cadastrar o usuário");
                      setTR(true);
                      setIsLoading(false);
                    });
                }
              });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            setSeverity("danger");
            setMessage("Ocorreu um erro ao cadastrar o usuário");
            setTR(true);
            setIsLoading(false);
          });
      });
    setIsLoading(true);
  };

  const getData = (currentUser) => {
    firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        setData([]);
        snapshot.forEach((doc) => {
            console.log(doc.data().super,doc.data().uid, currentUser)
          if (doc.data().uid !== currentUser && doc.data().super === true) {
            setData((data) => data.concat(doc.data()));
          }
        });
      });
  };

  const control = 0;
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        getData(user.uid);
      } else {
        // No user is signed in.
      }
    });
  }, [control]);
  const deleteItem = () => {
    console.log("em obras");
  };
  const listData = data.map((item, index) => (
    <Row
      key={index + item.name}
      deleteItem={(id) => deleteItem(id)}
      data={item}
    />
  ));
  return (
    <>
      <Snackbar
        place="tr"
        color={severity}
        icon={severity !== "success" ? ErrorIcon : DoneIcon}
        message={message}
        open={tr}
        closeNotification={() => setTR(false)}
        close
      />
      <Card>
        <CardHeader color="primary">
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <h4 style={{ color: "#000" }}>Novo usuário</h4>
            </GridItem>
          </GridContainer>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={6} md={5}>
              <CustomInput
                labelText="Nome"
                adornment={<AccountBoxIcon />}
                value={name}
                onChangeText={(e) => {
                  setName(e.target.value);
                }}
                id="name"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={5}>
              <CustomInput
                labelText="E-mail"
                adornment={<AlternateEmailIcon />}
                value={email}
                onChangeText={(e) => {
                  setEmail(e.target.value);
                }}
                id="email"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={5}>
              <input
                type="file"
                id="drop-file-input"
                onChange={(e) => {
                  if (e.target) {
                    setPhoto(e.target.files[0]);
                  } else {
                    setPhoto(null);
                  }
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={5}>
              {photo ? (
                <img
                  alt=""
                  className="carousel-drop-image-new-user"
                  src={URL.createObjectURL(photo)}
                />
              ) : null}
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={5}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender1"
                  color="primary"
                  value={type}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Diretor"
                    control={<Radio color="primary" />}
                    label="Diretor"
                  />
                  <FormControlLabel
                    value="Coordenador"
                    color="primary"
                    control={<Radio color="primary" />}
                    label="Coordenador"
                  />
                  <FormControlLabel
                    value="Associado"
                    control={<Radio color="primary" />}
                    color="primary"
                    label="Associado"
                  />
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6} md={5}></GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={5}>
              {isLoading ? (
                <Loader
                  type="MutatingDots"
                  color="#fbcd00"
                  secondaryColor="#F3F96E"
                />
              ) : (
                <Button onClick={() => submit()} color="primary">
                  Enviar
                </Button>
              )}
            </GridItem>
          </GridContainer>
          <br />
        </CardBody>
      </Card>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h3 style={{ color: "#000" }}>Usuários</h3>
            </CardHeader>
            <CardBody>
              <Table className={classesTable.table}>
                <TableHead className={classesTable["primaryTableHeader"]}>
                  <TableRow className={classesTable.tableHeadRow}>
                    {["","Nome", "E-mail", "Tipo", "Ativo"].map((prop, key) => {
                      return (
                        <TableCell
                          className={
                            classesTable.tableCell +
                            " " +
                            classesTable.tableHeadCell
                          }
                          key={key}
                        >
                          {prop}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>{listData}</TableBody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
