import React, { FC, useState } from "react";
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

const Timeline: FC<{
  data: any[][];
  loading: boolean;
  address: string;
  loadMore: () => void;
}> = ({ data, loading, address, loadMore }) => {
  return (
    <VerticalTimeline className="vertical-timeline-custom-line">
      {data.map((grouping) => {
        const event = grouping[0];
        const nft = event.asset;
        const bought =
          event.to_account.address.toUpperCase() === address.toUpperCase();

        if (grouping.length === 1) {
          return grouping.map((event) => (
            <TimeLineEntry
              key={event.transaction.transaction_hash}
              time={event.transaction.timestamp}
              title={bought ? "Minted or Bought" : "Sold or Transfered"}
              subTitle="from"
              imgUrl={nft.image_url}
              text={nft.description}
              titleLinkText={nft.name}
              titleLink={`https://opensea.io/assets/${nft.asset_contract.address}/${nft.token_id}`}
              subTitleLinkText={nft.collection.name}
              subTitleLink={
                nft.collection.external_url ??
                `https://opensea.io/collection/${nft.collection.name}}`
              }
            />
          ));
        } else {
          return <TimeLineGrouping grouping={grouping} address={address} />;
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

const TimeLineGrouping: FC<{ grouping: any[]; address: string }> = ({
  grouping,
  address,
}) => {
  const [expanded, setExpanded] = useState(false);
  const event = grouping[0];
  const nft = event.asset;
  const bought =
    event.to_account.address.toUpperCase() === address.toUpperCase();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <TimeLineEntry
        key={event.transaction.transaction_hash}
        time={event.transaction.timestamp}
        title={
          (bought ? "Minted or Bought" : "Sold or Transfered") +
          " " +
          grouping.length +
          " NFTs"
        }
        subTitle="from"
        imgUrl={nft.collection.featured_image_url}
        text={nft.collection.description}
        subTitleLinkText={nft.collection.name}
        subTitleLink={
          nft.collection.external_url ??
          `https://opensea.io/collection/${nft.collection.name}}`
        }
      />
      {expanded ? (
        <>
          {grouping.map((event) => {
            const nft = event.asset;
            const bought =
              event.to_account.address.toUpperCase() === address.toUpperCase();

            return (
              <TimeLineEntry
                key={event.transaction.transaction_hash}
                time={event.transaction.timestamp}
                title={bought ? "Minted or Bought" : "Sold or Transfered"}
                subTitle="from"
                imgUrl={nft.image_url}
                text={nft.description}
                titleLinkText={nft.name}
                titleLink={`https://opensea.io/assets/${nft.asset_contract.address}/${nft.token_id}`}
                subTitleLinkText={nft.collection.name}
                subTitleLink={
                  nft.collection.external_url ??
                  `https://opensea.io/collection/${nft.collection.name}}`
                }
              />
            );
          })}
        </>
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

const TimeLineEntry: FC<{
  time: string;
  title: string;
  subTitle: string;
  imgUrl: string;
  text: string;
  titleLinkText?: string;
  titleLink?: string;
  subTitleLinkText?: string;
  subTitleLink?: string;
}> = ({
  time,
  title,
  subTitle,
  imgUrl,
  text,
  titleLinkText,
  titleLink,
  subTitleLinkText,
  subTitleLink,
}) => (
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
      {title}{" "}
      {titleLink ? (
        <a
          href={titleLink}
          style={{
            color: "rgb(33, 150, 243)",
            textDecoration: "underline",
          }}
        >
          {titleLinkText}
        </a>
      ) : null}
    </h3>
    <h4 className="vertical-timeline-element-subtitle">
      {subTitle}{" "}
      {subTitleLink ? (
        <a
          href={subTitleLink}
          style={{
            color: "rgb(33, 150, 243)",
            textDecoration: "underline",
          }}
        >
          {subTitleLinkText}{" "}
        </a>
      ) : null}
    </h4>
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
