import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { styles } from "./mainDrop.styles";
import Link from "next/link";
import Fade from "@mui/material/Fade";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
export default function MainDrop({ data, select, selected }) {
  const classes = styles();
  const [hover, setHover] = useState(false);
  return (
    <>
      <Grid
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width:"min-content"

        }}
        container
        onMouseEnter={() => {
          select(data);
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <div className={classes.product_image_wrapper}>
          <img
            style={{
              border: selected
                ? `#ffffff 2px solid`
                : "transparent 2px solid",
            }}
            className={classes.product_image}
            src={data.images[0]}
            alt=""
          />
        </div>
        <Fade in={hover} timeout={350}>
          <div className={classes.product_description_wrapper}>
            <Link href={`/drop/${data.id}`}>
              <div className={classes.product_link}>
                {" "}
                <Typography variant="body2" color="primary.white">
                  Detalhes
                </Typography>
                <ArrowForwardIcon />
              </div>
            </Link>
          </div>
        </Fade>
      </Grid>
    </>
  );
}
