/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Col,
  Button,
  Collapse,
} from "reactstrap";
import GestaoDeChamados from './../../components/gestaoDeChamados/index';
import firebase from './../../initfirebase';
import Ativos from './chamadosAtivos';
import Encerrados from './chamadosEncerrados';
export default function ChamadosReccebidos() {
  const [listChamados, setListChamados] = useState([]);

  const getChamados = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
         firebase.firestore().collection("Chamados").where("encarregados", "array-contains", user.email).where("finalized", "==", false).orderBy("timestamp", "desc").onSnapshot((snapshot) => {
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

  listChamados.map((object, index) => {
    var open = true;
    const date = new Date(object.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dt = date.getDate();
    var now = new Date();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    var fullDate = dt + "/" + month + "/" + year;
    var pastDate = new Date(dt + "-" + month + "-" + year)

    return (
      <>
        <tr>
          <td>
            <Button onClick={() => open = false}>Editar</Button>
          </td>
          <td>{object.id}</td>
          <td>{object.areas}</td>
          {
            pastDate < now === true ?
              <td>
                <p style={{ color: "red" }}>{fullDate}</p>
              </td> :
              <td>
                <p style={{ color: "green" }}>{fullDate}</p>
              </td>
          }

          {
            object.status === "Feito" ? <td style={{ color: "green" }}>
              <div style={{ height: 15, width: 15, backgroundColor: "green", borderRadius: "50%" }} />
            </td> :
              <>
                {
                  object.status === "A fazer" ? <td style={{ color: "yellow" }} >
                    <div style={{ height: 15, width: 15, backgroundColor: "yellow", borderRadius: "50%" }} />
                  </td> :
                    <>
                      {
                        object.status === "Em andamento" ? <td style={{ color: "blue" }}>
                          <div style={{ height: 15, width: 15, backgroundColor: "blue", borderRadius: "50%" }} />
                        </td> :
                          <>
                            {
                              object.status === "Pausado" ? <td style={{ color: "grey" }} >
                                <div style={{ height: 15, width: 15, backgroundColor: "grey", borderRadius: "50%" }} />
                              </td> : null
                            }
                          </>
                      }
                    </>
                }
              </>
          }
          <td>{object.creatorName}</td>
          <td>{object.problema}</td>
          {
            // object.descricao.length > 10? <td>{object.descricao.substr(0,10)}</td> :<td>{object.descricao}</td>
          }
        </tr>
      </>
    )
  })
  return (
    <>
      <div className="content">
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Gestão de chamados</CardTitle>
            </CardHeader>
            <CardBody>
              <GestaoDeChamados />
            </CardBody>
          </Card>
        </Col>
        <Ativos/>
        <Encerrados/>
      </div>
    </>
  );
};
