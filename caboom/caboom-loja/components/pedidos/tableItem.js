import { IconButton, Typography } from "@mui/material";
import { styles } from "./../../assets/styles/pedidos/pedidos.styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "next/link";
export default function TableItem({ order }) {
  const classes = styles();
  const totalOrder = (order) => {
    var total = 0;
    order.pieces.forEach((piece) => {
      total += piece.amount * piece.piece.price;
    });
    return total;
  };
  const totalItems = (order) => {
    var total = 0;
    order.pieces.forEach((piece) => {
      total += piece.amount;
    });
    return total;
  };
  return (
    <tr className={classes.pedidos_table_row_wrapper}>
      <td style={{ textAlign: "center" }}>
        <Typography variant="body1">{totalItems(order)}</Typography>
      </td>
      <td style={{ textAlign: "center" }}>
        <Typography variant="body1">{order.data}</Typography>
      </td>
      <td style={{ textAlign: "center" }}>
        <Typography color="primary.accent" variant="body1">
          {totalOrder(order).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
      </td>
      <td style={{ textAlign: "center" }}>
        <Typography variant="body1">{order.paymentStatus}</Typography>
      </td>
      <td style={{ textAlign: "center" }}>
        <Link href={`/pedidos/${order.id}`}>
          <a target="_blank">
            <IconButton>
              <OpenInNewIcon />
            </IconButton>
          </a>
        </Link>
      </td>
    </tr>
  );
}
