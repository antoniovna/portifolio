import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import IconButton from "@material-ui/core/IconButton";
import Pieces from "./pieces";
import AddIcon from "@material-ui/icons/AddCircle";
import CardFooter from "components/Card/CardFooter";

export default function Lancamento({
  pieces,
  removePieces,
  changePiece,
  addPieces,
  brands,
}) {
  return (
    <>
      <Card>
        <CardHeader color="primary">
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <h4 style={{ color: "#000" }}>Peças</h4>
            </GridItem>
          </GridContainer>
        </CardHeader>
        <CardBody>
          {pieces.map((piece, index) => (
            <Pieces
              name={piece.name}
              price={piece.price}
              brands={brands}
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
              selectedBrands={piece.brands}
              subcategory={piece.subcategory}
              images={piece.images}
              removePiece={() => removePieces(piece.id)}
              changePiece={(prop, value) => changePiece(piece.id, prop, value)}
              key={index}
            />
          ))}
        </CardBody>
        <CardFooter>
          <IconButton color="primary" onClick={() => addPieces()}>
            <AddIcon />
          </IconButton>
        </CardFooter>
      </Card>
    </>
  );
}

/**
 *   <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <span>Marcas</span>
              <Select
                styles={{ zIndex: 10 }}
                value={selectedBrands}
                options={brands}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                onChange={(e) => {
                  changeBrands(e, id);
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
                  changeName(e.target.value, id);
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
                  changePrice(e.target.value, id);
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
                    changeImages(imageList, id);
                  } else {
                    changeImages([], id);
                  }
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
                  changeDescription(e.target.value, id);
                }}
                id="description"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
          </GridContainer>
          {pieces.map((piece, index) => (
            <Pieces
              name={piece.name}
              id={index}
              stock={piece.stock}
              images={piece.images}
              description={piece.description}
              price={piece.price}
              key={index + " piece-item"}
              changeStock={(e, index, prop) => changeStock(e, id, index, prop)}
              changePiece={(e, index, prop) => {
                changePieces(e, id, index, prop);
              }}
              changePieceDescription={(e, index) =>
                changePieceDescription(e, id, index)
              }
              changeImages={(e, index, prop) =>
                changePieces(e, id, index, prop)
              }
              addPieces={(index) => addPieces(id, index)}
              removePiece={(index) => removePiece(id, index)}
            />
          ))}
          <IconButton color="primary" onClick={() => addPieces(id)}>
            <AddIcon />
          </IconButton>
          <br />
 */
