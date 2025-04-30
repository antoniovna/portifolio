import Head from "next/head";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../material-ui/theme/theme";

import Header from "../components/navbar/navbar";
import "./../assets/styles/styles.css";
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          key="viewport"
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      {/* REDUX STORE PROVIDER */}
      <ThemeProvider theme={theme}>
        <Header />
        <div>
          {" "}
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};
