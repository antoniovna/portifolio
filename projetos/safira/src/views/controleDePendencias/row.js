import React, { useState } from 'react';
import { Collapse } from 'reactstrap'
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

export default function Row(props) {
    const [open, setOpen] = useState(false);
    const date = new Date(props.object.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dt = date.getDate();
    var now = new Date();
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
    return (
        <>
            <tr>
                <td>
                    <IconButton onClick={() => setOpen(!open)} color="primary">
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </td>
                <td>{props.object.id}</td>
                <td>{props.object.areas}</td>
                {
                    pastDate < now === true ?
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
                {/*<td>{props.object.problema}</td>*/}
            </tr>
            <Collapse style={{ width: "100%" }} isOpen={open}>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                    {anexo}
                </div>
            </Collapse>
        </>
    )
}