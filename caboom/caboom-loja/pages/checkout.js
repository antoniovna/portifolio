import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, IconButton, Badge } from "@mui/material";
import { styles } from "../assets/styles/checkout/checkout.styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Cart from "./../components/checkout/cart";
import Payment from "./../components/checkout/payment";
import Login from "./../components/checkout/login";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "next/router";

const steps = ["Carrinho", "Login", "Pagamento"];

export default function Checkout() {
  const classes = styles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [cart, setCart] = useState([]);
  const [totalOfItems, setTotalOfItems] = useState(0);
  const [user, setuser] = useState(null);
  const [orderCreated, setorderCreated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (loggedIn) {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      }
    } else {
      if (activeStep === 2) {
        localStorage.removeItem("items");
        Router.push({
          pathname: "/pedidos",
        });
      } else {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function get_cart() {
    const local = JSON.parse(localStorage.getItem("items"));
    var amount = 0;
    console.log("local => ", local);
    for (let index = 0; index < local.length; index++) {
      const element = local[index];
      amount = element.amount;
    }

    setTotalOfItems(amount);
    setCart(local);
  }
  const change_sizes = (item, size, amount) => {
    var _sizes = cart.find((piece) => piece.piece.id === item);
    for (let index = 0; index < _sizes.length; index++) {
      const element = _sizes[index];
      if (element === size) {
        _sizes[index] = amount;
      }
    }
    setCart(
      cart.map((piece) =>
        piece.piece.id === item ? { ...piece, sizes: _sizes } : piece
      )
    );
  };
  const removeItem = (idx) => {
    var local = cart.splice(idx, 1);
    if (local.length === 1) {
      local = [];
    }
    setCart(local);

    localStorage.setItem("items", JSON.stringify(local));
    var amount = 0;
    if (local) {
      for (let index = 0; index < local.length; index++) {
        const element = local[index];
        amount += element.amount;
      }
    }
    setTotalOfItems(amount);
  };
  useEffect(() => {
    get_cart();
  }, []);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        setuser(_user);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);
  return (
    <div className={classes.checkout_page_wrapper}>
      <Grid container className={classes.checkout_page_body}>
        {totalOfItems > 0 ? (
          <>
            {" "}
            <Stepper
              className={classes.stepper_wrapper}
              activeStep={activeStep}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === 0 && (
              <Cart
                change_sizes={(item, size, amount) =>
                  change_sizes(item, size, amount)
                }
                items={cart}
                remove_item={(idx) => removeItem(idx)}
              />
            )}
            {activeStep === 1 && (
              <Login
                handleBack={() => handleBack()}
                handleNext={() => handleNext()}
                handleLoggedIn={(value) => setLoggedIn(value)}
              />
            )}
            {activeStep === 2 && (
              <Payment
                items={cart}
                user={user}
                handleNext={() => handleNext()}
                cart={cart}
                orderCreated={orderCreated}
                setorderCreated={(value) => setorderCreated(value)}
              />
            )}
          </>
        ) : (
          <div className={classes.checkout_empty_cart_wrapper}>
            <Typography variant="h5">Seu carrinho está vazio</Typography>
            <Link href={"/"}>
              <Typography variant="body1">Adicionar itens</Typography>
            </Link>
          </div>
        )}
      </Grid>
      {totalOfItems > 0 && (
        <>
          {" "}
          <Grid className={classes.checkout_stepper_buttons}>
            <button
              onClick={() => handleBack()}
              className={classes.checkout_go_back_button}
            >
              {" "}
              Voltar
            </button>
            <button
              onClick={() => handleNext()}
              className={classes.checkout_next_button}
            >
              {" "}
              {activeStep === 2 ? "Meus pedidos" : "Próximo"}
            </button>
          </Grid>
        </>
      )}
    </div>
  );
}
