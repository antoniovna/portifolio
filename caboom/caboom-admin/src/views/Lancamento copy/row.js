import React, { useState, useEffect } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import firebase from "./../../initFirebase";
import Switch from "@material-ui/core/Switch";
import Drawer from "@material-ui/core/Drawer";
import Details from "./details";
export default function Row({ data, deleteItem, brands }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [active, setActive] = useState(data.active);
  const [modal, setModal] = useState(false);
  const [drops, setDrorps] = useState([]);
  const getDrops = () => {
    for (let index = 0; index < data.drops.length; index++) {
      const element = data.drops[index];
      firebase
        .firestore()
        .collection("drops")
        .doc(element)
        .get()
        .then((snapshot) => {
          setDrorps((drops) => drops.concat(snapshot.data()));
        });
    }
  };

  const listDrops = drops.map((drop, index) => (
    <>
      {drops.length > 4 ? (
        <>
          {index === 0 ? (
            <p key={index + drop.name}>{drop.name}, </p>
          ) : index !== 3 ? (
            <p key={index + drop.name}>{drop.name}, </p>
          ) : (
            <p key={index + drop.name}>...</p>
          )}
        </>
      ) : index === 0 ? (
        <p key={index + drop.name}>{drop.name}, </p>
      ) : index !== drops.length - 1 ? (
        <p key={index + drop.name}>{drop.name}, </p>
      ) : (
        <p key={index + drop.name}>{drop.name}</p>
      )}
    </>
  ));
  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setModal(isOpen);
  };
  useEffect(() => {
    getDrops();
  }, [data]);
  return (
    <>
      <Drawer  anchor={"right"} open={modal} onClose={toggleDrawer(false)}>
        <Details
          close={() => toggleDrawer(false)}
          props_brands={brands}
          data={data}
        />
      </Drawer>
      <TableRow className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>
          <IconButton onClick={() => setModal(true)} color="primary">
            <MenuOpenIcon />
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCell}>{data.name}</TableCell>
        <TableCell className={classes.tableCell}>{listDrops}</TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton color="secondary" onClick={() => deleteItem(data.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Switch
            checked={active}
            color="primary"
            onChange={() => {
              firebase
                .firestore()
                .collection("releases")
                .doc(data.id)
                .update({ active: !active });
              setActive(!active);
            }}
            name="Ativo"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
