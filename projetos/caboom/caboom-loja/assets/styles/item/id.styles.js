import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  piece_page_left: {
    display: "flex",
    flex: 8,
    "& .carousel .slider-wrapper": { maxHeight: "65vh" },
    "& .carousel .slider-wrapper.axis-horizontal .slider ": {
      height: "inherit",
    },

    "& p": {
      display: "none",
    },
    "& .carousel .control-dots .dot ": {
      backgroundColor: theme.palette.primary.light_gray,
      height: "10px",
      width: "10px",
      opacity: 1,
      webkitBoxShadow: "none",
      boxShadow: "none",
      zIndex: 1300,
    },
    "& .carousel .control-dots .dot.selected": {
      backgroundColor: theme.palette.primary.lighter_gray,
    },
  },
  piece_page_wrap: {
    paddingTop: "130px",
    display: "flex",
    alignItems: "center",
    paddingRight: "8%",
    paddingLeft: "8%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "90px",
    },
  },
  piece_page_content: {
    display: "flex",
    flex: 12,
    flexDirection: "row",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      justifyContent: "center",
    },
  },
  piece_page_right: {
    display: "flex",
    flex: 4,
    position: "relative",
    padding: "0% 2% 0% 3%",
  },
  piece_page_carousel_wrapper: {},
  piece_page_right_content: {
    marginTop: "-15px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      position: "relative",
      marginTop: "15px",
      marginBottom: "20px",
    },
  },
  piece_page_image: {
    width: "22rem",
    height: "30rem",
    objectFit: "cover",
    objectPosition: "50% 50%",
    borderRadius: "4px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "90px",
      maxWidth: "90vw",
    },
  },
  add_to_cart_button: {
    backgroundColor: theme.palette.primary.background,
    borderRadius: "35px",
    padding: "8px 25px 8px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    width: "70%",
    border: `${theme.palette.primary.background} 1px solid`,

    "&:hover": {
      border: `${theme.palette.primary.accent} 1px solid`,
      backgroundColor: `${theme.palette.primary.accent} `,
      transition: "background-color 0.4s ease",
      "& p": {
        color: `${theme.palette.primary.white} !important`,
        transition: "color 0.4s ease",
      },
      "& svg": {
        fill: `${theme.palette.primary.white}`,
        transition: "fill .4s ease",
      },
    },
  },
  size_element_wrapper: {
    border: `1px solid ${theme.palette.primary.light_gray}`,
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "-10px",
    paddingRight: "-10px",
    paddingTop: "-15px !important",
    paddingBottom: "-15px !important",
    transform: "scale(0.92)",
    marginTop: "3px",
    width: "130px",
    "& button": {
      "& svg": { fill: `${theme.palette.primary.light_gray}` },
      "& :hover": {
        "& svg": {
          fill: `${theme.palette.primary.accent}`,
          transition: "fill .4s ease",
        },
      },
    },
    "& p": { cursor: "default" },
    "&:hover": {
      backgroundColor: `${theme.palette.primary.lighter_gray} `,
      transition: "background-color 0.4s ease",
    },
  },
  total_wrapper: {
    width: "100%",
    marginTop: "30px",
  },
  item_header_title: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "xx-large",
    },
  },
}));
