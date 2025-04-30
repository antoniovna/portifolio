import React from "react";
import DropItem from "./dropitem";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";

export default function Drops({ data, handleChange, brands }) {
  const changeName = (value, id) => {
    var values = [...data];
    values[id].name = value;
    handleChange(values);
  };

  const changePrice = (value, id) => {
    var values = [...data];
    values[id].price = value;
    handleChange(values);
  };
  const changeDescription = (value, id) => {
    var values = [...data];
    values[id].description = value;
    handleChange(values);
  };

  const changeBrands = (value, id) => {
    var values = [...data];
    values[id].brands = value;
    handleChange(values);
  };
  const changeStock = (value, id, index, prop) => {
    var values = [...data];
    values[id].pieces[index].stock[prop] = value;
    handleChange(values);
  };

  const changePieceDescription = (value, id, index) => {
    var values = [...data];
    console.log(values[id].pieces[index].description)
    values[id].pieces[index].description = value;
    handleChange(values);
  };
  const changePieces = (value, id, index, prop) => {
    var values = [...data];
    values[id].pieces[index][prop] = value;
    handleChange(values);
  };
  const changeImages = (value, id) => {
    var values = [...data];
    values[id].images = value;
    handleChange(values);
  };
  const removeImages = (id, index) => {
    var values = [...data];
    values[id].images.splice(index, 1);
    handleChange(values);
  };
  const removeDrop = (id) => {
    var values = [...data];
    values.splice(id, 1);
    handleChange(values);
  };
  const removePiece = (id, index) => {
    var values = [...data];
    values[id].pieces.splice(index, 1);
    handleChange(values);
  };
  const deleteImages_pieces = (id, piece, index) => {
    var values = [...data];
    values[id].pieces[piece].images.splice(index, 1);
    handleChange(values);
  };
  const addImages = (id) => {
    var values = [...data];
    values[id].images.push("");
    handleChange(values);
  };

  const addPieces = (id) => {
    var values = [...data];
    values[id].pieces.push({
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
    });
    handleChange(values);
  };
  return (
    <>
      {data.map((drop, index) => (
        <DropItem
          key={index}
          name={drop.name}
          price={drop.price}
          brands={brands}
          id={drop.id}
          description={drop.description}
          images={drop.images}
          selectedBrands={drop.brands}
          stock={drop.stock}
          pieces={drop.pieces}
          changeName={(e, i) => changeName(e, i)}
          changePrice={(e, i) => changePrice(e, i)}
          changeBrands={(e, i) => changeBrands(e, i)}
          changeStock={(e, i, index, prop) => changeStock(e, i, index, prop)}
          changePieces={(e, i, index, prop) => changePieces(e, i, index, prop)}
          changeImages={(e, i) => changeImages(e, i)}
          changeDescription={(e, i) => changeDescription(e, i)}
          changePieceDescription={(e, i, index) => changePieceDescription(e, i, index)}
          removeImages={(i, index) => removeImages(i, index)}
          deleteImages_pieces={(id, piece, index) =>
            deleteImages_pieces(id, piece, index)
          }
          addImages={(id) => addImages(id)}
          removePiece={(id, index) => removePiece(id, index)}
          addPieces={(id) => addPieces(id)}
          removeDrop={(id) => removeDrop(id)}
        />
      ))}
      <IconButton
        color="primary"
        onClick={() => {
          var values = [...data];

          var newData = {
            id: 0,
            brands: [],
            images: [],
            description: "",
            name: "",
            price: 0,
            stock: {
              pp: 0,
              p: 0,
              m: 0,
              g: 0,
              gg: 0,
            },
            pieces: [
              {
                name: "",
                images: [],
                description: "",
                price: "",
                stock: {
                  pp: 0,
                  p: 0,
                  m: 0,
                  g: 0,
                  gg: 0,
                },
              },
            ],
          };
          if (values[values.length - 1]) {
            newData.id = values[data.length - 1].id + 1;
          }
          values.push(newData);
          handleChange(values);
        }}
      >
        <AddIcon />
      </IconButton>
    </>
  );
}
