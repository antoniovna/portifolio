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
import firebase from './../../initfirebase';
import RowTable from './rowAtivos';
export default function ChamadosReccebidos() {
  const [listChamados, setListChamados] = useState([]);

  const getChamados = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().collection("Chamados").where("creator", "==", user.email).where("finalized", "==", false).orderBy("timestamp", "desc").onSnapshot((snapshot) => {
          setListChamados([])
          snapshot.forEach(doc => {
            setListChamados(listChamados => listChamados.concat(doc.data()))
          })
        })
        // User is signed in.
      } else {
        return;
        // No user is signed in.
      }
    })
  }

  useEffect(() => {
    getChamados()
  }, [])

  const chamados = listChamados.map((object, index) => (
    <RowTable object={object} />
  ))
  return (
    <>
      <div className="content">
        <Col md="12">
          <Card>
            <CardHeader>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
                <CardTitle tag="h4">Chamados ativos</CardTitle>
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
      </div>
    </>
  );
};
