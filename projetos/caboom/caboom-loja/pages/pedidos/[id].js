import { Divider, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { styles } from "./../../assets/styles/pedidos/pedidos.styles";
import { get_order } from "../../util/api";
import { useEffect, useState } from "react";
export default function Pedido() {
  const [order, setOrder] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const classes = styles();
  const fetch = () => {
    get_order(id).then((res) => {
      setOrder(res);
    });
  };
  useEffect(() => {
    fetch();
  }, []);
  const total = () => {
    var _total = 0;
    if (order?.pieces?.length > 0) {
      order.pieces.forEach((el) => {
        _total += el.amount * el.piece.price;
      });
    }
    return _total;
  };
  const status_color = (status) => {
    switch (status) {
      case "Esperando pagamento":
        return ["gray", "white"];
      case "Aguardando confirmação":
        return ["yellow", "black"];

      case "Em preparo":
        return ["blue", "white"];
      case "Cancelado":
        return ["red", "white"];
      case "Finalizado":
        return ["green", "white"];

      default:
        return ["white", "black"];

        break;
    }
  };
  return (
    <div className={classes.order_page_wrapper}>
      <div style={{ paddingLeft: "4rem", paddingTop: "20px" }}>
        <Typography variant="h3">Meu pedido</Typography>
      </div>{" "}
      <div className={classes.order_page_content}>
        <Grid container className={classes.order_page_left}>
          {order?.pieces?.map((item, idx) => (
            <>
              <div
                className={classes.order_page_left_image_wrapper}
                key={"item - " + item.id}
              >
                <img
                  className={classes.order_page_left_image}
                  src={item.piece.images[0]}
                />
              </div>
            </>
          ))}
        </Grid>
        <div className={classes.order_page_right}>
          <table className={classes.order_page_table_content}>
            <thead>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Item</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Tamanhos</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Valor unitário</Typography>
              </th>
              <th style={{ textAlign: "center" }}>
                <Typography variant="body1">Valor total</Typography>
              </th>
            </thead>
            <tbody className={classes.order_page_desktop_table}>
              {order?.pieces?.map((item, idx) => (
                <tr key={"table - " + item.id}>
                  <td style={{ textAlign: "center" }}>
                    <Typography variant="body2">{item.piece.name} </Typography>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "row",
                      width: "200px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {item.sizes.map((size, index) => (
                      <>
                        {size.amount > 0 && (
                          <Typography
                            key={
                              "cart size" + item.piece.id + index + size.size
                            }
                            className={classes.size_element_wrapper}
                          >
                            {size.amount}x {size.size.toUpperCase()}
                          </Typography>
                        )}
                      </>
                    ))}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Typography
                      fontWeight="bold"
                      color="primary.accent"
                      variant="body2"
                    >
                      {(item.piece.price * 1).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Typography>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Typography fontWeight="bold" variant="body2">
                      {(item.piece.price * item.amount).toLocaleString(
                        "pt-br",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </Typography>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td style={{ textAlign: "center" }}>
                  <Typography variant="body1">Total:</Typography>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {total().toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
          <div className={classes.order_page_mobile_card}>
            {order?.pieces?.map((item, idx) => (
              <div className={classes.order_page_mobile_card_element}>
                <div
                  style={{
                    display: "flex",
                    alignItem: "center",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Typography variant="body2">{item.piece.name} </Typography>
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "row",
                      width: "200px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Typography fontWeight="bold" variant="body2">
                      {(item.piece.price * item.amount).toLocaleString(
                        "pt-br",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </Typography>
                  </div>
                  <div>
                    {item.sizes.map((size, index) => (
                      <>
                        {size.amount > 0 && (
                          <Typography
                            key={
                              "cart size" + item.piece.id + index + size.size
                            }
                            className={classes.size_element_wrapper}
                          >
                            {size.amount}x {size.size.toUpperCase()}
                          </Typography>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItem: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                borderTop: "1px solid lightgray",
                marginTop: "20px",
              }}
            >
              <Typography variant="body1">Total:</Typography>
              <Typography
                variant="body1"
                color="primary.accent"
                fontWeight="bold"
              >
                {total().toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Typography>
            </div>
          </div>
          <br />
          <Divider />
          <br />
          <div className={classes.order_page_right_content}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body1">Status: </Typography>
              <Typography
                variant="body1"
                style={{
                  color: status_color(order?.paymentStatus)[1],
                  backgroundColor: status_color(order?.paymentStatus)[0],
                  padding: "5px 12px 5px 12px",
                  borderRadius: "8px",
                }}
              >
                {order?.paymentStatus}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
