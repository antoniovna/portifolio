import React, { useEffect, useState } from "react";
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
    Label
} from "reactstrap";
import moment from 'moment'
//material UI
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from './checkbox.jsx';
import firebase from './../../initfirebase';
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar';
import { ClipLoader } from 'react-spinners';
import calendarConfig from './../../services/calendarConfig';
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
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function AbrirChamados() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [tasks, setTasks] = useState([{ value: null }])
    const [descricao, setDescricao] = useState("");
    const [selectedArea, setSelectedArea] = useState({});
    const [listAreas, setListAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [problemas, setProblemas] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState('');
    const [files, setFiles] = useState([]);
    const [fileLength, setFileLength] = useState([1]);
    const [dateTime, setDateTime] = useState("");
    const [nomeCriador, setNomeCriador] = useState('');
    const [areaCriador, setAreaCriador] = useState([]);
    const handleClick = () => {
        setOpen(true);
    };

    const fetchUserData = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.firestore().collection("Users").where("email", "==", user.email).onSnapshot(element => {
                    element.forEach((doc => {
                        setAreaCriador(doc.data().areas)
                        setNomeCriador(doc.data().name)
                    }))
                })
                // User is signed in.
            } else {
                return;
                // No user is signed in.
            }
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleAdd = () => {
        const values = [...tasks];
        values.push({ value: null });
        setTasks(values);
    }

    const handleAddInputs = () => {
        const values = [...fileLength];
        values.push({ value: null });
        setFileLength(values);
    }
    const handleNewTasks = (index, event) => {
        const values = [...tasks];
        values[index].value = event.target.value;
        setTasks(values);
    }

    const getAreas = () => {
        firebase.firestore().collection("Areas").get().then((snapshot) => {
            if (snapshot.empty) {
                return;
            }
            snapshot.forEach(doc => {
                setListAreas(listAreas => listAreas.concat(doc.data()))
            })
        })
    }

    const handleChangeCheckusers = (event) => {
        // updating an object instead of a Map
        const entries = Object.entries(selectedUsers);
        let filtered = [];
        for (let index = 0; index < entries.length; index++) {
            if (entries[index][1] === true) {
                filtered.push(entries[index][0])
            }
        }
        setSelectedUsers({ ...selectedUsers, [event.target.name]: event.target.checked });
    }

    const getProblems = async (areas) => {
        setProblemas([]);
        areas.forEach((area) => {
            firebase.firestore().collection("Problemas").where("area", "==", area).get().then(snapshot => {
                if (snapshot.empty) {
                    return;
                }
                snapshot.forEach(doc => {
                    setProblemas(problemas => problemas.concat(doc.data()))
                })
            })
        })
    }

    const getUser = async (areas) => {
        setUsers([])
        console.log(selectedUsers)
        let data = [];
        var emailsList = [];
        var filteredUserList = [];
        for (let index = 0; index < areas.length; index++) {
            const area = areas[index];
            firebase.firestore().collection("Users").where("areas", "array-contains", area).get().then((snapshot => {
                if (snapshot.empty) {
                    return
                }
                snapshot.forEach(doc => {
                    data.push(doc.data());
                })
            })).then(() => {
                console.log(index, areas.length)
                if (index === areas.length - 1) {
                    for (let ix = 0; ix < data.length; ix++) {
                        if (emailsList.length === 0) {
                            emailsList.push(data[ix].email);
                            filteredUserList.push(data[ix]);
                        }
                        else {
                            if (emailsList.includes(data[ix].email)) {
                                // console.log("repetiu")

                            } else {
                                filteredUserList.push(data[ix]);
                                emailsList.push(data[ix].email)
                            }
                        }
                    }
                }
            }).then(() => {
                let keys = Object.keys(selectedUsers);
                let filteredKeys = [];
                for (let i = 0; i < keys.length; i++) {
                    console.log(selectedUsers[keys[i]],)
                    if (selectedUsers[keys[i]] === true) {
                        filteredKeys.push(keys[i]);
                    }
                }
                let newCheckedUsers = {};
                for (let idx = 0; idx < filteredUserList.length; idx++) {
                    if (filteredKeys.includes(filteredUserList[idx].name)) {
                        newCheckedUsers[filteredUserList[idx].name] = true;
                    }
                };
                setSelectedUsers(newCheckedUsers)
                setUsers(filteredUserList);
            })
        }
    }

    const handleChangeCheck = async (event) => {
        // updating an object instead of a Map
        var objects = selectedArea;
        var name = event.target.name;
        var value = event.target.checked;
        objects[name] = value;
        const entries = Object.entries(objects);
        let filtered = [];
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
        filtered = new Set(filtered)
        setSelectedArea({ ...selectedArea, [event.target.name]: event.target.checked });
        getUser([...filtered]);
        getProblems(filtered);
    }

    var gapi = window.gapi
    /*
     const addEvent = (atendees, id) => {
        var startDate = new Date().toISOString();
        var emails = [];
 
        for (let index = 0; index < atendees.length; index++) {
            emails.push({
                'email': atendees[index]
            })
 
        }
 
        console.log("triggered")
        gapi.load("client:auth2", () => {
            console.log("Loaded client")
 
            gapi.client.init({
                apiKey: calendarConfig.API_KEY,
                clientId: calendarConfig.CLIENT_ID,
                discoveryDocs: calendarConfig.DISCOVERY_DOCS,
                scope: calendarConfig.SCOPES,
            })
 
            gapi.client.load('calendar', "v3", () => console.log("bam!"))
 
 
            gapi.auth2.getAuthInstance().signIn().then(() => {
 
                var event = {
                    'summary': `Data de vencimento do chamado ${id}`,
                    'location': 'Quadra 02 Lote 49,51,53,54, St. de Indústria - Ceilândia, Brasília - DF, 72265-020',
                    'description': descricao,
                    'start': {
                        'dateTime': dateTime,
                        'timeZone': 'America/Sao_Paulo',
                    },
                    'end': {
                        'dateTime': dateTime,
                        'timeZone': 'America/Sao_Paulo',
                    },
                    'recurrence': [
                        'RRULE:FREQ=DAILY;COUNT=2'
                    ],
                    'attendees': emails,
                    'reminders': {
                        'useDefault': false,
                        'overrides': [
                            { 'method': 'email', 'minutes': 24 * 60 },
                            { 'method': 'popup', 'minutes': 10 },
                        ],
                    },
                };
 
                var request = gapi.client.calendar.events.insert({
                    'calendarId': "primary",
                    "resource": event,
                })
 
                request.execute(event => {
                    console.log(event)
                    window.open(event.htmlLink)
                })
            })
        })
    }
     */

    const submit = async () => {
        setIsLoading(true);
        var filteredAreas = []
        const areasEntries = Object.entries(selectedArea);
        for (let index = 0; index < areasEntries.length; index++) {
            if (areasEntries[index][1] === true) {
                filteredAreas.push(areasEntries[index][0])
            }
        }

        var filteredUsers = []
        const usersEntries = Object.entries(selectedUsers);
        for (let index = 0; index < usersEntries.length; index++) {
            if (usersEntries[index][1] === true) {
                filteredUsers.push(usersEntries[index][0])
            }
        }

        var filteredTasks = []
        for (let index = 0; index < tasks.length; index++) {
            if (tasks[index].value != null) {
                filteredTasks.push({ task: tasks[index].value, isChecked: false });
            }
        }

        let formatedDate = dateTime;

        var emails = [];
        filteredUsers.forEach((name) => {
            firebase.firestore().collection("Users").where("name", "==", name).get().then(snapshot => {
                snapshot.forEach((doc) => {
                    emails.push(doc.data().email)
                })
            })
        })
        let id;
        firebase.firestore().collection("Chamados").get().then(snapshot => {
            id = snapshot.size + 1
        }).then(() => {
            id = id + ''
            firebase.firestore().collection("Chamados").doc(id).set({
                date: dateTime,
                areas: filteredAreas,
                problema: selectedProblem,
                descricao: descricao,
                id: id,
                status: "A fazer",
                creator: firebase.auth().currentUser.email,
                encarregados: emails,
                vinculados: [],
                createdAt: formatedDate,
                anexo: [],
                timestamp: new Date(),
                tarefas: filteredTasks,
                areaCriador: areaCriador,
                finalDate: "",
                finalized: false,
                hideEncarregado: false,
                hideOwner: false,
                first: true,
                names: filteredUsers,
                creatorName: nomeCriador,
                creationDate: moment(new Date()).format("DD/MM/YYYY")
            })
        }).then(() => {
            for (let index = 0; index < emails.length; index++) {
                makeNotifications(id, emails[index], filteredUsers[index])
            }
            // addEvent(emails, id)
            var urls = [];
            if (files.length > 0) {
                files.forEach(file => {
                    let storageRef = firebase.storage().ref()
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
                            firebase.firestore().collection("Chamados").doc(id).update({ anexo: urls, first: false })
                        })
                    })
                })
                setSelectedArea([]);
                setSelectedProblem("");
                setDescricao("");
                setSelectedUsers({});
                setUsers([]);
                setTasks([{ value: null }]);
                setFileLength([1]);
                setFiles([]);
                document.getElementById("file-input-abrir-chamados").value = null
                setDateTime("");
                setIsLoading(false);
                handleClick();
                setIsLoading(false);
                handleClick();
            } else {
                setSelectedArea([]);
                setSelectedProblem("");
                setDescricao("");
                setSelectedUsers({});
                setUsers([]);
                setTasks([{ value: null }]);
                setFileLength([1]);
                setFiles([]);
                document.getElementById("file-input-abrir-chamados").value = null
                setDateTime("");
                setIsLoading(false);
                handleClick();
                setIsLoading(false);
                handleClick();
            }
        })
    }

    /*
    const uploadFiles = async (id) => {
        var nameAndUrl = [];
        for (let index = 0; index < files.length; index++) {
            const storageRef = firebase.storage().ref("Anexos/")
            const fileRef = storageRef.child(files[index].name)
            var uploadTask = fileRef.put(files[index]);
            uploadTask.on('state_changed', function (snapshot) {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, function (error) {
                console.log(error);
                // Handle unsuccessful uploads
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    nameAndUrl.push({
                        url: downloadURL,
                        name: files[index].name,
                    })
                    let updateRef = firebase.firestore().collection("Chamados").doc(id).update({ anexo: nameAndUrl })
                    if (index === (files.length - 1)) {
                        setSelectedArea([]);
                        setSelectedProblem("");
                        setDescricao("");
                        setSelectedUsers({});
                        setUsers([]);
                        setTasks([{ value: null }]);
                        setFileLength([1]);
                        setFiles([]);
                        document.getElementById("file-input-abrir-chamados").value = null
                        setDateTime("");
                        setIsLoading(false);
                        handleClick();
                        setIsLoading(false);
                        handleClick();
                    }
                });
            });
 
        }
    }
     */

    const makeNotifications = async (id, email, userName) => {
        const message = `${nomeCriador} atribuiu o chamado ${id} a você`;
        const ref = firebase.firestore().collection("Notifications").add({
            relatedId: id,
            userName: userName,
            email: email,
            message: message,
            path: "/helpdesk/chamadosRecebidos",
            isRead: false,
            id: "",
            timesTamp: new Date(),
            date: moment(new Date()).format("DD/MM/YYYY"),
        }).then(newDoc => {
            firebase.firestore().collection("Notifications").doc(newDoc.id).update({ id: newDoc.id })
        })
    }
    const onchangeFile = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            setFiles(prevState => [...prevState, newFile]);
        }
        console.log(files.length)
    }

    useEffect(() => {
        getAreas()
        fetchUserData()
    }, [])

    const listProblems = problemas.map((value, index) => (
        <MenuItem key={index} value={value.problema}>{value.problema}</MenuItem>
    ))

    const listInputs = fileLength.map((element, index) => (
        <input key={index} style={{ marginBottom: 10 }} id="file-input-abrir-chamados" multiple type="file" onChange={onchangeFile} />
    ))
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Chamado cadastrado com sucesso!
        </Alert>
            </Snackbar>
            <div className="content">
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Abrir chamado</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <Label>Áreas</Label>
                                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                                    {
                                                        listAreas.map((item, index) => (
                                                            <label>
                                                                <Checkbox key={index} name={item.area} checked={selectedArea[item.area]} onChange={handleChangeCheck} />
                                                            </label>
                                                        ))
                                                    }
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        {/*<Col className="px-md-1" md="5">
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">Problema</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={selectedProblem}
                                                    onChange={(e) => setSelectedProblem(e.target.value)}
                                                    label="Problema"
                                                >
                                                    {listProblems}
                                                </Select>
                                            </FormControl>
                                                </Col>*/}
                                    </Row>

                                    <Row>
                                        <Col className="pr-md-1" md="10">
                                            <FormGroup>
                                                <label>Descrição</label>
                                                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" type="textarea" style={{ backgroundColor: "transparent", borderWidth: 1.2, borderRadius: 5, width: "100%", borderColor: "#2c3454", minHeight: 20, paddingLeft: 15, paddingTop: 5 }} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="10">
                                            {
                                                users.length > 0 ?
                                                    <FormGroup>
                                                        <Label>Usuários</Label>
                                                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                                            {
                                                                users.map((item, index) => (
                                                                    <label>
                                                                        <Checkbox key={index} name={item.name} checked={selectedUsers[item.name]} onChange={handleChangeCheckusers} />
                                                                    </label>
                                                                ))
                                                            }
                                                        </div>
                                                    </FormGroup> : null
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <label>Tarefas</label>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    {tasks.map((field, idx) => {
                                                        return (
                                                            <Input
                                                                placeholder="Tarefa"
                                                                type="text"
                                                                defaultValue={field.value || ""}
                                                                onChange={e => handleNewTasks(idx, e)}
                                                                key={idx}
                                                                style={{ marginTop: 7 }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <IconButton onClick={() => handleAdd()} color="primary" aria-label="add to shopping cart" >
                                                    <AddRoundedIcon />
                                                </IconButton>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-md-1" md="5">
                                            <label>Anexos</label>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                {listInputs}
                                            </div>
                                            <IconButton onClick={() => handleAddInputs()} color="primary" aria-label="add to shopping cart" >
                                                <AddRoundedIcon />
                                            </IconButton>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="8">

                                            <input type="datetime-local" step="1"
                                                value={dateTime}
                                                onChange={(e) => {
                                                    setDateTime(e.target.value)
                                                }} />
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                {
                                    isLoading === true ?
                                        <div style={{ marginLeft: 7, marginRight: 7 }}>
                                            <ClipLoader color="#FFFFFF" size={30} />
                                        </div> :
                                        <Button onClick={() => submit()} className="btn-fill" color="success" type="submit">Enviar</Button>
                                }

                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}