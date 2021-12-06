import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        {/* Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.safetygoggles.xyz/" />
        <meta property="og:title" content="Safety Goggles" />
        <meta
          property="og:description"
          content="View a history of any wallet's NFT activity, see through shady behaviour, look for alpha with Safety Goggles."
        />
        <meta property="og:image" content="/preview.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.safetygoggles.xyz/" />
        <meta property="twitter:title" content="Safety Goggles" />
        <meta
          property="twitter:description"
          content="Look for alpha with Safety Goggles."
        />
        <meta
          property="twitter:image"
          content="https://i.postimg.cc/zfsBbVfw/preview.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
