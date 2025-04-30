import React, { useState, useEffect } from 'react';
import { Card, CardBody, Input, Label, CardHeader, FormGroup, Table } from 'reactstrap'
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import firebase from './../../initfirebase';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import Update from './updateStatus';
import Chat from './makeNotes';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Online = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);
const Offline = withStyles((theme) => ({
    badge: {
        backgroundColor: 'grey',
        color: 'grey',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);
const Unavailable = withStyles((theme) => ({
    badge: {
        backgroundColor: 'red',
        color: 'red',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);
const DontDisturb = withStyles((theme) => ({
    badge: {
        backgroundColor: 'yellow',
        color: 'yellow',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);
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
export default function Details(props) {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [alert, setAlert] = React.useState(false);
    const [userData, setUserData] = useState({})
    const [encarregadosData, setEncarregadosData] = useState([]);
    const loop = null;
    const [listTaks, setListTaks] = useState(props.data.tarefas);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert(false);
    };

    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }
    const getCreatorData = () => {
        firebase.firestore().collection("Users").where("email", "==", props.data.creator).get().then(snapshot => {
            if (snapshot.empty) {
                console.log("User not found")
            }
            snapshot.forEach(user => {
                setUserData(user.data())
            })
        })
    }
    const displayCreatorAvatar = (
        <>
            <div className="avatar-wrapper">

                <div className="avatar-badge-wrapper">
                    {
                        userData.status === "Disponível" ? <Online
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={userData.name} src={userData.photo} />
                        </Online> : null
                    }
                    {
                        userData.status === "Offline" ? <Offline
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={userData.name} src={userData.photo} />
                        </Offline> : null
                    }
                    {
                        userData.status === "Indisponível" ? <Unavailable
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={userData.name} src={userData.photo} />
                        </Unavailable> : null
                    }
                    {
                        userData.status === "Não perturbe" ? <DontDisturb
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={userData.name} src={userData.photo} />
                        </DontDisturb> : null
                    }
                </div>
                <p>{userData.name}</p>
            </div>
        </>
    )
    const getEncarregadosData = () => {
        props.data.encarregados.forEach((email) => {
            firebase.firestore().collection("Users").where("email", "==", email).get().then((snapshot) => {
                if (snapshot.empty) {
                    console.log("foto não encontrada");
                }
                snapshot.forEach(encarregado => {
                    setEncarregadosData(encarregadosData => encarregadosData.concat(encarregado.data()))
                })
            })
        })
    }

    const displayEncarregados = encarregadosData.map((user, key) => (
        <>
            <div className="avatar-wrapper">


                <div className="avatar-badge-wrapper">
                    {
                        user.status === "Disponível" ? <Online
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={user.name} src={user.photo} />
                        </Online> : null
                    }
                    {
                        user.status === "Offline" ? <Offline
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={user.name} src={user.photo} />
                        </Offline> : null
                    }
                    {
                        user.status === "Indisponível" ? <Unavailable
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={user.name} src={user.photo} />
                        </Unavailable> : null
                    }
                    {
                        user.status === "Não perturbe" ? <DontDisturb
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={user.name} src={user.photo} />
                        </DontDisturb> : null
                    }
                    {
                        user.status === undefined ?
                            <>
                                {
                                    user.photo === "" ? <Avatar alt={user.name.substr(0, 1)} >{user.name.substr(0, 1)}</Avatar> : <Avatar alt={user.name} src={user.photo} />
                                }
                            </>
                            : null
                    }
                </div>
                <p>{user.name}</p>
            </div>
        </>
    ))

    const patchTaks = () => {
        firebase.firestore().collection("Chamados").doc(props.data.id).update(({ tarefas: listTaks }))
    }

    const displayTasks = listTaks.map((task, index) => (
        <>
            <tr key={index}>
                <td>
                    <FormGroup check>
                        <Label check>
                            <Input defaultValue={task.isChecked} checked={task.isChecked} onChange={(e) => {
                                setListTaks(
                                    listTaks.map((item) =>
                                        item.task === task.task
                                            ? { ...item, isChecked: e.target.checked }
                                            : item
                                    )
                                );
                                console.log(listTaks)
                            }} name={task.task} type="checkbox" />
                            <span className="form-check-sign">
                                <span className="check" />
                            </span>
                        </Label>
                    </FormGroup>
                </td>
                <td>
                    <p className="title">{task.task}</p>
                </td>
            </tr>
        </>
    ))
    const listAnexos = props.data.anexo.map((anexo, index) => (
        <>
            <a className="list-anexos" href={anexo.url}>{anexo.name}</a>
        </>
    ))
    useEffect(() => {
        getCreatorData();
        getEncarregadosData();
    }, [loop])
    return (
        <>
            <Snackbar open={alert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Tarefas atualizadas com sucesso!
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
                <div className="details-card-body">
                    <Card>
                        <div className="title-wrapper">
                            <div>
                                <IconButton onClick={() => closeModal()} color="secondary">
                                    <HighlightOffIcon />
                                </IconButton>
                            </div>
                            <CardHeader>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <Typography variant="h4" component="h4">Chamado: {props.data.id}</Typography>
                                    <Chat id={props.data.id} />
                                </div>
                            </CardHeader>
                        </div>

                        <CardBody>
                            <div className="modal-details-wrapper">
                                <div className="creator-data-wrapper">
                                    <Typography variant="h6" component="h6">Criador:</Typography>
                                    {displayCreatorAvatar}
                                </div>
                                <div className="creator-data-wrapper">
                                    <Typography variant="h6" component="h6">Encarregados:</Typography>
                                    {displayEncarregados}
                                </div>
                            </div>
                            <br />
                            <Update operation={props.operation} data={props.data} />

                            <br />
                            {
                                props.data.tarefas.length > 0 ?
                                    <div className="table-task-wrapper">
                                        <Card>
                                            <CardHeader>
                                                <div className="title-wrapper">
                                                    <IconButton onClick={() => patchTaks()} id="1234567812345678" color="primary">
                                                        <SendIcon />
                                                    </IconButton>
                                                    <Typography variant="h6" component="h6">Tarefas</Typography>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <Table>
                                                    <tbody>
                                                        {displayTasks}
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>

                                    </div> : null
                            }
                            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
                                {listAnexos}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Modal>
            <IconButton color="primary" onClick={() => openModal()} >
                <MoreVertIcon />
            </IconButton>
        </>
    );
};