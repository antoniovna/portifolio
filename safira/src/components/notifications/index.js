/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import firebase from './../../initfirebase';
// reactstrap components
import {
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import { Link } from 'react-router-dom';
import NotificationsIcon from '@material-ui/icons/Notifications';

class AdminNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            modalSearch: false,
            color: "navbar-transparent",
            isWhiteMode: false,
            photo: "",
            admin: false,
            id: "",
            status: "",
            notifications: [],
        };
    }


    getNotifications() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.firestore().collection("Notifications").where("email", "==", user.email).where("isRead", "==", false).orderBy("timesTamp", "desc").onSnapshot((snapshot) => {
                    this.setState({
                        notifications: []
                    })
                    snapshot.forEach(doc => {
                        this.setState({
                            notifications: this.state.notifications.concat(doc.data())
                        })
                    })
                })
                // User is signed in.
            } else {
                return;
                // No user is signed in.
            }
        })

        // User is signed in
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateColor);
        this.getNotifications();
    }

    readNotification(id) {
        console.log("Reading", id)
        firebase.firestore().collection("Notifications").doc(id).update({ isRead: true }).then(() => {
            this.getNotifications()
        })
    }
    render() {
        const listNotifications = this.state.notifications.map((notification, index) => (
            <Link onClick={() => this.readNotification(notification.id)} to={notification.path}>
                <DropdownItem className="nav-item">
                    {notification.message}
                </DropdownItem>
            </Link>
        ))
        return (
            <>
                <UncontrolledDropdown nav>
                    <DropdownToggle
                        caret
                        color="default"
                        data-toggle="dropdown"
                        nav
                    >
                        {
                            this.state.notifications.length > 0 ? <div className="notification d-none d-lg-block d-xl-block" /> : null
                        }
                        <NotificationsIcon />
                        <p className="d-lg-none">Notificações</p>

                    </DropdownToggle>
                    <DropdownMenu className="dropdown-navbar" right tag="ul">
                        {
                            this.state.notifications.length > 0 ?
                                <>
                                    <button onClick={() => {
                                        this.state.notifications.forEach((notification) => {
                                            this.readNotification(notification.id)
                                        })
                                    }} className="read-all-button">Ler tudo</button>
                                    {listNotifications}
                                </> : null
                        }
                    </DropdownMenu>
                </UncontrolledDropdown>
            </>
        );
    }
}

export default AdminNavbar;

/*
 <DropdownMenu className="dropdown-navbar" right tag="ul">
                    {
                      this.state.notifications.length > 1 ? listNotifications : null
                    }
                  </DropdownMenu>
*/