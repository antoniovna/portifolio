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
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import AbrirChamados from "views/abrirChamados";
import CadastrarAreas from "views/cadastrarArea";
import Login from "views/Login";
import ForgotPassword from "views/forgotPassword";
import CadastrarProblemas from "views/cadastrarProblemas";
import RegistroDeLigacoes from "views/registroDeLigacoes";
import LigacoesRecebidas from "views/ligacoesRecebidas";
import ChamadosEnviados from "views/chamadosEnviados";
import ChamadosRecebidos from "views/chamadosRecebidos";
import CadastrarUsuarios from "views/cadastrarUsuarios";
import Oportunidades from "views/oportunidades";
import Pendencias from "views/controleDePendencias";
import OldChamados from "views/oldChamados";
import Regionalizacao from "views/regionalizacao";
import GestaoDeOportunidades from "views/gestaoDeOportunidades";
import Metas from "views/metas";
import MinhasMetas from "views/minhas_metas";
import Contratos from "views/contratos";
import Contracheque from "views/contracheque";
import Indicadores from "views/indicadores";
import BI from "views/BI";
var routes = [
  /*  {
    path: "/bi-produtos",
    name: "BI Produtos",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: BI,
    layout: "/admin",
    display: true,
  },
  {
    path: "/Indicadores",
    name: "Indicadores",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Indicadores,
    layout: "/admin",
    display: true,
  },
  {
    path: "/contracheque",
    name: "Contracheque",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Contracheque,
    layout: "/admin",
    display: true,
  },
  {
    path: "/contratos",
    name: "Contratos",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Contratos,
    layout: "/admin",
    display: true,
  },
  {
    path: "/metas",
    name: "Controle de metas",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Metas,
    layout: "/admin",
    display: true,
  },
  {
    path: "/metas",
    name: "Minhas metas",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: MinhasMetas,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/regionalizacao",
    name: "Regionalização",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Regionalizacao,
    layout: "/admin",
    display: true,
  },
  {
    path: "/controle-oportunidades",
    name: "Controle de oportunidades",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: GestaoDeOportunidades,
    layout: "/admin",
    display: true,
  },
   {
    path: "/pendencias",
    name: "Controle de pendências",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: Pendencias,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/oportunidades",
    name: "Oportunidades",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: Oportunidades,
    layout: "/helpdesk",
    display: true,
  },

   {
    path: "/registroLigacoes",
    name: "registro de ligações",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: RegistroDeLigacoes,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/ligacesRecebidas",
    name: "Ligações recebidas",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: LigacoesRecebidas,
    layout: "/helpdesk",
    display: true,
  },
{
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/admin",
    display: true,
  },
  {
    path: "/map",
    name: "Map",
    rtlName: "خرائط",
    icon: "tim-icons icon-pin",
    component: Map,
    layout: "/admin",
    display: true,
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/admin",
    display: true,
  },

{
    path: "/tables",
    name: "Table List",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: TableList,
    layout: "/admin",
    display: true,
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: "tim-icons icon-align-center",
    component: Typography,
    layout: "/admin",
    display: true,
  },
  {
    path: "/rtl-support",
    name: "RTL Support",
    rtlName: "ار تي ال",
    icon: "tim-icons icon-world",
    component: Rtl,
    layout: "/rtl",
    display: true,
  },
  */
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
    display: true,
  }, 
  {
    path: "/abrirChamados",
    name: "Abrir chamados",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: AbrirChamados,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/antigos",
    name: "Chamados antigos",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: OldChamados,
    layout: "/helpdesk",
    display: true,
  },
 
  {
    path: "/chamadosEnviados",
    name: "Chamados enviados",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: ChamadosEnviados,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/chamadosRecebidos",
    name: "Chamados recebidos",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: ChamadosRecebidos,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/usuarios",
    name: "Cadastrar usuários",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: CadastrarUsuarios,
    layout: "/helpdesk",
    display: true,
  },
 
  {
    path: "/areas",
    name: "Cadastrar áreas",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: CadastrarAreas,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/problemas",
    name: "Cadastrar áreas",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: CadastrarProblemas,
    layout: "/helpdesk",
    display: true,
  },
  {
    path: "/login",
    name: "Login",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: Login,
    layout: "/auth",
    display: false,
  },
  {
    path: "/redefinir",
    name: "Redefinir senha",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-simple-add",
    component: ForgotPassword,
    layout: "/auth",
    display: false,
  },
  
  {
    path: "/perfil",
    name: "Perfil do usuário",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
    display: false,
  },
  
];
export default routes;
