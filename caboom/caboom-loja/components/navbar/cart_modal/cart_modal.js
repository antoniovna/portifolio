import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState, useEffect } from "react";
import { Grid, Typography, Box, IconButton, Badge } from "@mui/material";
import { styles } from "./cart_modal.styles";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import { is_logged_in } from "./../../../util/api";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

export default function Cart_modal() {
  const classes = styles();
  const [totalOfItems, setTotalOfItems] = useState(0);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  var sortingArray = ["pp", "p", "m", "g", "gg"];
  useEffect(() => {
    is_logged_in().then((res) => {
      setLoggedIn(res);
    });
  }, [loggedIn]);
  const removeItem = (idx) => {
    setCart(cart.splice(idx, 1));
    localStorage.setItem("items", JSON.stringify(cart));
    var amount = 0;
    if (cart) {
      for (let index = 0; index < cart.length; index++) {
        const element = cart[index];
        amount += element.amount;
      }
    }

    setTotalOfItems(amount);
  };
  function get_cart() {
    var local = [];
    var amount = 0;
    local = JSON.parse(localStorage.getItem("items"));
    if (local) {
      for (let index = 0; index < local.length; index++) {
        if (local) {
          const element = local[index];
          amount += element.amount;
        }
      }
    }
    setTotalOfItems(amount);
    setCart(local);
  }
  const update_cart = () => {
    get_cart();
    setTimeout(() => {
      update_cart();
    }, 2000);
  };
  useEffect(() => {
    update_cart();
  }, []);

  const itemTotal = (item) => {
    return (item.amount * (item.piece.price * 1)).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };

  const cartTotal = () => {
    var total = 0;
    for (let index = 0; index < cart?.length; index++) {
      const element = cart[index];
      total += element.amount * element.piece.price;
    }
    return total.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };

  const list_cart = cart?.map((item, idx) => {
    var _sizes = [];
    var amount = 0;
    item.sizes = item.sizes.sort(
      (a, b) => sortingArray.indexOf(a) - sortingArray.indexOf(b)
    );
    item.sizes.forEach((size) => {
      if (size.amount > 0) {
        _sizes.push(size.size);
        amount += size.amount;
      }
    });
    return (
      <Grid
        className={classes.cart_drawer_piece}
        item
        xs={12}
        md={12}
        sm={12}
        lg={12}
        key={"item " + idx}
      >
        <Link href={`/item/${item.piece.id}`}>
          <div className={classes.cart_drawer_image_wraper}>
            <img
              className={classes.cart_drawer_image}
              src={item.piece.images[0]}
              alt=""
            />
          </div>
        </Link>

        <div className={classes.cart_drawer_content_wraper}>
          <Link href={`/item/${item.piece.id}`}>
            <Typography
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "14vw",
              }}
              variant="h6"
            >
              {item.piece.name}
            </Typography>
          </Link>

          <Typography variant="body2">{itemTotal(item)}</Typography>

          <div variant="body2" className={classes.cart_drawer_sizes}>
            {_sizes.map((size, idx) => {
              return (
                <>
                  <Typography
                    key={item.piece.id + " size " + idx}
                    color="primary.accent"
                    variant="body1"
                  >
                    {" "}
                    {size.toUpperCase()}
                    {idx < _sizes.length - 1 && <>,</>}
                  </Typography>
                </>
              );
            })}
          </div>
          <Typography variant="body1">
            {amount} {amount > 1 ? "Itens" : "Item"}
          </Typography>
        </div>
        <div className={classes.cart_item_bin_wrapper}>
          <IconButton onClick={() => removeItem(idx)} color="warning">
            <ClearIcon style={{ fill: "red" }} />
          </IconButton>
        </div>
      </Grid>
    );
  });
  return (
    <>
      {" "}
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {loggedIn ? (
          <Box>
            <Link href="/account">
              <IconButton>
                <PermIdentityIcon />
              </IconButton>
            </Link>
          </Box>
        ) : null}
        {/* <IconButton
          style={{ zIndex: "100" }}
          size="large"
          aria-haspopup="true"
          color="inherit"
          onClick={() => setOpen(!open)}
        >
          <Badge badgeContent={totalOfItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton> */}
      </Box>
      <Modal onClose={() => setOpen(!open)} open={open}>
        <Fade in={open} timeout={350}>
          <Grid className={classes.cart_drawer_wrapper} container spacing={2}>
            <Grid className={classes.cart_drawer_header}>
              <IconButton
                style={{ zIndex: 6000 }}
                onClick={() => setOpen(!open)}
              >
                <CloseIcon />
              </IconButton>
              <div
                style={{ zIndex: 5000 }}
                className={classes.cart_drawer_header_content}
              >
                {" "}
                <Typography variant="body1">Seu Carrinho</Typography>
              </div>
            </Grid>

            {totalOfItems > 0 ? (
              <>
                <Grid className={classes.cart_content_wrapper}>
                  {cart?.items?.length > 0 || (cart && list_cart)}
                </Grid>
                <Grid className={classes.subtotal_wrapper}>
                  <Typography variant="h3" fontWeight="normal">
                    Subtotal: {cartTotal()}{" "}
                  </Typography>
                  <div className={classes.cart_drawer_two_buttons_wrapper}>
                    <button className={classes.keep_shoping_button}>
                      <Typography>Adicionar items</Typography>
                    </button>
                    <button className={classes.access_button}>
                      <Typography>
                        Acessar <PersonIcon />
                      </Typography>
                    </button>
                  </div>
                  <Link href="/checkout">
                    <button
                      onClick={() => {
                        setOpen(false);
                      }}
                      className={classes.cart_drawer_finish_button}
                    >
                      <Typography>Finalizar compra</Typography>
                    </button>
                  </Link>
                </Grid>
              </>
            ) : (
              <>
                <Grid className={classes.empty_cart_wrapper}>
                  <Typography variant="body1" color="primary.light_gray">
                    Seu carrinho está vazio
                  </Typography>
                </Grid>
                <Grid className={classes.subtotal_wrapper}>
                  <div className={classes.cart_drawer_two_buttons_wrapper}>
                    <button className={classes.keep_shoping_button}>
                      <Typography>Adicionar items</Typography>
                    </button>
                    <button className={classes.access_button}>
                      <Typography>
                        Acessar <PersonIcon />
                      </Typography>
                    </button>
                  </div>
                </Grid>
              </>
            )}
          </Grid>
        </Fade>
      </Modal>
    </>
  );
}
