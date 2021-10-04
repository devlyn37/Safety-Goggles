import React, { FC, ReactNode, useState } from "react";
import { NFTEvent } from "../utils/data";
import { groupEvents } from "../utils/data";
import styles from "../styles/timeline.module.css";

const weiToEth = (wei: number): number => {
  return wei / Math.pow(10, 18);
};

const Timeline: FC<{
  data: NFTEvent[];
  loading: boolean;
  address: string;
  loadMore: () => void;
}> = ({ data, loading, loadMore }) => {
  if (!data.length) {
    return <div>No Results</div>; // To-do expand this
  }

  const groupings = groupEvents(data);

  return (
    <>
      <div className={styles.eventGrid}>
        {groupings.map((grouping) => {
          if (grouping.length > 3) {
            return <EventGrouping key={grouping[0].key} grouping={grouping} />;
          } else {
            return <EventList key={grouping[0].key} grouping={grouping} />;
          }
        })}
      </div>
      <div className={styles.loadMoreButtonContainer} onClick={loadMore}>
        <button className={styles.loadMoreButton} onClick={loadMore}>
          {" "}
          {loading ? "Loading..." : "Load more"}
        </button>
      </div>
    </>
  );
};

const EventGrouping: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => {
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
      <Event
        key={event.key}
        imgUrl={event.collectionImgUrl}
        main={
          <>
            <h3 className={styles.title}>
              {event.action} {grouping.length} NFTs{" "}
            </h3>
            <h4 className={styles.subTitle}>
              <a href={event.collectionUrl} target="_blank">
                {event.collectionName}{" "}
              </a>
            </h4>
          </>
        }
        details={
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <div
              className={styles.detail}
              style={{
                marginBottom: "5px",
              }}
            >
              {sum ? (
                "Total: " + weiToEth(sum) + " ETH"
              ) : (
                <a
                  className={styles.link}
                  target="_blank"
                  href={"https://etherscan.io/tx/" + event.transactionHash}
                >
                  View on Etherscan
                </a>
              )}
            </div>
            <div className={styles.subDetail}>{event.date}</div>
          </div>
        }
      />
    </>
  );
};

const EventList: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => (
  <>
    {grouping.map((event) => (
      <Event
        key={event.key}
        main={
          <>
            <h3 className={styles.title}>
              {event.action}{" "}
              <a className={styles.link} target="_blank" href={event.assetUrl}>
                {event.assetName}
              </a>
            </h3>
            <h4 className={styles.subTitle}>
              <a target="_blank" href={event.collectionUrl}>
                {event.collectionName}{" "}
              </a>
            </h4>
          </>
        }
        details={
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "5px",
              }}
              className={styles.detail}
            >
              {event.action === "Bought" || event.action === "Sold" ? (
                weiToEth(event.price) + " ETH"
              ) : (
                <a
                  className={styles.link}
                  target="_blank"
                  href={"https://etherscan.io/tx/" + event.transactionHash}
                >
                  View on Etherscan
                </a>
              )}
            </div>
            <div className={styles.subDetail}>{event.date}</div>
          </div>
        }
        imgUrl={event.assetImgUrl}
      />
    ))}
  </>
);

const Event: FC<{
  main: ReactNode;
  details: ReactNode;
  imgUrl: string;
}> = ({ main, details, imgUrl }) => (
  <div className={styles.eventCard}>
    <img className={styles.eventImg} src={imgUrl}></img>
    <div className={styles.titleContainer}>{main}</div>
    <div className={styles.detailContainer}>{details}</div>
  </div>
);

export default Timeline;
