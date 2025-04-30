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
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Table from './table';
import firebase from './../../initfirebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 220,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CadastrarAres() {
    const [open, setOpen] = React.useState(false);
    const [area, setArea] = useState("")
    const [accept, setAccept] = useState(false);
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
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <InputLabel id="demo-simple-select-outlined-label">Cliente</InputLabel>
                                            <Input placeholder="Cliente" value={area} type="text" onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="2">
                                            <InputLabel id="demo-simple-select-outlined-label">Nº do pregão</InputLabel>
                                            <Input placeholder="Nº do pregão" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Empenho</InputLabel>
                                            <Input placeholder="Empenho" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="4">
                                            <InputLabel id="demo-simple-select-outlined-label">Contato do responável</InputLabel>
                                            <Input placeholder="Contato" value={area} type="text" onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="2">
                                            <InputLabel id="demo-simple-select-outlined-label">Nº do pregão</InputLabel>
                                            <Input placeholder="Nº do pregão" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="1">
                                            <InputLabel id="demo-simple-select-outlined-label">UF</InputLabel>
                                            <Input placeholder="UF" type="select" value={area} onChange={(e) => setArea(e.target.value)} >
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Input>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="2">
                                            <InputLabel id="demo-simple-select-outlined-label">Data de chegada</InputLabel>
                                            <Input placeholder="Data de chegada" value={area} type="date" onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="2">
                                            <InputLabel id="demo-simple-select-outlined-label">Data p/ entrega</InputLabel>
                                            <Input placeholder="Data p/ entrega" type="date" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Produto pendente</InputLabel>
                                            <Input placeholder="Produto pendente" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Quantidade pendente</InputLabel>
                                            <Input placeholder="Quantidade pendente" type="text" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Marca</InputLabel>
                                            <Input placeholder="Marca" value={area} type="text" onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Produto pendente</InputLabel>
                                            <Input placeholder="Produto pendente" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="2">
                                            <InputLabel id="demo-simple-select-outlined-label">Quantidade pendente</InputLabel>
                                            <Input placeholder="Quantidade pendente" type="text" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Aceita troca de marca?</InputLabel>
                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <label style={{ marginRight: 7 }}>Não</label>
                                                <Switch onChange={() => setAccept(!accept)} value={accept} color="primary" />
                                                <label style={{ marginLeft: 7 }}>Sim</label>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Valor licitado</InputLabel>
                                            <Input placeholder="Valor licitado" value={area} type="text" onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Valor da garantia</InputLabel>
                                            <Input placeholder="Valor da garantia" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="2">
                                            <InputLabel id="demo-simple-select-outlined-label">Valor atual</InputLabel>
                                            <Input placeholder="Valor atual" type="text" value={area} onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="4">
                                            <InputLabel id="demo-simple-select-outlined-label">Problema</InputLabel>
                                            <Input placeholder="Problema" value={area} type="text" onChange={(e) => setArea(e.target.value)} />
                                        </Col>
                                        <Col className="px-md-1" md="3">
                                            <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                                            <Input placeholder="Produto pendente" type="select" value={area} onChange={(e) => setArea(e.target.value)} >
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                            </Input>
                                        </Col>
                                    </Row>
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
                <Table />
            </div>
        </>
    );
};
