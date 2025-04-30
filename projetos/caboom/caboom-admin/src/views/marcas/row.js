import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import PhotoIcon from "@material-ui/icons/Photo";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
export default function Row({ data, deleteItem }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <>
      <TableRow className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>{data.name}</TableCell>
        <TableCell className={classes.tableCell}>
          {data.photo ? (
            <IconButton color="primary" onClick={() => window.open(data.photo)}>
              <PhotoIcon />
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton color="secondary" onClick={() => deleteItem(data.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
