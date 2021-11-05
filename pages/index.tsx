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
          <h1>A Transparent Wallet Activity Timeline</h1>
          <h2 style={{ color: "dimgray" }}>
            See what a wallet has been up to, See what a wallet has been up to,
            See what a wallet has been up to, See what a wallet has been up to.
          </h2>
        </div>
        <Search handleSearch={handleSearch} />
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ textAlign: "center" }}>Made by Devlyn</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <img
              src={"twitter-logo.svg"}
              style={{ width: "45px", height: "45px", marginRight: "20px" }}
            ></img>
            <img
              src={"github-logo.svg"}
              style={{ width: "45px", height: "45px" }}
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
