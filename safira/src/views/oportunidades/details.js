import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col
} from 'reactstrap';
import moment from 'moment';
import Slider from '@material-ui/core/Slider';
import firebase from './../../initfirebase';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import CardFooter from 'reactstrap/lib/CardFooter';

export default function Modal({ data, close, edital, certame }) {

    const displayDetails = () => {
        return (
            data.details.map((item, index) => (
                <Col md="4" >
                    <Card className="oportunidade-produto-details">
                        <CardHeader>
                            <h4>{item.produtoLicitado}</h4>
                            <p className="total-value-subtitle" >{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.montanteOportunidade).toFixed(2))}</p>
                        </CardHeader>
                        <CardBody>
                            <h5>Quantidade: {item.quantidade}</h5>
                            <h5>Unidade: {item.unidade}</h5>
                        </CardBody>
                    </Card>
                </Col>
            ))
        )
    }
    return (
        <>
            <div className="metas-modal-wrapper">
                <Card>
                    <CardHeader>
                        <div className="oportunidades-header-wrapper">
                            <h2 style={{ justifySelf: "center" }}>{data.idLicitasys}</h2>
                            <IconButton color="secondary" onClick={() => close()}>
                                <HighlightOffOutlinedIcon />
                            </IconButton>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            {displayDetails()}
                        </Row>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}