import React, { useState, useEffect } from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Col,
} from "reactstrap";
import RowTable from './../chamadosEnviados/rowEncerrado';
export default function TabelaDashboard({ listChamados }) {
    const chamados = listChamados.map((object, index) => (
        <RowTable key={"chamado-dashboard " + index} object={object} />
    ))
    return (
        <>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ height: 15, width: 15, backgroundColor: "green", borderRadius: "50%", marginRight: 4, marginLeft: 12 }} />
                                    <p>Aguardando aprovação</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ height: 15, width: 15, backgroundColor: "blue", borderRadius: "50%", marginRight: 4, marginLeft: 12 }} />
                                    <p>Em andamento</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ height: 15, width: 15, backgroundColor: "yellow", borderRadius: "50%", marginRight: 4, marginLeft: 12 }} />
                                    <p>A fazer</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ height: 15, width: 15, backgroundColor: "grey", borderRadius: "50%", marginRight: 4, marginLeft: 12 }} />
                                    <p>Pausado</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table className="tablesorter" responsive>
                            <thead className="text-primary">
                                <tr>
                                    <th></th>
                                    <th>ID</th>
                                    <th>Área</th>
                                    <th>Prazo</th>
                                    <th>Status</th>
                                    <th>Criador</th>
                                    {/*<th>Problema</th>*/}
                                    {/*<th>Descrição</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {chamados}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};
