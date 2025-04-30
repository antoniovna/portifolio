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
import classNames from "classnames";
import firebase from './../../initfirebase';
// reactstrap components
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  Collapse
} from "reactstrap";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import CreateIcon from '@material-ui/icons/Create';
import Notifications from './../notifications/index';

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
  async getPhoto() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().collection("Users").where("email", "==", user.email).onSnapshot((snapshot) => {
          if (snapshot.empty) {
            return;
          }
          snapshot.forEach(doc => {
            this.setState({
              photo: doc.data().photo,
              id: doc.data().id,
              status: doc.data().status
            })
          })
        })
        // User is signed in.
      } else {
        return;
        // No user is signed in.
      }
    })
  }

  async getNotifications() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().collection("Notifications").where("email", "==", user.email).where("isRead", "==", false).onSnapshot((snapshot) => {
          this.setState({
            notifications: []
          }, () => {
            snapshot.forEach(doc => {
              this.setState({
                notifications: this.state.notifications.concat(doc.data())
              })
            })
          })
        })
        // User is signed in.
      } else {
        return;
        // No user is signed in.
      }
    })
  }

  signOut() {
    firebase.auth().signOut().then(() => {
    }).catch((e) => {
      console.log(e)
    })
  }
  changeColorMode() {
    const newMode = !this.state.isWhiteMode;
    if (newMode === true) {
      document.body.classList.add("white-content");
    }
    if (newMode === false) {
      document.body.classList.remove("white-content");
    }
    this.setState({
      isWhiteMode: newMode
    })
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
    this.getPhoto();
    this.getNotifications();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };

  updateStatus(status) {
    firebase.firestore().collection("Users").doc(this.state.id).update({ status: status }).then(() => {
      this.getNotifications()
    })
  }
  readNotification(id) {
    console.log("Reading", id)
    firebase.firestore().collection("Notifications").doc(id).update({ isRead: true });
  }
  render() {

    return (
      <>
        <Navbar
          className={classNames("navbar-absolute", this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                  >
                    <CreateIcon />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem onClick={() => this.updateStatus("Disponível")} className="nav-item">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <div style={{ height: 10, width: 10, backgroundColor: "green", marginRight: 7, borderRadius: "50%" }} />
                          Disponível
                        </div>

                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem onClick={() => this.updateStatus("Indisponível")} className="nav-item">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <div style={{ height: 10, width: 10, backgroundColor: "red", marginRight: 7, borderRadius: "50%" }} />
                          Indisponível
                        </div>
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem onClick={() => this.updateStatus("Não perturbe")} className="nav-item">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <div style={{ height: 10, width: 10, backgroundColor: "yellow", marginRight: 7, borderRadius: "50%" }} />
                          Não perturbe
                        </div>
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem onClick={() => this.updateStatus("Offline")} className="nav-item">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <div style={{ height: 10, width: 10, backgroundColor: "grey", marginRight: 7, borderRadius: "50%" }} />
                          Offline
                        </div>
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <FormControlLabel
                  value="end"
                  control={<Switch onChange={() => this.changeColorMode()} value={this.state.isWhiteMode} color="primary" />}
                  label={<Brightness4Icon />}
                  labelPlacement="start"
                />
                <Notifications />
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    {
                      this.state.status === "Disponível" ? <div style={{
                        backgroundColor: "green",
                        color: "#ffffff",
                        borderRadius: "50%",
                        height: 6,
                        width: 6,
                        position: "absolute",
                        textAlign: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        top: 10,
                        right: 10,
                        border: " 1 solid #fd5d93",
                      }} /> : null
                    }
                    {
                      this.state.status === "Indisponível" ? <div style={{
                        backgroundColor: "red",
                        color: "#ffffff",
                        borderRadius: "50%",
                        height: 6,
                        width: 6,
                        position: "absolute",
                        textAlign: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        top: 10,
                        right: 10,
                        border: " 1 solid #fd5d93",
                      }} /> : null
                    }
                    {
                      this.state.status === "Não perturbe" ? <div style={{
                        backgroundColor: "yellow",
                        color: "#ffffff",
                        borderRadius: "50%",
                        height: 6,
                        width: 6,
                        position: "absolute",
                        textAlign: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        top: 10,
                        right: 10,
                        border: " 1 solid #fd5d93",
                      }} /> : null
                    }
                    {
                      this.state.status === "Offline" ? <div style={{
                        backgroundColor: "grey",
                        color: "#ffffff",
                        borderRadius: "50%",
                        height: 6,
                        width: 6,
                        position: "absolute",
                        textAlign: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        top: 10,
                        right: 10,
                        border: " 1 solid #fd5d93",
                      }} /> : null
                    }
                    <div className="photo">
                      <img alt="..." src={this.state.photo} />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">Log out</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink onClick={() => this.signOut()} tag="li">
                      <DropdownItem className="nav-item">Finalizar sessão</DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default AdminNavbar;
