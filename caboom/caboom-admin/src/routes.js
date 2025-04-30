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
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Lancamento from "views/Lancamento";
import AssignmentIcon from "@material-ui/icons/Assignment";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import Marcas from "./views/marcas";
import Projetos from "./views/projects";
import NewUser from "./views/newUsers";
import Tasks from "./views/tasks";
import { RiTrademarkLine } from "react-icons/ri";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Orders from "./views/orders";
const dashboardRoutes = [
  {
    path: "/pedidos",
    name: "Pedidos",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: Orders,
    layout: "/admin",
  },
  /*{
    path: "/pastas",
    name: "Pastas",
    rtlName: "لوحة القيادة",
    icon: AssignmentIcon,
    component: Projetos,
    layout: "/admin",
  }, */
  {
    path: "/usuarios",
    name: "Usuários",
    rtlName: "لوحة القيادة",
    icon: AccountBoxIcon,
    component: NewUser,
    layout: "/admin",
  },
  {
    path: "/pastas/:id",
    name: "Tarefas",
    rtlName: "لوحة القيادة",
    icon: AssignmentIcon,
    component: Tasks,
    hide: true,
    layout: "/admin",
  },
  {
    path: "/lancamentos",
    name: "Lançamentos",
    rtlName: "لوحة القيادة",
    icon: NewReleasesIcon,
    component: Lancamento,
    layout: "/admin",
  },
  {
    path: "/marcas",
    name: "Marcas",
    rtlName: "لوحة القيادة",
    icon: RiTrademarkLine,
    component: Marcas,
    layout: "/admin",
  },
  {
    path: "/perfil",
    name: "Perfil",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
];

export default dashboardRoutes;
