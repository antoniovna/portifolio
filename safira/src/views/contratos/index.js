import React, { useState, useEffect } from "react";
import { CardBody, CardHeader, Card, CardFooter, Row, Col } from "reactstrap";
import * as XLSX from "xlsx";
import firebase from "./../../initfirebase";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { ClipLoader } from "react-spinners";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Histogram from "./histogram";
import TotalContracts from "./totalContracts";
import DetailedItems from "./detailedItems";
import DetailedContracts from "./detailedContracts";
import Select from "react-select";
import Horizontal from "./horizontal";
import moment from "moment";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Regionalizacao() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [loops, setLoops] = useState(0);
  const [chosenDataLab, setChosenDataLab] = useState([]);
  const [chosenDataEmployee, setChosenDataEmployee] = useState([]);
  const [optionsLab, setOptionsLab] = useState([]);
  const [optionsEmployee, setOptionsEmployee] = useState([]);
  const [calculatedDataLabs, setCalculatedDataLabs] = useState({});
  const [calculatedDataEmployees, setCalculatedDataEmployees] = useState({});
  const [allLabs, setAllLabs] = useState({});
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    expired: false,
    open: false,
  });
  const [allData, setAllData] = useState({});
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const readFile = (e) => {
    e.preventDefault();
    setIsloading(true);
    var vendedores = {};
    var organized = [];
    try {
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, { type: "binary" });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const lineArray = XLSX.utils.sheet_to_json(ws, { header: 1 });
        var data = {};
        var people = {};
        var labs = {};
        var clients = {};
        var products = {};
        for (let index = 0; index < lineArray.length; index++) {
          var row = lineArray[index];
          if (index > 0) {
            if (data[row[0] * 1]) {
              data[row[0] * 1].push(row);
            } else {
              data[row[0] * 1] = [];
              data[row[0] * 1].push(row);
            }

            if (labs[row[7]]) {
              labs[row[7]].push(row);
            } else {
              labs[row[7]] = [];
              labs[row[7]].push(row);
            }
          }
        }
        setAllLabs(labs);
        setAllData(data);
        setLoops(1);
        setIsloading(false);
        //  for (let index = 0; index < oportunidades.length; index++) {
        //    firebase.firestore().collection("oportunidades").doc(oportunidades[index].id).set(oportunidades[index])
        // }
      };
      reader.readAsBinaryString(f);
    } catch {
      setIsloading(true);
      setSeverity("error");
      setMessage(
        "Ocorreu um erro ao ler os contratos, verifique o formato das colunas do arquivo e tente novamente"
      );
      handleClick();
    }
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
  useEffect(() => {
    treatData();
    treatDataEmployee();
  }, [loops]);

  const checkForValues = (key, array) => {
    if (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].value == key) {
          return true;
        }
      }
    }
    return false;
  };
  const checkFor_all = (array) => {
    if (checkForValues("_all", array)) {
      return true;
    } else {
      return false;
    }
  };

  const returnAllElements = (array) => {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      newArray.push(array[i].label);
    }
    return newArray;
  };
  const treatData = (selected) => {
    setOptionsLab([]);
    var selectInfo = [
      { label: "Todos", value: "_all" },
      {
        label: "Laboratórios",
        options: [],
      },
    ];
    var displayData = {
      labels: [],
      datasets: [
        {
          label: "Laboratórios",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    };

    var values = {};
    for (let ix = 0; ix < Object.keys(allLabs).length; ix++) {
      const element = Object.keys(allLabs)[ix];
      for (let idx = 0; idx < allLabs[element].length; idx++) {
        const labElement = allLabs[element][idx];
        const element2 = allLabs[element][idx][20];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);
        if (
          (selectedOption.expired && isPast) ||
          (selectedOption.open && !isPast)
        ) {
          if (checkFor_all(chosenDataLab)) {
            if (checkFor_all(chosenDataEmployee)) {
              if (!values[element]) {
                values[element] = { value: 0 };
                displayData.labels.push(element);
                var color = random_rgba();
                displayData.datasets[0].backgroundColor.push(color[1]);
                displayData.datasets[0].borderColor.push(color[0]);
              }
              values[element].value = values[element].value + labElement[29];
            }
            if (
              checkForValues(
                element2.split(" ")[0] + " " + element2.split(" ")[1],
                chosenDataEmployee
              )
            ) {
              var labelArray2 = returnAllElements(chosenDataEmployee);

              if (
                labelArray2.includes(
                  element2.split(" ")[0] + " " + element2.split(" ")[1]
                )
              ) {
                if (!values[element]) {
                  values[element] = { value: 0 };
                  displayData.labels.push(element);
                  var color = random_rgba();
                  displayData.datasets[0].backgroundColor.push(color[1]);
                  displayData.datasets[0].borderColor.push(color[0]);
                }
                values[element].value = values[element].value + labElement[29];
              }
            }
          } else {
            if (checkForValues(element, chosenDataLab)) {
              var labelArray = returnAllElements(chosenDataLab);
              if (labelArray.includes(element)) {
                if (checkFor_all(chosenDataEmployee)) {
                  if (!values[element]) {
                    values[element] = { value: 0 };
                    displayData.labels.push(element);
                    var color = random_rgba();
                    displayData.datasets[0].backgroundColor.push(color[1]);
                    displayData.datasets[0].borderColor.push(color[0]);
                  }
                  values[element].value =
                    values[element].value + labElement[29];
                }
                if (
                  checkForValues(
                    element2.split(" ")[0] + " " + element2.split(" ")[1],
                    chosenDataEmployee
                  )
                ) {
                  var labelArray2 = returnAllElements(chosenDataEmployee);

                  if (
                    labelArray2.includes(
                      element2.split(" ")[0] + " " + element2.split(" ")[1]
                    )
                  ) {
                    if (!values[element]) {
                      values[element] = { value: 0 };
                      displayData.labels.push(element);
                      var color = random_rgba();
                      displayData.datasets[0].backgroundColor.push(color[1]);
                      displayData.datasets[0].borderColor.push(color[0]);
                    }
                    values[element].value =
                      values[element].value + labElement[29];
                  }
                }
              }
            }
          }
        }
      }
    }
    for (let index = 0; index < Object.keys(values).length; index++) {
      const element = Object.keys(values)[index];
      displayData.datasets[0].data.push(values[element].value);
    }
    displayData.datasets[0].label = "Valor R$ ";
    setOptionsLab(selectInfo);

    setCalculatedDataLabs(displayData);
  };

  const treatDataEmployee = () => {
    setOptionsEmployee([]);
    var selectInfo = [
      { label: "Todos", value: "_all" },
      {
        label: "Funcionários",
        options: [],
      },
    ];
    var displayData = {
      labels: [],
      datasets: [
        {
          label: "Laboratórios",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    };
    var values = {};
    var filteredData = {};
    var allData2 = {};

    for (let ix = 0; ix < Object.keys(allLabs).length; ix++) {
      const element = Object.keys(allLabs)[ix];
      for (let idx = 0; idx < allLabs[element].length; idx++) {
        const element2 = allLabs[element][idx][20];
        const labElement = allLabs[element][idx];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);
        var added = false;
        if (
          (selectedOption.expired && isPast) ||
          (selectedOption.open && !isPast)
        ) {
          if (checkFor_all(chosenDataEmployee)) {
            if (checkFor_all(chosenDataLab)) {
              if (!filteredData[element]) {
                filteredData[element] = [];
              }
              filteredData[element].push(labElement);
              if (!values[element2]) {
                values[element2] = { value: 0 };
                displayData.labels.push(
                  element2.split(" ")[0] + " " + element2.split(" ")[1]
                );
                var color = random_rgba();
                displayData.datasets[0].backgroundColor.push(color[1]);
                displayData.datasets[0].borderColor.push(color[0]);
              }
              values[element2].value = values[element2].value + labElement[29];
              if (!allData2[element]) {
                allData2[element] = [];
              }
              allData2[element].push(labElement);
            } else {
              if (checkForValues(element, chosenDataLab)) {
                var labelArray = returnAllElements(chosenDataLab);
                if (labelArray.includes(element)) {
                  if (!filteredData[element]) {
                    filteredData[element] = [];
                  }
                  filteredData[element].push(labElement);
                  if (!values[element2]) {
                    values[element2] = { value: 0 };
                    displayData.labels.push(
                      element2.split(" ")[0] + " " + element2.split(" ")[1]
                    );
                    var color = random_rgba();
                    displayData.datasets[0].backgroundColor.push(color[1]);
                    displayData.datasets[0].borderColor.push(color[0]);
                  }
                  values[element2].value =
                    values[element2].value + labElement[29];
                  if (!allData2[element]) {
                    allData2[element] = [];
                  }
                  allData2[element].push(labElement);
                }
              }
            }
          } else {
            if (
              checkForValues(
                element2.split(" ")[0] + " " + element2.split(" ")[1],
                chosenDataEmployee
              )
            ) {
              var labelArray = returnAllElements(chosenDataEmployee);
              if (
                labelArray.includes(
                  element2.split(" ")[0] + " " + element2.split(" ")[1]
                )
              ) {
                if (checkFor_all(chosenDataLab)) {
                  if (!filteredData[element]) {
                    filteredData[element] = [];
                  }
                  filteredData[element].push(labElement);
                  if (!values[element2]) {
                    values[element2] = { value: 0 };
                    displayData.labels.push(
                      element2.split(" ")[0] + " " + element2.split(" ")[1]
                    );
                    var color = random_rgba();
                    displayData.datasets[0].backgroundColor.push(color[1]);
                    displayData.datasets[0].borderColor.push(color[0]);
                  }
                  values[element2].value =
                    values[element2].value + labElement[29];
                  if (!allData2[element]) {
                    allData2[element] = [];
                  }
                  allData2[element].push(labElement);
                } else {
                  if (checkForValues(element, chosenDataLab)) {
                    var labelArray2 = returnAllElements(chosenDataLab);
                    if (labelArray2.includes(element)) {
                      if (!filteredData[element]) {
                        filteredData[element] = [];
                      }
                      filteredData[element].push(labElement);
                      if (!values[element2]) {
                        values[element2] = { value: 0 };
                        displayData.labels.push(
                          element2.split(" ")[0] + " " + element2.split(" ")[1]
                        );
                        var color = random_rgba();
                        displayData.datasets[0].backgroundColor.push(color[1]);
                        displayData.datasets[0].borderColor.push(color[0]);
                      }
                      values[element2].value =
                        values[element2].value + labElement[29];
                      if (!allData2[element]) {
                        allData2[element] = [];
                      }
                      allData2[element].push(labElement);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    //setChosenData(filteredData);
    for (let index = 0; index < Object.keys(values).length; index++) {
      const element = Object.keys(values)[index];
      displayData.datasets[0].data.push(values[element].value);
    }

    displayData.datasets[0].label = "Valor R$ ";
    setOptionsEmployee(selectInfo);
    setData(allData2);
    setCalculatedDataEmployees(displayData);
  };

  const listOptionsLab = () => {
    var selectInfo = [
      { label: "Todos", value: "_all" },
      {
        label: "Laboratórios",
        options: [],
      },
    ];
    var values = {};
    for (let ix = 0; ix < Object.keys(allLabs).length; ix++) {
      const element = Object.keys(allLabs)[ix];
      for (let idx = 0; idx < allLabs[element].length; idx++) {
        const labElement = allLabs[element][idx];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);

        if (selectedOption.expired && isPast) {
          if (!values[element]) {
            values[element] = { value: 0 };
            selectInfo[1].options.push({
              label: element,
              value: element,
            });
          }
        }
        if (selectedOption.open && !isPast) {
          if (!values[element]) {
            values[element] = { value: 0 };
            selectInfo[1].options.push({
              label: element,
              value: element,
            });
          }
        }
      }
    }
    return selectInfo;
  };

  const listOptionsEmployees = () => {
    var selectInfo = [
      { label: "Todos", value: "_all" },
      {
        label: "Funcionários",
        options: [],
      },
    ];

    var values = {};
    for (let ix = 0; ix < Object.keys(allLabs).length; ix++) {
      const element = Object.keys(allLabs)[ix];
      for (let idx = 0; idx < allLabs[element].length; idx++) {
        const element2 = allLabs[element][idx][20];
        const labElement = allLabs[element][idx];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);
        if (selectedOption.expired && isPast) {
          if (!values[element2]) {
            values[element2] = { value: 0 };
            selectInfo[1].options.push({
              label: element2.split(" ")[0] + " " + element2.split(" ")[1],
              value: element2.split(" ")[0] + " " + element2.split(" ")[1],
            });
          }
        }
        if (selectedOption.open && !isPast) {
          if (!values[element2]) {
            values[element2] = { value: 0 };
            selectInfo[1].options.push({
              label: element2.split(" ")[0] + " " + element2.split(" ")[1],
              value: element2.split(" ")[0] + " " + element2.split(" ")[1],
            });
          }
        }
      }
    }
    return selectInfo;
  };

  var dateInPast = function (firstDate, secondDate) {
    var todayDate = moment(new Date(), "DD-MM-YYYY");
    var pastDate = moment(firstDate, "DD-MM-YYYY");

    if (todayDate.isBefore(pastDate)) {
      return false;
    } else {
      return true;
    }
  };
  const totalValue = () => {
    var value = 0;
    for (let ix = 0; ix < Object.keys(allData).length; ix++) {
      const element = Object.keys(allData)[ix];
      for (let idx = 0; idx < allData[element].length; idx++) {
        //const element2 = allData[element][idx][11];
        const labElement = allData[element][idx];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);
        var added = false;
        if (selectedOption.expired && isPast) {
          added = true;
          value = value + labElement[29];
        }
        if (selectedOption.open && !isPast && !added) {
          value = value + labElement[29];
        }
      }
    }
    return (
      <h3>
        {value.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
      </h3>
    );
  };

  const getExpiredPercentage = () => {
    var value = 0;
    var all = 0;
    for (let ix = 0; ix < Object.keys(allData).length; ix++) {
      const element = Object.keys(allData)[ix];
      for (let idx = 0; idx < allData[element].length; idx++) {
        //const element2 = allData[element][idx][11];
        const labElement = allData[element][idx];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);
        if (isPast) {
          value = value + labElement[29];
        }
        all = all + labElement[29];
      }
    }
    if (value === 0 && all === 0) {
      return "0%";
    }
    return ((value / all) * 100).toFixed(2) + " %";
  };

  const getOpenPercentage = () => {
    var value = 0;
    var all = 0;
    for (let ix = 0; ix < Object.keys(allData).length; ix++) {
      const element = Object.keys(allData)[ix];
      for (let idx = 0; idx < allData[element].length; idx++) {
        //const element2 = allData[element][idx][11];
        const labElement = allData[element][idx];
        var today = new Date();
        var isPast = dateInPast(labElement[22], today);
        if (!isPast) {
          value = value + labElement[29];
        }
        all = all + labElement[29];
      }
    }
    if (value === 0 && all === 0) {
      return "0%";
    }
    return ((value / all) * 100).toFixed(2) + " %";
  };

  const control = 0;
  useEffect(() => {
    // fetchData();
  }, [control]);
  return (
    <div className="content">
      <Row>
        <Card>
          <CardHeader>
            <h3>Uplaod dos contratos</h3>
          </CardHeader>
          <CardBody>
            <input
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => readFile(e)}
            />
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </Row>
      {isLoading ? null : (
        <Row>
          <Col sm={6} lg={6} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={selectedOption.expired}
                  onChange={() => {
                    setSelectedOption({
                      ...selectedOption,
                      expired: !selectedOption.expired,
                    });
                    setLoops(loops + 1);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={"Expirados " + getExpiredPercentage()}
            />{" "}
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={selectedOption.open}
                  onChange={() => {
                    setSelectedOption({
                      ...selectedOption,
                      open: !selectedOption.open,
                    });
                    setLoops(loops + 1);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={"Abertos " + getOpenPercentage()}
            />
          </Col>
          <Col>{totalValue()}</Col>
        </Row>
      )}
      {isLoading === false ? (
        <>
          <Row>
            <Col sm={12} lg={6} md={6}>
              <Select
                isMulti
                name="Funcionários"
                onChange={(e) => {
                  setChosenDataEmployee(e);
                  setLoops(loops + 1);
                }}
                options={listOptionsEmployees()}
                className="basic-multi-select"
                classNamePrefix="funcionarios"
              />
              <Histogram label="Funcionários" data={calculatedDataEmployees} />
            </Col>
            <Col sm={12} lg={6} md={6}>
              <Select
                isMulti
                name="Laboratórios"
                onChange={(e) => {
                  setChosenDataLab(e);
                  setLoops(loops + 1);
                }}
                options={listOptionsLab()}
                className="basic-multi-select"
                classNamePrefix="laboratorios"
              />
              <Horizontal label="Laboratórios" data={calculatedDataLabs} />
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={12} md={12}>
              <TotalContracts data={data} />
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={12} md={12}>
              <DetailedItems data={data} />
            </Col>
          </Row>
        </>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          <ClipLoader color="#2381f8" size={45} />
        </div>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
