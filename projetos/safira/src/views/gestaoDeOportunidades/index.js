import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import firebase from './../../initfirebase';
import Snackbar from '@material-ui/core/Snackbar';
import {
    Table,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Row,
} from 'reactstrap';
import MuiAlert from '@material-ui/lab/Alert';
import { ClipLoader } from 'react-spinners';
import List from './row';
import moment from 'moment';
import calendarConfig from './../../services/calendarConfig';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AbrirChamados() {
    /*
     const handleAdd = () => {
        const values = [...tasks];
        values.push({ value: null });
        setTasks(values);
    }
    const handleNewTasks = (index, event) => {
        const values = [...tasks];
        values[index].value = event.target.value;
        setTasks(values);
    }

    const submit = async () => {
        let dbRef = firebase.firestore().collection("Chamados").add({
            teste: "boraaaaaaaaaa"
        }).then(newDoc => {
            console.log(newDoc)
        })
    }
    var gapi = window.gapi
    const addEvent = () => {
        console.log("triggered")
        gapi.load("client:auth2", () => {
            console.log("Loaded client")

            gapi.client.init({
                apiKey: calendarConfig.API_KEY,
                clientId: calendarConfig.CLIENT_ID,
                discoveryDocs: calendarConfig.DISCOVERY_DOCS,
                scope: calendarConfig.SCOPES,
            })

            gapi.client.load('calendar', "v3", () => console.log("bam!"))


            gapi.auth2.getAuthInstance().signIn().then(() => {

                var event = {
                    'summary': 'Google I/O 2015',
                    'location': '800 Howard St., San Francisco, CA 94103',
                    'description': 'A chance to hear more about Google\'s developer products.',
                    'start': {
                        'dateTime': '2020-11-02T09:00:00-07:00',
                        'timeZone': 'America/Los_Angeles',
                    },
                    'end': {
                        'dateTime': '2020-11-02T17:00:00-07:00',
                        'timeZone': 'America/Los_Angeles',
                    },
                    'recurrence': [
                        'RRULE:FREQ=DAILY;COUNT=2'
                    ],
                    'attendees': [
                        { 'email': 'lpage@example.com' },
                        { 'email': 'sbrin@example.com' },
                    ],
                    'reminders': {
                        'useDefault': false,
                        'overrides': [
                            { 'method': 'email', 'minutes': 24 * 60 },
                            { 'method': 'popup', 'minutes': 10 },
                        ],
                    },
                };

                var request = gapi.client.calendar.events.insert({
                    'calendarId': "primary",
                    "resource": event,
                })

                request.execute(event => {
                    console.log(event)
                    window.open(event.htmlLink)
                })
            })
        })
    }
     <Row>
                <Col >
                    <Card>
                        <CardHeader>
                            <h5 className="title">Cadastro de oportunidades</h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <Row>
                                    <Col className="pr-md-1" md="4">
                                        <label>Nº do pregão</label>
                                        <Input
                                            placeholder="Nº do pregão"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                    <Col className="px-md-1" md="4">
                                        <label>Nome do cliente</label>
                                        <Input
                                            placeholder="Nome do cliente"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                    <Col className="px-md-1" md="4">
                                        <label>Estado</label>
                                        <Input
                                            placeholder="Nome do cliente"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pr-md-1" md="5">
                                        <label>Cidade/Município</label>
                                        <Input
                                            placeholder="Cidade/Município"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pr-md-1" md="3">
                                        <label>Modalidade</label>
                                        <Input
                                            placeholder="Nº do pregão"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                    <Col className="px-md-1" md="3">
                                        <label>Valor da oportunidade</label>
                                        <Input
                                            placeholder="Valor da oportunidade"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                    <Col className="pr-md-1" md="3">
                                        <label>Prazo de certame</label>
                                        <Input
                                            placeholder="Nº do pregão"
                                            type="datetime"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                    <Col className="px-md-1" md="3">
                                        <label>Prazo de proposta</label>
                                        <Input
                                            placeholder="Nome do cliente"
                                            type="datetime"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pr-md-1" md="8">
                                        <label>Observação</label>
                                        <Input
                                            placeholder="Observação"
                                            type="text"
                                            style={{ marginTop: 7 }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="8">
                                        <FormGroup>

                                                 </FormGroup>
                                                 </Col>
                                             </Row>
                                         </Form>
                                     </CardBody>
                                     <CardFooter>
             
             
                                     </CardFooter>
                                 </Card>
                             </Col>
                         </Row>
                                         /*
                            <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
                            
                 */
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const [fetch, setFetch] = useState([]);
    const [users, setUsers] = useState([]);
    const [fetchedData, setFetchedData] = useState({});
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const readFile = async (e) => {
        e.preventDefault();
        if (e.target.files === null) {
            return;
        }
        setIsloading(true);
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
                let obj = fetch.find(o => ((o.municipio).normalize('NFD').replace(/[\u0300-\u036f]/g, "")).toUpperCase() === lineArray[index][5]);
                if (obj) {
                    oportunidades.push({
                        regiao: lineArray[index][0],
                        idLicitasys: lineArray[index][1],
                        cnpj: lineArray[index][2],
                        licitador: lineArray[index][3],
                        uf: lineArray[index][4],
                        municipio: lineArray[index][5],
                        populacao: lineArray[index][6] ? lineArray[index][6] : "",
                        calssificacao: lineArray[index][7],
                        nEdital: lineArray[index][8],
                        nEditalOriginal: lineArray[index][9],
                        repeticao: lineArray[index][10],
                        nProcesso: lineArray[index][11],
                        objeto: lineArray[index][12],
                        modalidade: lineArray[index][13],
                        nomeSite: lineArray[index][14],
                        urlSite: lineArray[index][15],
                        identificador: lineArray[index][16],
                        tipo: lineArray[index][17],
                        contemItem: lineArray[index][18],
                        prazoEdital: lineArray[index][19],
                        dataHoraCertame: lineArray[index][20],
                        prazoValidadeContrato: lineArray[index][21],
                        observacao: lineArray[index][22],
                        lote: lineArray[index][23],
                        item: lineArray[index][24],
                        produtoLicitado: lineArray[index][25],
                        complemento: lineArray[index][26],
                        quantidade: lineArray[index][27],
                        unidade: lineArray[index][28],
                        conversao: lineArray[index][29],
                        quantidadeOriginal: lineArray[index][30],
                        unidadeOriginal: lineArray[index][31],
                        precoReferenciaUnitario: lineArray[index][32],
                        precoReferenciaTotal: lineArray[index][33],
                        mandadoJudicial: lineArray[index][34],
                        exclusivoEpp: lineArray[index][35],
                        produtoCandidato: lineArray[index][36],
                        descricao: lineArray[index][37],
                        formato: lineArray[index][38],
                        caracteristicas: lineArray[index][39],
                        apresentacao: lineArray[index][40],
                        viaAdministracao: lineArray[index][41],
                        precoUnitarioCliente: lineArray[index][42],
                        montanteOportunidade: lineArray[index][43],
                        codigoDoProduto: lineArray[index][44],
                        nFornececdores: lineArray[index][45],
                        possiveisFornecedores: lineArray[index][46],
                        classeTerapeutica: lineArray[index][47],
                        tarja: lineArray[index][48],
                        codigoProSaude: lineArray[index][49],
                        fornecedorPreferencial: lineArray[index][50],
                        estrategico: lineArray[index][51],
                        status: lineArray[index][52],
                        motivosDaRevisao: lineArray[index][53],
                        motivosDoAjuste: lineArray[index][54],
                        situacaoEdital: lineArray[index][55],
                        dataHoraSituação: lineArray[index][56],
                        dataHoraPublicacao: lineArray[index][57],
                        observacaoNoItem: lineArray[index][58],
                        linkEdital: "https://www.licitasys.com.br/api/Shared/Anexo/DownloadAnexosEdital?idEdital=" + lineArray[index][1],
                        encarregadoEmail: "",
                        enacarregadoNome: "",
                        won: false,
                        finalized: false,
                        tarefas: [],
                        id: lineArray[index][1] + "$" + lineArray[index][25].replace(/[/]/g, ' ') + "%" + lineArray[index][8].replace(/[/]/g, ' '),
                        vendedor: ((obj.nomeVendedor).normalize('NFD').replace(/[\u0300-\u036f]/g, "")).replace(/\s/g, ''),
                        email: "",
                        name: "",
                        details: [],
                        lost: false,
                        finished: false,
                        hidden: false,
                        showAdmin: true,
                    })
                }
            }
            var names = [];
            var names2 = [];
            for (let idx = 0; idx < oportunidades.length; idx++) {
                const element = oportunidades[idx];
                if (!names2.includes(element.vendedor)) {
                    names2.push(element.vendedor)
                }
                for (let i = 0; i < users.length; i++) {
                    const element2 = users[i];
                    var nameT = (((element2.name).normalize('NFD').replace(/[\u0300-\u036f]/g, "")).replace(/\s/g, '')).toUpperCase()
                    if (nameT.includes((element.vendedor).toUpperCase())) {
                        if (!names.includes(element.vendedor)) {
                            names.push(element.vendedor)
                        }
                        oportunidades[idx].name = element2.name;
                        oportunidades[idx].email = element2.email;
                    }
                }
            }
            var oportunitiesById = {};
            var oportunitiesIds = [];
            for (let index = 0; index < oportunidades.length; index++) {
                const element = oportunidades[index];
                if (!oportunitiesIds.includes(element.idLicitasys)) {
                    oportunitiesById[element.idLicitasys] = element;
                    oportunitiesIds.push(element.idLicitasys)
                    oportunitiesById[element.idLicitasys].details.push({
                        objeto: element.objeto,
                        observacao: element.observacao,
                        item: element.item,
                        produtoLicitado: element.produtoLicitado,
                        quantidade: element.quantidade,
                        unidade: element.unidade,
                        precoReferenciaTotal: element.precoReferenciaTotal,
                        mandadoJudicial: element.mandadoJudicial,
                        exclusivoEpp: element.exclusivoEpp,
                        produtoCandidato: element.produtoCandidato,
                        caracteristicas: element.caracteristicas,
                        montanteOportunidade: element.montanteOportunidade,
                        possiveisFornecedores: element.possiveisFornecedores,
                        classeTerapeutica: element.classeTerapeutica,
                        tarja: element.tarja,
                        codigoProSaude: element.codigoProSaude,
                        fornecedorPreferencial: element.fornecedorPreferencial,
                        observacaoNoItem: element.observacaoNoItem,
                    })
                } else {
                    oportunitiesById[element.idLicitasys].montanteOportunidade = oportunitiesById[element.idLicitasys].montanteOportunidade + element.montanteOportunidade;
                    oportunitiesById[element.idLicitasys].details.push({
                        objeto: element.objeto,
                        observacao: element.observacao,
                        item: element.item,
                        produtoLicitado: element.produtoLicitado,
                        quantidade: element.quantidade,
                        unidade: element.unidade,
                        precoReferenciaTotal: element.precoReferenciaTotal,
                        mandadoJudicial: element.mandadoJudicial,
                        exclusivoEpp: element.exclusivoEpp,
                        produtoCandidato: element.produtoCandidato,
                        caracteristicas: element.caracteristicas,
                        montanteOportunidade: element.montanteOportunidade,
                        possiveisFornecedores: element.possiveisFornecedores,
                        classeTerapeutica: element.classeTerapeutica,
                        tarja: element.tarja,
                        codigoProSaude: element.codigoProSaude,
                        fornecedorPreferencial: element.fornecedorPreferencial,
                        observacaoNoItem: element.observacaoNoItem,
                    })
                }
            }
            var newArray = [];
            var keys = Object.keys(oportunitiesById)
            for (let i = 0; i < keys.length; i++) {
                const element = keys[i];
                newArray.push(oportunitiesById[element]);
            };
            //for (let i = 0; i < Object.keys(oportunidades).length; i++) {
            //var element = Object.keys(oportunidades)[i]
            //submit(oportunidades, element)
            //}
            newArray.map(async (oportunidade, index) => {
                await firebase.firestore().collection("oportunidades").doc(oportunidade.id).set(oportunidade);
                if (index === newArray.length - 2) {
                    addEvent(newArray);
                    setSeverity("success")
                    setMessage("Oportunidades cadastradas com sucesso");
                    handleClick();
                    setIsloading(false);
                    getOportunidades();
                }
            })
        };
        reader.readAsBinaryString(f)
    }

    const getOportunidades = () => {
        setFetchedData([]);
        var data = []
        firebase.firestore().collection("oportunidades").where("showAdmin", "==", true).orderBy("dataHoraCertame", "asc").get().then((snapshot) => {
            snapshot.forEach(doc => {
                data.push(doc.data())
            })
        }).then(() => {
            var tables = {};
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (!tables[element.name]) {
                    tables[element.name] = [element];
                } else {
                    tables[element.name].push(element)
                }
            }
            setFetchedData(tables);
        })
    }

    useEffect(() => {
        fetchData();
        fetchUsers();
        getOportunidades();
    }, []);

    const fetchUsers = () => {
        firebase.firestore().collection("Users").where("areas", "array-contains", "Comercial").get().then((snapshot) => {
            snapshot.forEach((doc) => {
                setUsers(users => [...users, doc.data()]);
            })
        })
    }
    const fetchData = () => {
        var data = {};
        setIsloading(true)
        firebase.firestore().collection("regionalizacao").onSnapshot(async snapshot => {
            var array = [];
            setFetch([]);
            setIsloading(true)
            snapshot.forEach(data2 => {
                data = data2.data();
            })
            var keys = Object.keys(data);
            for (let index = 0; index < keys.length; index++) {
                const element = keys[index];
                for (let index = 0; index < data[element].length; index++) {
                    const element2 = data[element][index];
                    if (element2.idVendedor) {
                        array.push(element2)
                    }
                }
            }
            setIsloading(false);
            setFetch(array);
        })
    }

    const listData = (data) => {
        return (
            data.map((oportunidade, index) => (
                <List refresh={() => {
                    setSeverity("success")
                    setMessage("Oportunidade deletada com sucesso");
                    handleClick();
                    getOportunidades();
                }} data={oportunidade} />
            ))
        )
    }

    var gapi = window.gapi
    const addEvent = async (data) => {

        if (data.length > 0) {
            console.log("Triggered")
            gapi.load("client:auth2", () => {

                gapi.client.init({
                    apiKey: calendarConfig.API_KEY,
                    clientId: calendarConfig.CLIENT_ID,
                    discoveryDocs: calendarConfig.DISCOVERY_DOCS,
                    scope: calendarConfig.SCOPES,
                })
                gapi.client.load('calendar', "v3", () => console.log("bam!"))
                gapi.auth2.getAuthInstance().signIn().then(async () => {
                    var request;
                    var errorEventos = [];
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        const event = {
                            'summary': element.idLicitasys + " - " + element.licitador,
                            'location': 'Quadra 02 Lote 49,51,53,54, St. de Indústria - Ceilândia, Brasília - DF, 72265-020',
                            'description': element.uf + " / " + element.municipio,
                            'start': {
                                'dateTime': moment(element.dataHoraCertame).toISOString(),
                                'timeZone': 'America/Sao_Paulo',
                            },
                            'end': {
                                'dateTime': moment(element.dataHoraCertame).toISOString(),
                                'timeZone': 'America/Sao_Paulo',
                            },
                            'recurrence': [
                                'RRULE:FREQ=DAILY;COUNT=1'
                            ],
                            'attendees': [
                                { 'email': element.email },
                            ],
                            'reminders': {
                                'useDefault': false,
                                'overrides': [
                                    { 'method': 'email', 'minutes': 24 * 60 },
                                    { 'method': 'popup', 'minutes': 10 },
                                ],
                            },
                        };
                        request = gapi.client.calendar.events.insert({
                            'calendarId': "primary",
                            "resource": event,
                        });
                        await request.execute(event2 => {
                            if (event2.error) {
                                console.log("Error ==> ", event2)
                                errorEventos.push(data[index]);
                            } else {
                                console.log("tentando => ", event2)
                                window.open(event2.htmlLink)
                            }
                        });
                    }
                    console.log("Erros ==> ", errorEventos)
                    addEvent(errorEventos);
                })
            })
        }
    }

    const listRow = () => {
        var keys = Object.keys(fetchedData);
        var data = [];
        for (let index = 0; index < keys.length; index++) {
            const element = fetchedData[keys[index]];
            console.log("element ==> ", element, keys, fetchedData)
            data.push(element)
        };

        return (
            data.map((vendedor, index) => {
                return (
                    <>
                        {
                            isLoading === false ?
                                <Card>
                                    <CardHeader>
                                        <h3>{vendedor[0].name}</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Table>
                                                <thead className="text-primary">
                                                    <tr>
                                                        <th></th>
                                                        <th>ID</th>
                                                        <th>Licitador</th>
                                                        <th>Município</th>
                                                        <th>UF</th>
                                                        <th>Proposta</th>
                                                        <th>Certame</th>
                                                        <th>Modalidade</th>
                                                        <th>Oportunidade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listData(vendedor)}
                                                </tbody>
                                            </Table>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <div>
                                            <h4>Total: {displayTotal(vendedor)}</h4>
                                        </div>
                                    </CardFooter>
                                </Card> : null
                        }
                    </>
                )
            })
        );
    };

    const displayTotal = (data) => {
        var total = 0;
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            total = total + element.montanteOportunidade
        }
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((total).toFixed(2))
    }
    return (
        <div className="content" >
            {
                isLoading === false ? <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => readFile(e)} /> : <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}> <ClipLoader color="#2381f8" size={45} /></div>
            }
            <div style={{ width: '100%', height: "30px" }} />
            {listRow()}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};