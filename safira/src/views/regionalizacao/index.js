import React, { useState, useEffect } from 'react';
import {
    CardBody,
    CardHeader,
    Card,
    CardFooter,
    Row,
    Col
} from 'reactstrap';
import * as XLSX from 'xlsx';
import firebase from './../../initfirebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ClipLoader } from 'react-spinners';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Regionalizacao() {
    const [vendedoresList, setVendedores] = useState({});
    const [fetch, setFetch] = useState({});
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const readFile = (e) => {
        e.preventDefault();
        setIsloading(true)
        var vendedores = {};
        var organized = [];
        try {
            var files = e.target.files, f = files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];

                /* Convert array to json*/
                const lineArray = XLSX.utils.sheet_to_json(ws, { header: 1 });
                var oportunidades = [];
                for (let index = 0; index < lineArray.length; index++) {
                    if (index > 0) {
                        if (!vendedores[lineArray[index][8]]) {
                            vendedores[lineArray[index][8]] = []
                        }
                        oportunidades.push({
                            estado: lineArray[index][0],
                            municipio: lineArray[index][1],
                            regiao: lineArray[index][2],
                            populacao: lineArray[index][4],
                            porte: lineArray[index][5],
                            idVendedor: lineArray[index][6],
                            licitasys: lineArray[index][7],
                            nomeVendedor: lineArray[index][8]
                        })
                        vendedores[lineArray[index][8]] = vendedores[lineArray[index][8]].concat({
                            estado: lineArray[index][0],
                            municipio: lineArray[index][1],
                            regiao: lineArray[index][2],
                            populacao: lineArray[index][4],
                            porte: lineArray[index][5],
                            idVendedor: lineArray[index][6],
                            licitasys: lineArray[index][7],
                            nomeVendedor: lineArray[index][8]
                        })
                    }
                };
                oportunidades.shift();
                setVendedores(vendedores)
                var newVend = vendedores;
                newVend['id'] = 'vendedores'
                firebase.firestore().collection("regionalizacao").doc("vendedores").set(newVend).then(() => {
                    setSeverity("success");
                    setIsloading(true)
                    setMessage("Regionalização atualizada com sucesso!");
                    handleClick();
                })
                //  for (let index = 0; index < oportunidades.length; index++) {
                //    firebase.firestore().collection("oportunidades").doc(oportunidades[index].id).set(oportunidades[index])
                // }
            };
            reader.readAsBinaryString(f)
        } catch {
            setIsloading(true)
            setSeverity("error");
            setMessage("Ocorreu um erro ao atualizar a regionalização, verifique a formatação do arquivo e tente novamente")
            handleClick();

        }

    }

    const fetchData = () => {
        setFetch({});
        setIsloading(true)
        firebase.firestore().collection("regionalizacao").onSnapshot(snapshot => {
            setFetch({});
            setIsloading(true)
            snapshot.forEach(data => {
                setFetch(data.data())
                setIsloading(false);
            })
        })
    }
    const control = 0;
    useEffect(() => {
        fetchData();
    }, [control]);

    const listVendedores = () => {
        var keys = Object.keys(fetch);
        var totPop = 0;
        var totNorte = 0;
        var totSul = 0;
        var totNordeste = 0;
        var totSudeste = 0;
        var totCentro = 0;

        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            var municipios = 0;
            if (element !== 'id') {
                for (let i = 0; i < fetch[element].length; i++) {
                    const data = fetch[element];
                    for (let idx = 0; idx < data.length; idx++) {
                        const el = data[idx];
                        totPop = totPop + el.populacao;
                        if (el.regiao === "norte") {
                            totNorte = totNorte + 1
                        }
                        if (el.regiao === "Sul") {
                            totSul = totSul + 1
                        }
                        if (el.regiao === "Nordeste") {
                            totNordeste = totNordeste + 1
                        }
                        if (el.regiao === "Sudeste") {
                            totSudeste = totSudeste + 1
                        }
                        if (el.regiao === "Centro-Oeste") {
                            totCentro = totCentro + 1
                        }
                    }

                }
            }
        }
        return (
            <>
                {
                    keys.map((key, i) => {
                        const element = key;
                        if (element !== 'id') {
                            var municipios = 0;
                            var pop = 0;
                            var Norte = 0;
                            var Sul = 0;
                            var Nordeste = 0;
                            var Sudeste = 0;
                            var Centro = 0;
                            for (let i = 0; i < fetch[element].length; i++) {
                                const data = fetch[element];
                                for (let idx = 0; idx < data.length; idx++) {
                                    const el = data[idx];
                                    pop += el.populacao;
                                    if (el.regiao === "norte") {
                                        Norte = Norte + 1
                                    }
                                    if (el.regiao === "Sul") {
                                        Sul = Sul + 1
                                    }
                                    if (el.regiao === "Nordeste") {
                                        Nordeste = Nordeste + 1
                                    }
                                    if (el.regiao === "Sudeste") {
                                        Sudeste = Sudeste + 1
                                    }
                                    if (el.regiao === "Centro-Oeste") {
                                        Centro = Centro + 1
                                    }
                                }
                            }
                            return (
                                <>
                                    {
                                        element !== 'id' ?
                                            <Col key={element} lg="3">
                                                <Card>
                                                    <CardHeader>
                                                        {element}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div>{((fetch[element].length / 5570) * 100).toFixed(2)}% dos municípios</div>
                                                        <div>{((pop / totPop) * 100).toFixed(2)}% da  população </div>
                                                        <div>Centro-Oeste: {((Centro / totCentro) * 100).toFixed(2)}%</div>
                                                        <div>Norte: {((Norte / totNorte) * 100).toFixed(2)}%</div>
                                                        <div>Nordeste: {((Nordeste / totNordeste) * 100).toFixed(2)}%</div>
                                                        <div>Sudeste: {((Sudeste / totSudeste) * 100).toFixed(2)}%</div>
                                                        <div>Sul: {((Sul / totSul) * 100).toFixed(2)}%</div>
                                                    </CardBody>
                                                </Card>
                                            </Col> : null
                                    }
                                </>
                            )
                        }
                    })
                }

            </>
        );
    };
    return (
        <div className="content">
            <Row>
                <Card>
                    <CardHeader>
                        <h3>Uplaod da regionalização</h3>
                    </CardHeader>
                    <CardBody>
                        <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => readFile(e)} />
                    </CardBody>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </Row>
            <Row>
                {isLoading === false ?
                    <Row>
                        {listVendedores()}
                    </Row>
                    : <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}> <ClipLoader color="#2381f8" size={45} /></div>}
            </Row>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>);
};  