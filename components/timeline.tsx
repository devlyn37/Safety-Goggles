import React, { FC, useState, useEffect } from "react";
import { NFTEvent, getEvents } from "../utils/data";
import { groupEvents } from "../utils/data";
import styles from "../styles/timeline.module.css";
import ContentLoader from "react-content-loader";
import { useRouter } from "next/dist/client/router";
import { SearchCriteria } from "../pages";

const weiToEth = (wei: number): number => {
  return wei / Math.pow(10, 18);
};

const Timeline: FC<{
  search: SearchCriteria;
  loadMore: () => void;
  loadingWallet: boolean;
}> = ({ search, loadMore, loadingWallet }) => {
  const [data, setData] = useState<NFTEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();

  // Hook into routing for quicker loading response on first load
  useEffect(() => {
    setLoading(true);
  }, [router.query]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const events = await getEvents(
          search.address,
          60,
          60 * (search.page - 1),
          search.startDate,
          search.endDate,
          search.contractAddress,
          search.filter
        );

        if (search.page > 1) {
          setData([...data, ...events]);
        } else {
          setData(events);
        }
      } catch (e) {
        setErrorMsg(e.message);
      }

      setLoading(false);
    };

    if (search.address) {
      loadData();
    }
  }, [search]);

  if (errorMsg) {
    return <div>{errorMsg}</div>;
  }

  if ((loading && search.page === 1) || loadingWallet) {
    return (
      <div className={styles.eventGrid}>
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  if (!data.length) {
    return <div>No Results</div>; // To-do expand this
  }

  const groupings = groupEvents(data);

  return (
    <>
      <div className={styles.eventGrid}>
        {groupings.map((grouping, i) => {
          if (grouping.length > 3) {
            return (
              <EventGrouping key={grouping[0].key + i} grouping={grouping} />
            );
          } else {
            return <EventList key={grouping[0].key + i} grouping={grouping} />;
          }
        })}
        {loading && search.page > 1 ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : null}
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
        <div className={styles.detailContainer}>
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
              marginLeft: "10px",
              padding: "10px",
              backgroundColor: "black",
              color: "white",
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
  <div
    className={styles.eventCard}
    style={{ border: "4px solid black", boxShadow: "0.3rem 0.7rem black" }}
  >
    <img className={styles.eventImg} src={imgUrl} loading="lazy"></img>
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "stretch",
        backgroundColor: "white",
        color: "black",
        borderRadius: "0px 0px 25px 25px",
        borderTop: "4px solid black",
      }}
    >
      {children}
    </div>
  </div>
);

const LoadingCard: FC = () => {
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

export default Timeline;
