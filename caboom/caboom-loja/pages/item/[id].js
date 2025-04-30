import { useState, useEffect, useRef } from "react";
import { Typography, Grid, Container } from "@mui/material";
import { styles } from "../../assets/styles/item/id.styles";
import { useRouter } from "next/router";
import { get_piece } from "./../../util/api";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { PageHead } from "./../../components/head/head";

export default function Piece() {
  const classes = styles();
  const router = useRouter();
  const [piece, setPiece] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [leftSize, setLeftSize] = useState(null);
  const [isPreviousCartItem, setIsPreviousCartItem] = useState(false);
  var sortingArray = ["pp", "p", "m", "g", "gg"];

  const { id } = router.query;
  var leftRef = useRef(<div />);
  const update_sizes = (_sizes) => {
    var found = false;
    var new_sizes = [];
    console.log("triggered => ", _sizes);
    var localSizes = JSON.parse(localStorage.getItem("items"));
    for (let index = 0; index < localSizes?.length; index++) {
      const element = localSizes[index];
      if (element.piece.id === piece?.id) {
        found = true;
        setIsPreviousCartItem(true);
        new_sizes = element.sizes;
      }
    }

    if (!found) {
      for (let index = 0; index < Object.keys(_sizes).length; index++) {
        const element = Object.keys(_sizes)[index];
        if (_sizes[element] * 1 > 0) {
          new_sizes.push({
            size: element,
            stock: _sizes[element],
            amount: 0,
          });
        }
      }
    }

    setSizes(new_sizes);
  };
  const leftWidth = () => {
    if (leftRef?.current) {
      setLeftSize(leftRef?.current?.offsetWidth);
    }
  };
  const fetch = () => {
    get_piece(id).then((result) => {
      var stock = [];
      stock = result.stock;
      var newStock = {};
      function sortArrayByArray(a, b) {
        return sortingArray.indexOf(a) - sortingArray.indexOf(b);
      }

      /*var orderedKeys = Object.keys(stock).sort(sortArrayByArray);
      orderedKeys.forEach(function (key) {
        newStock[key] = stock[key];
      });
      result.stock = newStock; */
      setPiece(result);
      console.log("aaaaaa", result);
      // update_sizes(result.stock);
    });
  };
  useEffect(() => {
    leftWidth();
    fetch();
  }, []);

  const change_sizes = (_size, amount) => {
    if (amount < 0) {
      return;
    }
    setSizes(
      sizes.map((item) =>
        item.size === _size ? { ...item, amount: amount } : item
      )
    );
  };

  const total_amount = () => {
    var amount = 0;

    for (let index = 0; index < sizes.length; index++) {
      const element = sizes[index];
      amount += element.amount;
    }
    return amount;
  };

  const add_to_cart = () => {
    if (total_amount() < 1) {
      return;
    }
    var data = { piece: piece, sizes: sizes, amount: total_amount() };
    var local = JSON.parse(localStorage.getItem("items"));
    if (local) {
      var found_id = false;
      for (let index = 0; index < local.length; index++) {
        const element = local[index];
        if (element.piece.id === piece.id) {
          found_id = true;
          local[index] = data;
        }
      }
      if (!found_id) {
        if (local) {
          local.push(data);
        }
      }
    } else {
      local = [data];
    }
    localStorage.setItem("items", JSON.stringify(local));
  };

  const map_sizes = sizes.map((size, idx) => (
    <div className={classes.size_element_wrapper} key={"sizes " + idx}>
      <IconButton
        onClick={() => {
          change_sizes(size.size, size.amount - 1);
        }}
      >
        <RemoveIcon />
      </IconButton>
      <Typography
        variant="body2"
        fontSize={"medium"}
        className={classes.size_element_text}
      >
        {size.amount} {size.size.toUpperCase()}
      </Typography>
      <IconButton
        onClick={() => {
          change_sizes(size.size, size.amount + 1);
        }}
      >
        <AddIcon />
      </IconButton>
    </div>
  ));

  const cardTotal = () => {
    var amount = 0;

    for (let index = 0; index < sizes.length; index++) {
      const element = sizes[index];
      amount += element.amount;
    }
    if (amount) {
      return (amount * piece.price).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    }
    return null;
  };

  const returnFirstImage = () => {
    if (piece) {
      return piece.images[0];
    } else {
      return "https://firebasestorage.googleapis.com/v0/b/projconexaoafro.appspot.com/o/logo%2Flogo.png?alt=media&token=a8e5da75-e4f4-4689-883b-1f5063cbee06";
    }
  };
  const tags = {
    title: piece ? `${piece.name} | Caboom` : `Caboom`,
    url: piece ? `/item/${piece.id}` : "/",
    description: ``,
    image: returnFirstImage(),
  };
  return (
    <div className={classes.piece_page_wrap}>
      <PageHead tags={tags} />
      <div className={classes.piece_page_content}>
        <div className={classes.piece_page_left}>
          <div className={classes.piece_page_carousel_wrapper}>
            <div
              container
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "row",
                width: "60vW",
                flexWrap: "wrap",
              }}
              spacing={2}
            >
              {piece?.images?.map((image, idx) => (
                <div
                  item
                  key={"piece page image " + idx}
                  style={{
                    padding: "8px",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                  sm={12}
                  md={6}
                  lg={6}
                >
                  <img
                    className={classes.piece_page_image}
                    src={image}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div ref={leftRef} className={classes.piece_page_right}>
          <div
            style={{ width: leftSize ? leftSize : "30vw" }}
            className={classes.piece_page_right_content}
          >
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              container
              spacing={2}
            >
              <Grid item xs="12" md="12" lg="12">
                <Typography className={classes.item_header_title} variant="h5">
                  {piece?.name}
                </Typography>
              </Grid>
              {/* <Grid item xs="12" md="12" lg="12">
                <Typography
                  fontWeight={"600"}
                  variant="h5"
                  color="primary.accent"
                >
                  {" "}
                  {(piece?.price * 1).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Typography>
              </Grid> */}
              {/* <div
                style={{
                  display: "inline-flex",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  flexWrap: "wrap",
                  padding: "5px 10px 5px 10px",
                  justifyContent: "center",
                }}
              >
                {map_sizes}
              </div> */}

              {/* <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                item
                xs="12"
                md="12"
                lg="12"
              >
                <button
                  onClick={() => add_to_cart()}
                  className={classes.add_to_cart_button}
                >
                  <Typography variant="body2" color="primary.white">
                    {isPreviousCartItem ? "Atualizar" : "Adicionar"}
                  </Typography>
                  {cardTotal() ? (
                    <Typography
                      variant="body2"
                      color="primary.accent"
                      fontWeight={"bold"}
                    >
                      {cardTotal()}
                    </Typography>
                  ) : (
                    <ShoppingCartIcon
                      style={{ width: "25px", height: "25px" }}
                    />
                  )}
                </button>
              </Grid> */}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
