/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
// react plugin used to create charts
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Input,
    Row,
    Col,
} from "reactstrap";
import TabelaDashboard from "./tabelasDashboard";

import firebase from "./../../initfirebase";

export default function ChamadosDash() {
    const [chamados, setChamados] = useState([]);
    const [tableData, setTableData] = useState([])
    const [allData, setAllData] = useState([]);
    const [timing, setTiming] = useState("Anual");
    const [filteredYears, setFilteredYears] = useState([]);
    const [areas, setAreas] = useState([]);
    const [areaNames, setAreaNames] = useState([]);
    const [people, setPeople] = useState([]);
    const getAreas = () => {
        setAreas([]);
        firebase.firestore().collection("Areas").get().then(snapshot => {
            if (snapshot.empty) {
                return;
            }
            var areasList = [];
            snapshot.forEach((doc) => {
                areasList.push(
                    {
                        id: areasList.length,
                        name: doc.data().area,
                        selected: true,
                    }
                )
            })
            setAreas(areasList);
            handleGetPeople(areasList)
            getChamados(areasList);
        })
    }

    const getChamados = (listAreas) => {
        var list = [];
        var listNames = [];
        firebase.firestore().collection("Chamados").where("finalized", "==", true).get().then(snapshot => {
            snapshot.forEach(data => {
                list.push(data.data());
                listNames.push(data.data().area)
            })
        }).then(() => {
            setAllData(list);
            changeTiming("first", list);
            orderData(list, true, listAreas);
        })
    };

    const orderData = (data, first, arrayAreas, peopleArr = []) => {
        var yearsFiltered = [];
        var filteredChamados = []
        var selected = document.getElementById("currentTiming").value
        if (document.getElementById("currentTiming").value) {
            setFilteredYears([]);
            var months = [[], [], [], [], [], [], [], [], [], [], [], []];
            if (first === false) {
                for (let index = 0; index < data.length; index++) {
                    if (data[index].finalDate === "") {
                        //console.log("data vazia")
                    } else {
                        for (let i = 0; i < arrayAreas.length; i++) {
                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                for (let idx = 0; idx < peopleArr.length; idx++) {
                                    if (peopleArr[idx].selected === true && data[index].names.includes(peopleArr[idx].name)) {
                                        const splice = data[index].finalDate.split("/");
                                        if (yearsFiltered.includes(splice[2]) === false) {
                                            yearsFiltered.push(splice[2])
                                        }
                                        if (splice[2] === selected) {
                                            months[(splice[1] * 1) - 1].push(data[index])
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                var firstYear = '';
                for (let ix = 0; ix < data.length; ix++) {
                    if (data[ix].finalDate === "") {
                        //console.log("data vazia")
                    } else {
                        var treatedDate = data[ix].finalDate.split("/");
                        if (firstYear * 1 < treatedDate[2] * 1) {
                            firstYear = treatedDate[2];
                        }
                    }
                }
                for (let index = 0; index < data.length; index++) {
                    if (data[index].finalDate === "") {
                        //console.log("data vazia")
                    } else {
                        for (let i = 0; i < arrayAreas.length; i++) {

                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                const splice = data[index].finalDate.split("/");
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                if (yearsFiltered.includes(splice[2]) === false) {
                                    yearsFiltered.push(splice[2])
                                }
                                if (firstYear === data[index].finalDate.split("/")[2]) {
                                    months[(splice[1] * 1) - 1].push(data[index])
                                }
                            }
                        }
                    }
                }
            }
            var ids = [];
            var dataArray = [[], [], [], [], [], [], [], [], [], [], [], []]
            for (let indicator = 0; indicator < months.length; indicator++) {
                for (let y = 0; y < months[indicator].length; y++) {
                    if (!ids.includes(months[indicator][y].id)) {
                        ids.push(months[indicator][y].id)
                        dataArray[indicator].push(months[indicator][y])
                        console.log("pushing data ", months)
                        filteredChamados.push(months[indicator][y])
                    }
                }
            }
            yearsFiltered.sort(function (a, b) { return b - a });
            yearsFiltered = [...new Set(yearsFiltered)];
            console.log("dataArray => ",dataArray)
            setFilteredYears(yearsFiltered);
            setChamados(dataArray);
            setTableData(filteredChamados)
            return;
        } else {
            setFilteredYears([]);
            var months = [[], [], [], [], [], [], [], [], [], [], [], []];
            var firstYear = '';
            for (let ix = 0; ix < data.length; ix++) {
                if (data[ix].finalDate === "") {
                    //console.log("data vazia")
                } else {
                    var treatedDate = data[ix].finalDate.split("/");
                    if (firstYear * 1 < treatedDate[2] * 1) {
                        firstYear = treatedDate[2];
                    }
                }
            }
            for (let index = 0; index < data.length; index++) {
                if (data[index].finalDate === "") {
                    //console.log("data vazia")
                } else {
                    for (let i = 0; i < arrayAreas.length; i++) {
                        if (peopleArr.length < 1) {
                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                const splice = data[index].finalDate.split("/");
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                if (yearsFiltered.includes(splice[2]) === false) {
                                    yearsFiltered.push(splice[2])
                                }
                                if (firstYear === data[index].finalDate.split("/")[2]) {
                                    months[(splice[1] * 1) - 1].push(data[index])
                                }
                            }
                        } else {
                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                const splice = data[index].finalDate.split("/");
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                for (let idx = 0; idx < peopleArr.length; idx++) {
                                    if (peopleArr[idx].selected === true && data[index].names.includes(peopleArr[idx].name)) {
                                        const splice = data[index].finalDate.split("/");
                                        if (yearsFiltered.includes(splice[2]) === false) {
                                            yearsFiltered.push(splice[2])
                                        }
                                        if (firstYear === data[index].finalDate.split("/")[2]) {
                                            months[(splice[1] * 1) - 1].push(data[index])
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
            var ids = [];
            var dataArray = [[], [], [], [], [], [], [], [], [], [], [], []]
            for (let indicator = 0; indicator < months.length; indicator++) {
                for (let y = 0; y < months[indicator].length; y++) {
                    if (!ids.includes(months[indicator][y].id)) {
                        ids.push(months[indicator][y].id)
                        dataArray[indicator].push(months[indicator][y])
                        filteredChamados.push(months[indicator][y])
                        console.log("pushing data ", months)

                    }
                }
            }
            yearsFiltered.sort(function (a, b) { return b - a });
            yearsFiltered = [...new Set(yearsFiltered)];
            setFilteredYears(yearsFiltered);
            console.log("dataArray => ",dataArray)
            setChamados(dataArray);
            setTableData(filteredChamados)
            return;
        }
    };

    const changeTiming = (year, data) => {
        var first = "";
        var months = [[], [], [], [], [], [], [], [], [], [], [], []];
        for (let index = 0; index < data.length; index++) {
            if (data[index].finalDate === "") {
                //console.log("data vazia")
            } else {
                if (year === "first") {
                    if (index === 0) {
                        const splice = data[index].finalDate.split("/");
                        first = data[index].finalDate.split("/");
                        months[(splice[1] * 1) - 1].push(data[index])
                    } else {
                        const splice = data[index].finalDate.split("/");
                        if (splice[2] === first[2]) {
                            months[(splice[1] * 1) - 1].push(data[index])
                        } else {
                        }
                    }
                } else {
                    const splice = data[index].finalDate.split("/");
                    if (splice[2] === year) {
                        months[(splice[1] * 1) - 1].push(data[index])
                    }
                }
            }
        }
        setChamados(months)
    };

    const controluseEffect = "";
    useEffect(() => {
        getAreas();
    }, [controluseEffect, areaNames])

    let chartExample1 = {
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "#f5f5f5",
                titleFontColor: "#333",
                bodyFontColor: "#666",
                bodySpacing: 4,
                xPadding: 12,
                mode: "nearest",
                intersect: 0,
                position: "nearest"
            },
            responsive: true,
            scales: {
                yAxes: [
                    {
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(29,140,248,0.0)",
                            zeroLineColor: "transparent"
                        },
                        ticks: {

                            padding: 20,
                            fontColor: "#9a9a9a"
                        }
                    }
                ],
                xAxes: [
                    {
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(29,140,248,0.1)",
                            zeroLineColor: "transparent"
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9a9a9a"
                        }
                    }
                ]
            }
        },
        data1: canvas => {
            let ctx = canvas.getContext("2d");

            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
            gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
            gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
            if (chamados.length > 0) {
                return {

                    labels: [
                        "JAN",
                        "FEV",
                        "MAR",
                        "ABR",
                        "MAI",
                        "JUN",
                        "JUL",
                        "AGO",
                        "SET",
                        "OUT",
                        "NOV",
                        "DEZ"
                    ],
                    datasets: [
                        {
                            label: "Nº de chamados concluídos",
                            fill: true,
                            backgroundColor: gradientStroke,
                            borderColor: "#1f8ef1",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#1f8ef1",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#1f8ef1",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: [chamados[0].length,
                            chamados[1].length,
                            chamados[2].length,
                            chamados[3].length,
                            chamados[4].length,
                            chamados[5].length,
                            chamados[6].length,
                            chamados[7].length,
                            chamados[8].length,
                            chamados[9].length,
                            chamados[10].length,
                            chamados[11].length]
                        }
                    ]
                };
            } else {
                return {

                    labels: [
                        "JAN",
                        "FEV",
                        "MAR",
                        "ABR",
                        "MAI",
                        "JUN",
                        "JUL",
                        "AGO",
                        "SET",
                        "OUT",
                        "NOV",
                        "DEZ"
                    ],
                    datasets: [
                        {
                            label: "My First dataset",
                            fill: true,
                            backgroundColor: gradientStroke,
                            borderColor: "#1f8ef1",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#1f8ef1",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#1f8ef1",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
                        }
                    ]
                };
            }

        }
    }
    const listfilteredYears = filteredYears.map((year, index) => (
        <option value={year} key={index} >{year}</option>
    ))

    const handleAreaChange = (id) => {
        setPeople([]);
        let newArr = []; // copying the old datas array
        let foundValues = [];
        for (let index = 0; index < areas.length; index++) {
            if (!foundValues.includes(areas[index].name)) {
                foundValues.push(areas[index].name);
                newArr.push(areas[index])
            }
        }
        newArr[id].selected = !areas[id].selected; // replace e.target.value with whatever you want to change it to
        handleGetPeople(newArr)
        setAreas(newArr);
        orderData(allData, false, areas);
    }

    const handleGetPeople = (element) => {
        let newArr = []; // copying the old datas array
        let foundValues = [];
        setPeople([])
        for (let index = 0; index < element.length; index++) {
            if (!foundValues.includes(element[index].name)) {
                foundValues.push(element[index].name);
                newArr.push(element[index])
            }
        }
        for (let index = 0; index < newArr.length; index++) {
            if (newArr[index].selected === true) {
                firebase.firestore().collection("Users").where("areas", "array-contains", newArr[index].name).get().then((snapshot) => {
                    if (snapshot.empty) {
                        return;
                    }
                    else {
                        snapshot.forEach((doc) => {
                            setPeople(people => people.concat({
                                admin: doc.data().admin,
                                areas: doc.data().areas,
                                email: doc.data().email,
                                id: doc.data().id,
                                matricula: doc.data().matricula,
                                name: doc.data().name,
                                photo: doc.data().photo,
                                status: doc.data().status,
                                selected: true,
                            }));
                        })
                    }
                })
            }
        }
    }

    const handlePeopleChange = (id) => {
        setPeople([]);
        let newArr = []; // copying the old datas array
        let foundValues = [];
        for (let index = 0; index < people.length; index++) {
            if (!foundValues.includes(people[index].name)) {
                foundValues.push(people[index].name);
                newArr.push(people[index])
            }
        }
        newArr[id].selected = !people[id].selected; // replace e.target.value with whatever you want to change it to
        setPeople(newArr);
        orderData(allData, false, areas, newArr);
    }

    const listPeople = () => {
        var noRepeat = [];
        var noRepeatEmails = [];
        for (let index = 0; index < people.length; index++) {
            if (!noRepeatEmails.includes(people[index].email)) {
                noRepeatEmails.push(people[index].email);
                noRepeat.push(people[index])
            }
        };
        return (
            <>
                {
                    noRepeat.map((area, index) => (
                        <>
                            <button onClick={() => handlePeopleChange(index)} className={area.selected === true ? "area-button-selected" : "area-button-inactive"} key={index}>
                                {area.name}
                            </button>
                        </>
                    ))
                }
            </>
        )
    }
    return (
        <>
            <div className="content">
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row>
                                    <Col className="text-left" sm="6">
                                        <h5 className="card-category">Chamados concluídos</h5>
                                        <CardTitle tag="h2">Chamados</CardTitle>
                                    </Col>
                                    <Col sm="6">
                                        <ButtonGroup
                                            className="btn-group-toggle float-right"
                                            data-toggle="buttons"
                                        >
                                            <Input id="currentTiming" onChange={(e) => changeTiming(e.target.value, allData)} type="select" placeholder="Selecione o período" >
                                                {listfilteredYears}
                                            </Input>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    timing === "Anual" ?
                                        <>
                                            <Col className="area-button-wrapper" sm="12">
                                                {
                                                    areas.map((area, index) => (
                                                        <>
                                                            <button onClick={() => handleAreaChange(index)} className={area.selected === true ? "area-button-selected" : "area-button-inactive"} key={index}>
                                                                {area.name}
                                                            </button>
                                                        </>
                                                    ))
                                                }
                                            </Col>
                                            <Col className="area-button-wrapper" sm="12">
                                                <hr className="people-divider" />
                                            </Col>
                                            <Col className="area-button-wrapper" sm="12">
                                                {
                                                    listPeople()
                                                }
                                            </Col>

                                            <br />

                                            <div className="chart-area">
                                                <Line
                                                    data={chartExample1["data1"]}
                                                    options={chartExample1.options}
                                                />
                                            </div>
                                        </> : null
                                }
                                {console.log("aaaaaa ", tableData
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <TabelaDashboard listChamados={tableData} />
                </Row>
                {/*
                <Row>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Total Shipments</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-bell-55 text-info" />{" "}
                    763,215
                  </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={chartExample2.data}
                                        options={chartExample2.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Daily Sales</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                    3,500€
                  </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Bar
                                        data={chartExample3.data}
                                        options={chartExample3.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Completed Tasks</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-send text-success" /> 12,100K
                  </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={chartExample4.data}
                                        options={chartExample4.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
               */}
            </div>
        </>
    );
};
