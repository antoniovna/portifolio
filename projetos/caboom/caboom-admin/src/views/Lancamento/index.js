import React, { useState, useEffect } from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Drop from "./drop";
import DropItem from "./dropitem";
import firebase from "./../../initFirebase";
import Button from "components/CustomButtons/Button.js";
import Loader from "react-loader-spinner";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "components/Snackbar/Snackbar.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Row from "./row";
// core components
import stylesTable from "assets/jss/material-dashboard-react/components/tableStyle.js";
function getSteps() {
  return ["Drop", "Peças"];
}

export default function Lancamentos() {
  const useStylesTable = makeStyles(stylesTable);
  const classesTable = useStylesTable();
  const [brands, setBrands] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [tr, setTR] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [lancamentos, setLancamentos] = useState([]);

  const [drop, setDrop] = useState({
    name: "",
    brands: [],
    end: "",
    start: "",
    description: "",
    images: [],
    color_1: "",
    color_2: "",
  });
  const [pieces, setPieces] = useState([
    {
      id: 0,
      name: "",
      images: [],
      description: "",
      price: 0,
      stock: {
        pp: 0,
        p: 0,
        m: 0,
        g: 0,
        gg: 0,
      },
      height: 0,
      width: 0,
      length: 0,
      weight: 0,
      insurance_value: 0,
      oldPrice: 0,
      category: [],
      subcategory: [],
      brands: [],
    },
  ]);
  const steps = getSteps();

  const getBrands = () => {
    firebase
      .firestore()
      .collection("marcas")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setBrands((brands) =>
            brands.concat({ label: doc.data().name, value: doc.data().id })
          );
        });
      });
  };

  const changePiece = (id, prop, value) => {
    setPieces(
      pieces.map((item) => (item.id === id ? { ...item, [prop]: value } : item))
    );
  };

  const deleteItem = (id) => {
    firebase
      .firestore()
      .collection("drops")
      .doc(id)
      .delete()
      .then(() => {
        fetch();
        setTR(true);
        setMessage("Lançamento excluído com sucesso");
        setSeverity("success");
        setTimeout(function () {
          setTR(false);
        }, 6000);
      });
  };

  const submit = () => {
    setIsloading(true);
    try {
      var dropId;
      firebase
        .firestore()
        .collection("drops")
        .add({
          name: drop.name,
          brands: drop.brands,
          end: drop.end,
          start: drop.start,
          description: drop.description,
          images: [],
          id: "",
          active: false,
          color_1: drop.color_1,
          color_2: drop.color_2,
          user: {
            email: firebase.auth().currentUser.email,
            name: firebase.auth().currentUser.displayName,
          },
        })
        .then((newDoc) => {
          dropId = newDoc.id;
          firebase
            .firestore()
            .collection("drops")
            .doc(dropId)
            .update({ id: dropId });
          pushUrls(drop.images, dropId, "drops");
          for (let index = 0; index < pieces.length; index++) {
            const element = pieces[index];
            firebase
              .firestore()
              .collection("pieces")
              .add({
                id: "",
                name: element.name,
                images: [],
                brands: element.brands,
                description: element.description,
                //   price: element.price,
                //   stock: element.stock,
                dropId: dropId,
                //    oldPrice: element.oldPrice,
                //    category: element.category.value,
                //    subcategory: element.subcategory.value,
                //    height: element.height,
                //    width: element.width,
                //    length: element.length,
                //    weight: element.weight,
                //     insurance_value: element.insurance_value,
              })
              .then((newPiece) => {
                firebase
                  .firestore()
                  .collection("pieces")
                  .doc(newPiece.id)
                  .update({ id: newPiece.id });
                pushUrls(element.images, newPiece.id, "pieces");
              });
          }
        });
      setIsloading(false);
      setTR(true);
      setMessage("Drop cadastrado com sucesso");
      setSeverity("success");
      setTimeout(function () {
        setTR(false);
      }, 6000);
    } catch (error) {
      setIsloading(false);
      setTR(true);
      setMessage(
        "Ocorreu um erro ao cadastrar o lançamento, verifique as informações e tente novamente"
      );
      setSeverity("danger");
      setTimeout(function () {
        setTR(false);
      }, 6000);
    }
  };

  const pushUrls = async (files, id, collection) => {
    var urls = [];
    files.forEach((file) => {
      let storageRef = firebase.storage().ref();
      let fileRef = storageRef.child(file.name);
      var uploadTask = fileRef.put(file);
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

  const fetch = () => {
    firebase
      .firestore()
      .collection("drops")
      .onSnapshot((snapshot) => {
        setLancamentos([]);
        snapshot.forEach((doc) => {
          setLancamentos((lancamentos) => lancamentos.concat(doc.data()));
        });
      });
  };
  const control = 0;
  useEffect(() => {
    getBrands();
    fetch();
  }, [control]);

  const listData = lancamentos.map((item, index) => (
    <Row
      key={index + item.name}
      brands={brands}
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
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step onClick={() => setActiveStep(index)} key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {isLoading === true ? (
              <Loader
                type="MutatingDots"
                color="#fbcd00"
                secondaryColor="#F3F96E"
              />
            ) : (
              <Button
                disabled={activeStep !== 1 ? true : false}
                onClick={() => submit()}
                color="primary"
              >
                Enviar
              </Button>
            )}
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            {activeStep === 0 ? (
              <Drop
                brands={brands}
                end={drop.end}
                date={drop.start}
                description={drop.description}
                images={drop.images}
                selectedBrands={drop.brands}
                color_1={drop.color_1}
                color_2={drop.color_2}
                selectBrand={(e) => setDrop({ ...drop, brands: e })}
                setDate={(e) => setDrop({ ...drop, start: e.target.value })}
                setEnd={(e) => setDrop({ ...drop, end: e.target.value })}
                setName={(e) => setDrop({ ...drop, name: e.target.value })}
                setDescription={(e) =>
                  setDrop({ ...drop, description: e.target.value })
                }
                setImages={(e) => setDrop({ ...drop, images: e })}
                setFirstColor={(e) => setDrop({ ...drop, color_1: e })}
                setSecondColor={(e) => setDrop({ ...drop, color_2: e })}
              />
            ) : null}
            {activeStep === 1 ? (
              <DropItem
                pieces={pieces}
                brands={brands}
                removePieces={(id) =>
                  setPieces(pieces.filter((item) => item.id !== id))
                }
                changePiece={(id, prop, value) => changePiece(id, prop, value)}
                addPieces={() => {
                  var newData = {
                    id: 0,
                    name: "",
                    images: [],
                    description: "",
                    price: 0,
                    oldPrice: 0,
                    stock: {
                      pp: 0,
                      p: 0,
                      m: 0,
                      g: 0,
                      gg: 0,
                    },
                  };
                  if (pieces[pieces.length - 1]) {
                    newData.id = pieces[pieces.length - 1].id + 1;
                  }
                  setPieces((pieces) => [...pieces, newData]);
                }}
              />
            ) : null}
          </GridItem>
        </GridContainer>
        <br />
        <br />
        <br />

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 style={{ color: "#000" }}>Drops</h4>
              </CardHeader>
              <CardBody>
                <Table className={classesTable.table}>
                  <TableHead className={classesTable["primaryTableHeader"]}>
                    <TableRow className={classesTable.tableHeadRow}>
                      {["", "Nome", "Peças", "", "Ativo"].map((prop, key) => {
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
      </div>
    </>
  );
}
