import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Carousel from "react-material-ui-carousel";

const styles = makeStyles((theme) => ({
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
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

export default function Lancamento({
  name,
  price,
  id,
  stock,
  description,
  images,
  changePiece,
  changeStock,
  removePiece,
  changePieceDescription,
}) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <>
      <Card>
        <CardHeader color="info">
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <h4 className={classes.cardTitleWhite}>Peça</h4>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton color="secondary" onClick={() => removePiece(id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <p
                style={{ marginLeft: "10px" }}
                className={classes.cardTitleWhite}
              >
                {name} {price !== 0 ? `, R$ ${price}` : ""}
              </p>
            </GridItem>
          </GridContainer>
        </CardHeader>

        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                labelText="Nome"
                value={name}
                onChangeText={(e) => {
                  changePiece(e.target.value, id, "name");
                }}
                id="name"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="R$"
                labelText="Preço"
                value={price}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece(e.target.value, id, "price");
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={8}>
              {images.length > 0 ? (
                <Carousel
                  animation="slide"
                  navButtonsAlwaysVisible={true}
                  swipe={true}
                  indicators={false}
                  className="carousel-drop-images-wrapper"
                >
                  {images.map((item, i) => (
                    <img
                      alt=""
                      className="carousel-drop-image"
                      key={i + "imamge-drop"}
                      src={
                        typeof item === "string"
                          ? item
                          : URL.createObjectURL(item)
                      }
                    />
                  ))}
                </Carousel>
              ) : null}
            </GridItem>
            <GridItem xs={12} sm={6} md={4}>
              <input
                multiple
                type="file"
                id="drop-file-input"
                onChange={(e) => {
                  if (e.target) {
                    var imageList = [];
                    for (
                      let index = 0;
                      index < e.target.files.length;
                      index++
                    ) {
                      const element = e.target.files[index];
                      imageList.push(element);
                    }
                    changePiece(imageList, id, "images");
                  } else {
                    changePiece([], id, "images");
                  }
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={5} md={3}>
              <CustomInput
                adornment="PP"
                labelText="Estoque P"
                value={stock.pp}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changeStock(e.target.value, id, "pp");
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={5} md={3}>
              <CustomInput
                adornment="P"
                labelText="Estoque P"
                value={stock.p}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changeStock(e.target.value, id, "p");
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={5} md={3}>
              <CustomInput
                adornment="M"
                labelText="Estoque M"
                value={stock.m}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changeStock(e.target.value, id, "m");
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={5} md={3}>
              <CustomInput
                adornment="G"
                labelText="Estoque G"
                value={stock.g}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changeStock(e.target.value, id, "g");
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={5} md={3}>
              <CustomInput
                adornment="GG"
                labelText="Estoque GG"
                value={stock.gg}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changeStock(e.target.value, id, "gg");
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                labelText="Descrição"
                value={description}
                multiline
                onChangeText={(e) => {
                  changePieceDescription(e.target.value, id);
                }}
                id="description"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>

          <br />
        </CardBody>
      </Card>
    </>
  );
}
