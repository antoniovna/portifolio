import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    FormFeedback,
} from "reactstrap";
//material UI
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from './checkboxes';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ClipLoader } from 'react-spinners';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import firebase from './../../initfirebase';

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


export default function AbrirChamados() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [tasks, setTasks] = useState([{ value: null }])
    const [mainFile, setMainFile] = useState(null);
    const [checkedItems, setCheckedItems] = useState({}); //plain object as state
    const [mainName, setMainName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [areas, setAreas] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [selectedArea, setSelectedArea] = useState([]);
    const [idLicitasys, setIdLicitasys] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("")
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        matricula: "",
        password: "",
        password2: "",
        foto: "",
        areas: ""
    })
    const handleChangeMainImage = (event) => {
        const name =
            event.target.files[0] != null ? event.target.files[0].name : "";

        const selectedFile =
            event.target.files[0] != null ? event.target.files[0] : null;
        setMainFile(selectedFile);
        setMainName(name)
    };

    function _fetchAreas() {
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

    const checkPassword = (first, second) => {
        if (first === second) {
            setPasswordMatch(true);
            return null;
        } else {
            setPasswordMatch(false);
            return null;
        }
    }
    const checkForm = () => {
        var entered = false
        var _errors = {
            name: "",
            email: "",
            matricula: "",
            password: "",
            password2: "",
            foto: "",
            areas: ""
        }
        if (email === "") {
            entered = true
            _errors .email = "Email inválido"
        }
        if (name === "") {
            entered = true
           _errors .name = "Campo obrigatório"
        }
        if (matricula === "") {
            entered = true
            _errors .matricula = "Campo obrigatório"
        }
        if (password === "") {
            entered = true
            _errors .password = "Campo obrigatório"
        }
        if (password2 === "") {
            entered = true
            _errors .password2 = "Campo obrigatório"
        }
        setErrors(_errors)
        return entered
    }
    console.log(errors)
    const submit = async () => {
        if (checkForm()) return
        setIsLoading(true)

        const checked = [];
        const entries = Object.entries(checkedItems)
        for (let index = 0; index < entries.length; index++) {
            if (entries[index][1] === true) {
                checked.push(entries[index][0]);
            }
        }
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            firebase.firestore().collection("Users").add({
                name: name,
                email: email,
                matricula: matricula,
                photo: '',
                areas: checked,
                admin: admin,
                idLicitasys: idLicitasys,
                id: "",
            }).then(newDoc => {
                if (mainFile != null) {
                    const storageRef = firebase.storage().ref("ProfilePictures/")
                    const fileRef = storageRef.child(name)
                    var uploadTask = fileRef.put(mainFile);
                    uploadTask.on('state_changed', function (snapshot) {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, function (error) {
                        // Handle unsuccessful uploads
                    }, function () {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            firebase.firestore().collection('Users').doc(newDoc.id).update({ photo: downloadURL, id: newDoc.id }).then(() => {
                                //handleClick({ vertical: 'top', horizontal: 'right' })
                                setIsLoading(false)
                                handleClick();

                            }).catch(e => {
                                setIsLoading(false)
                            })
                        });
                    });
                } else {
                    let updateRef = firebase.firestore().collection('Users').doc(newDoc.id).update({ id: newDoc.id }).then(() => {
                        setIsLoading(false)
                        handleClick();
                    }).catch(e => {
                        setIsLoading(false)
                    })
                }

            })
        }).catch((e) => {
            switch (e.code) {
                case "auth/invalid-email":
                    setSubmitError("Verifique a formatação do email")
                    break;
                case "auth/weak-password":
                    setSubmitError("Senha fraca")
                    break;
                case "auth/email-already-in-use":
                    setSubmitError("Este email já está em uso")
                    break
                default:
                    setSubmitError("Erro ao cadastrar o usuário")
                    break;
            }
            console.log(e, Object.keys(e))
            setIsLoading(false)
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
    const handleCloseSubmitError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSubmitError("");
    };
    const handleChangeCheck = (event) => {
        // updating an object instead of a Map
        console.log("checkedItem =>", checkedItems)
        setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
    }
    useEffect(() => (
        _fetchAreas()
    ), [0])

    const showLicitasys = () => {
        var keys = Object.keys(checkedItems);
        if (keys.includes("Vendas")) {
            if (checkedItems["Vendas"] === true) {
                return (
                    <Row>
                        <Col className="pr-md-1" md="5">
                            <FormGroup>
                                <label>ID licitasys</label>
                                <Input placeholder="ID licitasys" value={idLicitasys} onChange={(e) => setIdLicitasys(e.target.value)} />
                            </FormGroup>
                        </Col>
                    </Row>
                )
            }
        }
        return null
    }
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Usuário cadastrado com sucesso!
                </Alert>
            </Snackbar>
            <Snackbar open={submitError !== ""} autoHideDuration={6000} onClose={handleCloseSubmitError}>
                <Alert onClose={handleCloseSubmitError} severity="error">
                    {submitError}
                </Alert>
            </Snackbar>
            <div className="content">
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Cadastrar novos usuários</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row>
                                        <Col className="pr-md-1" md="10">
                                            <FormGroup>
                                                <label>Nome do usuário</label>
                                                <Input invalid={errors.name !== ""} placeholder="Nome do usuário" value={name} onChange={(e) => setName(e.target.value)} />
                                                <FormFeedback>{errors.name}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <label>E-mail</label>
                                                <Input invalid={errors.email} placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <label>Matrícula</label>
                                                <Input placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                                            </FormGroup>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <label>Senha</label>
                                                <Input placeholder="Senha" value={password} onChange={(e) => {
                                                    setPassword(e.target.value)
                                                    checkPassword(e.target.value, password2);
                                                }} />
                                                <FormFeedback>As senhas não coincidem</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-md-1" md="5">
                                            <FormGroup>
                                                <label>Confirmar senha</label>
                                                <Input placeholder="Confirmar senha" value={password2} onChange={(e) => {
                                                    checkPassword(e.target.value, password)
                                                    setPassword2(e.target.value)
                                                }} />
                                                <FormFeedback>As senhas não coincidem</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {
                                        showLicitasys()
                                    }

                                    <Col className="pr-md-1" md="5">
                                        <FormGroup>
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    borderStyle: "dotted",
                                                    borderColor: "#cecece",
                                                    height: 80,
                                                }}
                                            >
                                                <p>
                                                    <i className={"tim-icons icon-upload"}></i>{" "}
                                                    {mainName != ""
                                                        ? mainName
                                                        : "Solte ou selecione um arquivo aqui"}
                                                </p>
                                                <Input
                                                    onChange={(e) => {
                                                        handleChangeMainImage(e)
                                                    }}
                                                    type="file"
                                                    name="thumbnail_image"
                                                    id="thumbnail_image"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col className="pr-md-1" md="8">
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
                                    <FormControlLabel
                                        value="end"
                                        control={<Switch onChange={() => setAdmin(!admin)} value={admin} color="primary" />}
                                        label={"Administrador"}
                                        labelPlacement="end"
                                    />
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => submit()} className="btn-fill" color="success" type="submit">
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        Enviar
                                        {
                                            isLoading === true ? <div style={{ marginLeft: 7, marginRight: 7 }}><ClipLoader color="#FFFFFF" size={20} /></div> : null
                                        }
                                    </div>

                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}