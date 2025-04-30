import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  drop_page_image: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    objectPosition: "50% 50%",
    borderRadius: "10px",
  },
  piece_box: {
    borderRadius: "15px",
    position: "relative",
    cursor: "pointer",
    width: "10rem",
  },
  piece_box_details: {
    position: "absolute",
    bottom: "0",
    width: "13rem",
    marginTop: "-4px",
    
    backdropFilter: "blur(0.1rem)",
    backgroundColor: theme.palette.primary.opaque_black,
    padding: "7px",
    borderBottomRightRadius: "10px",
    borderBottomLeftRadius: "10px",
  },
  piece_box_sizes: {
    position: "absolute",
    top: 10,
    right: 10,

    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: theme.palette.primary.opaque_black,

    borderRadius: "20px",
    display: "flex",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
  },
  piece_box_fade_wrapper: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "13rem",
    backgroundColor: theme.palette.primary.opaque_black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },
  piece_box_plus_button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: `${theme.palette.primary.lighter_gray} 1px solid`,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "3px",
    paddingBottom: "3px",
    borderRadius: "50px",
    gap:"2px",
    "&:hover": {
      border: `${theme.palette.primary.accent} 1px solid`,
      backgroundColor: `${theme.palette.primary.accent} `,
      transition: "background-color 0.4s ease",
      "& svg": {
        fill: `${theme.palette.primary.white}`,
        transition: "fill .4s ease",
      },
    },
  },
  drop_page_image_wrapper: {
    height: "19rem",
    width: "13rem",
    backgroundColor:theme.palette.primary.light_gray,
    borderRadius:"10px"
  },
}));
