import { Typography, Divider } from "@mui/material";
import { create_order } from "./../../util/api";
import { useEffect } from "react";
import { styles } from "./../../assets/styles/checkout/payment.styles";
import moment from "moment";
export default function Payment({
  items,
  user,
  orderCreated,
  setorderCreated,
}) {
  const classes = styles();
  useEffect(() => {
    if (!orderCreated) {
      var data = {
        address: "",
        cardData: {},
        data: moment(new Date()).format("DD/MM/YYYY HH:mm"),
        deliveryType: "Collection",
        deliveryUpdate: "",
        id: "",
        paymentStatus: "Esperando pagamento",
        pieces: items,
        user: {
          email: user.email,
          name: user.displayName,
          uid: user.uid,
        },
      };
      create_order(data).then((res) => {
        setorderCreated(true);
        console.log("res - >", res);
      });
    }
  }, []);
  const cart_total = () => {
    var total = 0;
    items.forEach((element) => {
      total += element.piece.price * element.amount;
    });
    return total;
  };
  const list_cart = items.map((item, idx) => (
    <>
      <div style={{ marginTop: "7px" }} key={"cart-item" + item.piece.id}>
        <div className={classes.payment_item_left_wrapper}>
          <div className={classes.payment_component_image_wrapper}>
            <img src={item.piece.images[0]} alt="" />
          </div>
          <div className={classes.item_card_content_wrapper}>
            {" "}
            <div style={{ width: "100%" }}>
              <Typography
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {item.piece.name}
              </Typography>
              <Typography>
                {item.amount} {item.amount > 1 ? " itens" : " item"}
              </Typography>
              <div className={classes.payment_component_sizes_wrapper}>
                {item.sizes.map((size, index) => (
                  <>
                    {size.amount > 0 && (
                      <Typography
                        key={"cart size" + item.piece.id + index + size.size}
                        className={classes.size_element_wrapper}
                      >
                        {size.amount}x {size.size.toUpperCase()}
                      </Typography>
                    )}
                  </>
                ))}
              </div>
            </div>
            <div>
              <Typography
                variant="body1"
                color="primary.accent"
                fontWeight="600"
              >
                {(item.piece.price * 1).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  ));

  return (
    <>
      <div className={classes.payment_step_page_wrapper}>
        <Typography variant="h4">Pagamento</Typography>
      </div>
      <div className={classes.payment_step_wrapper}>
        <div className={classes.payment_picpay_wrapper}>
          <img
            style={{ zIndex: "100" }}
            height="70px"
            width="auto"
            src="./qr_code.png"
          />
        </div>
        <div className={classes.payment_right_content}>
          <div className={classes.payment_total_wrapper}>
            <Typography variant="h3">Total</Typography>
            <Typography variant="h5" color="primary.accent">
              {cart_total().toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </Typography>
          </div>
          <br />
          <Divider />
          <br />
          {list_cart}
          <br />
          <Divider />
          <br />
          <div>
            <ul>
              <li>Abra o aplicativo do PicPay</li>
              <li>Leia o Qr-code</li>
              <li>Efetue o pagamento</li>
              <li>
                Nós entraremos em contato para combinar a entrega do pedido
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
