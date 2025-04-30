import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import HelpdeskLayout from 'layouts/Admin/helpdesk';
import AdminLayout from "layouts/Admin/Admin.js";
import AuthLayout from './layouts/auth';
import firebase from  './initfirebase';
//import RTLLayout from "layouts/RTL/RTL.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import './layouts/auth/styles.css';
const hist = createBrowserHistory();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    ReactDOM.render(
      <Router history={hist}>
        <Switch>
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path="/helpdesk" render={props => <HelpdeskLayout {...props} />} />
          <Route path="/auth" render={props => <AuthLayout {...props} />} />
          <Redirect from="/" to="/auth/login" />
        </Switch>
      </Router>,
      document.getElementById("root")
    );
    // User is signed in.
  } else {
    ReactDOM.render(
      <Router history={hist}>
        <Switch>
          <Redirect from="/admin" to="/auth/login" /> 
          <Redirect from="/helpdesk" to="/auth/login" /> 
          <Route path="/auth" render={props => <AuthLayout {...props} />} />
          <Redirect from="/" to="/auth/login" />
        </Switch>
      </Router>,
      document.getElementById("root")
    );
    // No user is signed in.
  }
})

