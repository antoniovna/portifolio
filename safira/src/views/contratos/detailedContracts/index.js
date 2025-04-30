import React from "react";
import TableRow from "./row";
import { Card, CardHeader, CardBody, Table } from "reactstrap";
export default function ({ data }) {
  console.log(data);
  return (
    <Card>
      <CardHeader>
        <h3>Planilha de contratos (detalhadas)</h3>
      </CardHeader>
      <CardBody>
        <Table responsive className="tablesorter" responsive>
          <thead className="text-primary">
            <tr>
              <th></th>
              <th>Valor entregue</th>
              <th>Valor contrato</th>
              <th>Valor saldo</th>
              <th>Saldo</th>
              <th>Nº itens</th>
            </tr>
          </thead>
          <tbody>
            <TableRow />
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
