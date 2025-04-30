import { useState, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import { styles } from "../../assets/styles/drops/id.styles";
import { useRouter } from "next/router";
import { get_drop, get_pieces } from "./../../util/api";
import PieceBox from "../../components/drop/piece/piece_box/piece_box";
import { PageHead } from "./../../components/head/head";

export default function Drop() {
  const classes = styles();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [pieces, setPieces] = useState(null);
  const { id } = router.query;
  const fetch = () => {
    get_drop(id).then((result) => {
      console.log(result);
      setData(result);
    });
    get_pieces(id).then((results) => {
      setPieces(results);
    });
  };
  useEffect(() => {
    fetch();
  }, []);
  const returnFirstImage = () => {
    if (data) {
      return data.images[0];
    } else {
      return "https://firebasestorage.googleapis.com/v0/b/projconexaoafro.appspot.com/o/logo%2Flogo.png?alt=media&token=a8e5da75-e4f4-4689-883b-1f5063cbee06";
    }
  };
  const tags = {
    title: data ? `${data.name} | Caboom` : `Caboom`,
    url: data ? `/drop/${data.id}` : "/",
    description: `O Drop 90002022, é um drop que visa unir as tendências dos anos
    90, 2000 e 2022 em suas peças, conseguindo assim resgatar a
    estética black, que foram responsáveis por ditar também as nossas
    tendências atuais, as nossas referências, e inspirações.`,
    image: returnFirstImage(),
  };
  return (
    <div className={classes.drop_page_wrap}>
      <PageHead tags={tags} />

      <div className={classes.drop_page_content}>
        <div className={classes.drop_page_left}>
          <div className={classes.drop_page_left_content}>
            <Typography variant="h2">{data?.name}</Typography>
            <Typography
              dangerouslySetInnerHTML={{ __html: data?.description }}
              variant="body2"
            ></Typography>
          </div>
        </div>
        <div className={classes.drop_page_right}>
          <div className={classes.drop_page_carousel_wrapper}>
            <div
              className={classes.drop_page_drops_wrapper}
              container
              spacing={2}
            >
              {pieces?.map((piece, idx) => (
                <PieceBox piece={piece} key={"Piece box " + idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
