import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  payment_step_wrapper: {
    display: "flex",
    flexDirection: "row",
    flex: "12",
    width: "70vw",
    justifyContent: "center",
    gap: "30px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
  },
  payment_step_page_wrapper: {
    display: "flex",
    justifyContent: "start",
    width: "50vw",
    marginTop: "30px",
    marginBottom: "20px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "-15%",
    },
  },
  payment_picpay_wrapper: {
    height: "250px",
    width: "250px",
    "& img": {
      height: "100%",
      width: "100%",
    },
  },
  payment_right_content: {
    width: "400px",
    [theme.breakpoints.down("sm")]: {
      width:"auto"
    },
  },
  payment_total_wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  payment_component_sizes_wrapper: {
    maxWidth: "20vw",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
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
  payment_component_image_wrapper: {
    height: "120px",
    width: "100px",
    "& img": {
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
  },
  payment_item_left_wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  item_card_content_wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "space-between",
    width: "100%",
  },
}));
