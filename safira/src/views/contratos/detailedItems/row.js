import React, { useState } from "react";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Modal from "@material-ui/core/Modal";
import { IconButton } from "@material-ui/core";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import moment from "moment";
export default function Row({ data }) {
  const [open, setOpen] = useState(false);
  const value_c = () => {
    var value = 0;
    for (let index = 0; index < data.items.length; index++) {
      const element = data.items[index];
      value = element.PRECO_TOTAL_ITEM + value;
    }
    return value;
  };
  const value_d = () => {
    var value = 0;
    for (let index = 0; index < data.items.length; index++) {
      const element = data.items[index];
      value = element.PRECO_TOTAL_ITEM + value;
    }
    return value;
  };

  var dateInPast = function (firstDate) {
    var todayDate = moment(new Date(), "DD-MM-YYYY");
    var pastDate = moment(firstDate, "DD-MM-YYYY");

    if (todayDate.isBefore(pastDate)) {
      return <p style={{ color: "green" }}>{data.items[0].DATA_CAPA}</p>;
    } else {
      return <p style={{ color: "red" }}>{data.items[0].DATA_CAPA}</p>;
    }
  };

  const total_value = () => {
    var value = 0;
    for (let index = 0; index < data.items.length; index++) {
      const element = data.items[index];
      value = element.PRECO_TOTAL_ITEM + value;
    }
    return value;
  };

  const stock = () => {
    var value = 0;
    for (let index = 0; index < data.items.length; index++) {
      const element = data.items[index];
      value = element.ESTOQUE_ATUAL + value;
    }
    return value;
  };

  return (
    <>
      <Modal
        open={open}
        className="contracts-modal-wrapper"
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Card className="contracts-modal-content">
          <CardHeader>
            <CardTitle>{data.nome_item}</CardTitle>
          </CardHeader>
          <CardBody></CardBody>
        </Card>
      </Modal>
      <tr>
        <td>
          <IconButton color="primary" onClick={() => setOpen(!open)}>
            <MenuOpenIcon />
          </IconButton>
        </td>
        <td>{data.id_produto *1}</td>
        <td>Saldo</td>
        <td>{stock()}</td>
        <td>{value_c()}</td>
        <td>{value_d()}</td>
        <td>{total_value()}</td>
        <td>Markup</td>
        <td>{dateInPast(data.items[0].DATA_CAPA)}</td>
      </tr>
    </>
  );
}
