import { useState, useEffect, useRef } from "react";
import { Typography, Grid, Container } from "@mui/material";
import { styles } from "../../assets/styles/marcas/id.styles";
import { useRouter } from "next/router";
import { get_brand } from "./../../util/api";
export default function Piece() {
  const classes = styles();
  const router = useRouter();
  const [data, setData] = useState({});

  const { id } = router.query;
  useEffect(() => {
    get_brand(id).then((res) => {
      setData(res);
    });
  }, []);
  return (
    <div className={classes.page_wrapper}>
      {data.name && (
        <>
          <div style={{ padding: "0px 15px 0px 15px" }}>
            <Typography fontWeight={"regular"} variant="h4">
              {data.name}
            </Typography>
            <br />
            <div className={classes.brand_description}>
              <Typography
                dangerouslySetInnerHTML={{ __html: data.description }}
                variant="body2"
              ></Typography>
            </div>
            <div className={classes.brand_images_wrapper}>
              {data.images && (
                <>
                  {data.images.map((image, key) => (
                    <div
                      className={classes.image_wrapper}
                      key={"brand-image" + key}
                    >
                      <img src={image} alt="" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
