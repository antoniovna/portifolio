import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  pedidos_page_wrapper: {
    padding: "5rem 0rem 0rem 0rem",
    width: "100vw",
  },
  pedidos_table_wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "1rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  pedidos_page_mobile_table: {
    display: "none",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: "1rem",

    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  mobile_page_card_wrapper: {
    border: `1px solid ${theme.palette.primary.light_gray}`,
    width: "100%",
    "& div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "100%",
      flexDirection: "row",
      marginTop: "10px",
      marginBottom: "10px",
    },
  },
  pedidos_table_content: {
    width: "70%",
    borderCollapse: "separate",
    borderSpacing: "0 20px",
  },
  pedidos_table_row_wrapper: {
    borderBottom: `1px solid ${theme.palette.primary.lighter_gray}`,
    padding: "5px",
  },
  order_page_wrapper: {
    padding: "5rem 0rem 0rem 0rem",
    width: "100vw",
  },
  order_page_content: {
    display: "flex",
    flexDirection: "row",
    flex: "12",
    padding: "3rem 3rem 3rem 3rem",
    gap: "15px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  order_page_left: { flex: "6" },
  order_page_right: { flex: "6" },
  order_page_left_image_wrapper: {
    padding: "5px",
    height: "350px",
  },
  order_page_left_image: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    borderRadius: "7px",
  },
  order_page_table_content: {
    width: "90%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  order_page_mobile_card: {
    width: "100%",
  },
  order_page_mobile_card_element: {},
  size_element_wrapper: {
    border: `1px solid ${theme.palette.primary.light_gray}`,
    borderRadius: "5px",
    padding: "2px 6px 2px 6px",
    transform: "scale(0.92)",
    marginTop: "3px",
    maxWidth: "100px",
    minWidth: "80px",
    "& svg": {
      fill: theme.palette.primary.light_gray,
    },
    "& p": { cursor: "default", textTransform: "uppercase" },
  },
}));
