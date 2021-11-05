import React, { FC, useState, useEffect } from "react";
import { NFTEvent, getEvents, groupEvents } from "../utils/data";
import styles from "../styles/timeline.module.css";
import ContentLoader from "react-content-loader";
import { SearchCriteria } from "../pages/wallet/[wallet]";
import { subDays, differenceInDays, format } from "date-fns";
import { VerticalTimeline, Interval } from "./verticalTimeline";
import InfiniteScroll from "react-infinite-scroll-component";

const weiToEth = (wei: number): number => {
  return wei / Math.pow(10, 18);
};

const groupAndOrganizeTimeline = (
  events: NFTEvent[]
): Map<string, NFTEvent[][]> => {
  // event times are in UTC
  const buckets: NFTEvent[][] = [];
  const now = new Date();

  for (const event of events) {
    const eventDate = new Date(event.date);
    const diff = differenceInDays(now, eventDate);
    const bucketIndex = Math.floor(diff / 7);

    if (buckets[bucketIndex]) {
      buckets[bucketIndex].push(event);
    } else {
      buckets[bucketIndex] = [event];
    }
  }

  const map = new Map<string, NFTEvent[][]>();
  buckets.forEach((bucket: NFTEvent[], i) => {
    if (!bucket) {
      return;
    }

    const dateFormat = "MMM d, yyyy";

    const rangeString = `${format(subDays(now, (i + 1) * 7), dateFormat)} - ${
      i === 0 ? "Today" : format(subDays(now, i * 7), dateFormat)
    }`;

    map.set(rangeString, groupEvents(bucket));
  });

  return map;
};

const GROUPING_MIN = 3;
const PAGE_LENGTH = 120;

const Timeline: FC<{
  search: SearchCriteria;
  loadMore: () => void;
  loadingWallet: boolean;
  externalErrorMsg: string;
}> = ({ search, loadMore, loadingWallet, externalErrorMsg }) => {
  const [data, setData] = useState<NFTEvent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [events, moreData] = await getEvents(
          search.address,
          PAGE_LENGTH,
          PAGE_LENGTH * (search.page - 1),
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

        setHasMore(moreData);
        setErrorMsg("");
      } catch (e) {
        setErrorMsg(
          "There was an issue loading OpenSea data, please try again later."
        );
      }

      setLoading(false);
    };

    if (search.address) {
      loadData();
    }
  }, [search]);

  const loadingFirstPage = loading && search.page === 1;
  const loadingMore = loading && search.page > 1;
  const noResults = data && !loading && !data.length;

  if (externalErrorMsg || errorMsg) {
    return (
      <UserInfo
        src="/clumsy.svg"
        message={externalErrorMsg ? externalErrorMsg : errorMsg}
      />
    );
  }

  if (data === null || loadingWallet || loadingFirstPage) {
    return (
      <VerticalTimeline>
        <Interval interval={"Today - ..."}>
          <div className={styles.eventGrid}>
            <LoadingGroup />
          </div>
        </Interval>
      </VerticalTimeline>
    );
  }

  if (noResults) {
    return <UserInfo src="/sitting.svg" message={"No Results Found"} />;
  }

  const timelineData: Map<string, NFTEvent[][]> =
    groupAndOrganizeTimeline(data);
  const keys = Array.from(timelineData.keys());

  return (
    <VerticalTimeline>
      <InfiniteScroll
        style={{ overflow: "visible" }} // For the box shadow
        dataLength={data.length}
        next={loadMore}
        hasMore={hasMore}
        loader={null}
        scrollThreshold={0.97}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>This is the beginning for {search.ens ?? search.address}!</b>
          </p>
        }
      >
        {keys.map((key: string, i: number) => {
          const groupings = timelineData.get(key);

          return (
            <Interval interval={key} key={key}>
              <div className={styles.eventGrid}>
                {groupings.map((grouping, i) => {
                  return grouping.length > GROUPING_MIN ? (
                    <EventGrouping
                      key={grouping[0].key + i}
                      grouping={grouping}
                    />
                  ) : (
                    <EventList key={grouping[0].key + i} grouping={grouping} />
                  );
                })}

                {loadingMore && i === keys.length - 1 ? <LoadingGroup /> : null}
              </div>
            </Interval>
          );
        })}
      </InfiniteScroll>
    </VerticalTimeline>
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
      <Event event={event} key={event.key} />
    ))}
  </>
);

const Event: FC<{ event: NFTEvent }> = ({ event }) => (
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
);

const EventCard: FC<{
  imgUrl: string;
  boxShadow?: boolean;
}> = ({ children, imgUrl }) => (
  <div
    className={styles.eventCard}
    style={
      {
        //border: "2px solid #f2f2f2",
      }
    }
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
        borderBottom: "2px solid #f2f2f2",
        borderLeft: "2px solid #f2f2f2",
        borderRight: "2px solid #f2f2f2",
      }}
    >
      {children}
    </div>
  </div>
);

const LoadingGroup: FC = () => (
  <>
    <LoadingCard />
    <LoadingCard />
    <LoadingCard />
    <LoadingCard />
    <LoadingCard />
    <LoadingCard />
  </>
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

const UserInfo: FC<{ src: string; message: string }> = ({ src, message }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    }}
  >
    <div style={{ width: "400px" }}>
      <img src={src} style={{ width: "100%" }} />
      <p
        style={{
          fontSize: "20px",
          color: "#000000B8",
          textAlign: "center",
        }}
      >
        {message}
      </p>
    </div>
  </div>
);

export default Timeline;
