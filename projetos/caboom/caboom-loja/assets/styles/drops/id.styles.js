import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  drop_page_left: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    justifyContent: "center",
    "& .carousel .slider-wrapper": { maxHeight: "65vh" },
    "& .carousel .slider-wrapper.axis-horizontal .slider ": {
      height: "inherit",
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
  drop_page_wrap: {
    paddingTop: "80px",
    display: "flex",
    alignItems: "center",
    paddingRight: "7%",
    paddingLeft: "7%",
  },
  drop_page_content: {
    display: "flex",
    flex: 12,
    flexDirection: "column",
  },
  drop_page_right: {
    display: "flex",
    flex: 12,
    width: "100%",
    justifyContent: "center",
  },
  drop_page_carousel_wrapper: { gap: 4 },
  drop_page_left_content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2% 15% 2% 15%",
    "& p": {
      textAlign: "center",
      marginTop: "30px",
    },
  },
  drop_page_image: {
    height: "50vh",
    width: "100%",
    objectFit: "cover",
    objectPosition: "50% 50%",
    borderRadius: "15px",
  },
  piece_box: {
    borderRadius: "15px",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      marginLeft:"-10px"
    },
  },
  piece_box_details: {
    position: "absolute",
    bottom: 0,
    padding: "10px",
    backdropFilter: "blur(2rem)",
    width: "100%",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
  },
  piece_box_sizes: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "10px",
    backdropFilter: "blur(2rem)",
    width: "100%",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
  },
  drop_page_drops_wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "40px",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
    },
  },
}));
