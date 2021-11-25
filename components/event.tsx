import { FC, useState } from "react";
import ContentLoader from "react-content-loader";
import { NFTEvent } from "../utils/data";
import styles from "../styles/event.module.css";
import { format } from "date-fns";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const weiToEth = (wei: number): number => {
  return wei / Math.pow(10, 18);
};

export const EventGrouping: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => {
  const [expanded, setExpanded] = useState(false);
  const event = grouping[0];
  const sum =
    event.action !== "Minted"
      ? grouping.map((e) => e.price).reduce((prev, curr) => prev + curr)
      : undefined;

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className={styles.eventCard} key={event.key}>
        <img
          className={styles.eventImg}
          src={event.collectionImgUrl}
          loading="lazy"
          alt={`Collection Image for ${event.collectionName}`}
        ></img>
        <div className={styles.imgOverlay}>
          <h4 className={styles.subTitle}>
            <a
              target="_blank"
              rel="noreferrer"
              href={event.collectionUrl}
              style={{
                display: "block",
                color: "white",
                fontWeight: 500,
              }}
            >
              {event.collectionName}
            </a>
          </h4>
        </div>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>
            {event.action} {grouping.length} NFTs{" "}
            {sum && "For " + weiToEth(sum) + " ETH"}
          </h3>
        </div>
        <div className={styles.detailContainer}>
          <div>
            <div className={styles.subDetail}>
              {format(new Date(event.date), "Pp")}
            </div>
          </div>
          <div>
            <div className={styles.groupButton} onClick={handleClick}>
              {" "}
              {expanded ? "Hide " : "Show "}
              {expanded ? (
                <FaAngleUp style={{ marginLeft: "4px" }} />
              ) : (
                <FaAngleDown style={{ marginLeft: "4px", marginTop: "2px" }} />
              )}
            </div>
          </div>
        </div>
      </div>
      {expanded ? <EventList grouping={grouping}></EventList> : null}
    </>
  );
};

export const EventList: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => (
  <>
    {grouping.map((event) => (
      <Event event={event} key={event.key} />
    ))}
  </>
);

export const Event: FC<{ event: NFTEvent }> = ({ event }) => (
  <div className={styles.eventCard} key={event.key}>
    <img
      className={styles.eventImg}
      src={event.assetImgUrl}
      loading="lazy"
      alt={`image for ${event.assetName}`}
    ></img>
    <div className={styles.imgOverlay}>
      <h4 className={styles.subTitle}>
        <a
          target="_blank"
          rel="noreferrer"
          href={event.assetUrl}
          style={{
            display: "block",
            color: "white",
            fontWeight: 500,
          }}
        >
          {event.assetName}
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href={event.collectionUrl}
          style={{ fontWeight: 300, fontSize: "12px", color: "lightgray" }}
        >
          {event.collectionName}{" "}
        </a>
      </h4>
    </div>

    <div className={styles.titleContainer}>
      <h3 className={styles.title}>
        {event.action}{" "}
        {event.action === "Bought" || event.action === "Sold"
          ? ` for ${weiToEth(event.price)} ETH`
          : null}
      </h3>
    </div>
    <div className={styles.detailContainer}>
      <div>
        <div className={styles.subDetail}>
          {format(new Date(event.date), "Pp")}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <a
          href={"https://etherscan.io/tx/" + event.transactionHash}
          target="_blank"
          rel="noreferrer"
          style={{ marginRight: "7px", display: "flex", alignItems: "center" }}
        >
          <img
            src={"/etherscan-logo-circle.svg"}
            className={styles.linkIcon}
            alt="Etherscan Logo"
          ></img>
        </a>
        <a
          href={event.assetUrl}
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={"/OpenSea-Logo-Blue.svg"}
            className={styles.linkIcon}
            alt="OpenSea Logo"
          ></img>
        </a>
      </div>
    </div>
  </div>
);

export const LoadingCard: FC = () => {
  return (
    <div className={styles.eventCard}>
      {/* Must expand with container */}
      <ContentLoader
        uniqueKey="loading-card-1"
        style={{
          borderRadius: "25px 25px 0px 0px",
          maxWidth: "100%",
          border: "2px solid #f2f2f2",
        }}
        speed={2}
        viewBox="0 0 400 402"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="400" height="402" />
      </ContentLoader>

      {/* Buffer */}
      <div
        style={{
          flex: "1",
          borderRight: "2px solid #f2f2f2",
          borderLeft: "2px solid #f2f2f2",
        }}
      ></div>

      {/* Should have static height */}
      <div
        style={{
          padding: "20px 20px",
          borderRight: "2px solid #f2f2f2",
          borderLeft: "2px solid #f2f2f2",
          borderBottom: "2px solid #f2f2f2",
          borderRadius: "0px 0px 25px 25px",
        }}
      >
        <div
          style={{
            width: "95%",
            height: "28px",
            backgroundColor: "#f3f3f3",
            borderRadius: "10px",
          }}
        />
        <div
          style={{
            marginTop: "6px",
            width: "80%",
            height: "18px",
            backgroundColor: "#f3f3f3",
            borderRadius: "6px",
          }}
        />
        <div
          style={{
            marginTop: "40px",
            width: "65%",
            height: "18px",
            backgroundColor: "#f3f3f3",
            borderRadius: "6px",
          }}
        />
        <div
          style={{
            marginTop: "6px",
            width: "93%",
            height: "15px",
            backgroundColor: "#f3f3f3",
            borderRadius: "6px",
          }}
        />
      </div>
    </div>
  );
};
