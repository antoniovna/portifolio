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
import Pieces from "./pieces";
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

export default function Details({ data, props_brands, close, _pieces }) {
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
  const [pieces, setPieces] = useState(_pieces ? _pieces : []);
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
    var dropsData = data;
    dropsData.pieces = pieces;
    setDrop(dropsData);
  };

  useEffect(() => {
    treatDrops();
  }, [data]);

  const submit = async () => {
    try {
      console.log("aqui");
      setIsloading(true);

      await firebase.firestore().collection("drops").doc(drop.id).update({
        brands: brands,
        images: drop.images,
        name: name,
        end: end,
        start: date,
        description: "string",
      });
      pieces.forEach(async (item) => {
        await firebase
          .firestore()
          .collection("pieces")
          .doc(item.id)
          .update(item);
      });
      setIsloading(false);
      setMessage("Drop atualizado com sucesso");
      setSeverity("success");
      setTimeout(function () {
        setTR(false);
      }, 6000);
    } catch (error) {
      console.log("error ", error);
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
  const changePiece = (id, prop, value) => {
    setPieces(
      pieces.map((item) => (item.id === id ? { ...item, [prop]: value } : item))
    );
  };
  console.log("pieces ---- ", pieces, drop);
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
              {pieces.map((piece, index) => (
                <Pieces
                  name={piece.name}
                  price={piece.price}
                  oldPrice={piece.oldPrice}
                  id={piece.id}
                  stock={piece.stock}
                  description={piece.description}
                  category={piece.category}
                  height={piece.height}
                  width={piece.width}
                  length={piece.length}
                  weight={piece.weight}
                  insurance_value={piece.insurance_value}
                  subcategory={piece.subcategory}
                  images={piece.images}
                  removePieces={(id) =>
                    setPieces(pieces.filter((item) => item.id !== id))
                  }
                  changePiece={(prop, value) =>
                    changePiece(piece.id, prop, value)
                  }
                  key={index}
                />
              ))}
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
