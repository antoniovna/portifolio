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
import { Line, Pie } from "react-chartjs-2";

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
// core components
import {
    chartExample2,
    chartExample3,
    chartExample4
} from "./../../variables/charts";

import firebase from "./../../initfirebase";

export default function ChamadosDash() {
    const [chamados, setChamados] = useState([]);
    const [naoConcluidos, setNaoConcluidos] = useState([], [], [], [], [], [], [], [], [], [], [], []);
    const [reajustados, setReajustados] = useState([], [], [], [], [], [], [], [], [], [], [], []);
    const [allChamados, setAllChamados] = useState([]);
    const [allData, setAllData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
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
        firebase.firestore().collection("Metas").onSnapshot(snapshot => {
            list = [];
            snapshot.forEach(data => {
                list.push(data.data());
            })
            setAllData(list);
            changeTiming("first", list);
            orderData(list, true, listAreas);
        })
    };

    const orderData = (data, first, arrayAreas, peopleArr = []) => {
        var yearsFiltered = [];
        var selected = document.getElementById("currentTiming").value
        if (document.getElementById("currentTiming").value) {
            setFilteredYears([]);
            var months = [[], [], [], [], [], [], [], [], [], [], [], []];
            var monthsNC = [[], [], [], [], [], [], [], [], [], [], [], []];
            var monthsReajustados = [[], [], [], [], [], [], [], [], [], [], [], []];
            if (first === false) {
                for (let index = 0; index < data.length; index++) {
                    if (data[index].fim === "") {
                        //console.log("data vazia")
                    } else {
                        for (let i = 0; i < arrayAreas.length; i++) {
                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                for (let idx = 0; idx < peopleArr.length; idx++) {
                                    if (peopleArr[idx].selected === true && data[index].quem.includes(peopleArr[idx].name)) {
                                        const splice = data[index].fim.split("/");
                                        if (yearsFiltered.includes(splice[2]) === false) {
                                            yearsFiltered.push(splice[2])
                                        }
                                        if (splice[2] === selected) {
                                            if (data[index].finished === true) {
                                                if (data[index].isReajustado === true) {
                                                    monthsReajustados[(splice[1] * 1) - 1].push(data[index])
                                                } else {
                                                    months[(splice[1] * 1) - 1].push(data[index])
                                                }
                                            } else {
                                                monthsNC[(splice[1] * 1) - 1].push(data[index])
                                            }
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
                    if (data[ix].fim === "") {
                        //console.log("data vazia")
                    } else {
                        var treatedDate = data[ix].fim.split("/");
                        if (firstYear * 1 < treatedDate[2] * 1) {
                            firstYear = treatedDate[2];
                        }
                    }
                }
                for (let index = 0; index < data.length; index++) {
                    if (data[index].fim === "") {
                        //console.log("data vazia")
                    } else {
                        for (let i = 0; i < arrayAreas.length; i++) {

                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                const splice = data[index].fim.split("/");
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                if (yearsFiltered.includes(splice[2]) === false) {
                                    yearsFiltered.push(splice[2])
                                }
                                if (splice[2] === selected) {
                                    if (data[index].finished === true) {
                                        if (data[index].isReajustado === true) {
                                            monthsReajustados[(splice[1] * 1) - 1].push(data[index])
                                        } else {
                                            months[(splice[1] * 1) - 1].push(data[index])
                                        }
                                    } else {
                                        monthsNC[(splice[1] * 1) - 1].push(data[index])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var ids = [];
            var idsRE = [];
            var idsNC = [];
            var dataArray = [[], [], [], [], [], [], [], [], [], [], [], []]
            var dataArrayRe = [[], [], [], [], [], [], [], [], [], [], [], []]
            var dataArrayNC = [[], [], [], [], [], [], [], [], [], [], [], []]
            for (let indicator = 0; indicator < months.length; indicator++) {
                for (let y = 0; y < months[indicator].length; y++) {
                    if (!ids.includes(months[indicator][y].id)) {
                        ids.push(months[indicator][y].id)
                        dataArray[indicator].push(months[indicator][y])
                    }
                }
            }
            for (let indicator = 0; indicator < monthsNC.length; indicator++) {
                for (let y = 0; y < monthsNC[indicator].length; y++) {
                    if (!idsNC.includes(monthsNC[indicator][y].id)) {
                        idsNC.push(monthsNC[indicator][y].id)
                        dataArrayNC[indicator].push(monthsNC[indicator][y])
                    }
                }
            }
            for (let indicator = 0; indicator < monthsReajustados.length; indicator++) {
                for (let y = 0; y < monthsReajustados[indicator].length; y++) {
                    if (!idsRE.includes(monthsReajustados[indicator][y].id)) {
                        idsRE.push(monthsReajustados[indicator][y].id)
                        dataArrayRe[indicator].push(monthsReajustados[indicator])
                    }
                }
            }
            yearsFiltered.sort(function (a, b) { return b - a });
            yearsFiltered = [...new Set(yearsFiltered)];
            setFilteredYears(yearsFiltered);
            //console.log("dataArray =====================>", dataArray, monthsReajustados, monthsNC)
            setChamados(dataArray);
            setReajustados(dataArrayRe);
            setNaoConcluidos(dataArrayNC);
            return;
        } else {
            setFilteredYears([]);
            var months = [[], [], [], [], [], [], [], [], [], [], [], []];
            var monthsNC = [[], [], [], [], [], [], [], [], [], [], [], []];
            var monthsReajustados = [[], [], [], [], [], [], [], [], [], [], [], []];
            var firstYear = '';
            for (let ix = 0; ix < data.length; ix++) {
                if (data[ix].fim === "") {
                    //console.log("data vazia")
                } else {
                    var treatedDate = data[ix].fim.split("/");
                    if (firstYear * 1 < treatedDate[2] * 1) {
                        firstYear = treatedDate[2];
                    }
                }
            }
            for (let index = 0; index < data.length; index++) {
                if (data[index].fim === "") {
                    //console.log("data vazia")
                } else {
                    for (let i = 0; i < arrayAreas.length; i++) {
                        if (peopleArr.length < 1) {
                            // console.log("people 2==> ", peopleArr, data[index].quem)
                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                const splice = data[index].fim.split("/");
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                if (yearsFiltered.includes(splice[2]) === false) {
                                    yearsFiltered.push(splice[2])
                                }
                                if (splice[2] === firstYear) {
                                    if (data[index].finished === true) {
                                        if (data[index].isReajustado === true) {
                                            monthsReajustados[(splice[1] * 1) - 1].push(data[index])
                                        } else {
                                            months[(splice[1] * 1) - 1].push(data[index])
                                        }
                                    } else {
                                        monthsNC[(splice[1] * 1) - 1].push(data[index])
                                    }
                                }
                            }
                        } else {
                            if (data[index].areas.includes(arrayAreas[i].name) && arrayAreas[i].selected === true) {
                                const splice = data[index].fim.split("/");
                                //nesse ponto concluímos que as áreas dos encarregados do chamado foi selecionada
                                for (let idx = 0; idx < peopleArr.length; idx++) {
                                    //   console.log("people 3 ==> ", peopleArr, data[index].quem)
                                    if (peopleArr[idx].selected === true && data[index].quem.includes(peopleArr[idx].name)) {
                                        const splice = data[index].fim.split("/");
                                        if (yearsFiltered.includes(splice[2]) === false) {
                                            yearsFiltered.push(splice[2])
                                        }
                                        if (splice[2] === firstYear) {
                                            if (data[index].finished === true) {
                                                if (data[index].isReajustado === true) {
                                                    monthsReajustados[(splice[1] * 1) - 1].push(data[index])
                                                } else {
                                                    months[(splice[1] * 1) - 1].push(data[index])
                                                }
                                            } else {
                                                monthsNC[(splice[1] * 1) - 1].push(data[index])
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
            var ids = [];
            var idsRE = [];
            var idsNC = [];
            var dataArray = [[], [], [], [], [], [], [], [], [], [], [], []]
            var dataArrayRe = [[], [], [], [], [], [], [], [], [], [], [], []]
            var dataArrayNC = [[], [], [], [], [], [], [], [], [], [], [], []]
            for (let indicator = 0; indicator < months.length; indicator++) {
                for (let y = 0; y < months[indicator].length; y++) {
                    if (!ids.includes(months[indicator][y].id)) {
                        ids.push(months[indicator][y].id)
                        dataArray[indicator].push(months[indicator])
                    }
                }
            }
            for (let indicator = 0; indicator < monthsNC.length; indicator++) {
                for (let y = 0; y < monthsNC[indicator].length; y++) {
                    if (!idsNC.includes(monthsNC[indicator][y].id)) {
                        idsNC.push(monthsNC[indicator][y].id)
                        dataArrayNC[indicator].push(monthsNC[indicator][y])
                    }
                }
            }
            for (let indicator = 0; indicator < monthsReajustados.length; indicator++) {
                for (let y = 0; y < monthsReajustados[indicator].length; y++) {
                    if (!idsRE.includes(monthsReajustados[indicator][y].id)) {
                        idsRE.push(monthsReajustados[indicator][y].id)
                        dataArrayRe[indicator].push(monthsReajustados[indicator])
                    }
                }
            }
            yearsFiltered.sort(function (a, b) { return b - a });
            yearsFiltered = [...new Set(yearsFiltered)];
            setFilteredYears(yearsFiltered);
            //console.log("dataArray =====================>", dataArray, monthsReajustados, monthsNC)
            setChamados(dataArray);
            setReajustados(dataArrayRe);
            setNaoConcluidos(dataArrayNC);
            return;
        }
    };

    const changeTiming = (year, data) => {
        var first = "";
        var months = [[], [], [], [], [], [], [], [], [], [], [], []];
        setSelectedYear(year)
        orderData(data, false, areas, people)
    };

    const controluseEffect = "";
    useEffect(() => {
        getAreas();
    }, [controluseEffect, areaNames])

    const getPieData = () => {
        var metasConcluidas = 0;
        var metasCoRe = 0;
        var metasRe = 0;
        var metasNC = 0;
        var metasArray = [];
        if (chamados.length > 0 && reajustados.length > 0 && naoConcluidos.length > 0) {
            for (let index = 0; index < chamados.length; index++) {
                for (let i = 0; i < chamados[index].length; i++) {
                    const element = chamados[index][i];
                    if (element.finished) {
                        metasArray.push(element)
                    } else {
                        for (let idx = 0; idx < element.length; idx++) {
                            const element2 = element[idx];
                            metasArray.push(element2)
                        }
                    }
                }
            }

            for (let index = 0; index < reajustados.length; index++) {
                for (let i = 0; i < reajustados[index].length; i++) {
                    const element = reajustados[index][i];
                    if (element.finished) {
                        metasArray.push(element)
                    } else {
                        for (let idx = 0; idx < element.length; idx++) {
                            const element2 = element[idx];
                            metasArray.push(element2)
                        }
                    }

                }
            }

            for (let index = 0; index < naoConcluidos.length; index++) {
                for (let i = 0; i < naoConcluidos[index].length; i++) {
                    const element = naoConcluidos[index][i];
                    metasArray.push(element)

                }
            }
            for (let index = 0; index < metasArray.length; index++) {
                const element = metasArray[index];
                if (element.finished === true) {
                    if (element.isReajustado === true) {
                        metasCoRe = metasCoRe + 1;
                    } else {
                        metasConcluidas = metasConcluidas + 1;
                    }
                } if (element.finished === false) {
                    if (element.isReajustado === true) {
                        metasRe = metasRe + 1;
                    } else {
                        metasNC = metasNC + 1;
                    }
                }

            }
        }
        return [metasConcluidas, metasCoRe, metasRe, metasNC]
    };

    const getStatus = (fim) => {
        var split2 = fim.split("/")
        const date2 = new Date(split2[1] + "/" + split2[0] + "/" + split2[2]);
        const date3 = new Date();
        const diffTime2 = Math.abs(date2 - date3);
        const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
        var calculus = "";
        if (date2 > date3) {
            if (diffDays2 > 90) {
                if (diffDays2 > 360) {
                    calculus = "Estratégico";
                } else {
                    calculus = "Tático";
                }
            } else {
                calculus = "Operacional";
            }
        }
        return (calculus)
    }
    const getPieData2 = () => {
        var metasConcluidas = 0;
        var metasEst = 0;
        var metasTat = 0;
        var metasOpe = 0;
        var metasArray = [];
        if (chamados.length > 0 && reajustados.length > 0 && naoConcluidos.length > 0) {
            for (let index = 0; index < chamados.length; index++) {
                for (let i = 0; i < chamados[index].length; i++) {
                    const element = chamados[index][i];
                    if (element.fim) {
                        metasArray.push(element)
                    } else {
                        for (let idx = 0; idx < element.length; idx++) {
                            metasArray.push(element[idx])
                        }
                    }
                }
            }

            for (let index = 0; index < reajustados.length; index++) {
                for (let i = 0; i < reajustados[index].length; i++) {
                    const element = reajustados[index][i];
                    if (element.fim) {
                        metasArray.push(element)
                    } else {
                        for (let idx = 0; idx < element.length; idx++) {
                            metasArray.push(element[idx])
                        }
                    }
                }
            }

            for (let index = 0; index < naoConcluidos.length; index++) {
                for (let i = 0; i < naoConcluidos[index].length; i++) {
                    const element = naoConcluidos[index][i];
                    if (element.fim) {
                        metasArray.push(element)
                    } else {
                        for (let idx = 0; idx < element.length; idx++) {
                            metasArray.push(element[idx])
                        }
                    }

                }
            }
            for (let index = 0; index < metasArray.length; index++) {
                const element = metasArray[index];
                const status = getStatus(element.fim);
                if (element.finished === false) {
                    if (status === "Estratégico") {
                        metasEst = metasEst + 1;
                    }
                    if (status === "Tático") {
                        metasTat = metasTat + 1;
                    }
                    if (status === "Operacional") {
                        metasOpe = metasOpe + 1;
                    }
                }
            }
        }
        return [metasEst, metasTat, metasOpe]
    };

    const data = {
        labels: ['Concluídas', 'Concluídas com reajuste', 'Reajustadas', 'Em progresso'],
        datasets: [
            {
                label: '# of Votes',
                data: getPieData(),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',

                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',

                ],
                borderWidth: 1,
            },
        ],
    }

    const dataPie2 = {
        labels: ['Estratégico', 'Tático', 'Operacional'],
        datasets: [
            {
                label: '# of Votes',
                data: getPieData2(),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',

                ],
                borderWidth: 1,
            },
        ],
    }

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
            let gradientStrokePurple = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStrokePurple.addColorStop(1, "rgba(72,72,176,0.1)");
            gradientStrokePurple.addColorStop(0.4, "rgba(72,72,176,0.0)");
            gradientStrokePurple.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

            let gradientStrokeGreen = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStrokeGreen.addColorStop(1, "rgba(66,134,121,0.15)");
            gradientStrokeGreen.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
            gradientStrokeGreen.addColorStop(0, "rgba(66,134,121,0)"); //green colors


            if (chamados.length > 0 && reajustados.length > 0 && naoConcluidos.length > 0) { ///NÂO TIRA ESSA MERDA
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
                            label: "Nº de metas concluídas",
                            fill: true,
                            backgroundColor: gradientStrokeGreen,
                            borderColor: "#00d6b4",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#00d6b4",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#00d6b4",
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
                        },
                        {
                            label: "Nº de metas reajustadas concluídas",
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
                            data: [reajustados[0].length,
                            reajustados[1].length,
                            reajustados[2].length,
                            reajustados[3].length,
                            reajustados[4].length,
                            reajustados[5].length,
                            reajustados[6].length,
                            reajustados[7].length,
                            reajustados[8].length,
                            reajustados[9].length,
                            reajustados[10].length,
                            reajustados[11].length]
                        },
                        {
                            label: "Nº de metas não concluídas",
                            fill: true,
                            backgroundColor: gradientStrokePurple,
                            borderColor: "#d048b6",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#d048b6",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#d048b6",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: [naoConcluidos[0].length,
                            naoConcluidos[1].length,
                            naoConcluidos[2].length,
                            naoConcluidos[3].length,
                            naoConcluidos[4].length,
                            naoConcluidos[5].length,
                            naoConcluidos[6].length,
                            naoConcluidos[7].length,
                            naoConcluidos[8].length,
                            naoConcluidos[9].length,
                            naoConcluidos[10].length,
                            naoConcluidos[11].length]
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
        orderData(allData, false, newArr, people);
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
                                        <h5 className="card-category">Metas concluídas</h5>
                                        <CardTitle tag="h2">Metas</CardTitle>
                                    </Col>
                                    <Col sm="6">
                                        <ButtonGroup
                                            className="btn-group-toggle float-right"
                                            data-toggle="buttons"
                                        >
                                            <Input id="currentTiming" value={selectedYear} onChange={(e) => changeTiming(e.target.value, allData)} type="select" placeholder="Selecione o período" >
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" >
                        <Card>
                            <CardBody>
                                <Pie data={data} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6" >
                        <Card>
                            <CardBody>
                                <Pie data={dataPie2} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};
