import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  drop_carousel_wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    height: "100vh",
  },
  selectedVideo: {
    display: "block",
    position: "absolute",
    zIndex: "1",
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  selectedVideoMobile: {
    display: "block",
    position: "absolute",
    zIndex: "1",
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drop_details_description: {
    display: "block",
    [theme.breakpoints.down("sm")]: {
      width: "90vw !important",
    },
  },
  unselectedVideo: {
    display: "none",
  },
  drops_wrapper: {
    position: "absolute",
    zIndex: 10,
    display: "flex",
    flexDirection: "row",
    bottom: 15,
    left: 30,
    gap: 20,
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "center",
      left: "0px",
      right: "0px",
    },
  },
  drop_details: {
    position: "absolute",
    zIndex: 11,
    top: 55,
    width: "fit-content",
    left: 10,
    // textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
    "& p": {
      marginTop: "10px",
      // width: "70%",
    },
  },
  brands_wrapper: {
    paddingTop: "3px",
    paddingBottom: "3px",
    paddingRight: "10px",
    width: "min-content",

    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
  },
  homepage_content_wrapper: {
    position: "relative",
    paddingTop: "106vh",
    padding: "10px",
    [theme.breakpoints.up("sm")]: {
      paddingLeft: "50px",
      paddingRight: "50px",
    },
  },
  homepage_content_text: {
    padding: "20px 10px 20px 10px",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      "& p": {
        width: "95%",
        textAlign: "left",
      },
    },
    [theme.breakpoints.up("sm")]: {
      "& p": {
        width: "65%",
        textAlign: "center",
      },
    },
  },
  drop_details_description_wrapper: {
    backdropFilter: "blur(2rem)",
    backgroundColor: "rgba(158, 29, 166, 0.1)",
    padding: "10px 10px 10px 10px",
    borderRadius: "5px",
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  drop_details_title: {
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));
