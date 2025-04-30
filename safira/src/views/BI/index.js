import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import firebase from "./../../initfirebase";
import Snackbar from "@material-ui/core/Snackbar";
import {
  Table,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Input,
  Button,
  CardTitle,
} from "reactstrap";
import MuiAlert from "@material-ui/lab/Alert";
import { ClipLoader } from "react-spinners";
import List from "./row";
import moment from "moment";
import calendarConfig from "./../../services/calendarConfig";
import Select from "react-select";
import Horizontal from "./graphs/bars";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AbrirChamados() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [allData, setAllData] = useState({});
  ///Filters
  const [n_edital, setN_edital] = useState("");
  const [id, setId] = useState("");
  const [modalidade, setModalidade] = useState([]);
  const [licitador, setLicitador] = useState([]);
  const [classificacao, setClassificacao] = useState([]);
  const [dataFIltrada, setDataFiltrada] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [estados, setEstados] = useState([]);
  //lista de filtros
  const [modalidadeList, setModalidadeList] = useState([]);
  const [licitadorList, setLicitadorList] = useState([]);
  const [classificacaoList, setClassificacaoList] = useState([]);
  const [dataFIltradaList, setDataFiltradaList] = useState([]);
  const [produtosList, setProdutosList] = useState([]);
  const [laboratoriosList, setLaboratoriosList] = useState([]);
  const [estadosList, setEstadosList] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [labs_data, setLabs_data] = useState({});
  const [limit, setLimit] = useState({});
  const [allOldData, setAllOldData] = useState({});
  const limits = [
    { value: "Top 3", label: "Top 3" },
    { value: "Top 5", label: "Top 5" },
    { value: "Top 7", label: "Top 7" },
    { value: "Top 10", label: "Top 10" },
    { value: "Todos", label: "Todos" },
  ];

  let chartExample3 = {
    data: {
      labels: ["USA", "GER", "AUS", "UK", "RO", "BR"],
      datasets: [
        {
          label: "Valor R$",
          fill: true,
          backgroundColor: "rgba(46, 99, 245, 0.1)",
          hoverBackgroundColor: "rgba(46, 99, 245, 0.1)",
          borderColor: "#2E63F5",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [53, 20, 10, 80, 100, 45],
        },
      ],
    },

    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(225,78,202,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 120,
              padding: 20,
              fontColor: "#9e9e9e",
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(225,78,202,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e",
            },
          },
        ],
      },
    },
  };

  const handleClick = () => {
    setOpen(true);
  };

  const displayTotal = (data) => {
    var total = 0;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      total = total + element.montanteOportunidade;
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total.toFixed(2));
  };
  const returnOptions = (array) => {
    var options = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      options.push({ value: element, label: element });
    }
    return options;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  function excelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25568);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    var date = moment(
      new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      )
    ).format("DD/MM/yyyy");
    var time = moment(
      new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      )
    ).format("HH:mm");
    return date + " " + time;
  }

  const readFile = async (e) => {
    e.preventDefault();
    if (e.target.files === null) {
      return;
    }
    setIsloading(true);
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
      var listContratos = {};
      for (let index = 0; index < lineArray.length; index++) {
        if (index > 0) {
          if (!listContratos[lineArray[index][1]]) {
            listContratos[lineArray[index][1]] = {
              pessoa: lineArray[index][0],
              ID_LicitaSYS: lineArray[index][1],
              CNPJ: lineArray[index][2],
              Licitador: lineArray[index][3],
              UF: lineArray[index][4],
              Municipio: lineArray[index][5],
              Populacao_Municipal: lineArray[index][6],
              Classificacao_do_Licitador: lineArray[index][7],
              No_Edital: lineArray[index][8],
              No_Edital_Original: lineArray[index][9],
              Repeticao: lineArray[index][10],
              No_Processo: lineArray[index][11],
              Objeto: lineArray[index][12],
              Modalidade: lineArray[index][13],
              Nome_Site: lineArray[index][14],
              Url_Site: lineArray[index][15],
              Identificador: lineArray[index][16],
              Tipo: lineArray[index][17],
              Contém_itens_Mand_Jud: lineArray[index][18],
              Prazo_do_Edital: excelDateToJSDate(lineArray[index][19]),
              Data_Hora_Certame: excelDateToJSDate(lineArray[index][20]),
              Prazo_de_Validade_do_Contrato: excelDateToJSDate(
                lineArray[index][21]
              ),
              Observacao_no_Edital: lineArray[index][22],
              Observacao_Licitacao: lineArray[index][23],
              Motivos_da_Revisao: lineArray[index][54],
              Motivos_do_Ajuste: lineArray[index][55],
              Situacao_Edital: lineArray[index][56],
              Data_Hora_Situacao: excelDateToJSDate(lineArray[index][57]),
              Data_Hora_Publicacao: excelDateToJSDate(lineArray[index][58]),
              linkEdital:
                "https://www.licitasys.com.br/api/Shared/Anexo/DownloadAnexosEdital?idEdital=" +
                lineArray[index][1],
              produtos: [],
            };
          }
          listContratos[lineArray[index][1]].produtos.push({
            Lote: lineArray[index][24],
            Item: lineArray[index][25],
            Produto_Licitado: lineArray[index][26],
            Complemento: lineArray[index][27],
            Quantidade: lineArray[index][28],
            Unidade: lineArray[index][29],
            Conversão: lineArray[index][30],
            Quantidade_Original: lineArray[index][31],
            Unidade_Original: lineArray[index][32],
            Preço_Referencia_Unitário: lineArray[index][33],
            Preço_Referência_Total: lineArray[index][34],
            Mandado_Judicial: lineArray[index][35],
            Exclusivo_EPP: lineArray[index][36],
            Produto_Candidato: lineArray[index][37],
            Descricao: lineArray[index][38],
            Formato: lineArray[index][39],
            Caracteristicas: lineArray[index][40],
            Apresentacao: lineArray[index][41],
            Via_Administracao: lineArray[index][42],
            Preço_Unitario_Cliente: lineArray[index][43],
            Montante_Oportunidade: lineArray[index][44],
            Codigo_do_Produto: lineArray[index][45],
            No_FORNECEDORES: lineArray[index][46],
            POSSIVEIS_FORNECEDORES: lineArray[index][47],
            CLASSE_TERAPEUTICA: lineArray[index][48],
            TARJA: lineArray[index][49],
            CODIGO_PRO_SAUDE: lineArray[index][50],
            FORN_PREFERENCIAL: lineArray[index][51],
            ESTRATEGICO: lineArray[index][52],
            Status: lineArray[index][53],
          });
        }
      }
      setAllData(listContratos);
      setIsloading(false);
    };
    reader.readAsBinaryString(f);
  };

  var gapi = window.gapi;
  const addEvent = async (data) => {
    if (data.length > 0) {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          apiKey: calendarConfig.API_KEY,
          clientId: calendarConfig.CLIENT_ID,
          discoveryDocs: calendarConfig.DISCOVERY_DOCS,
          scope: calendarConfig.SCOPES,
        });
        gapi.client.load("calendar", "v3", () => console.log("bam!"));
        gapi.auth2
          .getAuthInstance()
          .signIn()
          .then(async () => {
            var request;
            var errorEventos = [];
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              const event = {
                summary: element.idLicitasys + " - " + element.licitador,
                location:
                  "Quadra 02 Lote 49,51,53,54, St. de Indústria - Ceilândia, Brasília - DF, 72265-020",
                description: element.uf + " / " + element.municipio,
                start: {
                  dateTime: moment(element.dataHoraCertame).toISOString(),
                  timeZone: "America/Sao_Paulo",
                },
                end: {
                  dateTime: moment(element.dataHoraCertame).toISOString(),
                  timeZone: "America/Sao_Paulo",
                },
                recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
                attendees: [{ email: element.email }],
                reminders: {
                  useDefault: false,
                  overrides: [
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 10 },
                  ],
                },
              };
              request = gapi.client.calendar.events.insert({
                calendarId: "primary",
                resource: event,
              });
              await request.execute((event2) => {
                if (event2.error) {
                  errorEventos.push(data[index]);
                } else {
                  window.open(event2.htmlLink);
                }
              });
            }
            addEvent(errorEventos);
          });
      });
    }
  };

  useEffect(() => {
    displayFilters();
  }, [allData]);
  const displayFilters = () => {
    var modalidade_f = [];
    var licitador_f = [];
    var classificacao_f = [];
    var dataFiltrada_f = ["Edital", "Validade do contrato", "Certame"];
    var produtos_f = [];
    var laboratorios_f = [];
    var estados_f = [];
    for (let index = 0; index < Object.keys(allData).length; index++) {
      const element = Object.keys(allData)[index];
      if (!modalidade_f.includes(allData[element].Modalidade)) {
        modalidade_f.push(allData[element].Modalidade);
      }
      if (!licitador_f.includes(allData[element].Licitador)) {
        licitador_f.push(allData[element].Licitador);
      }
      if (!estados_f.includes(allData[element].UF)) {
        estados_f.push(allData[element].UF);
      }
      if (
        !classificacao_f.includes(allData[element].Classificacao_do_Licitador)
      ) {
        classificacao_f.push(allData[element].Classificacao_do_Licitador);
      }

      if (allData[element].produtos) {
        for (let idx = 0; idx < allData[element].produtos.length; idx++) {
          const element2 = allData[element].produtos[idx];
          if (!produtos_f.includes(element2.Produto_Candidato)) {
            produtos_f.push(element2.Produto_Candidato);
          }
          for (
            let i = 0;
            i < element2.POSSIVEIS_FORNECEDORES.split("/").length;
            i++
          ) {
            const element3 = element2.POSSIVEIS_FORNECEDORES.split("/")[i];
            if (!laboratorios_f.includes(element3)) {
              laboratorios_f.push(element3);
            }
          }
        }
      }
    }
    setModalidadeList(modalidade_f);
    setLicitadorList(licitador_f);
    setClassificacaoList(classificacao_f);
    setProdutosList(produtos_f);
    setLaboratoriosList(laboratorios_f);
    setEstadosList(estados_f);
    setDataFiltradaList(dataFiltrada_f);
  };

  const filter = () => {
    var _old_filteredData = allData;
    var _new_filteredData = {};
    if (n_edital) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element =
          _old_filteredData[Object.keys(_old_filteredData)[index]].No_Edital;
        if (id === element) {
          _new_filteredData[Object.keys(_old_filteredData)[index]] =
            _old_filteredData[Object.keys(_old_filteredData)[index]];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};
    if (id) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element = Object.keys(_old_filteredData)[index];
        if (id === element) {
          _new_filteredData[element] = _old_filteredData[element];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};
    if (modalidade.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element =
          _old_filteredData[Object.keys(_old_filteredData)[index]].Modalidade;
        if (modalidade.some((e) => e.value === element)) {
          _new_filteredData[Object.keys(_old_filteredData)[index]] =
            _old_filteredData[Object.keys(_old_filteredData)[index]];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};
    if (licitador.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element =
          _old_filteredData[Object.keys(_old_filteredData)[index]].Licitador;

        if (licitador.some((e) => e.value === element)) {
          _new_filteredData[Object.keys(_old_filteredData)[index]] =
            _old_filteredData[Object.keys(_old_filteredData)[index]];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};

    if (classificacao.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element =
          _old_filteredData[Object.keys(_old_filteredData)[index]]
            .Classificacao_do_Licitador;

        if (classificacao.some((e) => e.value === element)) {
          _new_filteredData[Object.keys(_old_filteredData)[index]] =
            _old_filteredData[Object.keys(_old_filteredData)[index]];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};

    if (dataFIltrada.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element = dateElement(
          _old_filteredData[Object.keys(_old_filteredData)[index]]
        );

        if (
          moment(formataStringData(element.split(" ")[0])).isBetween(
            dataInicio,
            dataLimite
          )
        ) {
          _new_filteredData[Object.keys(_old_filteredData)[index]] =
            _old_filteredData[Object.keys(_old_filteredData)[index]];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};

    if (produtos.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        for (
          let idx = 0;
          idx <
          _old_filteredData[Object.keys(_old_filteredData)[index]].produtos
            .length;
          idx++
        ) {
          const element =
            _old_filteredData[Object.keys(_old_filteredData)[index]].produtos[
              idx
            ].Produto_Candidato;
          if (produtos.some((e) => e.value === element)) {
            _new_filteredData[Object.keys(_old_filteredData)[index]] =
              _old_filteredData[Object.keys(_old_filteredData)[index]];
          }
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};
    if (laboratorios.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        for (
          let idx = 0;
          idx <
          _old_filteredData[Object.keys(_old_filteredData)[index]].produtos
            .length;
          idx++
        ) {
          const element =
            _old_filteredData[Object.keys(_old_filteredData)[index]].produtos[
              idx
            ].POSSIVEIS_FORNECEDORES;

          if (laboratorios.some((e) => e.value === element)) {
            _new_filteredData[Object.keys(_old_filteredData)[index]] =
              _old_filteredData[Object.keys(_old_filteredData)[index]];
          }
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};

    if (estados.length > 0) {
      for (
        let index = 0;
        index < Object.keys(_old_filteredData).length;
        index++
      ) {
        const element =
          _old_filteredData[Object.keys(_old_filteredData)[index]].UF;

        if (estados.some((e) => e.value === element)) {
          _new_filteredData[Object.keys(_old_filteredData)[index]] =
            _old_filteredData[Object.keys(_old_filteredData)[index]];
        }
      }
    } else {
      _new_filteredData = _old_filteredData;
    }
    _old_filteredData = _new_filteredData;
    _new_filteredData = {};
    console.log(_old_filteredData);
    setAllOldData(_old_filteredData);
    var labs = {};
    var sum = 0;
    for (
      let index = 0;
      index < Object.keys(_old_filteredData).length;
      index++
    ) {
      const element = Object.keys(_old_filteredData)[index];
      for (
        let idx = 0;
        idx < _old_filteredData[element].produtos.length;
        idx++
      ) {
        const produto = _old_filteredData[element].produtos[idx];
        sum += produto.Montante_Oportunidade;
        var potenciais = produto.POSSIVEIS_FORNECEDORES.split("/");
        for (let i = 0; i < potenciais.length; i++) {
          const produto_data = potenciais[i];
          if (produto_data) {
            if (!labs[produto_data]) {
              labs[produto_data] = 0;
            }
            labs[produto_data] += produto.Montante_Oportunidade;
          }
        }
      }
    }

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
    labs = Object.fromEntries(
      Object.entries(labs).sort(([, a], [, b]) => b - a)
    );
    for (let index = 0; index < Object.keys(labs).length; index++) {
      const element = Object.keys(labs)[index];
      displayData.labels.push(element);
      displayData.datasets[0].data.push(Math.ceil(labs[element] * 1));
      displayData.datasets[0].backgroundColor.push(random_rgba()[1]);
      displayData.datasets[0].borderColor.push("transparent");
    }

    console.log(displayData, sum);
    setLabs_data(displayData);
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
  function formataStringData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    return ano + "-" + ("0" + mes).slice(-2) + "-" + ("0" + dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  const dateElement = (object) => {
    switch (dataFIltrada) {
      case "Entrada":
        return object.Prazo_do_Edital;
      case "Validade do contrato":
        return object.Prazo_de_Validade_do_Contrato;
      case "Certame":
        return object.Data_Hora_Certame;
      default:
        return object.Prazo_do_Edital;
    }
  };
  return (
    <div className="content">
      <Row>
        <Card>
          <CardBody>
            {isLoading === false ? (
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => readFile(e)}
              />
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
          </CardBody>
        </Card>
      </Row>

      <Row>
        <Card>
          <CardHeader>
            <h2>Filtros</h2>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <label>Nº edital</label>
                <Input
                  value={n_edital}
                  placeholder="Nº edital"
                  onChange={(e) => setN_edital(e.target.value)}
                />
              </Col>
              <Col>
                <label>ID licitasys</label>
                <Input
                  value={id}
                  placeholder="ID Licitasys"
                  onChange={(e) => setId(e.target.value)}
                />
              </Col>
              <Col>
                <label>Modalidade</label>
                <Select
                  isMulti
                  name="Modalidade"
                  onChange={(e) => setModalidade(e)}
                  options={returnOptions(modalidadeList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Licitador</label>
                <Select
                  isMulti
                  name="Licitador"
                  onChange={(e) => setLicitador(e)}
                  options={returnOptions(licitadorList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
              <Col>
                <label>Classificação do licitador</label>
                <Select
                  isMulti
                  name="Licitador"
                  onChange={(e) => setClassificacao(e)}
                  options={returnOptions(classificacaoList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Data filtrada</label>
                <Select
                  isMulti
                  name="Data filtrada"
                  onChange={(e) => setDataFiltrada(e)}
                  options={returnOptions(dataFIltradaList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
              <Col>
                <label>Data de início</label>
                <Input
                  value={dataInicio}
                  type="date"
                  placeholder="Data de início"
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </Col>
              <Col>
                <label>Data limite</label>
                <Input
                  value={dataLimite}
                  type="date"
                  placeholder="Data limite"
                  onChange={(e) => setDataLimite(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Produtos</label>
                <Select
                  isMulti
                  name="Produtos"
                  onChange={(e) => setProdutos(e)}
                  options={returnOptions(produtosList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
              <Col>
                <label>Laboratórios</label>
                <Select
                  isMulti
                  name="Laboratórios"
                  onChange={(e) => setLaboratorios(e)}
                  options={returnOptions(laboratoriosList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
              <Col>
                <label>Estados</label>
                <Select
                  isMulti
                  name="Estados"
                  onChange={(e) => setEstados(e)}
                  options={returnOptions(estadosList)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            {isFiltering === false ? (
              <Button onClick={() => filter()} color="info">
                Filtrar
              </Button>
            ) : (
              <ClipLoader color="#2381f8" size={45} />
            )}
          </CardFooter>
        </Card>
        <Col md="4" sm="12">
          <label>Resultados</label>
          <Select
            name="Resultados"
            onChange={(e) => setLimit(e)}
            options={limits}
            className="basic-multi-select"
            className
          />
          <br />
        </Col>
        <Card className="card-chart">
          <CardHeader>
            <CardTitle tag="h3">Laboratórios</CardTitle>
          </CardHeader>
          <CardBody>
            <Horizontal
              label="Laboratórios"
              allData={allOldData}
              data={labs_data}
            />{" "}
          </CardBody>
        </Card>
      </Row>

      <div style={{ width: "100%", height: "30px" }} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
