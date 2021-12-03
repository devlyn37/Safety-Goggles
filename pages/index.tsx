import React from "react";
import { Search } from "../components/Search";
import styles from "../styles/home.module.css";
import { useRouter } from "next/dist/client/router";
import { GiProtectionGlasses } from "react-icons/gi";

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
        <div className={styles.desc}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Safety</h1>
            <GiProtectionGlasses className={styles.icon} />
          </div>
          <h2 className={styles.subTitle}>
            See a history of a wallet's NFT activity through an analytical lens.
            See through tricks and shady activity, look for alpha with Safety
            Glasses. Search an address or ENS name to get started.
          </h2>
        </div>
        <Search handleSearch={handleSearch} />
        <div className={styles.creditContainer}>
          <p className={styles.creditLabel}>Made by Devlyn</p>
          <div className={styles.linkContainer}>
            <a
              href="https://twitter.com/Devlyn_3"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={"/twitter-logo.svg"}
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
                src={"/github-logo.svg"}
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
