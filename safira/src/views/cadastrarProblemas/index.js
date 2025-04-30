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
} from "reactstrap";
//material UI
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Table from './table';
import firebase from './../../initfirebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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

export default function CadastrarAres() {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [problema, setProblema] = useState("");
    const [area, setArea] = useState('');
    const [areas, setAreas] = useState([]);
    const [tasks, setTasks] = useState([{ value: null }])
    useEffect(() => (
        getAreas()
    ), [0])
    
    const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    const getAreas =  () => {
        setAreas([])
        let areasRef = firebase.firestore().collection("Areas").onSnapshot(element => {
            element.forEach((doc) => {
                setAreas(areas => areas.concat(doc.data()))
            })
        })
    }
    const submit = async () => {
        let dbRef = firebase.firestore().collection("Problemas").add({
            problema: problema,
            area: area,
            id: "",
        }).then(newDoc => {
            let updateRef = firebase.firestore().collection("Problemas").doc(newDoc.id).update(({ id: newDoc.id }))
            setProblema("");
            setArea("");
            getAreas();
            handleClick();
        })
    };
    const listAreas = areas.map((value, index) => (
        <MenuItem value={value.area} >{value.area}</MenuItem>
    ))
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Problema cadastrado com sucesso!
        </Alert>
            </Snackbar>
            <div className="content">
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Cadastrar novo problema</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Col className="px-md-1" md="5">
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel id="demo-simple-select-outlined-label">Área</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="demo-simple-select-outlined"
                                                value={area}
                                                onChange={
                                                    (e) => setArea(e.target.value)
                                                }
                                                label="Área"
                                            >
                                                {listAreas}
                                            </Select>
                                        </FormControl>
                                    </Col>
                                    <Col className="px-md-1" md="5">
                                        <InputLabel id="demo-simple-select-outlined-label">Problema</InputLabel>
                                        <Input placeholder="Área" value={problema} onChange={(e) => setProblema(e.target.value)} />
                                    </Col>
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
                <Row>
                    <Col >
                        <Card>
                            <CardHeader>
                                <h5 className="title">Lista de problemas</h5>
                            </CardHeader>
                            <CardBody>
                                <Table />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};