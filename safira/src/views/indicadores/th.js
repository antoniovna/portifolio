import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import FunctionsIcon from "@material-ui/icons/Functions";
import FontDownloadIcon from "@material-ui/icons/FontDownload";
export default function Th({
  change,
  delete_column,
  change_type,
  th,
  invalid,
  change_label,
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <div style={{ marginTop: "10px", display:"flex", flexDirection:"row" }}>
      <IconButton
        className="indicator-type-button"
        color="primary"
        onClick={() => {
          change_type();
        }}
      >
        {th.type === "calculus" ? <FunctionsIcon /> : <FontDownloadIcon />}
      </IconButton>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {th.type === "calculus" ? (
          <input
            placeholder="Título"
            className="indicators-simple-input"
            value={th.label}
            onChange={(e) => change_label(e)}
          />
        ) : (
          <label>Campo</label>
        )}
        <Input
          style={{
            borderColor: invalid ? "" : "red",
          }}
          placeholder="Campo"
          className=""
          value={th.value}
          onChange={(e) => change(e)}
        />
      </div>
      <IconButton
        color="secondary"
        onClick={() => {
          delete_column();
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
