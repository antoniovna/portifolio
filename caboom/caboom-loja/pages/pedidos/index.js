import { Typography } from "@mui/material";
import { styles } from "../../assets/styles/pedidos/pedidos.styles";
import { get_orders } from "../../util/api";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TableItem from "../../components/pedidos/tableItem";
import MobileCard from "./../../components/pedidos/mobileCard";
export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = styles();
  const fetch = (email) => {
    setLoading(true);
    get_orders(email).then((res) => {
      console.log("orders => ", res);
      setLoading(false);
      setOrders(res);
    });
  };
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        fetch(_user.email);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <>
      <div className={classes.pedidos_page_wrapper}>
        <div style={{ paddingLeft: "7rem", paddingTop: "20px" }}>
          <Typography variant="h3">Meus pedidos</Typography>
        </div>
        <div className={classes.pedidos_table_wrapper}>
          <table className={classes.pedidos_table_content}>
            <thead>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Itens</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Data</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Valor total</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Status</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Detalhes</Typography>
              </th>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <TableItem order={order} key={"table item" + order.id} />
              ))}
            </tbody>
          </table>
        </div>
        <div className={classes.pedidos_page_mobile_table}>
          {orders.map((order, idx) => (
            <MobileCard order={order} key={"table item" + order.id} />
          ))}
        </div>
      </div>
    </>
  );
}
