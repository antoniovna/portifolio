import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  cart_drawer_wrapper: {
    width: "30vw",
    backgroundColor: theme.palette.primary.white,
    height: "103vh",
    padding: "15px",
    position: "absolute",
    right: 0,
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
    },
    
  },
  cart_drawer_piece: {
    height: "20vh !important",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "row",
    flex: 12,
    padding: "0px 0px 10px 0px !important",
    borderBottom: `1px solid ${theme.palette.primary.light_gray}`,
  },
  cart_drawer_image_wraper: {
    flex: 4,
    cursor: "pointer",
  },
  cart_drawer_image: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    marginLeft: "0px",
    borderRadius: "5px",
  },
  cart_drawer_content_wraper: {
    flex: 8,
    padding: "0px 0px 5px 10px",
    cursor: "pointer",
  },
  cart_item_bin_wrapper: {
    flex: 1,
    alignItems: "center",
    display: "flex",
  },
  cart_drawer_header: {
    backgroundColor: theme.palette.primary.background,
    position: "fixed",
    width: "30vw",
    marginLeft: "-1rem",
    display: "flex",
    alignItems: "center",
    padding: "14px 5px 14px 5px",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
    },
    
  },
  cart_drawer_header_content: {
    position: "absolute",
    right: "0px",
    left: "0px",
    bottom: "0px",
    top: "0px",
    color: theme.palette.primary.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cart_content_wrapper: {
    marginTop: "5rem",
    height: "60vh",
    overflowY: "auto",

    "&::-webkit-scrollbar": {
      width: "10px",
    },

    /* Track */
    "&::-webkit-scrollbar-track": {
      background: theme.palette.primary.light_gray,
      borderRadius: "10px",
    },

    /* Handle */
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.primary.background,
      borderRadius: "10px",
    },

    /* Handle on hover */
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  cart_drawer_sizes: {
    flexWrap: "wrap",
    borderRadius: "5px",
    width: "min-content",
    display: "flex",
    flexDirection: "row",
    marginTop: "0px",
    "& p": {
      whiteSpace: "nowrap",
    },
    width: "100%",
    gap: "4px",
  },
  subtotal_wrapper: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    paddingBottom: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingRight: "30px",
  },
  cart_drawer_finish_button: {
    width: "100%",
    backgroundColor: theme.palette.primary.background,
    color: theme.palette.primary.white,
    borderRadius: "40px",
    padding: "8px 0px 8px 0px",
    border: `1px solid ${theme.palette.primary.background}`,
    cursor: "pointer",
  },
  cart_drawer_two_buttons_wrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    flex: 12,
    gap: 10,
    padding: "0px 10px 5px 10px",
    marginTop: "10px",
    marginBottom: "5px",
  },
  keep_shoping_button: {
    flex: 6,
    borderRadius: "50px",
    backgroundColor: theme.palette.primary.white,
    padding: "5px 0px 5px 0px",
    cursor: "pointer",
  },
  access_button: {
    flex: 6,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    borderRadius: "50px",
    backgroundColor: theme.palette.primary.white,
    padding: "5px 0px 5px 0px",
    cursor: "pointer",
    "& svg": {
      marginBottom: "-5px",
    },
  },
  empty_cart_wrapper: {
    marginTop: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
