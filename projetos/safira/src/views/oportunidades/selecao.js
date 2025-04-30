import React, { useEffect, useState } from 'react';
import {
    Col,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Row,
    Table
} from 'reactstrap';
import firebase from './../../initfirebase';
import Line from './row';
export default function Selecao() {
    const [data, setData] = useState([]);

    const fetch = () => {
        var currentUser;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                currentUser = user.email
                firebase.firestore().collection("oportunidades").where("email", "==", user.email).orderBy("dataHoraCertame", "asc").onSnapshot(snapshot => {
                    setData([]);
                    var dados = []
                    if (snapshot.empty) {
                        return;
                    }
                    snapshot.forEach((doc) => {
                        console.log("snapshot ==> ", doc.data())
                        dados.push(doc.data())
                    })
                    setData(dados);
                })
            }
        })
    }

    const control = 0;
    useEffect(() => {
        fetch();
    }, [control])
    const listData = data.map((oportunidade, index) => (
        <Line key={index + oportunidade.name} data={oportunidade} />
    ));
    return (
        <>
            <Card>
                <CardHeader>
                    <h2>Oportunidades</h2>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Table responsive>
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
                                {listData}
                            </tbody>
                        </Table>
                    </Row>
                </CardBody>
            </Card>
        </>
    );
};