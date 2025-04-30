import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  drop_carousel_wrapper: {
    width: "100%",
  },
  product_image_wrapper: {
    width: "14rem",
    height: "18rem",
  },
  product_image: {
    width: "100%",
    height: "100%",
    objectFit: "cover !important",
    objectPosition: "50% 17%",
    boxShadow: "7px 9px 24px -9px rgba(0,0,0,0.58)",
    borderRadius: "10px",
  },
  product_content_wrapper_carousel: {
    display: "flex",
    flexDirection: "row",
  },
  product_description_wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    backdropFilter: "blur(1rem)",
    height: "12.72rem",
    width: "151px",
    position: "absolute",
    borderRadius: "9px",
    marginLeft: "1px",
    marginTop: "2px",
    width: "14rem",
    height: "18rem",
  },
  product_name: {
    padding: "3px",
  },
  product_link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: "50px",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "20px",
    paddingRight: "20px",
    gap:"10px",
    cursor: "pointer",
    border: `${theme.palette.primary.lighter_gray} 1px solid`,
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
}));
