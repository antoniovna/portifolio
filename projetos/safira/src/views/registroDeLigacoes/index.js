import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
} from "reactstrap";
import moment from 'moment'
//material UI
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from './checkbox';
import firebase from './../../initfirebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CadastrarAres() {
    const [tasks, setTasks] = useState([{ value: null }])
    const [open, setOpen] = useState(false);
    const [empresa, setEmpresa] = useState("");
    const [assunto, setAssunto] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [descricao, setDescricao] = useState("");
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [checkedItems, setCheckedItems] = useState({}); //plain object as state

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const getUser =  (areas) => {
        setUsers([])
        areas.forEach((area) => {
            let ref = firebase.firestore().collection("Users").where("areas", "array-contains", area).get().then((snapshot => {
                if (snapshot.empty) {
                    return
                }
                snapshot.forEach(doc => {
                    setUsers(users => users.concat(doc.data()))
                })
            }))
        })
    }

    const handleChangeCheck = async (event) => {
        // updating an object instead of a Map
        var objects = checkedItems;
        var name = event.target.name;
        var value = event.target.checked;
        objects[name] = value;
        const entries = Object.entries(objects);
        let filtered = [];
        console.log("items", objects)
        for (let index = 0; index < entries.length; index++) {
            if (entries[index][1] === true) {
                filtered.push(entries[index][0])
            }
        }
        if (!filtered.includes([event.target.name])) {
            if (event.target.checked === true) {
                filtered.push(event.target.name)
            }
        }
        console.log("filtered", filtered)
        filtered = new Set(filtered)
        setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
        getUser(filtered)
    }

    const handleChangeCheckusers = (event) => {
        // updating an object instead of a Map
        const entries = Object.entries(checkedItems);
        let filtered = [];
        for (let index = 0; index < entries.length; index++) {
            if (entries[index][1] === true) {
                filtered.push(entries[index][0])
            }
        }
        setSelectedUsers({ ...selectedUsers, [event.target.name]: event.target.checked });
    }

    const handleAdd = () => {
        const values = [...tasks];
        values.push({ value: null });
        setTasks(values);
    }
    const handleNewTasks = (index, event) => {
        const values = [...tasks];
        values[index].value = event.target.value;
        setTasks(values);
    }

    const getAreas =  () => {
        let ref = firebase.firestore().collection("Areas").get().then(snapshot => {
            if (snapshot.empty) {
                console.log("Documentos não encontrados")
            }
            snapshot.forEach(doc => {
                setAreas(areas => areas.concat(doc.data()))
                console.log(areas)
            })
        })
    }

    const submit = async () => {
        var usersFiltered = [];
        var emails = []
        const entries = Object.entries(selectedUsers);
        for (let index = 0; index < entries.length; index++) {
            if (entries[index][1] === true) {
                usersFiltered.push(entries[index][0])
            }
        }

        for (let index = 0; index < usersFiltered.length; index++) {
            var ref = firebase.firestore().collection("Users").where("name", "==", usersFiltered[index]).get().then(snapshot => {
                if (snapshot.empty) {
                    return;
                }
                snapshot.forEach(doc => {
                    console.log(doc.data())
                    emails.push(doc.data().email)
                })
            }).then(() => {
                let dbRef = firebase.firestore().collection("Ligacoes").add({
                    empresa: empresa,
                    nome: name,
                    email: email,
                    phone: phone,
                    assunto: assunto,
                    usersNames: usersFiltered,
                    emails: emails,
                    id: "",
                }).then(newDoc => {
                    for (let index = 0; index < usersFiltered.length; index++) {
                        console.log(emails[index])
                        addNotifications(newDoc.id, usersFiltered[index], emails[index])
                    }
                    let updateRef = firebase.firestore().collection("Ligacoes").doc(newDoc.id).update({ id: newDoc.id })


                })
            })
        }
    };

    const addNotifications = async (relatedId, name, email) => {
        var message = `Ligação recebida de ${empresa}`
        const ref = firebase.firestore().collection("Notifications").add({
            relatedId: relatedId,
            userName: name,
            email: email,
            message: message,
            path: "/helpdesk/ligacesRecebidas",
            isRead: false,
            id: "",
            timesTamp: new Date(),
            date: moment(new Date()).format("DD/MM/YYYY"),
        }).then(newDoc => {
            let updateRef = firebase.firestore().collection("Notifications").doc(newDoc.id).update({ id: newDoc.id }).then(() => {
                setEmpresa("");
                setAssunto("");
                setName("");
                setPhone("");
                setEmail("");
                setDescricao("");
                setSelectedArea("");
                setAllUsers([]);
                setUsers([]);
                setSelectedUsers({});
                setFilteredUsers([]);
                setCheckedItems({});
                handleClick();
            })
        })
    }

    useEffect(() => (
        getAreas()
    ), [0])
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Ligação registrada com sucesso!
        </Alert>
            </Snackbar>
            <div className="content">
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Registrar ligações</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <label>Empresa</label>
                                            <Input
                                                placeholder="empresa"
                                                type="text"
                                                value={empresa}
                                                onChange={e => setEmpresa(e.target.value)}
                                                style={{ marginTop: 7 }}
                                            />
                                        </Col>
                                        <Col className="pr-md-1" md="5">
                                            <label>Nome</label>
                                            <Input
                                                placeholder="Nome"
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                style={{ marginTop: 7 }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <label>E-mail</label>
                                            <Input
                                                placeholder="E-mail"
                                                type="text"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                style={{ marginTop: 7 }}
                                            />
                                        </Col>
                                        <Col className="pr-md-1" md="5">
                                            <label>Telefone</label>
                                            <Input
                                                placeholder="Telefone"
                                                type="text"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                style={{ marginTop: 7 }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <label>Assunto</label>
                                            <Input
                                                placeholder="Assunto"
                                                type="text"
                                                value={assunto}
                                                onChange={e => setAssunto(e.target.value)}
                                                style={{ marginTop: 7 }}
                                            />
                                        </Col>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                                    {
                                                        areas.map((item, index) => (
                                                            <label>
                                                                <Checkbox key={index} name={item.area} checked={checkedItems[item.area]} onChange={handleChangeCheck} />
                                                            </label>
                                                        ))
                                                    }
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                                    {
                                                        users.map((item, index) => (
                                                            <label>
                                                                <Checkbox key={index} name={item.name} checked={selectedUsers[item.name]} onChange={handleChangeCheckusers} />
                                                            </label>
                                                        ))
                                                    }
                                                </div>
                                            </FormGroup>
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
            </div>
        </>
    );
};