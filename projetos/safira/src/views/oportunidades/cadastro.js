import React, { useState } from "react";
import * as XLSX from 'xlsx';
import firebase from './../../initfirebase';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ClipLoader } from 'react-spinners';

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

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const lineArray = XLSX.utils.sheet_to_json(ws, { header: 1 });
            var oportunidades = {};
            for (let index = 0; index < lineArray.length; index++) {
                if (!oportunidades[lineArray[index][4]]) {
                    oportunidades[lineArray[index][4]] = [];
                }
                oportunidades[lineArray[index][4]].push({
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
                })
            }
            for (let i = 0; i < Object.keys(oportunidades).length; i++) {
                var element = Object.keys(oportunidades)[i]
                firebase.firestore().collection("oportunidades").doc(element).set({ oportunidades: oportunidades[element], id:element })
            }
            setSeverity("success")
            setMessage("Oportunidades cadastradas com sucesso");
            handleClick();
            console.log(oportunidades);
        };
        reader.readAsBinaryString(f)
    }
    return (
        <>
            <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => readFile(e)} />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};