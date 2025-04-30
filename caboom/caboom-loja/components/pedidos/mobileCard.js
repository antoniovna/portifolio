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
    <div className={classes.mobile_page_card_wrapper}>
      <div>
        <Typography color="primary.accent" variant="body1">
          {order.data}
        </Typography>
        <Typography variant="body1">{totalItems(order)} peças</Typography>
      </div>
      <div>
        <Typography color="primary.accent" variant="body1">
          {totalOrder(order).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
        <Link href={`/pedidos/${order.id}`}>
          <a target="_blank">
            <IconButton>
              <OpenInNewIcon />
            </IconButton>
          </a>
        </Link>
      </div>
    </div>
  );
}
