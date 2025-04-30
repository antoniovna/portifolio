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
/*eslint-disable*/
import React from "react";
import { NavLink, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import firebase from "./../../initfirebase";
// reactstrap components
import { Nav } from "reactstrap";
import safira from "./../../assets/img/Logos/safira.png";
import FolderIcon from "@material-ui/icons/Folder";
import SendIcon from "@material-ui/icons/Send";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      photo: "",
      admin: false,
      areas: [],
    };
    this.activeRoute.bind(this);
  }
  getPhoto() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let ref = firebase
          .firestore()
          .collection("Users")
          .where("email", "==", user.email)
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              return;
            }
            snapshot.forEach((doc) => {
              this.setState({
                photo: doc.data().photo,
                admin: doc.data().admin,
                areas: doc.data().areas,
              });
            });
          });
        // User is signed in.
      } else {
        return;
        // No user is signed in.
      }
    });
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    if (this.props.location.pathname.includes(routeName)) {
      return "active";
    } else {
      return "";
    }
  }
  componentDidMount() {
    this.getPhoto();
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  linkOnClick = () => {
    document.documentElement.classList.remove("nav-open");
  };
  render() {
    const { bgColor, routes, rtlActive, logo } = this.props;
    let logoImg = null;
    let logoText = null;
    if (logo !== undefined) {
      if (logo.outterLink !== undefined) {
        logoImg = (
          <a
            href={logo.outterLink}
            className="simple-text logo-mini"
            target="_blank"
            onClick={this.props.toggleSidebar}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className="logo-img">
                <img style={{ width: "60%", height: "auto" }} src={safira} alt="react-logo" />
              </div>
          </a>
        );
        logoText = (
          <a
            href={logo.outterLink}
            className="simple-text logo-normal"
            target="_blank"
            onClick={this.props.toggleSidebar}
          >
            {logo.text}
          </a>
        );
      } else {
        logoImg = (
          <Link
            to={logo.innerLink}
            className="simple-text logo-mini"
            onClick={this.props.toggleSidebar}
          >
            <div className="logo-img">
              <img src={logo.imgSrc} alt="react-logo" />
            </div>
          </Link>
        );
        logoText = (
          <Link
            to={logo.innerLink}
            className="simple-text logo-normal"
            onClick={this.props.toggleSidebar}
          >
            {logo.text}
          </Link>
        );
      }
    }
    return (
      <div className="sidebar" data={bgColor}>
        <div className="sidebar-wrapper" ref="sidebar">
          {logoImg !== null || logoText !== null ? (
            <div className="logo">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className="logo-img">
                <img style={{ width: "60%", height: "auto" }} src={safira} alt="react-logo" />
              </div>
            </div>
          ) : null}
          <Nav>

            {this.state.admin === true ? (
              <li className={this.activeRoute("/dashboard")}>
                <NavLink
                  to="/admin/dashboard"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className={"tim-icons icon-chart-pie-36"} />
                  <p>Dashboard</p>
                </NavLink>
              </li>
            ) : null}
            {/*
            
            <li className={this.activeRoute("/registroLigacoes")}>
              <NavLink
                to="/helpdesk/registroLigacoes"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AddIcCallIcon size="large" />
                  <p style={{ marginLeft: 20 }}>Registro de ligações</p>
                </div>
              </NavLink>
            </li>

            <li className={this.activeRoute("/ligacesRecebidas")}>
              <NavLink
                to="/helpdesk/ligacesRecebidas"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <PhoneIcon size="large" />
                  <p style={{ marginLeft: 20 }}>Ligações recebidas</p>
                </div>
              </NavLink>
            </li>
            <li className={this.activeRoute("/contracheque")}>
                  <NavLink
                    to="/admin/contracheque"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <ReceiptIcon size="25px" />
                      <p style={{ marginLeft: 20 }}>Contracheque</p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/contratos")}>
                  <NavLink
                    to="/admin/contratos"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <DashboardIcon size="25px" />
                      <p style={{ marginLeft: 20 }}>Contratos</p>
                    </div>
                  </NavLink>
                </li>

                <li className={this.activeRoute("/regionalizacao")}>
                  <NavLink
                    to="/admin/regionalizacao"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <GiBrazil size="25px" />
                      <p style={{ marginLeft: 20 }}>Regionalização</p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/controle-oportunidades")}>
                  <NavLink
                    to="/admin/controle-oportunidades"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AiOutlineControl size="25px" />
                      <p style={{ marginLeft: 20 }}>
                        Controle de Oportunidades
                      </p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/bi-produtos")}>
                  <NavLink
                    to="/admin/bi-produtos"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MultilineChartIcon size="25px" />
                      <p style={{ marginLeft: 20 }}>
                        BI Produtos
                      </p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/admin/metas")}>
                  <NavLink
                    to="/admin/metas"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <InsertChartIcon />
                      <p style={{ marginLeft: 20 }}>Controle de metas</p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/admin/Indicadores")}>
                  <NavLink
                    to="/admin/Indicadores"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TimelineIcon />
                      <p style={{ marginLeft: 20 }}>Indicadores</p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/pendencias")}>
              <NavLink
                to="/helpdesk/pendencias"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TimerIcon size="large" />
                  <p style={{ marginLeft: 20 }}>Cotrole de pendências</p>
                </div>
              </NavLink>
            </li>
            {this.state.areas.includes("Comercial") ? (
              <li className={this.activeRoute("/oportunidades")}>
                <NavLink
                  to="/helpdesk/oportunidades"
                  className="nav-link"
                  activeClassName="active"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <EmojiObjectsIcon size="large" />
                    <p style={{ marginLeft: 20 }}>Oportunidades</p>
                  </div>
                </NavLink>
              </li>
            ) : null}
            <li className={this.activeRoute("/helpdesk/metas")}>
              <NavLink
                to="/helpdesk/metas"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TrendingUpIcon size="25px" />
                  <p style={{ marginLeft: 20 }}>Minhas metas</p>
                </div>
              </NavLink>
            </li>
            <li className={this.activeRoute("/problemas")}>
                  <NavLink
                    to="/helpdesk/problemas"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <i className={"tim-icons icon-simple-add"} />
                      <p style={{ marginLeft: 20 }}>Cadastrar problemas</p>
                    </div>
                  </NavLink>
                </li>
             */}

            <li className={this.activeRoute("/abrirChamados")}>
              <NavLink
                to="/helpdesk/abrirChamados"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <i className={"tim-icons icon-simple-add"} />
                  <p>Cadastrar Chamados</p>
                </div>
              </NavLink>
            </li>
            <li className={this.activeRoute("/chamadosEnviados")}>
              <NavLink
                to="/helpdesk/chamadosEnviados"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <SendIcon size="large" />
                  <p style={{ marginLeft: 20 }}>Chamados enviados</p>
                </div>
              </NavLink>
            </li>
            <li className={this.activeRoute("/chamadosRecebidos")}>
              <NavLink
                to="/helpdesk/chamadosRecebidos"
                className="nav-link"
                activeClassName="active"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AllInboxIcon size="large" />
                  <p style={{ marginLeft: 20 }}>Chamados recebidos</p>
                </div>
              </NavLink>
            </li>
            {this.state.admin === true ? (
              <>

                <li className={this.activeRoute("/usuarios")}>
                  <NavLink
                    to="/helpdesk/usuarios"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AddCircleOutlineIcon size="large" />
                      <p style={{ marginLeft: 20 }}>Cadastrar usuários</p>
                    </div>
                  </NavLink>
                </li>
                <li className={this.activeRoute("/areas")}>
                  <NavLink
                    to="/helpdesk/areas"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <i className={"tim-icons icon-simple-add"} />
                      <p style={{ marginLeft: 20 }}>Cadastrar áreas</p>
                    </div>
                  </NavLink>
                </li>

              </>
            ) : null}

            <li className={this.activeRoute("/perfil")}>
              <NavLink
                to="/admin/perfil"
                className="nav-link"
                activeClassName="active"
              >
                <i className={"tim-icons icon-single-02"} />
                <p>Perfil do usuário</p>
              </NavLink>
            </li>
          </Nav>
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  rtlActive: false,
  bgColor: "primary",
  routes: [{}],
};

Sidebar.propTypes = {
  // if true, then instead of the routes[i].name, routes[i].rtlName will be rendered
  // insde the links of this component
  rtlActive: PropTypes.bool,
  bgColor: PropTypes.oneOf(["primary", "blue", "green"]),
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the text of the logo
    text: PropTypes.node,
    // the image src of the logo
    imgSrc: PropTypes.string,
  }),
};

export default Sidebar;
