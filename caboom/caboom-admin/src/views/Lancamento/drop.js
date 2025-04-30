import React from "react";
// core components
import Select from "react-select";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import makeAnimated from "react-select/animated";
import { StackedCarousel } from "react-stacked-carousel";
import "react-stacked-carousel/dist/index.css";
const animatedComponents = makeAnimated();

export default function Lancamento({
  date,
  end,
  name,
  brands,
  images,
  description,
  selectedBrands,
  color_1,
  color_2,
  setDate,
  setEnd,
  setName,
  selectBrand,
  setImages,
  setDescription,
  setFirstColor,
  setSecondColor,
}) {
  return (
    <>
      <Card>
        <CardHeader color="primary">
          <h4 style={{ color: "#000" }}>Informações do Drop</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Select
                options={brands}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={selectedBrands}
                onChange={(e) => {
                  selectBrand(e);
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
                  setName(e);
                }}
                id="username"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}></GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Descrição"
                value={description}
                onChangeText={(e) => {
                  setDescription(e);
                }}
                id="descricao"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <p>Início</p>
              <input
                type="datetime-local"
                className="date-input"
                value={date}
                max={end}
                onChange={(e) => setDate(e)}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <p>Fim</p>
              <input
                type="datetime-local"
                className="date-input"
                value={end}
                min={date}
                onChange={(e) => setEnd(e)}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={8}>
              {images &
              (
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
                      key={i + "imamge-drop"}
                      src={
                        typeof item === "string"
                          ? item
                          : URL.createObjectURL(item)
                      }
                    />
                  ))}
                </StackedCarousel>
              )}
            </GridItem>
            <input
              multiple
              type="file"
              id="drop-file-input"
              onChange={(e) => {
                if (e.target) {
                  var imageList = [];
                  for (let index = 0; index < e.target.files.length; index++) {
                    const element = e.target.files[index];
                    imageList.push(element);
                  }
                  setImages(imageList);
                } else {
                  setImages([]);
                }
              }}
            />
          </GridContainer>

          <br />
        </CardBody>
      </Card>
    </>
  );
}
