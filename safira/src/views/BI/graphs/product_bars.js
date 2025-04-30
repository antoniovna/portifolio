import React, { useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import Modal from "@material-ui/core/Modal";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { IconButton } from "@material-ui/core";
function HorizontalBarChart({ data, allData }) {
  const [filtered, setFiltered] = useState([]);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState("");
  const options = {
    onClick: (e, element) => {
      if (element.length > 0) {
        var ind = element[0]._index;
        setSelected(data.labels[ind]);
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

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
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
          <CardBody></CardBody>
        </Card>
      </Modal>
      <HorizontalBar data={data} options={options} />{" "}
    </>
  );
}

export default HorizontalBarChart;
