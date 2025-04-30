/* global gapi */
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
    Label
} from "reactstrap";
import moment from 'moment'
//material UI
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import calendarConfig from './../../services/calendarConfig';
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

export default function AbrirChamados() {
    const classes = useStyles();
    const [tasks, setTasks] = useState([{ value: null }])
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [photo, setPhoto] = useState('');
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

    const submit = async () => {
        let dbRef = firebase.firestore().collection("Chamados").add({
            teste: "boraaaaaaaaaa"
        }).then(newDoc => {
            console.log(newDoc)
        })
    }
    var gapi = window.gapi
    const addEvent = () => {
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
                    'summary': 'Google I/O 2015',
                    'location': '800 Howard St., San Francisco, CA 94103',
                    'description': 'A chance to hear more about Google\'s developer products.',
                    'start': {
                        'dateTime': '2020-11-02T09:00:00-07:00',
                        'timeZone': 'America/Los_Angeles',
                    },
                    'end': {
                        'dateTime': '2020-11-02T17:00:00-07:00',
                        'timeZone': 'America/Los_Angeles',
                    },
                    'recurrence': [
                        'RRULE:FREQ=DAILY;COUNT=2'
                    ],
                    'attendees': [
                        { 'email': 'lpage@example.com' },
                        { 'email': 'sbrin@example.com' },
                    ],
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
    return (
        <>
            <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
            <div className="content">
                <>
                    <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
                    <Row>
                        <Col >
                            <Card>
                                <CardHeader>
                                    <h5 className="title">Cadastro de oportunidades</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="px-md-1" md="5">
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <label>Nº do pregão</label>
                                                    <Input
                                                        placeholder="Nº do pregão"
                                                        type="text"
                                                        style={{ marginTop: 7 }}
                                                    />
                                                </FormControl>
                                            </Col>
                                            <Col className="px-md-1" md="5">
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-outlined-label">Problema</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        //value={age}
                                                        //onChange={handleChange}
                                                        label="Problema"
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-1" md="10">
                                                <FormGroup>
                                                    <label>Descrição</label>
                                                    <textarea placeholder="Descrição" type="textarea" style={{ backgroundColor: "transparent", borderWidth: 1.2, borderRadius: 5, width: "100%", borderColor: "#2c3454", minHeight: 20 }} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-1" md="10">
                                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input defaultValue="" type="checkbox" />
                                                            <span className="form-check-sign">
                                                                <span className="check" />
                                                            </span>
                                                            <p className="title">Encarregado</p>
                                                        </Label>
                                                    </FormGroup>

                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-1" md="4">
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
                                        </Row>
                                        <Row>
                                            <Col md="8">
                                                <FormGroup>
                                                    {/*
                                                <label>About Me</label>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        margin="normal"
                                                        inputMode="text"
                                                        id="date-picker-dialog"
                                                        label="Data limite"
                                                        format="dd/MM/yyyy"
                                                        value={selectedDate}
                                                       // onChange={handleDateChange}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                                 */}

                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                                <CardFooter>
                                    <Button onClick={() => addEvent()} className="btn-fill" color="success" type="submit">
                                        Enviar
              </Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </>
            </div>
        </>
    )
}