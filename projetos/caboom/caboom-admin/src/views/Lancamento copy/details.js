import React, { useEffect, useState } from "react";
import firebase from "./../../initFirebase";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Lancamento from "./lancamento";
import AppBar from "@material-ui/core/AppBar";
import Drop from "./drop";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "components/CustomButtons/Button.js";
import Loader from "react-loader-spinner";
import { element } from "prop-types";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Details({ data, props_brands, close }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [active, setActive] = useState(data.active);
  const [modal, setModal] = useState(false);
  const [drops, setDrorps] = useState([]);
  const [name, setName] = useState(data.name);
  const [date, setDate] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [brands] = useState(props_brands);
  const [selectedBrands, setSelectedBrands] = useState(data.brands);
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
  const handleBrands = (value) => {
    setSelectedBrands(value);
  };
  const treatDrops = async () => {
    var dropsToTreat = data.drops;
    var piecesToTreat = data.pieces;
    var dropsData = [];
    var piecesData = [];
    console.log(dropsToTreat, piecesToTreat);
    for (let index = 0; index < dropsToTreat.length; index++) {
      const dropId = dropsToTreat[index];
      await firebase
        .firestore()
        .collection("drops")
        .doc(dropId)
        .get()
        .then((doc) => {
          dropsData.push(doc.data());
        });
    }
    for (let index = 0; index < piecesToTreat.length; index++) {
      const pieceId = piecesToTreat[index];
      await firebase
        .firestore()
        .collection("pieces")
        .doc(pieceId)
        .get()
        .then((doc) => {
          piecesData.push(doc.data());
        });
    }
    console.log(piecesData, dropsData);
    for (let index = 0; index < dropsData.length; index++) {
      const dropElement = dropsData[index];
      for (let idx = 0; idx < piecesData.length; idx++) {
        const pieceElement = piecesData[idx];
        if (dropElement.pieces.includes(pieceElement.id)) {
          dropsData[index].pieces[
            dropElement.pieces.indexOf(pieceElement.id)
          ] = pieceElement;
        }
      }
    }
    setDrop(dropsData);
  };

  useEffect(() => {
    treatDrops();
  }, [data]);

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
          var images_url = [];
          for (let idx = 0; idx < piece.images.length; idx++) {
            const image_element = piece.images[idx];
            if (typeof image_element === "string") {
              images_url.push(image_element);
            }
          }
          pieces[index].push({
            id: piece.id,
            drop: piece.drop,
            brands: element.brands,
            release: piece.release,
            name: piece.name,
            images: images_url,
            description: "",
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
        var images_url_drop = [];
        for (let idx = 0; idx < element.images.length; idx++) {
          const image_element_drop = element.images[idx];
          if (typeof image_element_drop === "string") {
            images_url_drop.push(image_element_drop);
          }
        }
        drops.push({
          id: element.id,
          release: element.release,
          brands: element.brands,
          images: images_url_drop,
          name: element.name,
          price: element.price,
          pieces: [],
        });
      }
      var release = {
        name: name,
        id: data.id,
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
        .doc(release.id)
        .update({
          name: name,
          id: data.id,
          end: end,
          start: date,
          brands: selectedBrands,
          drops: data.drops,
          pieces: data.pieces,
          acive: false,
        })
        .then(async () => {
          release_id = release.id;
          drop_ids = [];
          for (let index = 0; index < drops.length; index++) {
            const kit = drops[index];
            if(kit.id){
              await firebase
              .firestore()
              .collection("drops")
              .doc(kit.id)
              .update({
                brands: element.brands,
                images: element.images
                  ? typeof element.images[0] === "string"
                    ? element.images
                    : []
                  : [],
                name: element.name,
                price: element.price,
              });
            } 
          }
          for (let index = 0; index < pieces.length; index++) {
            const element = pieces[index];
            for (let idx = 0; idx < element.length; idx++) {
              const item = element[idx];
              await firebase
                .firestore()
                .collection("pieces")
                .add({
                  drop: item.drop,
                  brands: item.brands,
                  release: item.release,
                  name: item.name,
                  images: item.images,
                  description: "",
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
            close();
          }, 6000);
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
      if (typeof file !== "string") {
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
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                urls.push(downloadURL);
                firebase
                  .firestore()
                  .collection(collection)
                  .doc(id)
                  .update({ images: urls });
              });
          }
        );
      }
    });
  };
  return (
    <>
      <GridContainer style={{ width: "60vw", overflowX: "hidden" }}>
        <GridItem xs={12} sm={12} md={12}>
          <AppBar style={{ backgroundColor: "#000" }} position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
            </Tabs>
          </AppBar>{" "}
          <TabPanel value={value} index={0}>
            <GridItem xs={12} sm={12} md={12}>
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
            </GridItem>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <GridItem xs={12} sm={12} md={12}>
              <Drop
                brands={selectedBrands}
                handleChange={(e) => setDrop(e)}
                data={drop}
              />
            </GridItem>
          </TabPanel>
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
        </GridItem>
      </GridContainer>
    </>
  );
}
