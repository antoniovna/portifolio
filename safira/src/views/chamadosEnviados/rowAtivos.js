import React, { useState } from 'react';
import { CardTitle, Collapse, Card, CardBody, Input, Label } from 'reactstrap'
import IconButton from '@material-ui/core/IconButton';
import MakeNotes from './../../components/chamadosDetails/makeNotes';
import Update from './../../components/chamadosDetails/updateStatus';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import firebase from './../../initfirebase';
import moment from 'moment';
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Details from './../../components/chamadosDetails/details';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 220,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Row(props) {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [alert, setAlert] = React.useState(false);
    const [open, setOpen] = useState(false);
    const date = new Date(props.object.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dt = date.getDate();
    var now = new Date();

    const handleClick = () => {
        setAlert(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert(false);
    };

    const closeModal = () => {
        setModal(false);
    }

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var fullDate = dt + "/" + month + "/" + year;
    var dueDate = new Date(dt + "-" + month + "-" + year)
    const anexo = props.object.anexo.map((value, index) => (
        <a style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#1B4279",
            borderRadius: 5,
            color: "#FFFFFF",
            height: 35,
            paddingRight: 10,
            paddingLeft: 10,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
            marginBottom: 10
        }} href={value.url} >
            {value.name}
        </a>
    ))

    const approve = () => {
        firebase.firestore().collection("Chamados").doc(props.object.id).update({ finalized: true, finalDate: moment(new Date()).format("DD/MM/yyyy") }).then(() => {
            makeNotification(props.object.encarregados);
        })
    }
    const makeNotification = (emails) => {
        emails.forEach((email) => {
            firebase.firestore().collection("Notifications").add({
                date: moment(new Date()).format("DD/MM/YYYY"),
                email: email,
                id: "",
                isRead: false,
                message: `${props.object.creatorName} aprovou o chamado ${props.object.id}`,
                path: "/helpdesk/chamadosRecebidos",
                relatedId: props.object.id,
                timesTamp: new Date(),
                userName: "",
            }).then(newDoc => {
                firebase.firestore().collection("Notifications").doc(newDoc.id).update({ id: newDoc.id })
                handleClick();
            })
        })
    }

    const listTarefas = props.object.tarefas.map((task, index) => (
        <>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Label>{task.task}</Label>
                <Input checked={task.isChecked} type="checkbox" />

            </div>
        </>
    ))
    const listAreas = props.object.areas.map((area, index) => {
        if (index === props.object.areas.length - 1) {
            return area
        } else {
            return area + ", "
        }
    })
    return (
        <>
            <tr>
                <Snackbar open={alert} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Chamado finalizado com sucesso!
        </Alert>
                </Snackbar>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={modal}
                    onClose={closeModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <MakeNotes id={props.object.id} />
                </Modal>
                <td>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Details operation={1} data={props.object} />
                        <MakeNotes id={props.object.id} />
                        {
                            props.object.status === "Feito" ?
                                <IconButton onClick={() => approve()} color="primary">
                                    <CheckCircleIcon />
                                </IconButton> : null
                        }

                    </div>

                </td>
                <td>{props.object.id}</td>
                <td>{listAreas}</td>
                {

                    moment(new Date()).isAfter(moment(dueDate).format("DD/MM/YYYY"), 'day') === false ?
                        <td>
                            <p style={{ color: "red" }}>{fullDate}</p>
                        </td> :
                        <td>
                            <p style={{ color: "green" }}>{fullDate}</p>
                        </td>
                }


                {
                    props.object.status === "Feito" ? <td style={{ color: "green" }}>
                        <div style={{ height: 15, width: 15, backgroundColor: "green", borderRadius: "50%" }} />
                    </td> :
                        <>
                            {
                                props.object.status === "A fazer" ? <td style={{ color: "yellow" }} >
                                    <div style={{ height: 15, width: 15, backgroundColor: "yellow", borderRadius: "50%" }} />
                                </td> :
                                    <>
                                        {
                                            props.object.status === "Em andamento" ? <td style={{ color: "blue" }}>
                                                <div style={{ height: 15, width: 15, backgroundColor: "blue", borderRadius: "50%" }} />
                                            </td> :
                                                <>
                                                    {
                                                        props.object.status === "Pausado" ? <td style={{ color: "grey" }} >
                                                            <div style={{ height: 15, width: 15, backgroundColor: "grey", borderRadius: "50%" }} />
                                                        </td> : null
                                                    }
                                                </>
                                        }
                                    </>
                            }
                        </>
                }
                <td>{props.object.creatorName}</td>
                {/*{/*<td>{props.object.problema}</td>*/}
            </tr>
            {
                open === true ?
                    <tr>
                        <Collapse className="collapse" isOpen={open}>
                            {
                                props.object.anexo.length > 0 ?
                                    <>
                                        <Card>
                                            <CardTitle>
                                                Anexos
                                            </CardTitle>
                                            <CardBody>
                                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                                                    {anexo}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </> : <p>Não há anexos{props.object.anexo.length}</p>
                            }
                            {
                                props.object.tarefas.length > 0 ?
                                    <>
                                        <Card>
                                            <CardTitle>
                                                Tarefas
                                    </CardTitle>
                                            <CardBody>
                                                {listTarefas}
                                            </CardBody>
                                        </Card>
                                    </> : <p>Não há tarefas</p>
                            }
                            <Update operation={1} data={props.object} />
                        </Collapse>
                    </tr> : null
            }


        </>
    )
}