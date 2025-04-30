import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  page_wrapper: {
    padding: "90px 10px 0px 10px",
  },
  brand_images_wrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
    justifyContent: "center",
    marginBottom: "50px",
  },
  image_wrapper: {
    height: "18rem",
    width: "25rem",
    [theme.breakpoints.down("sm")]: {
      width: "95vw",
    },
    "& img": {
      height: "100%",
      width: "100%",
      objectFit: "cover",
      borderRadius: "10px",
    },
  },
  brand_description: {
    padding: "10px 5px 10px 5px",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      alignItems: "center",
      padding: "1rem 5rem 0rem 5rem",
    },
  },
}));
