import React, {
    useState,
    useEffect,
} from 'react';
import { Input, Col } from 'reactstrap';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ClipLoader } from 'react-spinners';
import moment from "moment";
import firebase from './../../initfirebase';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import ModalContent from './modal';
import Modal from '@material-ui/core/Modal';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
        alignItems: 'flex-start',
        marginTop: "15px",
        marginBottom: "15px",
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function Metas({ data, name, _getData }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const [diff1, setDiff1] = useState("");
    const [diff2, setDiff2] = useState("");
    const [inicio, setInicio] = useState(data.inicio);
    const [fim, setFim] = useState(data.fim);
    const [conclusao, setConclusao] = useState(data.conclusao)
    const [toDelete, setToDelete] = useState(false);
    const [modal, setModal] = useState(false);
    const [listTaks, setListTaks] = useState(data.como);


    const closeModal = (update) => {
        setModal(false);
        _getData();
    }

    var splitDate = fim.split("/");
    var splitDate2 = inicio.split("/");
    const handleChange = (event, newValue) => {
        setConclusao(newValue);
    };
    const handleClick = () => {
        setOpen(true);
    };

    const getDiff = () => {
        var split1 = data.inicio.split("/");
        var split2 = data.fim.split("/")
        const date1 = new Date(split1[1] + "/" + split1[0] + "/" + split1[2]);
        const date2 = new Date(split2[1] + "/" + split2[0] + "/" + split2[2]);
        const date3 = new Date();
        const diffTime2 = Math.abs(date1 - date3);
        const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var calculus = 0;
        if (date1 < date3) {
            calculus = ((diffDays2 / diffDays) * 100).toFixed(2);
        }
        if (date3 > date2) {
            calculus = 100
        }
        return (calculus)
    }

    const getStatus = () => {
        if (data.tipo === "Estratégico") {
            return (<p style={{ color: "green" }} >Estratégico</p>)
        }
        if (data.tipo === "Tático") {
            return (<p style={{ color: "blue" }} >Tático</p>)
        }
        if (data.tipo === "Operacional") {
            return (<p style={{ color: "yellow" }} >Operacional</p>)
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const listEncarregados = (data) => {
        return (
            data.map((person, idx) => (
                <>
                    {
                        idx === 2 ? "..." : idx > 3 && data.length > 3 ? null :
                            <>
                                {
                                    data.length - 1 === idx ? <p>{person}</p> : <p>{person}, {" "}</p>
                                }
                            </>
                    }
                </>
            ))
        )
    }

    const _delete = (id) => {
        firebase.firestore().collection("Metas").doc(id).delete().then(() => {
            _getData();
            setSeverity("success");
            setMessage("Meta deletada com sucesso!");
            handleClick();
        })
    }

    const notify = (id, date) => {
        const message = `${name} redefiniu a ${data.oque} para ${date}`;
        for (let index = 0; index < data.quem.length; index++) {
            firebase.firestore().collection("Users").where("name", "==", data.quem[index]).get().then(snapshot => {
                snapshot.forEach((doc) => {
                    const ref = firebase.firestore().collection("Notifications").add({
                        relatedId: id,
                        userName: data.quem[index],
                        email: doc.data().email,
                        message: message,
                        path: "/helpdesk/metas",
                        isRead: false,
                        id: "",
                        timesTamp: new Date(),
                        date: moment(new Date()).format("DD/MM/YYYY"),
                    }).then(newDoc => {
                        firebase.firestore().collection("Notifications").doc(newDoc.id).update({ id: newDoc.id })
                    })
                })
            })

        }
    }

    const _listComo = data.como.map((task, idx) => (
        <>
            {
                idx === 2 ? "..." : idx > 2  ? null :
                    <>
                        {
                            data.length - 1 === idx ? <p key={idx + task.task} style={{ color: task.isChecked === true ? "green" : "red" }} >{task.task}</p> : <p key={idx + task.task} style={{ color: task.isChecked === true ? "green" : "red" }} >{task.task},{" "}</p>
                        }
                    </>
            }
        </>
    ))
    const getConclusao = () => {
        var percentage = 0;
        var tasksArray = [];
        for (let index = 0; index < listTaks.length; index++) {
            const element = listTaks[index];
            if (element.isChecked === true) {
                tasksArray.push(element.task);
            }
        }
        return ((tasksArray.length / listTaks.length).toFixed(2))
    }
    return (
        <>
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
                <ModalContent refresh={() => {
                    _getData();

                }} name={name} close={() => closeModal()} data={data} inicio2={inicio} fim2={fim} />
            </Modal>
            <tr>
                {
                    toDelete === false ?
                        <>
                            <td style={{ display: "flex", flexDirection: "row" }}>
                                <IconButton onClick={() => {
                                    setModal(true)
                                }} aria-label="open" color="primary">
                                    <LaunchRoundedIcon />
                                </IconButton>
                                <IconButton onClick={() => {
                                    setToDelete(true)
                                }} aria-label="delete" color="secondary">
                                    <HighlightOffOutlinedIcon />
                                </IconButton>
                            </td>
                            <td >{data.oque.length > 35 ? (data.oque).substr(0, 35) + "..." : data.oque}</td>
                            <td>{data.prioridade === "Pode esperar" ? <p style={{ color: "green", fontWeight: "bold" }}>{data.prioridade}</p> : data.prioridade === "Pouco urgente" ? <p style={{ color: "blue", fontWeight: "bold" }}>{data.prioridade}</p> : data.prioridade === "Urgente" ? <p style={{ color: "yellow", fontWeight: "bold" }}>{data.prioridade}</p> : data.prioridade === "Muito urgente" ? <p style={{ color: "orange", fontWeight: "bold" }}>{data.prioridade}</p> : <p style={{ color: "red", fontWeight: "bold" }}>{data.prioridade}</p>}</td>
                            <td>{_listComo}</td>
                            <td >{listEncarregados(data.quem)}</td>
                            <td>
                                <Input type="date" value={splitDate2[2] + "-" + splitDate2[1] + "-" + splitDate2[0]} onChange={async (e) => {
                                    var selectedDate = e.target.value;
                                    setInicio(moment(e.target.value).format("DD/MM/yyyy"))
                                    console.log(e.target, e, e.target.value)
                                    await firebase.firestore().collection("Metas").doc(data.id).update({ inicio: moment(selectedDate).format("DD/MM/yyyy"), isReajustado: true });
                                    notify(data.id, moment(selectedDate).format("DD/MM/yyyy"), "Início")
                                }} />
                            </td>
                            <td>
                                <Input type="date" value={splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]} onChange={async (e) => {
                                    var selectedDate = e.target.value;
                                    setFim(moment(e.target.value).format("DD/MM/yyyy"))
                                    console.log(e.target, e, e.target.value)
                                    await firebase.firestore().collection("Metas").doc(data.id).update({ fim: moment(selectedDate).format("DD/MM/yyyy"), isReajustado: true });
                                    notify(data.id, moment(selectedDate).format("DD/MM/yyyy"))
                                }} />
                            </td>
                            <td>
                                {
                                    getStatus()
                                }
                            </td>
                            <td>
                                {getConclusao() * 100}%
                            </td>
                            <td>{getDiff()}%</td>
                            <td>{data.isReajustado === true ? <div className="reajustado-positive-indicator" /> : <div className="reajustado-negative-indicator" />}</td>
                        </> :
                        <>
                            <td>
                                <IconButton onClick={() => _delete(data.id)} aria-label="confirm" color="primary">
                                    <CheckCircleOutlineOutlinedIcon />
                                </IconButton>
                                <IconButton onClick={() => setToDelete(false)} aria-label="delete" color="secondary">
                                    <HighlightOffOutlinedIcon />
                                </IconButton>
                            </td>
                            <p className="confirm-message-table">Você tem certeza de que deseja apagar essa meta?</p>
                        </>
                }
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </tr>

        </>
    )
}