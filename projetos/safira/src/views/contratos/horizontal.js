import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import { Card, CardHeader, CardBody } from "reactstrap";

const options = {
  onClick: (e, element) => {
    if (element.length > 0) {
      var ind = element[0]._index;
      alert(ind);
    }
  },
  scales: {
    xAxes: [
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
  tooltips: {
    enabled: true,
  },
};

const HorizontalBarChart = ({ data }) => (
  <>
    <Card>
      <CardHeader>
        <h3>{"Laboratórios"}</h3>
      </CardHeader>
      <CardBody>
        <HorizontalBar data={data} options={options} />
      </CardBody>
    </Card>
  </>
);

export default HorizontalBarChart;
