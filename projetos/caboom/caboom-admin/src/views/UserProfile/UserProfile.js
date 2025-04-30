import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import firebase from "./../../initFirebase";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Snackbar from "components/Snackbar/Snackbar.js";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import Loader from "react-loader-spinner";
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tr, setTR] = React.useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const getType = (uid) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        setData(snapshot.data());
      });
  };
  const control = 0;
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setName(user.displayName);
        setEmail(user.email);
        setPhoto(user.photoURL);
        getType(user.uid);
      } else {
        // No user is signed in.
      }
    });
  }, [control]);
  const classes = useStyles();
  const submit = () => {
    /**if (email !== data.email) {
      var user = firebase.auth().currentUser;

      user
        .updateEmail(data.email)
        .then(function () {
          firebase
            .firestore()
            .collection("users")
            .doc(data.uid)
            .update({ email: data.email })
            .then(() => {
              setSeverity("success");
              setMessage("Email atualizada com sucesso");
              setTR(true);
              setIsLoading(false);
            });
        })
        .catch(function (error) {
          setSeverity("danger");
          setMessage("Ocorreu um erro ao atualizar o e-mail");
          setTR(true);
          setIsLoading(false);
        });
    } */

    if (name !== data.name) {
      var user = firebase.auth().currentUser;

      user
        .updateProfile({
          displayName: data.name,
        })
        .then(function () {
          firebase
            .firestore()
            .collection("users")
            .doc(data.uid)
            .update({ name: data.name })
            .then(() => {
              setSeverity("success");
              setMessage("Nome atualizado com sucesso");
              setTR(true);
              setIsLoading(false);
            });
        })
        .catch(function (error) {
          // An error happened.
        });
    }

    if (photo !== data.photo) {
      if (typeof data.photo === "object") {
        let pictureRef = firebase.storage.refFromURL(photo);
        //2.
        pictureRef
          .delete()
          .then(() => {
            //3.
            let storageRef = firebase.storage().ref();
            let fileRef = storageRef.child(data.uid);
            var uploadTask = fileRef.put(data.photo);
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
                      .doc(data.uid)
                      .update({ photo: downloadURL });
                    var user = firebase.auth().currentUser;

                    user
                      .updateProfile({
                        photoURL: downloadURL,
                      })
                      .then(function () {
                        setSeverity("success");
                        setMessage("Foto atualizada com sucesso");
                        setTR(true);
                        setIsLoading(false);
                      })
                      .catch(function (error) {
                        setSeverity("danger");
                        setMessage("Erro ao atualizar a foto");
                        setTR(true);
                        setIsLoading(false);
                      });
                  });
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  return (
    <div>
      <Snackbar
        place="tr"
        color={severity}
        icon={severity !== "success" ? ErrorIcon : DoneIcon}
        message={message}
        open={tr}
        closeNotification={() => setTR(false)}
        close
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Editar perfil</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={7} md={6}>
                  <CustomInput
                    labelText="Nome"
                    adornment={<AccountBoxIcon />}
                    value={data.name}
                    onChangeText={(e) => {
                      setData({
                        ...data,
                        name: e.target.value,
                      });
                    }}
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={7} md={5}>
                  <CustomInput
                    labelText="E-mail"
                    adornment={<AlternateEmailIcon />}
                    value={data.email}
                    disabled
                    onChangeText={(e) => {
                      setData({
                        ...data,
                        email: e.target.value,
                      });
                    }}
                    id="mail"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={7} md={6}>
                  <input
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    id="drop-file-input"
                    onChange={(e) => {
                      if (e.target) {
                        setData({ ...data, photo: e.target.files[0] });
                      } else {
                        setData({ ...data, photo: null });
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={7} md={5}>
                  {typeof data.photo === "object" ? (
                    <img
                      alt=""
                      className="carousel-drop-image-new-user"
                      src={URL.createObjectURL(data.photo)}
                    />
                  ) : null}
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              {isLoading ? (
                <Loader
                  type="MutatingDots"
                  color="#fbcd00"
                  secondaryColor="#F3F96E"
                />
              ) : (
                <Button onClick={() => submit()} color="primary">
                  Atualizar perfil
                </Button>
              )}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <img
                src={photo}
                className="carousel-drop-image-new-user"
                alt="..."
              />
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{data.type}</h6>
              <h4 className={classes.cardTitle}>{name}</h4>
              <p className={classes.description}>{email}</p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
