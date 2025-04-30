import React from "react";
import { Card, CardBody, CardHeader, Col, Row, CardTitle } from "reactstrap";
export default function Modal({ data }) {
  const show_legenda = (legenda) => {
    switch (legenda) {
      case "AMARELO NAO LICITAR":
        return "yellow";
      case "NAO CLASSIFICADO":
        return "gray";
      case "ROSA VENDAS SEM DESCONTO":
        return "pink";

      default:
        return "green";
    }
  };
  const show_items = data.items.map((item, index) => (
    <>
      <Col sm={6} lg={4} md={3}>
        <Card>
          <CardHeader>
            <div className="item-contract-card">
              <CardTitle>
                {item.DESCRICAO_ITEM} / {item.CODIGO_PRO}
              </CardTitle>
              <div
                style={{ backgroundColor: show_legenda(item.LEGENDA_COR) }}
                className="status-indicator-contract"
              />
            </div>
          </CardHeader>
          <CardBody>
            <p>{item.QUANTIDADE_ITEM} unidades</p>
            <p>{item.MARCA_ITEM}</p>
          </CardBody>
        </Card>
      </Col>
    </>
  ));
  return (
    <>
      <Card className="contracts-modal-content">
        <CardHeader>
          <h3>Uplaod dos contratos</h3>
        </CardHeader>
        <CardBody>
          <h4>Itens:</h4>
          <Row>{show_items}</Row>
        </CardBody>
      </Card>
    </>
  );
}
