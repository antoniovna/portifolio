import React, { useState, useEffect } from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Lancamento from "./lancamento";
import Drop from "./drop";
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
  return ["Lançamento", "Drops"];
}

export default function Lancamentos() {
  const useStylesTable = makeStyles(stylesTable);
  const classesTable = useStylesTable();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [end, setEnd] = useState("");
  const [brands, setBrands] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [tr, setTR] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [lancamentos, setLancamentos] = useState([]);
  const [drop, setDrop] = useState([
    {
      id: 0,
      brands: [],
      images: [],
      name: "",
      description: "",
      price: 0,
      pieces: [
        {
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
        },
      ],
    },
  ]);
  const steps = getSteps();

  const handleBrands = (value) => {
    setSelectedBrands(value);
  };
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
  const submit = async () => {
    try {
      var pieces = [];
      var drops = [];
      var release_id = "";
      var drop_ids = [];
      var piece_ids = [];

      for (let index = 0; index < drop.length; index++) {
        setIsloading(true);
        const element = drop[index];
        for (let id = 0; id < element.pieces.length; id++) {
          const piece = element.pieces[id];
          if (!pieces[index]) {
            pieces[index] = [];
          }
          pieces[index].push({
            id: "",
            drop: "",
            brands: element.brands,
            release: "",
            name: piece.name,
            images: piece.images,
            description: piece.description,
            price: piece.price,
            stock: {
              pp: piece.stock.pp,
              p: piece.stock.p,
              m: piece.stock.m,
              g: piece.stock.g,
              gg: piece.stock.gg,
            },
          });
        }
        drops.push({
          id: "",
          release: "",
          brands: element.brands,
          images: element.images,
          description: element.description,
          name: element.name,
          price: element.price,
          pieces: [],
        });
      }
      var release = {
        name: name,
        id: "",
        end: end,
        start: date,
        brands: selectedBrands,
        drops: [],
        pieces: [],
        acive: false,
      };
      await firebase
        .firestore()
        .collection("releases")
        .add(release)
        .then(async (newDoc) => {
          release_id = newDoc.id;
          await firebase
            .firestore()
            .collection("releases")
            .doc(release_id)
            .update({ id: release_id });
          setTR(true);
          setMessage("Lançamento cadastrado com sucesso");
          setSeverity("success");
          setTimeout(function () {
            setTR(false);
          }, 6000);
          drop_ids = [];
          for (let index = 0; index < drops.length; index++) {
            const kit = drops[index];
            await firebase
              .firestore()
              .collection("drops")
              .add({
                id: "",
                release: release_id,
                brands: kit.brands,
                description: kit.description,
                images: [],
                name: kit.name,
                price: kit.price,
                pieces: [],
              })
              .then(async (newDrop) => {
                await firebase
                  .firestore()
                  .collection("drops")
                  .doc(newDrop.id)
                  .update({ id: newDrop.id });
                drop_ids.push(newDrop.id);
                drops[index].id = newDoc.id;
                for (
                  let idx = 0;
                  idx < pieces[drop_ids.length - 1].length;
                  idx++
                ) {
                  pieces[drop_ids.length - 1][idx].drop = newDrop.id;
                }
              });
          }
          for (let index = 0; index < pieces.length; index++) {
            const element = pieces[index];
            for (let idx = 0; idx < element.length; idx++) {
              const item = element[idx];
              await firebase
                .firestore()
                .collection("pieces")
                .add({
                  id: "",
                  drop: item.drop,
                  brands: item.brands,
                  release: release_id,
                  name: item.name,
                  images: [],
                  description: item.description,
                  price: item.price,
                  stock: {
                    pp: item.stock.pp,
                    p: item.stock.p,
                    m: item.stock.m,
                    g: item.stock.g,
                    gg: item.stock.gg,
                  },
                })
                .then(async (newPiece) => {
                  await firebase
                    .firestore()
                    .collection("pieces")
                    .doc(newPiece.id)
                    .update({ id: newPiece.id });
                  if (!piece_ids[index]) {
                    piece_ids[index] = [];
                  }
                  piece_ids[index].push(newPiece.id);
                });
            }
          }
          var allPieces = [];

          for (let index = 0; index < piece_ids.length; index++) {
            const element = piece_ids[index];
            console.log(
              "element => ",
              element,
              pieces[index][0],
              drop_ids[index]
            );
            for (let idx = 0; idx < element.length; idx++) {
              const element2 = element[idx];
              allPieces.push(element2);
            }
            await firebase
              .firestore()
              .collection("drops")
              .doc(drop_ids[index])
              .update({ pieces: element });
          }
          for (let idx = 0; idx < drops.length; idx++) {
            const element = drops[idx];
            if (element.images) {
              console.log(drop_ids);
              await pushUrls(element.images, drop_ids[idx], "drops");
              setMessage("Drop cadastrado com sucesso");
              setSeverity("success");
              setTimeout(function () {
                setTR(false);
              }, 6000);
            } else {
              setMessage("Drop cadastrado com sucesso");
              setSeverity("success");
              setTimeout(function () {
                setTR(false);
              }, 6000);
            }
          }
          await firebase
            .firestore()
            .collection("releases")
            .doc(release_id)
            .update({ drops: drop_ids, pieces: allPieces });
          for (let idx = 0; idx < pieces.length; idx++) {
            const element = pieces[idx];
            for (let id = 0; id < element.length; id++) {
              const piece = element[id];
              if (piece.images) {
                await pushUrls(piece.images, piece_ids[idx][id], "pieces");
              }
            }
          }
          setMessage("Peças cadastradas com sucesso");
          setSeverity("success");
          setTimeout(function () {
            setTR(false);
          }, 6000);
          setName("");
          setActiveStep(0);
          setDate("");
          setEnd("");
          setDrop([
            {
              id: 0,
              brands: [],
              images: [],
              name: "",
              price: 0,
              pieces: [
                {
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
                },
              ],
            },
          ]);
          setSelectedBrands([]);
          setIsloading(false);
        });
    } catch (error) {
      setTR(true);
      setMessage("Ocorreu um erro ao cadastrar o lançamento");
      setSeverity("danger");
      setTimeout(function () {
        setTR(false);
      }, 6000);
      setIsloading(false);
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
  const deleteItem = (id) => {
    firebase
      .firestore()
      .collection("releases")
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
  const fetch = () => {
    firebase
      .firestore()
      .collection("releases")
      .onSnapshot((snapshot) => {
        setLancamentos([]);
        snapshot.forEach((doc) => {
          console.log(doc.data());
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
              <Lancamento
                name={name}
                end={end}
                selectedBrands={selectedBrands}
                setName={(e) => setName(e.target.value)}
                date={date}
                setDate={(e) => setDate(e.target.value)}
                setEnd={(e) => setEnd(e.target.value)}
                brands={brands}
                selectBrand={(e) => handleBrands(e)}
              />
            ) : null}
            {activeStep === 1 ? (
              <Drop
                brands={selectedBrands}
                handleChange={(e) => setDrop(e)}
                data={drop}
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
                <h4 style={{ color: "#000" }}>Lançamentos</h4>
              </CardHeader>
              <CardBody>
                <Table className={classesTable.table}>
                  <TableHead className={classesTable["primaryTableHeader"]}>
                    <TableRow className={classesTable.tableHeadRow}>
                      {["", "Nome", "Drops", "", "Ativo"].map((prop, key) => {
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
