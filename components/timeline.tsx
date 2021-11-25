import React, { FC, useState, useEffect } from "react";
import { NFTEvent, getEvents, groupEvents } from "../utils/data";
import styles from "../styles/timeline.module.css";
import { SearchCriteria } from "../pages/wallet/[wallet]";
import { subDays, differenceInDays, format } from "date-fns";
import { VerticalTimeline, Interval } from "./verticalTimeline";
import InfiniteScroll from "react-infinite-scroll-component";
import { EventGrouping, EventList, LoadingCard } from "./event";

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
  const [data, setData] = useState<NFTEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");

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
          setData((data) => [...data, ...events]);
        } else {
          setData(events);
        }

        setHasMore(moreData);
      } catch (e) {
        setErrorMsg(
          "There was an issue loading OpenSea data, please try again later."
        );
        throw e;
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
  const preHyrate = search.ens === "" && search.address === "";

  if (externalErrorMsg || errorMsg) {
    return (
      <UserInfo
        src="/clumsy.svg"
        message={externalErrorMsg ? externalErrorMsg : errorMsg}
      />
    );
  }

  if (preHyrate || loadingWallet || loadingFirstPage) {
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

const UserInfo: FC<{ src: string; message: string }> = ({ src, message }) => (
  <div className={styles.infoContainer}>
    <div className={styles.infoRestrictor}>
      <img
        src={src}
        className={styles.infoImg}
        alt={"cartoon image to represent the message"}
      />
      <p className={styles.infoText}>{message}</p>
    </div>
  </div>
);

export default Timeline;
