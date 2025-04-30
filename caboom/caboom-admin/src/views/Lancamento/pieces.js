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
import { StackedCarousel } from "react-stacked-carousel";
import Select from "react-select";
import animatedComponents from "react-select/animated";
import "react-stacked-carousel/dist/index.css";
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
  oldPrice,
  id,
  stock,
  description,
  category,
  subcategory,
  images,
  changePiece,
  removePiece,
  height,
  width,
  length,
  weight,
  insurance_value,
  brands,
  selectedBrands,
}) {
  console.log("images - ", images, name);
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const _category = [
    { label: "Acessórios", value: "Acessórios" },
    { label: "Calçados", value: "Calçados" },
    { label: "Roupas", value: "Roupas" },
  ];

  const _acessorios = [
    { label: "Bolsas", value: "Bolsas" },
    { label: "Mochilas", value: "Mochilas" },
    { label: "Brincos", value: "Brincos" },
    { label: "Anéis", value: "Anéis" },
    { label: "Laces", value: "Laces" },
    { label: "Durags", value: "Durags" },
    { label: "Pulseiras", value: "Pulseiras" },
  ];

  const _calcados = [
    { label: "Sandálias", value: "Sandálias" },
    { label: "Tênis", value: "Tênis" },
  ];
  const _roupas = [
    { label: "Blusas", value: "Blusas" },
    { label: "Camisas", value: "Camisas" },
    { label: "Camisetas", value: "Camisetas" },
    { label: "Shorts", value: "Shorts" },
    { label: "Bermudas", value: "Bermudas" },
    { label: "Calças", value: "Calças" },
    { label: "Casacos", value: "Casacos" },
  ];
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
              <Select
                options={_category}
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={category}
                onChange={(e) => {
                  console.log("cat => ", category);
                  changePiece("category", e);
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
              <Select
                options={
                  category
                    ? category.value === "Roupas"
                      ? _roupas
                      : category.value === "Acessórios"
                      ? _acessorios
                      : _calcados
                    : []
                }
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={subcategory}
                onChange={(e) => {
                  console.log("sub => ", subcategory);
                  changePiece("subcategory", e);
                }}
              />
            </GridItem>
          </GridContainer>
          <br />
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Select
                options={brands}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={selectedBrands}
                onChange={(e) => {
                  changePiece("brands", e);
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                labelText="Nome"
                value={name}
                onChangeText={(e) => {
                  changePiece("name", e.target.value);
                }}
                id="name"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="R$"
                labelText="Preço original"
                value={oldPrice}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("oldPrice", e.target.value);
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="R$%"
                labelText="Preço com desconto"
                value={price}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("price", e.target.value);
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
                <StackedCarousel
                  autoRotate={false}
                  cardClassName="card"
                  leftButton={
                    <button className={"stacked-carousel-buttons"}>
                      {"<"}
                    </button>
                  }
                  rightButton={
                    <button className={"stacked-carousel-buttons"}>
                      {">"}
                    </button>
                  }
                >
                  {images.map((item, i) => (
                    <img
                      alt=""
                      className="carousel-drop-image"
                      key={i + "imamge-drop-piece"}
                      src={
                        typeof item === "string"
                          ? item
                          : URL.createObjectURL(item)
                      }
                    />
                  ))}
                </StackedCarousel>
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
                    changePiece("images", imageList);
                  } else {
                    changePiece("images", []);
                  }
                }}
              />
            </GridItem>
          </GridContainer>
          {stock && (
            <>
              {" "}
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
                      stock.pp = e.target.value;
                      changePiece("stock", stock);
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
                      stock.p = e.target.value;
                      changePiece("stock", stock);
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
                      stock.m = e.target.value;
                      changePiece("stock", stock);
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
                      stock.g = e.target.value;
                      changePiece("stock", stock);
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
                      stock.gg = e.target.value;
                      changePiece("stock", stock);
                    }}
                    id="price"
                    type="number"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </>
          )}
          <GridContainer>
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="cm"
                labelText="Altura"
                value={height}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("height", e.target.value);
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="cm"
                labelText="Largura"
                value={width}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("width", e.target.value);
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
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="cm"
                labelText="Comprimento"
                value={length}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("length", e.target.value);
                }}
                id="price"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="Kg"
                labelText="Peso (quilos)"
                value={weight}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("weight", e.target.value);
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
            <GridItem xs={12} sm={6} md={4}>
              <CustomInput
                adornment="R$"
                labelText="Preço para seguro"
                value={insurance_value}
                onChangeText={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  changePiece("insurance_value", e.target.value);
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
                  changePiece("description", e.target.value);
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
