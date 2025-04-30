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
// react plugin used to create charts
import { Line } from "react-chartjs-2";

// reactstrap components
import {
    Input,
    Row,
    Col,
    CardBody
} from "reactstrap";

// core components

import firebase from "./../../initfirebase";

export default function ChamadosDash() {
    const [chamados, setChamados] = useState([]);
    const [allChamados, setAllChamados] = useState([]);
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

    const orderData = (data, first, arrayAreas) => {
        var yearsFiltered = [];
        console.log("newestdate ===> ", data.map(function (e) { return e.finalDate; }).sort()[0])
        setFilteredYears([]);
        var months = [[], [], [], [], [], []];
        if (first === false) {
            for (let index = 0; index < data.length; index++) {
                if (data[index].finalDate === "") {
                    //console.log("data vazia")
                } else {
                    for (let i = 0; i < arrayAreas.length; i++) {
                        console.log("entrando array das áreas", console.log(data[index]))
                        if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                            //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                            for (let idx = 0; idx < people.length; idx++) {
                                if (people[idx].selected === true && data[index].names.includes(people[idx].name)) {
                                    const splice = data[index].finalDate.split("/");
                                    if (yearsFiltered.includes(splice[2]) === false) {
                                        console.log("Splice ", splice[2])
                                        yearsFiltered.push(splice[2])
                                    }
                                    if(splice[2] <= 6){
                                        months[(splice[1] * 1) - 1].push(data[index])
                                    }
                                } else {
                                    //       console.log("falhou na segunda verificação", data[index])
                                }
                            }
                        } else {
                            // console.log("falhou na primeira verificação", data[index]);
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
                    console.log("ano ===> ", data[ix].finalDate, firstYear)
                    var treatedDate = data[ix].finalDate.split("/");
                    if (firstYear * 1 < treatedDate[2] * 1) {
                        firstYear = treatedDate[2];
                    }
                }
            }
            console.log("entrou aqui", firstYear)
            for (let index = 0; index < data.length; index++) {
                if (data[index].finalDate === "") {
                    //console.log("data vazia")
                } else {
                    console.log("Aaaaaaaaaaaaaaaaaaaaaaaa", arrayAreas)
                    for (let i = 0; i < arrayAreas.length; i++) {

                        if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                            console.log('ok ok', people)
                            const splice = data[index].finalDate.split("/");
                            //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                            if (yearsFiltered.includes(splice[2]) === false) {
                                yearsFiltered.push(splice[2])
                            }
                            if (firstYear === data[index].finalDate.split("/")[2]) {
                                console.log('foooi?', data[index])
                                months[(splice[1] * 1) - 1].push(data[index])
                            } else {
                                //                                    console.log("falhou na segunda verificação", data[index])
                            }
                        } else {
                            // console.log("falhou na primeira verificação", data[index]);
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
                    dataArray[indicator].push(months[indicator[y]])
                }
            }
        }
        yearsFiltered.sort(function (a, b) { return b - a });
        setFilteredYears(yearsFiltered);
        setChamados(dataArray);

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
        orderData(allData, false, areas);
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
            <CardBody>
                {
                    timing === "Anual" ?
                        <>
                            <Col className="area-button-wrapper" sm="8">
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
                            <Col className="area-button-wrapper" sm="8">
                                <hr className="people-divider" />
                            </Col>
                            <Col className="area-button-wrapper" sm="8">
                                {
                                    listPeople()
                                }
                            </Col>
                            <Row>
                                <Col sm={2} lg={2}>
                                    <Input onChange={(e) => changeTiming(e.target.value, allData)} type="select" placeholder="Selecione o período" >
                                        {listfilteredYears}
                                    </Input>
                                </Col>
                            </Row>
                            <br />

                            <div className="chart-area">
                                <Line
                                    data={chartExample1["data1"]}
                                    options={chartExample1.options}
                                />
                            </div>
                        </> : null
                }
            </CardBody>
        </>
    );
};
