import Head from "next/head";

export const PageHead = ({ tags }) => {
  const { title, url, description, image } = tags;

  return (
    <Head>
      <title> {title} </title>
      <meta name="robots" content="index, follow" />
      <meta name="description" content={description} />

      <meta
        favicon="./../../public/static/images/favicon.ico"
        key="viewport"
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        title="Caboom"
      />

      {/* Primary Meta Tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://loja-caboom.web.app${url}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content={`https://loja-caboom.web.app${url}`}
      />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image}></meta>
    </Head>
  );
};
