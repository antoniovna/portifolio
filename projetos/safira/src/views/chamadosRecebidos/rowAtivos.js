import React, { useState } from 'react';
import { Collapse } from 'reactstrap'
import MakeNotes from './../../components/chamadosDetails/makeNotes';
import Update from './../../components/chamadosDetails/updateStatus';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Details from './../../components/chamadosDetails/details';
import moment from 'moment';

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

export default function Row(props) {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [open, setOpen] = useState(false);
    const date = new Date(props.object.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dt = date.getDate();
    var now = new Date();

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
    var pastDate = new Date(dt + "-" + month + "-" + year)
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
                        <Details operation={0} data={props.object} />
                        <MakeNotes id={props.object.id} />
                    </div>
                </td>
                <td>{props.object.id}</td>
                <td>{listAreas}</td>
                {

                    moment().isAfter(moment(pastDate).format("DD/MM/YYYY"), 'day') === true ?
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
            <Collapse style={{ width: "100%" }} isOpen={open}>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                    {anexo}
                </div>
                <Update operation={2} data={props.object} />
            </Collapse>
        </>
    )
}