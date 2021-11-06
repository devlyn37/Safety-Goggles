import { FC, useState } from "react";
import ContentLoader from "react-content-loader";
import { NFTEvent } from "../utils/data";
import styles from "../styles/event.module.css";

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
        <div className={styles.detailContainer}>
          <div>
            <div className={styles.detail}>
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
          <div className={styles.groupButton} onClick={handleClick}>
            {" "}
            {expanded ? "Hide" : "Show"}
          </div>
        </div>
      </EventCard>
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
  <EventCard imgUrl={event.assetImgUrl}>
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
    <div className={styles.detailContainer}>
      <div>
        <div className={styles.detail}>
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
);

const EventCard: FC<{
  imgUrl: string;
  boxShadow?: boolean;
}> = ({ children, imgUrl }) => (
  <div className={styles.eventCard}>
    <img className={styles.eventImg} src={imgUrl} loading="lazy"></img>
    <div className={styles.eventDetails}>{children}</div>
  </div>
);

// To-do take another look at this
export const LoadingCard: FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      {/* Must expand with container */}
      <ContentLoader
        uniqueKey="loading-card-1"
        style={{ borderRadius: "25px 25px 0px 0px", maxWidth: "100%" }}
        speed={2}
        viewBox="0 0 400 402"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="592" height="402" />
      </ContentLoader>

      {/* Buffer */}
      <div style={{ flex: "1" }}></div>

      {/* Should have static height */}
      <ContentLoader
        uniqueKey="loading-card-2"
        style={{
          borderRadius: "25px",
          height: "170px",
          width: "375px",
        }}
        speed={2}
        viewBox="0 0 400 180"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="15" rx="5" ry="5" width="350" height="32" />
        <rect x="0" y="55" rx="5" ry="5" width="220" height="21" />
        <rect x="0" y="105" rx="5" ry="5" width="220" height="21" />
        <rect x="0" y="130" rx="5" ry="5" width="281" height="13" />
      </ContentLoader>
    </div>
  );
};
