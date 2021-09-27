import React, { FC, ReactNode, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  AiOutlineEllipsis,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import { NFTEvent } from "../utils/data";

const weiToEth = (wei: number): number => {
  return wei / Math.pow(10, 18);
};

const groupEvents = (events: NFTEvent[]): NFTEvent[][] => {
  let prevCollection: string;
  let prevAction: string;
  let prevBucket: NFTEvent[];
  const groups: NFTEvent[][] = [];

  for (const event of events) {
    const collection = event.collectionName;
    const action = event.action;

    if (prevCollection !== collection || prevAction !== action) {
      prevBucket = [event];
      groups.push(prevBucket);
    } else {
      prevBucket.push(event);
    }

    prevCollection = collection;
    prevAction = action;
  }

  return groups;
};

const Timeline: FC<{
  data: NFTEvent[];
  loading: boolean;
  address: string;
  loadMore: () => void;
}> = ({ data, loading, loadMore }) => {
  const groupings = groupEvents(data);

  return (
    <VerticalTimeline className="vertical-timeline-custom-line">
      {groupings.map((grouping) => {
        if (grouping.length > 3) {
          return <TimeLineGrouping grouping={grouping} />;
        } else {
          return <TimeLineEvents grouping={grouping} />;
        }
      })}

      <VerticalTimelineElement
        iconOnClick={loadMore}
        iconStyle={{
          background: "green",
          color: "#fff",
          border: "3px solid black",
          boxShadow: "none",
        }}
        icon={loading ? <AiOutlineEllipsis /> : <AiFillCaretDown />}
      />
    </VerticalTimeline>
  );
};

const TimeLineGrouping: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => {
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
      <TimeLineEntry
        key={event.key}
        time={event.date}
        title={`${event.action} ${grouping.length} NFTs${
          sum ? " for a total of " + weiToEth(sum) + " eth" : ""
        }`}
        subTitle={
          <>
            from{" "}
            <a
              href={event.collectionUrl}
              style={{
                color: "rgb(33, 150, 243)",
                textDecoration: "underline",
              }}
            >
              {event.collectionName}{" "}
            </a>
          </>
        }
        imgUrl={event.collectionImgUrl}
        text={event.collectionDescription}
      />
      {expanded ? (
        <TimeLineEvents grouping={grouping} />
      ) : (
        <VerticalTimelineElement
          iconOnClick={handleClick}
          iconStyle={{
            background: "red",
            color: "#fff",
            border: "3px solid black",
            boxShadow: "none",
          }}
          icon={expanded ? <AiFillCaretUp /> : <AiFillCaretDown />}
          date={"View All"}
        />
      )}
    </>
  );
};

const TimeLineEvents: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => (
  <>
    {grouping.map((event) => (
      <TimeLineEntry
        key={event.key}
        time={event.date}
        title={
          <>
            {event.action + " "}
            <a
              href={event.assetUrl}
              style={{
                color: "rgb(33, 150, 243)",
                textDecoration: "underline",
              }}
            >
              {event.assetName}
            </a>
            {event.price ? " for " + weiToEth(event.price) + " eth" : null}
          </>
        }
        subTitle={
          <>
            from{" "}
            <a
              href={event.collectionUrl}
              style={{
                color: "rgb(33, 150, 243)",
                textDecoration: "underline",
              }}
            >
              {event.collectionName}{" "}
            </a>
          </>
        }
        imgUrl={event.assetImgUrl}
        text={event.assetDescription}
      />
    ))}
  </>
);

const TimeLineEntry: FC<{
  time: string;
  title: ReactNode;
  subTitle: ReactNode;
  imgUrl: string;
  text: string;
}> = ({ time, title, subTitle, imgUrl, text }) => (
  <VerticalTimelineElement
    contentStyle={{
      border: "3px solid black",
      boxShadow: "none",
    }}
    contentArrowStyle={{ borderRight: "9px solid  black" }}
    className="vertical-timeline-element--work"
    date={time}
    iconStyle={{
      background: "rgb(33, 150, 243)",
      color: "#fff",
      border: "4px solid black",
      boxShadow: "none",
    }}
  >
    <h3
      className="vertical-timeline-element-title"
      style={{ marginBottom: "5px" }}
    >
      {title}
    </h3>
    <h4 className="vertical-timeline-element-subtitle">{subTitle}</h4>
    <NftDisplay description={text} imgUrl={imgUrl} />
  </VerticalTimelineElement>
);

const NftDisplay: FC<{ description: string; imgUrl: string }> = ({
  description,
  imgUrl,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      margin: "20px 0px",
      wordBreak: "break-all",
    }}
  >
    <img style={{ borderRadius: "10px", maxHeight: "50vh" }} src={imgUrl}></img>
    <p>{description}</p>
  </div>
);

export default Timeline;
