import React, { useState } from 'react';
import moment from 'moment';
import IconButton from "@material-ui/core/IconButton";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import LaunchIcon from '@material-ui/icons/Launch';
import Details from './details';
import { makeStyles } from '@material-ui/core/styles';
import firebase from './../../initfirebase';
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
export default function Row({ data, refresh }) {

    function excelDateToJSDate(serial) {
        var utc_days = Math.floor(serial - 25568);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);

        var fractional_day = serial - Math.floor(serial) + 0.0000001;

        var total_seconds = Math.floor(86400 * fractional_day);

        var seconds = total_seconds % 60;

        total_seconds -= seconds;

        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;
        var date = moment(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)).format("DD/MM/yyyy")
        var time = moment(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)).format("HH:mm");
        return date + " " + time;
    }

    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }

    const _delete = () => {
        firebase.firestore().collection("oportunidades").doc(data.id).delete().then(() => {
            refresh();
        })
    }
    return (
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
                <Details close={() => closeModal()} data={data} edital={excelDateToJSDate(data.prazoEdital)} certame={moment(data.dataHoraCertame).format("DD/MM/yyyy HH:MM")} />
            </Modal>
            <td>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                    <IconButton color="primary" onClick={() => openModal()}>
                        <LaunchIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => _delete()}>
                        <HighlightOffIcon />
                    </IconButton>
                </div>
            </td>
            <td>{data.idLicitasys}</td>
            <td>{data.licitador}</td>
            <td>{data.municipio}</td>
            <td>{data.uf}</td>
            <td>{moment(data.dataHoraCertame).format("DD/MM/yyyy HH:MM")}</td>
            <td>{excelDateToJSDate(data.prazoEdital)}</td>
            <td>{data.modalidade}</td>
            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((data.montanteOportunidade).toFixed(2))}</td>

        </tr>
    )
}