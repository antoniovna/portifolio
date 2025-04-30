import React, { useState } from "react";
//material UI
import { makeStyles } from '@material-ui/core/styles';
import Selecao from './selecao';

export default function AbrirChamados() {
    /*
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
    */

    return (
        <>
            <div className="content">
                <Selecao />
            </div>
        </>
    )
}