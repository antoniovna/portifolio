import React from "react";
import TableRow from "./row";
import { Card, CardHeader, CardBody, Table } from "reactstrap";
export default function ({ data }) {
  const showData = () => {
    var list = [];
    var dictData = {};
    for (let index = 0; index < Object.keys(data).length; index++) {
      const element = Object.keys(data)[index];
      for (let idx = 0; idx < data[element].length; idx++) {
        const element2 = data[element][idx];
        if (!dictData[element2[1]]) {
          dictData[element2[1]] = {
            id_produto: element2[1],
            nome_item: element2[3],
            items: [],
          };
        }
        dictData[element2[1]].items.push({
          CODIGO_PRO: element2[1],
          ITEM_NO_ITEM: element2[2],
          DESCRICAO_ITEM: element2[3],
          UNIDADE_ITEM: element2[4],
          QUANTIDADE_ITEM: element2[5],
          TOTAL_ITEM: element2[6],
          MARCA_ITEM: element2[7],
          PRODUTO_ID_ITEM: element2[8],
          ANEXO_ITEM: element2[9],
          STATUS_ITEM: element2[10],
          QUANTIDADE_VENCIDO: element2[11],
          QUANTIDADE_PERDIDO: element2[12],
          PRECO_ORIGINAL: element2[13],
          CADASTROS_ID_CAPA: element2[14],
          CLIENTE_CAPA: element2[15],
          DATA_CAPA: element2[16],
          DESCRICAO_CAPA: element2[17],
          STATUS_CAPA: element2[18],
          FUNCIONARIO_ID: element2[19],
          NOME_VENDEDOR: element2[20],
          DATA_ABERTURA: element2[21],
          VALIDADE_CONTRATO: element2[22],
          DATA_ENCERRAMENTO: element2[23],
          CAD_CGC: element2[24],
          CODIGO_GRUPO: element2[25],
          PRECO_CUSTO: element2[26],
          CUSTO_CALCULADO: element2[27],
          PRECO_ITEM_POR_EMB: element2[28],
          PRECO_TOTAL_ITEM: element2[29],
          PRECO_ITEM: element2[30],
          PRECO_CUSTO_POR_UN: element2[31],
          PERC: element2[32],
          PRECO_CUSTO_CALCULADO_POR_UN: element2[33],
          PERC_CC: element2[34],
          ESTOQUE_ATUAL: element2[35],
          QUANTIDADE_POR_UNIDADE: element2[36],
          ESTOQUE_ATUAL_UNIDADE: element2[37],
          QTD_FATURADO: element2[38],
          QTD_A_FATURA: element2[39],
          LEGENDA_COR: element2[40],
        });
      }
    }
    return (
      <>
        {Object.keys(dictData).map((key, index) => (
          <TableRow key={"element" + index} data={dictData[key]} />
        ))}
      </>
    );
  };
  return (
    <Card>
      <CardHeader>
        <h3>Detalhes itens laboratórios por contrato</h3>
      </CardHeader>
      <CardBody>
        <Table responsive className="tablesorter" responsive>
          <thead className="text-primary">
            <tr>
              <th></th>
              <th>Item</th>
              <th>Saldo</th>
              <th>Estoque</th>
              <th>Valor C.</th>
              <th>Valor V.</th>
              <th>Valor total</th>
              <th>Markup</th>
              <th>Validade</th>
            </tr>
          </thead>
          <tbody>{showData()}</tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
