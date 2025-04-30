import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import Modal from "@material-ui/core/Modal";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { IconButton } from "@material-ui/core";
import Product from "./product_bars";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
function HorizontalBarChart({ data, allData }) {
  const [filtered, setFiltered] = useState([]);
  const [allOldData, setAllOldData] = useState({});
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState("");
  const [limit, setLimit] = useState("top");
  const options = {
    onClick: (e, element) => {
      if (element.length > 0) {
        var ind = element[0]._index;
        setSelected(data.labels[ind]);
        filterData(data.labels[ind], limit);
        openModal();
      }
    },

    tooltips: {
      // enabled: false,
      callbacks: {
        label: (tooltipItem, data) => {
          // Get the dataset label, global label or fall back to empty label
          return data.datasets[tooltipItem.datasetIndex].data[
            tooltipItem.index
          ].toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });
        },
      },
    },
    scales: {
      xAxes: [
        {
          // stacked: true,
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
  };
  function random_rgba() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    var firstColor = o(r() * s);
    var secondColor = o(r() * s);
    var thirdColor = o(r() * s);
    var value1 =
      "rgba(" +
      firstColor +
      "," +
      secondColor +
      "," +
      thirdColor +
      "," +
      1 +
      ")";
    var value2 =
      "rgba(" +
      firstColor +
      "," +
      secondColor +
      "," +
      thirdColor +
      "," +
      0.3 +
      ")";
    return [value1, value2];
  }
  var displayData = {
    labels: [],
    datasets: [
      {
        label: "Produtos",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };
  const filterData = (lab, _limit) => {
    const newData = {};
    var labs = {};
    var sum = 0;
    for (let index = 0; index < Object.keys(allData).length; index++) {
      const element = Object.keys(allData)[index];
      for (let idx = 0; idx < allData[element].produtos.length; idx++) {
        const produto = allData[element].produtos[idx];
        sum += produto.Montante_Oportunidade;
        var laboratorios = produto.POSSIVEIS_FORNECEDORES.split("/");
        var produto_data = produto.Produto_Candidato.split(" ")[0];
        console.log("Laboratórios => ", laboratorios, lab);
        if (laboratorios.includes(lab)) {
          if (!labs[produto_data]) {
            labs[produto_data] = 0;
          }
          labs[produto_data] += produto.Montante_Oportunidade;
          if (!allOldData[produto_data]) {
            allOldData[produto_data] = allData[element];
          }
        }
      }
    }

    labs = Object.fromEntries(
      Object.entries(labs).sort(([, a], [, b]) => b - a)
    );
    for (let index = 0; index < Object.keys(labs).length; index++) {
      const element = Object.keys(labs)[index];
      displayData.labels.push(element);
      displayData.datasets[0].data.push(Math.ceil(labs[element] * 1));
      displayData.datasets[0].backgroundColor.push(random_rgba()[1]);
      displayData.datasets[0].borderColor.push("transparent");
    }

    console.log(displayData, allOldData);
    if (_limit === "top") {
      if (displayData.labels.length > 15) {
        displayData.labels.length = 15;
        displayData.datasets[0].data.length = 15;
        displayData.datasets[0].backgroundColor.length = 15;
        displayData.datasets[0].borderColor.length = 15;
      }
    } else {
      if (displayData.labels.length > 15) {
        displayData.labels = displayData.labels.slice(
          Math.max(displayData.labels.length - 15, 0)
        );
        displayData.datasets[0].data = displayData.datasets[0].data.slice(
          Math.max(displayData.datasets[0].data.length - 15, 0)
        );
        displayData.datasets[0].backgroundColor =
          displayData.datasets[0].backgroundColor.slice(
            Math.max(displayData.datasets[0].backgroundColor.length - 15, 0)
          );
        displayData.datasets[0].borderColor =
          displayData.datasets[0].borderColor.slice(
            Math.max(displayData.datasets[0].borderColor.length - 15, 0)
          );
      }
    }

    setFiltered(displayData);
  };
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const handleChange = (event) => {
    setLimit(event.target.value);
    filterData(selected, event.target.value);
  };
  return (
    <>
      <Modal
        open={modal}
        className="contracts-modal-wrapper"
        onClose={() => closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Card className="contracts-modal-content">
          <CardHeader>
            <IconButton onClick={() => closeModal()}>
              <HighlightOffIcon color="secondary" />
            </IconButton>
            <CardTitle tag="h3">{selected}</CardTitle>
          </CardHeader>
          <CardBody>
            <FormControl component="fieldset">
              <RadioGroup
                style={{ display: "flex", flexDirection: "row" }}
                aria-label="gender"
                name="gender1"
                value={limit}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="top"
                  control={<Radio />}
                  label="Melhores"
                />
                <FormControlLabel
                  value="bottom"
                  control={<Radio />}
                  label="Piores"
                />
              </RadioGroup>
            </FormControl>
            <Product data={filtered} />
          </CardBody>
        </Card>
      </Modal>
      <Bar data={data} options={options} />{" "}
    </>
  );
}

export default HorizontalBarChart;
