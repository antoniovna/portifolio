import React from "react";
import { Table, Card, CardBody, CardTitle, CardHeader, Row } from "reactstrap";
import Details from "./details";
export default function List({ data, name, getData, handleClick }) {
  const listData = data.map((row, index) => (
    <Details
      getData={() => getData()}
      handleClick={(e) => {
        handleClick(e);
      }}
      data={row}
    />
  ));
  return (
    <>
      <Row>
        <Card>
          <CardHeader>
            <CardTitle tag="h2">{name}</CardTitle>
          </CardHeader>
          <CardBody>
            <Table >
              <thead>
                <th>Data</th>
                <th>Anexo</th>
                <th></th>
              </thead>
              <tbody>{listData}</tbody>
            </Table>
          </CardBody>
        </Card>
      </Row>
    </>
  );
}
