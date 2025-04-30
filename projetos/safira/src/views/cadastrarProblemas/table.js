import React, { useState, useEffect, forwardRef } from 'react';
import firebase from './../../initfirebase';
import { useHistory } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Card,
    CardBody,
    Table,
    Row,
    Col
} from "reactstrap";
import { ClipLoader } from 'react-spinners';

let currentUser;

export default function LigacoesRecebidas() {
    var history = useHistory();
    const body = document.querySelector("body");
    function _fetchCalls(user) {
        firebase.firestore().collection("Problemas");
        firebase.firestore().collection("Problemas").onSnapshot((doc) => {
            setCalls([])
            doc.forEach(element => {
                setCalls(calls => calls.concat(element.data()))
            })
        })
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                currentUser = user.email;
                _fetchCalls(user.email)
                // ...
            } else {
                history.push("/IntranetLogin")
            }
        });
    }, [currentUser]);
    const [calls, setCalls] = useState([])
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteRow = async (id) => {
        setIsDeleting(true)
        firebase.firestore().collection("Problemas").doc(id).delete().then(() => {
            setIsDeleting(false)
        }).catch(e => {
            setIsDeleting(false)
        })
    }
    const tableRow = calls.map((value, index) => (
        <tr key={index}>
            <td><button className="delete-button" onClick={() => deleteRow(value.id)} color="danger" >
                Excluir
            </button></td>
            <td>{value.problema}</td>
            <td>{value.area}</td>
        </tr>
    ))

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardBody>
                                <Table className="tablesorter" responsive>
                                    <thead className="text-primary">
                                        <tr>
                                            <th>Ações</th>
                                            {/*<th>Problema</th>*/}
                                            <th>Área</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableRow}
                                    </tbody>
                                </Table>
                                {
                                    isDeleting === true ? <div style={{ marginLeft: 7, marginRight: 7, display: "flex", justifyContent: "center", alignItems: "center" }}><ClipLoader color="#FFFFFF" size={35} /></div> : null
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}