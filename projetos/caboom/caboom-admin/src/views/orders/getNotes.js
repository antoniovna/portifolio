import React, { useState, useEffect } from 'react';
import firebase from "./../../initFirebase";

export default function GetNotes(props) {
    const [notes, setNotes] = useState([]);
    var currentUser;
    const getNotes = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                currentUser = user.email
                firebase.firestore().collection("Notes").where("relatedId", "==", props.id).orderBy("timestamp", "asc").onSnapshot(snapshot => {
                    setNotes([]);
                    if (snapshot.empty) {
                        return;
                    }
                    snapshot.forEach((doc) => {
                        var data = {}
                        console.log(doc.data())
                        if (currentUser === doc.data().user) {
                            data = {
                                owned: true,
                                user: doc.data().user,
                                name: doc.data().name,
                                note: doc.data().note,
                                anexo: doc.data().anexo,
                            }
                        } else {
                            data = {
                                owned: false,
                                user: doc.data().user,
                                name: doc.data().name,
                                note: doc.data().note,
                                anexo: doc.data().anexo,
                            }
                        }
                        console.log("docs", doc.data())
                        setNotes(notes => notes.concat(data));
                    })
                })
                // User is signed in.
            } else {
                return;
                // No user is signed in.
            }
        })
    }

    useEffect(() => {
        //getNotes();
    }, []);

    const listFile = (files) => {
        files.map((file, idx) => {
            return (
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
                }} href={file.url} >
                    {file.name}
                </a>
            );
        })
    }
    const listAnexos = (files) => {
        if (files.length === 1) {
            var extension = files[0].name.split('.');
            if (extension[1] === "svg" || extension[1] === "png" || extension[1] === "jpg" || extension[1] === "jpeg") {
                return (
                    <img className="images-chat" alt={files[0].name} src={files[0].url} />
                );
            } else {
                return (
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
                    }} href={files[0].url} >
                        {files[0].name}
                    </a>
                );
                return null;
            };
        } if (files.length > 1) {
            listFile(files)
        }
    };

    const listNotes = notes.map((note, index) => {
        if (note.owned === true) {
            return (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="notes-body-me">
                        <p style={{ color: "white" }}>{note.note}</p>
                        {
                            note.anexo.length > 0 ? listAnexos(note.anexo) : null
                        }
                    </div>
                </div>
            );
        } if (note.owned === false) {
            return (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div className="notes-body">
                        <p style={{ fontWeight: "bold", color: "white" }}>{note.name}</p>
                        <p style={{ color: "white" }}>{note.note}</p>
                        {
                            note.anexo.length === 1 ? listAnexos(note.anexo) : null
                        }
                        {
                            note.anexo.length > 1 ?
                                note.anexo.forEach((file, idx) => {
                                    return (
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
                                        }} href={file.url} >
                                            {file.name}
                                        </a>
                                    );
                                }) : null
                        }
                    </div>
                </div>
            );
        }
    })
    return (
        <>
            {listNotes}
        </>
    );
};