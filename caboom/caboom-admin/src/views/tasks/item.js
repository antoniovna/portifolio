import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import CustomInput from "components/CustomInput/CustomInput.js";

import MenuOpenIcon from "@material-ui/icons/MenuOpen";
// a little function to help us with reordering the result
export default function Item({
  data,
  changeName,
  changeDate,
  updateDate,
  updateName,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer
        anchor={"right"}
        open={open}
        style={{ display: "flex", justifyContent: "flex-end" }}
        onClose={() => setOpen(false)}
      >
        <div className="task-item-modal-wrapper">
          <h2>{data.description}</h2>
        </div>
      </Drawer>
      <div className="task-header">
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{marginTop:"-27px"}} >
            <CustomInput
              onBlurProps={() => updateName()}
              value={data.description}
              onChangeText={(e) => {
                changeName(e);
              }}
              id="task Name"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </div>
          <IconButton onClick={() => setOpen(true)}>
            {" "}
            <MenuOpenIcon />
          </IconButton>{" "}
        </div>
      </div>
    </>
  );
}
