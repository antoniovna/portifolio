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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import firebase from './../../initfirebase';
import Getnotes from './getNotes';
import Modal from '@material-ui/core/Modal';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChatIcon from '@material-ui/icons/Chat';
import Backdrop from '@material-ui/core/Backdrop';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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

export default function MakeNotes(props) {
    const classes = useStyles();
    const [note, setNote] = useState('');
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = useState([]);
    const [modal, setModal] = useState(false);
    const [fileLength, setFileLength] = useState([1]);
    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
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

    const handleAddInputs = () => {
        const values = [...fileLength];
        values.push({ value: null });
        setFileLength(values);
    }

    const onchangeFile = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            setFiles(prevState => [...prevState, newFile]);
        }
        console.log(files.length)
    }

    const submit = async () => {
        var name = '';
        if (note === "") {
            return;
        }
        var currentUser = firebase.auth().currentUser.email;
        firebase.firestore().collection("Users").where("email", "==", currentUser).get().then(snapsht => {
            console.log("user", currentUser)
            if (snapsht.empty) {
                console.log("vazio")
            }
            snapsht.forEach((doc) => {
                name = doc.data().name;
            })
        }).then(() => {
            firebase.firestore().collection("Notes").add({
                id: "",
                relatedId: props.id,
                note: note,
                timestamp: new Date(),
                user: firebase.auth().currentUser.email,
                name: name,
                anexo: "",
            }).then(doc => {
                setNote('');
                setFiles([]);
                setFileLength([1]);
                document.getElementById("file-input-abrir-chamados").value = null
                firebase.firestore().collection("Notes").doc(doc.id).update({ id: doc.id });
                var urls = [];
                if (files.length > 0) {
                    console.log("arquivos")
                    files.forEach(file => {
                        let storageRef = firebase.storage().ref('/notes')
                        let fileRef = storageRef.child(file.name)
                        var uploadTask = fileRef.put(file);
                        uploadTask.on('state_changed', function (snapshot) {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        }, function (error) {
                            // Handle unsuccessful uploads
                        }, function () {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                urls.push({ name: file.name, url: downloadURL })
                                firebase.firestore().collection("Notes").doc(doc.id).update({ anexo: urls, first: false })
                            })
                        })
                    })

                }
            })
        })
    }

    const listInputs = fileLength.map((a, b) => (
        <Input key={b} style={{ marginBottom: 10 }} id="file-input-abrir-chamados" type="file" multiple onChange={onchangeFile} />
    ))
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
                <Row>
                    <Col >
                        <PerfectScrollbar>
                            <div className="list-notes-body">
                                <Card>
                                    <div className="title-wrapper">
                                        <div>
                                            <IconButton onClick={() => closeModal()} color="secondary">
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </div>
                                        <CardHeader>
                                            <h5 className="title">Anotações</h5>
                                        </CardHeader>
                                    </div>
                                    <CardBody>
                                        <PerfectScrollbar>
                                            <div className="messages-body">
                                                <Getnotes id={props.id} />
                                            </div>
                                        </PerfectScrollbar>
                                        <form onSubmit={() => submit()}>
                                            <Col className="pr-md-1" md="12">
                                                <label>Anotação</label>
                                                <Input value={note} type="text" placeholder="Anotação" onChange={(e) => setNote(e.target.value)} />
                                            </Col>
                                            <Col className="pr-md-1" md="12">
                                                <label>Anexos</label>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    {
                                                        listInputs
                                                    }
                                                </div>
                                                <IconButton onClick={() => handleAddInputs()} color="primary" aria-label="add to shopping cart" >
                                                    <AddRoundedIcon />
                                                </IconButton>
                                            </Col>
                                        </form>
                                    </CardBody>
                                    <CardFooter>
                                        <Button onClick={() => submit()} className="btn-fill" color="success" type="submit">
                                            Enviar
              </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </PerfectScrollbar>
                    </Col>
                </Row>
            </Modal>
            <IconButton onClick={() => openModal()} color="primary">
                <ChatIcon />
            </IconButton>
        </>
    );
};