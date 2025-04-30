import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardBody } from "reactstrap";
const lineOptions = {
  onClick: (e, element) => {
    if (element.length > 0) {
      var ind = element[0]._index;
      alert(ind);
    }
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        // stacked: true,
        gridLines: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
          // Return an empty string to draw the tick line but hide the tick label
          // Return `null` or `undefined` to hide the tick line entirely
          userCallback(value) {
            // Convert the number to a string and splite the string every 3 charaters from the end
            value = value.toString();
            value = value.split(/(?=(?:...)*$)/);

            // Convert the array to a string and format the output
            value = value.join(".");
            return `R$ ${value}`;
          },
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: true,
  },
};

export default function VerticalBar({ data, label }) {
  return (
    <>
      <Card>
        <CardHeader>
          <h3>{label}</h3>
        </CardHeader>
        <CardBody>
          <Bar data={data} options={lineOptions} />
        </CardBody>
      </Card>
    </>
  );
}
