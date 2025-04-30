import { Typography, Grid, IconButton } from "@mui/material";
import { styles } from "./../../assets/styles/checkout/checkout.styles";
import DeleteIcon from "@mui/icons-material/Delete";
export default function Cart({ items, remove_item }) {
  var classes = styles();
  const cartTotal = () => {
    var total = 0;
    for (let index = 0; index < items?.length; index++) {
      const element = items[index];
      total += element.amount * element.piece.price;
    }
    return total.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };
  return (
    <>
      <Grid className={classes.cart_component_wrapper}>
        <Typography variant="h4">Seu carrinho</Typography>
        {items && (
          <Grid className={classes.cart_component_items_wrapper}>
            <table className={classes.cart_component_table_wrapper}>
              <thead>
                <th>
                  <Typography style={{ textAlign: "left" }} variant="h6">
                    Item
                  </Typography>
                </th>
                <th>
                  {" "}
                  <Typography variant="h6">Valor unitário</Typography>
                </th>
                <th>
                  {" "}
                  <Typography variant="h6">Valor total</Typography>
                </th>
                <th></th>
              </thead>
              <br />
              <tbody>
                {items && (
                  <>
                    {" "}
                    {items.map((item, idx) => (
                      <tr
                        className={classes.cart_component_item_wrapper}
                        key={"cart item" + item.piece.id + idx}
                      >
                        <td className={classes.cart_component_item_content}>
                          <div className={classes.cart_item_image_wrapper}>
                            <img alt="" src={item.piece.images[0]} />
                          </div>
                          <div
                            className={classes.cart_component_item_name_wrapper}
                          >
                            <Typography>{item.piece.name}</Typography>
                            <Typography>
                              {item.amount}{" "}
                              {item.amount > 1 ? " itens" : " item"}
                            </Typography>
                            <div
                              className={classes.cart_component_sizes_wrapper}
                            >
                              {item.sizes.map((size, index) => (
                                <>
                                  {size.amount > 0 && (
                                    <Typography
                                      key={
                                        "cart size" +
                                        item.piece.id +
                                        index +
                                        size.size
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
                        </td>
                        <td
                          className={
                            classes.cart_component_unitary_price_wrapper
                          }
                        >
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
                        </td>
                        <td
                          className={
                            classes.cart_component_unitary_price_wrapper
                          }
                        >
                          <Typography
                            variant="body1"
                            color="primary.background"
                            fontWeight="600"
                          >
                            {(item.piece.price * item.amount).toLocaleString(
                              "pt-br",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          </Typography>
                        </td>{" "}
                        <td>
                          <div
                            className={
                              classes.cart_component_delete_button_wrapper
                            }
                          >
                            <IconButton onClick={() => remove_item(idx)}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td className={classes.cart_component_last_row_item}>
                        <Typography variant="body1">Total:</Typography>
                      </td>
                      <td className={classes.cart_component_last_row_item}>
                        <Typography fontWeight="600" variant="body1">
                          {" "}
                          {cartTotal().toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Typography>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </Grid>
        )}
      </Grid>
    </>
  );
}
