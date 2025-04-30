import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  checkout_page_wrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  stepper_wrapper: {
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      paddingLeft: "0px",
    },
  },
  checkout_page_body: {
    width: "80%",
    padding: "7rem 5% 0px 5%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      padding: "7rem 0% 0px 0%",
    },
  },
  //Payment//
  cart_component_wrapper: {
    marginTop: "50px",
  },
  checkout_go_back_button: {
    border: `1px solid ${theme.palette.primary.light_gray}`,
    backgroundColor: theme.palette.primary.lighter_gray,
    borderRadius: "25px",
    padding: "10px 20px 10px 20px",
    cursor: "pointer",
    fontSize: "18px",
    "& :hover": {
      backgroundColor: theme.palette.primary.light_gray,
    },
  },
  checkout_next_button: {
    border: `1px solid ${theme.palette.primary.light_gray}`,
    backgroundColor: theme.palette.primary.background,
    color: theme.palette.primary.white,
    borderRadius: "25px",
    padding: "10px 20px 10px 20px",
    cursor: "pointer",
    fontSize: "18px",
    "& :hover": {
      backgroundColor: theme.palette.primary.light_gray,
    },
  },
  checkout_stepper_buttons: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: "60px",
    marginTop: "20px",
    width: "60%",
  },
  cart_component_table_wrapper: {
    width: "100%",
    borderCollapse: "collapse",
  },
  cart_item_image_wrapper: {
    width: "50px",
    height: "120px",
    padding: "4px 4px 4px 4px",
    "& img": {
      height: "100%",
      width: "100%",
      objectFit: "cover",
      borderRadius: "5px",
    },
  },
  cart_component_item_wrapper: {
    width: "100%",
    borderBottom: `1px solid ${theme.palette.primary.lighter_gray}`,
  },
  cart_component_item_content: {
    display: "flex",
    flexDirection: "row",
  },
  cart_component_item_name_wrapper: {
    marginLeft: "10px",
    maxWidth: "20vw",
    "& p": {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
  size_element_wrapper: {
    border: `1px solid ${theme.palette.primary.light_gray}`,
    borderRadius: "5px",
    padding: "2px 6px 2px 6px",
    transform: "scale(0.92)",
    marginTop: "3px",
    "& svg": {
      fill: theme.palette.primary.light_gray,
    },
    "& p": { cursor: "default", textTransform: "uppercase" },
  },
  cart_component_sizes_wrapper: {
    maxWidth: "20vw",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cart_component_unitary_price_wrapper: {
    width: "200px",
    "& p": {
      width: "100%",
      textAlign: "center",
    },
  },
  cart_component_items_wrapper: {
    marginTop: "10px",
  },
  cart_component_last_row_item: {
    paddingTop: "10px",
    "& p": {
      textAlign: "center",
    },
  },
  cart_component_delete_button_wrapper: {},
  checkout_empty_cart_wrapper: {
    paddingTop: "30vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& p": {
      border: `1px solid ${theme.palette.primary.light_gray}`,
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.white,
      borderRadius: "25px",
      padding: "10px 20px 10px 20px",
      cursor: "pointer",
      textDecoration: "none",
      fontSize: "18px",
      marginTop: "30px",
      "& :hover": {
        backgroundColor: theme.palette.primary.light_gray,
      },
    },
  },
}));
