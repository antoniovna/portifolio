import { useEffect, useState } from "react";
import { get_drops, get_brands } from "./../util/api";
import MainDrop from "./../components/homePage/mainDrop/mainDrop";
import { styles } from "../assets/styles/home/home.styles";
import { Typography } from "@mui/material";
import Link from "next/link";
import { PageHead } from "./../components/head/head";
import Logo from "./../public/logo.png";
export default function Home() {
  const classes = styles();
  const [drops, setDrops] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedDrop, setSelectedDrop] = useState({});
  const fetch = async () => {
    var _brands = [];
    await get_drops().then((res) => {
      if (res[0]) {
        res[0].isSelected = true;
        setDrops(res);
        setSelectedDrop(res[0]);
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          _brands.push(...element.brands);
        }
      }
    });

    get_brands(_brands).then((res) => {
      setBrands(res);
    });
  };
  useEffect(() => {
    fetch();
  }, []);
  const listDrops = drops.map((drop, idx) => (
    <>
      <MainDrop
        select={(data) => {
          console.log(data);
          setSelectedDrop(data);
        }}
        selected={selectedDrop.id === drop.id}
        data={drop}
        key={"drop " + idx}
      />
    </>
  ));
  useEffect(() => {
    if (document.getElementById("vid")) {
      if (document.getElementById("vid").playing) {
      } else {
        document.getElementById("vid").play();
      }
    }
    if (document.getElementById("vid-mobile")) {
      if (document.getElementById("vid-mobile").playing) {
      } else {
        document.getElementById("vid-mobile").play();
      }
    }
  }, []);
  const returnFirstImage = () => {
    if (drops.length > 0) {
      return drops[0].images[0];
    } else {
      return Logo;
    }
  };
  const tags = {
    title: `Caboom`,
    url: `/`,
    description: `O Drop 90002022, é um drop que visa unir as tendências dos anos
    90, 2000 e 2022 em suas peças, conseguindo assim resgatar a
    estética black, que foram responsáveis por ditar também as nossas
    tendências atuais, as nossas referências, e inspirações.`,
    image: returnFirstImage(),
  };

  return (
    <>
      <PageHead tags={tags} />
      <div className={classes.drop_carousel_wrapper}>
        <video
          className={classes.selectedVideo}
          src={require("./../public/videos/capa.mp4")}
          autoplay
          loop
          muted
          playsInline
          controls={false}
          id="vid"
        />
        <video
          className={classes.selectedVideoMobile}
          src={require("./../public/videos/capa-mobile.mp4")}
          autoplay
          loop
          muted
          playsInline
          controls={false}
          id="vid-mobile"
        />

        {selectedDrop && (
          <div className={classes.drop_details}>
            <div className={classes.drop_details_description_wrapper}>
              <Typography
                className={classes.drop_details_title}
                variant="h1"
                color="primary.black"
              >
                {selectedDrop.name}
              </Typography>

              <Typography
                className={classes.drop_details_description}
                variant="body2"
                color="primary.black"
              >
                O Drop 90002022, é um drop que visa unir as tendências dos anos
                90, 2000 e 2022 em suas peças, conseguindo assim resgatar a
                estética black, que foram responsáveis por ditar também as
                nossas tendências atuais, as nossas referências, e inspirações.
              </Typography>
              <br />
              <Typography
                className={classes.drop_details_description}
                variant="body2"
                color="primary.black"
              >
                Se você ligar no número 90002022, onde será que isso vai te
                levar?
              </Typography>
              <div className={classes.brands_wrapper}>
                <Typography
                  style={{ paddingRight: "10px" }}
                  variant="body1"
                  color="primary.black"
                >
                  Marcas:{" "}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    gap: "10px",
                  }}
                >
                  {" "}
                  {brands.map((brand, idx) => (
                    <>
                      <Link href={`/marcas/${brand.id}`}>
                        <Typography
                          key={"brand - " + idx}
                          variant="body2"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "black",
                          }}
                        >
                          {brand.name}
                          {idx === brands.length - 1 ? "" : ", "}
                        </Typography>
                      </Link>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={classes.drops_wrapper}>{listDrops}</div>
      </div>
      <div className={classes.homepage_content_wrapper}>
        <Typography variant="h4">O que é o caboom?</Typography>
        <div className={classes.homepage_content_text}>
          <Typography variant="body1">
            O Caboom é um projeto voltado pra moda idealizado pelo{" "}
            <a
              style={{ color: "black" }}
              href="https://instagram.com/projetoconexaoafro?igshid=YmMyMTA2M2Y="
              target="_blank"
            >
              ConexãoAfro
            </a>
            , que visa conectar artistas e marcas pretas através de colaborações
            e lançamentos de drops anuais.
          </Typography>
        </div>
      </div>
    </>
  );
}
