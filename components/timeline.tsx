import React, { FC, useState } from "react";
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
      <EventCard key={event.key} imgUrl={event.collectionImgUrl}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>
            {event.action} {grouping.length} NFTs{" "}
          </h3>
          <h4 className={styles.subTitle}>
            <a href={event.collectionUrl} target="_blank">
              {event.collectionName}{" "}
            </a>
          </h4>
        </div>
        <div className={styles.detailContainer} style={{ marginTop: "10px" }}>
          <div>
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
          <div
            style={{
              padding: "10px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
            }}
            onClick={handleClick}
          >
            {" "}
            {expanded ? "Hide" : "Show"}
          </div>
        </div>
      </EventCard>
      {expanded ? <EventList grouping={grouping}></EventList> : null}
    </>
  );
};

const EventList: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => (
  <>
    {grouping.map((event) => (
      <EventCard key={event.key} imgUrl={event.assetImgUrl}>
        <div className={styles.titleContainer}>
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
        </div>
        <div className={styles.detailContainer} style={{ marginTop: "10px" }}>
          <div>
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
        </div>
      </EventCard>
    ))}
  </>
);

const EventCard: FC<{
  imgUrl: string;
}> = ({ children, imgUrl }) => (
  <div className={styles.eventCard}>
    <img className={styles.eventImg} src={imgUrl} loading="lazy"></img>
    {children}
  </div>
);

export default Timeline;
