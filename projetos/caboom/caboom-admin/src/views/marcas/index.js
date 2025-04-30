import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import stylesTable from "assets/jss/material-dashboard-react/components/tableStyle.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Loader from "react-loader-spinner";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "components/Snackbar/Snackbar.js";
import firebase from "./../../initFirebase";
import Row from "./row";

export default function TableList() {
  const useStylesTable = makeStyles(stylesTable);
  const classesTable = useStylesTable();

  const [marca, setMarca] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [file, setFile] = useState([]);
  const [tr, setTR] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [data, setData] = useState([]);
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const pushUrls = async (_files, id, collection) => {
    var urls = [];
    const files = Array.from(_files);
    files.forEach((_file) => {
      let storageRef = firebase.storage().ref();
      let fileRef = storageRef.child(_file.name);
      var uploadTask = fileRef.put(_file);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        function (error) {
          // Handle unsuccessful uploads
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            urls.push(downloadURL);
            firebase
              .firestore()
              .collection(collection)
              .doc(id)
              .update({ images: urls });
          });
        }
      );
    });
  };
  const submit = async () => {
    setIsloading(true);
    firebase
      .firestore()
      .collection("marcas")
      .add({
        name: marca,
        id: "",
        photo: "",
        instagram: instagram,
        description: description,
      })
      .then(async (newDoc) => {
        await firebase.firestore().collection("marcas").doc(newDoc.id).update({
          id: newDoc.id,
        });
        setMarca("");
        setInstagram("");
        setDescription("");
        if (file) {
          pushUrls(file, newDoc.id, "marcas");
          setTR(true);
          setMessage("Marca cadastrada com sucesso");
          setSeverity("success");
          setTimeout(function () {
            setTR(false);
          }, 6000);
          setIsloading(false);
        } else {
          setTR(true);
          setMessage("Marca cadastrada com sucesso");
          setSeverity("success");
          setTimeout(function () {
            setTR(false);
          }, 6000);
          setIsloading(false);
        }
      });
  };

  const getData = () => {
    setData([]);
    firebase
      .firestore()
      .collection("marcas")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setData((data) => data.concat(doc.data()));
        });
      });
  };

  const deleteItem = (id) => {
    firebase
      .firestore()
      .collection("marcas")
      .doc(id)
      .delete()
      .then(() => {
        getData();
        setTR(true);
        setMessage("Marca excluída com sucesso");
        setSeverity("success");
        setTimeout(function () {
          setTR(false);
        }, 6000);
      });
  };
  const control = 0;
  useEffect(() => {
    getData();
  }, [control]);
  const listData = data.map((item, index) => (
    <Row
      key={index + item.name}
      deleteItem={(id) => deleteItem(id)}
      data={item}
    />
  ));
  return (
    <GridContainer>
      <Snackbar
        place="tr"
        color={severity}
        icon={severity !== "success" ? ErrorIcon : DoneIcon}
        message={message}
        open={tr}
        closeNotification={() => setTR(false)}
        close
      />
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h3 style={{ color: "#000" }}>Cadastro de marcas</h3>
          </CardHeader>
          <CardBody>
            <GridItem xs={12} sm={12} md={6}>
              <CustomInput
                labelText="Nome"
                onChangeText={(e) => {
                  setMarca(e.target.value);
                }}
                id="username"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <CustomInput
                labelText="Descrição"
                onChangeText={(e) => {
                  setDescription(e.target.value);
                }}
                multiline={true}
                id="description"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <CustomInput
                labelText="Link do instagram"
                onChangeText={(e) => {
                  setInstagram(e.target.value);
                }}
                id="instagram_link"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <br />
            <GridItem xs={12} sm={12} md={6}>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target) {
                    setFile(e.target.files);
                  } else {
                    setFile(undefined);
                  }
                }}
              />
            </GridItem>
            <br />
            {isLoading === true ? (
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
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h3 style={{ color: "#000" }}>Marcas</h3>
          </CardHeader>
          <CardBody>
            <Table className={classesTable.table}>
              <TableHead className={classesTable["primaryTableHeader"]}>
                <TableRow className={classesTable.tableHeadRow}>
                  {["Nome", "Foto", ""].map((prop, key) => {
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
  );
}
