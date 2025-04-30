import React, { useState } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Form,
    Input,
    Row,
    Col,
} from "reactstrap";
//material UI
import InputLabel from '@material-ui/core/InputLabel';
import Table from './table';
import firebase from './../../initfirebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CadastrarAres() {
    const [open, setOpen] = React.useState(false);
    const [area, setArea] = useState("")

    const submit = async () => {
        firebase.firestore().collection("Areas").where("area", "==", area).get().then((snapshot) => {
            if (snapshot.empty) {
                createArea();
            } else {
                alert("Essa área já existe")
            }
        })
    }
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const createArea = async () => {
        firebase.firestore().collection("Areas").add({
            area: area,
            id: ""
        }).then(newDoc => {
            firebase.firestore().collection("Areas").doc(newDoc.id).update({ id: newDoc.id })
            handleClick();
            setArea('');
        })
    }
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Área cadastrada com sucesso!
        </Alert>
            </Snackbar>
            <div className="content">
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Cadastrar nova área</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Col className="px-md-1" md="5">
                                        <InputLabel id="demo-simple-select-outlined-label">Área</InputLabel>
                                        <Input placeholder="Área" value={area} onChange={(e) => setArea(e.target.value)} />
                                    </Col>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => submit()} className="btn-fill" color="success" type="submit">
                                    Enviar
              </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Lista de áreas</h5>
                            </CardHeader>
                            <CardBody>
                                <Table />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};
