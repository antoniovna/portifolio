import { useState } from "react";
import { Typography, Grid, Fade } from "@mui/material";
import { styles } from "./piece_box.styles";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
export default function PieceBox({ piece }) {
  const classes = styles();
  const [entered, setEntered] = useState(false);
  /*const show_sizes = Object.keys(piece.stock)
    .filter(
      (v, i, a) => a.findIndex((v2) => v2 === v) === i && piece.stock[v] * 1 > 0
    )
    .map((size, idx) => (
      <Typography
        key={"size " + idx}
        fontWeight="bold"
        variant="body2"
        color="primary.white"
      >
        {size.toUpperCase()}
      </Typography>
    )); */
  return (
    <Grid style={{ padding: "10px", width: "13rem" }} sm={6} md={3} lg={3}>
      <Link href={`/item/${piece.id}`}>
        <div
          onMouseEnter={() => {
            setEntered(true);
          }}
          onMouseLeave={() => {
            setEntered(false);
          }}
          className={classes.piece_box}
        >
          <>
            <div className={classes.drop_page_image_wrapper}>
              <img
                className={classes.drop_page_image}
                src={piece.images[0]}
                alt=""
              />
            </div>
            <Grid className={classes.piece_box_details}>
              <Typography variant="body1" color="primary.white">
                {piece.name}
              </Typography>
              {/*<Typography
                fontWeight="bold"
                variant="body2"
                color="primary.accent"
                
              >
                {(piece.price * 1).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Typography> */}
            </Grid>
            {/*<Grid className={classes.piece_box_sizes}>{show_sizes}</Grid> */}
            <Fade in={entered} timeout={350}>
              <Grid className={classes.piece_box_fade_wrapper}>
                <div className={classes.piece_box_plus_button}>
                  <Typography variant="body2" color="primary.white">
                    {" "}
                    Ver mais{" "}
                  </Typography>
                  <AddIcon style={{ width: "25px", height: "25px" }} />
                </div>
              </Grid>
            </Fade>
          </>
        </div>
      </Link>
    </Grid>
  );
}
