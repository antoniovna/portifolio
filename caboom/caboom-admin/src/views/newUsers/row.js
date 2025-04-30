import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Switch from "@material-ui/core/Switch";
import firebase from "./../../initFirebase";
import Drawer from "@material-ui/core/Drawer";
import Details from "./details";
export default function Row({ data, deleteItem }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [active, setActive] = useState(data.active);
  const [modal, setModal] = useState(false);
  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
  };
  return (
    <>
      <Drawer anchor={"right"} open={modal} onClose={toggleDrawer(false)}>
        <Details close={() => toggleDrawer(false)} data={data} />
      </Drawer>
      <TableRow className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>
          <IconButton onClick={() => setModal(true)} color="primary">
            <MenuOpenIcon />
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCell}>{data.name}</TableCell>
        <TableCell className={classes.tableCell}>{data.email}</TableCell>

        <TableCell className={classes.tableCell}>{data.type}</TableCell>
        <TableCell>
          <Switch
            checked={active}
            color="primary"
            onChange={() => {
              firebase
                .firestore()
                .collection("users")
                .doc(data.uid)
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
