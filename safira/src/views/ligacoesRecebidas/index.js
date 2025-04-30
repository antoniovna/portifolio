import React, { useState, useEffect } from 'react';
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import 'date-fns';
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

export default function CadastrarAres() {
    const classes = useStyles();
    const [tasks, setTasks] = useState([{ value: null }])
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
        firebase.firestore().collection("Chamados").add({
            teste: "boraaaaaaaaaa"
        }).then(newDoc => {
            console.log(newDoc)
        })
    }
    return (
        <>
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
                                        <Col className="px-md-1" md="5">
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">Área</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    //value={age}
                                                    //onChange={handleChange}
                                                    label="Área"
                                                >
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>
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