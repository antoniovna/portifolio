/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from "./views/auth/login";
import firebase from "./initFirebase";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./styles.css"
const hist = createBrowserHistory();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    ReactDOM.render(
      <Router history={hist}>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/rtl" component={RTL} />
          <Redirect from="/" to="/admin/pedidos" />
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
          <Route path="/auth/login" component={Login} />
          <Redirect from="/" to="/auth/login" />
        </Switch>
      </Router>,
      document.getElementById("root")
    );
    // No user is signed in.
  }
});
