/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Table,
  CardTitle,
} from "reactstrap";
import firebase from "./../initfirebase";
import { ClipLoader } from "react-spinners";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function UserProfile() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleChangeMainImage = (event) => {
    const name =
      event.target.files[0] !== null ? event.target.files[0].name : "";

    const selectedFile =
      event.target.files[0] !== null ? event.target.files[0] : null;
    setNewFileName(name);
    setNewPhoto(selectedFile);
  };

  const getData = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("Users")
          .where("email", "==", user.email)
          .onSnapshot((element) => {
            element.forEach((doc) => {
              setEmail(doc.data().email);
              setName(doc.data().name);
              setPhotoURL(doc.data().photo);
              setId(doc.data().id);
              getContracheque(doc.data().email);
            });
          });
        // User is signed in.
      } else {
        return;
        // No user is signed in.
      }
    });
  };

  const getContracheque = (e) => {
    firebase
      .firestore()
      .collection("Contracheque")
      .where("email", "==", e)
      .orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setData((data) => data.concat(doc.data()));
        });
      });
  };
  const submit = () => {
    setIsLoading(true);
    if (newPhoto !== null) {
      const storageRef = firebase.storage().ref("ProfilePictures/");
      const fileRef = storageRef.child(newFileName);
      var uploadTask = fileRef.put(newPhoto);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {
          // Handle unsuccessful uploads
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            firebase
              .firestore()
              .collection("Users")
              .doc(id)
              .update({ photo: downloadURL, name: name })
              .then(() => {
                //handleClick({ vertical: 'top', horizontal: 'right' })
                setIsLoading(false);
                handleClick();
              });
          });
        }
      );
    } else {
      firebase.firestore().collection("Users").doc(id).update({
        name: name,
      });
      handleClick();
      setIsLoading(false);
    }
  };
  useEffect(() => getData(), []);
  const listContracheque = data.map((item, index) => (
    <>
      {item.type === "Contracheque" ? (
        <tr key={index + item.file}>
          <td>{item.date}</td>
          <td>
            <a href={item.file}>{item.type}</a>
          </td>
        </tr>
      ) : null}
    </>
  ));
  const listRendimento = data.map((item, index) => (
    <>
      {item.type === "Rendimento anual" ? (
        <tr key={index + item.file}>
          <td>{item.date}</td>
          <td>
            <a href={item.file}>{item.type}</a>
          </td>
        </tr>
      ) : null}
    </>
  ));
  console.log(data)
  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card style={{height:"100%"}}>
              <CardHeader>
                <h5 className="title">Editar perfil</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>E-mail</label>
                        <Input
                          value={email}
                          disabled
                          placeholder="E-mail"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">Nome</label>
                        <Input
                          disabled
                          value={name}
                          placeholder="Nome"
                          type="email"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            borderStyle: "dotted",
                            borderColor: "#cecece",
                            height: 80,
                          }}
                        >
                          <p>
                            <i className={"tim-icons icon-upload"}></i>{" "}
                            {newFileName !== ""
                              ? newFileName
                              : "Solte ou selecione um arquivo aqui"}
                          </p>
                          <Input
                            onChange={(e) => {
                              handleChangeMainImage(e);
                            }}
                            type="file"
                            name="thumbnail_image"
                            id="thumbnail_image"
                            accept="image/*"
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  onClick={() => submit()}
                  className="btn-fill"
                  color="success"
                  type="submit"
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    Salvar
                    {isLoading === true ? (
                      <div style={{ marginLeft: 7, marginRight: 7 }}>
                        <ClipLoader color="#FFFFFF" size={20} />
                      </div>
                    ) : null}
                  </div>
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card style={{height:"100%"}} className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  {photoURL === "" ? null : (
                    <img
                      alt="..."
                      className="avatar-user-profile"
                      src={photoURL}
                    />
                  )}
                  <h5 className="title">{name}</h5>
                  <p className="description">{email}</p>
                </div>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert onClose={handleClose} severity="success">
                    Atualização realizada com sucesso!
                  </Alert>
                </Snackbar>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
