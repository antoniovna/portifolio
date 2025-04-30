import React, { useState } from "react";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Modal from "@material-ui/core/Modal";
import { IconButton } from "@material-ui/core";
import moment from "moment";
import Details from "./modal";
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

  const n_items = () => {
    var value = 0;
    for (let index = 0; index < data.items.length; index++) {
      const element = data.items[index];
      value = element.QUANTIDADE_ITEM + value;
    }
    return value;
  };
  var dateInPast = function (firstDate) {
    var todayDate = moment(new Date(), "DD-MM-YYYY");
    var pastDate = moment(firstDate, "DD-MM-YYYY");

    if (todayDate.isBefore(pastDate)) {
      return (
        <p style={{ color: "green" }}>{data.items[0].VALIDADE_CONTRATO}</p>
      );
    } else {
      return <p style={{ color: "red" }}>{data.items[0].VALIDADE_CONTRATO}</p>;
    }
  };
  const show_color = (legenda) => {
    switch (legenda) {
      case "AMARELO NAO LICITAR":
        return "yellow";
      case "NAO CLASSIFICADO":
        return "gray";
      case "ROSA VENDAS SEM DESCONTO":
        return "pink";

      default:
        return "green";
    }
  };
  const show_legendas = () => {
    var legendas = [];
    for (let index = 0; index < data.items.length; index++) {
      const element = data.items[index];
      if (!legendas.includes(element.LEGENDA_COR)) {
        legendas.push(element.LEGENDA_COR);
      }
    }
    return (
      <>
        {legendas.map((legenda, index) => (
          <div
            key={"legenda" + index + " / " + legenda}
            style={{ backgroundColor: show_color(legenda) }}
            className="status-indicator-contract"
          />
        ))}
      </>
    );
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
        <Details data={data} />
      </Modal>
      <tr>
        <td>
          <IconButton color="primary" onClick={() => setOpen(!open)}>
            <MenuOpenIcon />
          </IconButton>
        </td>
        <td></td>
        <td>{data.LICITACAO_ID_ITEM}</td>
        <td>{value_c()}</td>
        <td>{value_d()}</td>
        <td>{value_c() - value_d()}</td>
        <td>{n_items()}</td>
        <td>{dateInPast(data.items[0].VALIDADE_CONTRATO)}</td>
        <td style={{display:"flex", flexDirection:"row"}}>{show_legendas()}</td>
      </tr>
    </>
  );
}
