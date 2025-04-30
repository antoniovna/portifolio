import React, {
    useState,
    useEffect,
} from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Row,
    Col,
    Button,
    Table,
} from 'reactstrap'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import firebase from './../../initfirebase';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ClipLoader } from 'react-spinners';
import moment from "moment";
import Linha from './row';
import Reajustadas from "./reajustadas";
import Dashboard from './dashboard';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Metas() {
    const [value, setValue] = React.useState({});
    const [tasks, setTasks] = useState([{ value: null }])
    const [areas, setAreas] = useState([]);
    const [pessoas, setPessoas] = useState([]);
    const [selected, setSelected] = useState({});
    const [como, setComo] = useState("");
    const [oque, setOque] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const [metas, setMetas] = useState([]);
    const [reajustadas, setReajustadas] = useState([]);
    const [porque, setPorque] = useState('');
    const [prioridade, setPrioridade] = useState("Pode esperar");
    const [type, setType] = useState("Operacional");
    const handleClick = () => {
        setOpen(true);
    };

    const getMetas = () => {
        setMetas([]);
        firebase.firestore().collection("Metas").where("finished", "==", false).orderBy("timesTamp", "asc").get().then((snapshot) => {
            setMetas([]);
            snapshot.forEach((doc) => {
                setMetas(metas => metas.concat(doc.data()))
            })
        })
    }

    const getReajustadas = () => {
        setReajustadas([]);
        firebase.firestore().collection("Metas").where("finished", "==", true).orderBy("timesTamp", "asc").get().then((snapshot) => {
            setReajustadas([]);
            snapshot.forEach((doc) => {
                setReajustadas(metas => metas.concat(doc.data()))
            })
        })
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChange = (event) => {
        var newAreas = Object.keys(value);
        var newAreasSelected = [];

        for (let index = 0; index < newAreas.length; index++) {

            if (value[newAreas[index]] === true) {
                if (newAreas[index] !== event.target.name) {
                    newAreasSelected.push(newAreas[index]);
                };
            };
        };

        setValue({ ...value, [event.target.name]: event.target.checked });
        if (!value[event.target.name]) {
            if (event.target.checked === true) {
                newAreasSelected.push(event.target.name)
            }
        }
        setSelected({})
        getPessoas(newAreasSelected);
    };

    const getAreas = () => {
        firebase.firestore().collection('Areas').get().then((snapshot) => {
            snapshot.forEach((doc) => {
                setAreas(areas => areas.concat(doc.data()));
            })
        })
    }

    const getPessoas = async (newAreas) => {
        setPessoas([]);
        var newPeople = [];
        for (let index = 0; index < newAreas.length; index++) {
            const element = newAreas[index];
            await firebase.firestore().collection('Users').where('areas', 'array-contains', element).get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    newPeople.push(doc.data())
                })
            })
        }
        var newFetched = [];
        var compare = []
        for (let index = 0; index < newPeople.length; index++) {
            const element = newPeople[index];
            console.log("newFetched ==> ", newFetched)
            if (compare.includes(element.name) === false) {
                newFetched.push(element)
                compare.push(element.name)
            }
        }
        console.log(newFetched)
        setPessoas(newFetched);
    }

    const oi = 'oioi'
    useEffect(() => {
        getAreas();
        fetchUserData();
        getMetas();
        getReajustadas();
    }, [oi]);

    const handleSelected = (event) => {
        setSelected({ ...selected, [event.target.name]: event.target.checked });

    }
    const listAreas = areas.map((area, i) => (
        <FormControlLabel
            key={i + area.area}
            style={{ marginLeft: '5px' }}
            control={<Checkbox checked={value[area.area]} onChange={handleChange} color="primary" name={area.area} />}
            label={area.area}
        />
    ));

    const listPessoas = pessoas.map((pessoa, i) => (
        <FormControlLabel
            style={{ marginLeft: '5px' }}
            control={<Checkbox checked={selected[pessoa.name]} onChange={handleSelected} color="primary" name={pessoa.name} />}
            label={pessoa.name}
        />

    ));
    const [nomeCriador, setNomeCriador] = useState('');

    const fetchUserData = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.firestore().collection("Users").where("email", "==", user.email).onSnapshot(element => {
                    element.forEach((doc => {
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
    const notify = (id) => {
        var people = Object.keys(selected);
        for (let index = 0; index < people.length; index++) {
            const element = people[index];
            var email = "";
            for (let i = 0; i < pessoas.length; i++) {
                const el = pessoas[i];
                if (el.name === element) {
                    email = el.email
                }
            }
            if (email !== "") {
                const message = `${nomeCriador} atribui uma nova meta a você!`;
                const ref = firebase.firestore().collection("Notifications").add({
                    relatedId: id,
                    userName: element,
                    email: email,
                    message: message,
                    path: "/helpdesk/metas",
                    isRead: false,
                    id: "",
                    timesTamp: new Date(),
                    date: moment(new Date()).format("DD/MM/YYYY"),
                }).then(newDoc => {
                    firebase.firestore().collection("Notifications").doc(newDoc.id).update({ id: newDoc.id })
                })
            }

        }
    }

    const submit = () => {
        var people = Object.keys(selected);
        var areasFiltered = [];
        var keys = Object.keys(value)
        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            if (value[element] === true) {
                areasFiltered.push(element)
            }
        }
        var filteredTasks = []
        for (let index = 0; index < tasks.length; index++) {
            if (tasks[index].value != null) {
                filteredTasks.push({ task: tasks[index].value, isChecked: false });
            }
        }
        firebase.firestore().collection("Metas").add({
            fim: moment(fim).format("DD/MM/yyyy"),
            inicio: moment(inicio).format("DD/MM/yyyy"),
            oque: oque,
            tipo: type,
            quem: people,
            id: "",
            isReajustado: false,
            oldFim: "",
            oldInicio: "",
            conclusao: 0,
            timesTamp: new Date(fim),
            finished: false,
            areas: areasFiltered,
            como: filteredTasks,
            evolucao: 0,
            porque: porque,
            prioridade: prioridade,
        }).then((newDoc) => {
            notify(newDoc.id)
            firebase.firestore().collection("Metas").doc(newDoc.id).update({ id: newDoc.id }).then(() => {
                setSeverity("success");
                setIsloading(false)
                setMessage("Meta registrada com sucesso!");
                handleClick();
                setFim("");
                setInicio("");
                setComo("");
                setOque("");
                setSelected({});
                setPessoas([]);
                setValue("");
                getMetas();
                getReajustadas();
            })
        })
    }


    const listMetas = metas.map((data, index) => {

        return (
            <Linha _getData={() => {
                getMetas();
                getReajustadas();
            }} name={nomeCriador} data={data} key={index + data.como} />
        )
    })


    const listReajustadas = reajustadas.map((data, index) => {

        return (
            <Reajustadas _getData={() => {
                getMetas();
                getReajustadas();
            }} name={nomeCriador} data={data} key={index + data.como} />
        )
    })

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
    const handleRemoveTasks = (index) => {
        const values = [...tasks];
        values.splice(index, 1);
        setTasks(values)
    }
    return (
        <>
            <div className='content'>
                <Card>
                    <CardHeader>
                        <h3>
                            Cadastro de metas
                        </h3>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col className="pr-md-1" md="5" >
                                <label>O quê?</label>
                                <Input value={oque} onChange={(e) => setOque(e.target.value)} placeholder="O quê?" />
                                <br />

                            </Col>

                            <Col className="pr-md-1" md="5">
                                <label>Tipo</label>
                                <Input type="select" value={type} onChange={(e) => setType(e.target.value)} placeholder="Prioridade" >
                                    <option>Operacional</option>
                                    <option>Tático</option>
                                    <option>Estratégico</option>
                                </Input>
                                <br />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pr-md-1" md="5" >
                                <label>Por quê?</label>
                                <Input value={porque} onChange={(e) => setPorque(e.target.value)} placeholder="Por quê?" />
                                <br />

                            </Col>

                            <Col className="pr-md-1" md="5">
                                <label>Prioridade</label>
                                <Input type="select" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} placeholder="Prioridade" >
                                    <option>Pode esperar</option>
                                    <option>Pouco urgente</option>
                                    <option>Urgente</option>
                                    <option>Muito urgente</option>
                                    <option>Imediatamente</option>
                                </Input>
                                <br />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pr-md-1" md="5">
                                <label>Data de início</label>
                                <Input value={inicio} onChange={(e) => setInicio(e.target.value)} placeholder="Data de início" type="date" />
                                <br />

                            </Col>
                            <Col className="pr-md-1" md="5">
                                <label>Data de fim</label>
                                <Input value={fim} onChange={(e) => setFim(e.target.value)} placeholder="Data de fim" type="date" />
                                <br />

                            </Col>
                        </Row>
                        <label>Onde?</label>
                        <Row>
                            {listAreas}
                        </Row>
                        {
                            pessoas.length > 0 ? <label>Quem?</label> : null

                        }
                        <Row>
                            {listPessoas}
                        </Row>
                        <Row>
                            <Col md="8">
                                <label>Como?</label>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {tasks.map((field, idx) => {
                                        return (
                                            <div style={{ display: "flex", flexDirection: "row" }} >
                                                <Input
                                                    placeholder="Tarefa"
                                                    type="text"
                                                    defaultValue={field.value || ""}
                                                    onChange={e => handleNewTasks(idx, e)}
                                                    key={idx}
                                                    style={{ marginTop: 7 }}
                                                />
                                                <IconButton onClick={() => handleRemoveTasks(idx)} color="secondary" aria-label="add to shopping cart" >
                                                    <CloseIcon />
                                                </IconButton>
                                            </div>
                                        );
                                    })}
                                </div>
                                <IconButton onClick={() => handleAdd()} color="primary" aria-label="add to shopping cart" >
                                    <AddRoundedIcon />
                                </IconButton>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        {
                            isLoading === false ? <Button onClick={() => submit()} color="success">
                                Enviar
                        </Button> : <ClipLoader color="#2381f8" size={35} />
                        }
                    </CardFooter>
                </Card>
                <Dashboard />
                <Card>
                    <CardHeader>
                        <h3>Metas em progresso</h3>
                    </CardHeader>
                    <CardBody>
                        <Table className="tablesorter" responsive>
                            <thead className="text-primary">
                                <tr>
                                    <th></th>
                                    <th>O quê?</th>
                                    <th>Prioridade</th>
                                    <th>Como?</th>
                                    <th>Quem?</th>
                                    <th>Início</th>
                                    <th>Fim</th>
                                    <th>Status</th>
                                    <th>Conclusão%</th>
                                    <th>Evolução%</th>
                                    <th>Reajustada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listMetas}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h3>Metas concluídas</h3>
                    </CardHeader>
                    <CardBody>
                        <Table className="tablesorter" responsive>
                            <thead className="text-primary">
                                <tr>
                                    <th></th>
                                    <th>O quê?</th>
                                    <th>Prioridade</th>
                                    <th>Como?</th>
                                    <th>Quem?</th>
                                    <th>Início</th>
                                    <th>Fim</th>
                                    <th>Status</th>
                                    <th>Conclusão%</th>
                                    <th>Evolução%</th>
                                    <th>Reajustado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listReajustadas}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>

            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}