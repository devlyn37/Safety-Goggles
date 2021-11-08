import React from "react";
import { Search } from "../components/search";
import styles from "../styles/home.module.css";
import { useRouter } from "next/dist/client/router";

export default function Home() {
  const router = useRouter();

  const handleSearch = async (search: string) => {
    router.push({
      pathname: "/wallet/[wallet]",
      query: { wallet: search },
    });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div style={{ marginBottom: "50px" }}>
          <h1 className={styles.title}>
            A Transparent Wallet NFT Activity Timeline 🏙
          </h1>
          <h2 className={styles.subTitle}>
            See a visual timeline of NFT activity. Find and share activity
            within collections and/or different time periods. Distinguish
            between real mints and influencers being sent tokens.
          </h2>
        </div>
        <Search handleSearch={handleSearch} />
        <div className={styles.creditContainer}>
          <p style={{ textAlign: "center" }}>Made by Devlyn</p>
          <div className={styles.linkContainer}>
            <a
              href="https://twitter.com/Devlyn_3"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={"twitter-logo.svg"}
                className={styles.linkIcon}
                style={{ marginRight: "20px" }}
                alt="twitter logo"
              ></img>
            </a>
            <a
              href="https://github.com/devlyn37"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={"github-logo.svg"}
                className={styles.linkIcon}
                alt="github logo"
              ></img>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
