import { FC, useState, useRef } from "react";
import ContentLoader from "react-content-loader";
import { NFTEvent } from "../utils/data";
import styles from "../styles/event.module.css";
import { format } from "date-fns";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { AddressContainer } from "./AddressContainer";
import { formatEthFromWei, addDefaultSrc, trunicate } from "../utils/misc";
import useOnScreen from "../hooks/useOnScreen";

export const EventGrouping: FC<{ grouping: NFTEvent[] }> = ({ grouping }) => {
  const [expanded, setExpanded] = useState(false);
  const event = grouping[0];
  const sum =
    event.action === "Bought" || event.action === "Sold"
      ? grouping.map((e) => e.price).reduce((prev, curr) => prev + curr)
      : undefined;

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const groupButton = (
    <div className={styles.groupButton} onClick={handleClick}>
      {" "}
      {expanded ? "Hide " : "Show "}
      {expanded ? (
        <FaAngleUp style={{ marginLeft: "4px" }} />
      ) : (
        <FaAngleDown style={{ marginLeft: "4px", marginTop: "2px" }} />
      )}
    </div>
  );

  return (
    <>
      <div className={styles.eventCard} key={event.key}>
        <div className={styles.imgContainer}>
          <img
            className={styles.eventImg}
            onError={addDefaultSrc}
            src={event.collectionImgUrl}
            loading="lazy"
            alt={`Collection Image for ${event.collectionName}`}
          ></img>
        </div>
        <div className={styles.imgOverlay}>
          <h4 className={styles.nameLabel}>
            <a
              target="_blank"
              rel="noreferrer"
              href={event.collectionUrl}
              className={styles.nameLabelLink}
            >
              {event.collectionName}
            </a>
          </h4>
        </div>
        <div className={styles.titleContainer}>
          <h3 className={`${styles.titleItem}`}>
            {event.action} {grouping.length} NFTs{" "}
          </h3>
          {sum && (
            <h3 className={`${styles.priceDesc} ${styles.titleItem}`}>
              {"for"}
              <div className={styles.priceContainer}>
                <img
                  src="/ethereum_icon.svg"
                  className={styles.ethIcon}
                  alt="Ethereum Icon"
                />
                {`${formatEthFromWei(sum)}`}
              </div>
            </h3>
          )}
        </div>
        <div className={styles.spaceBuffer} />
        <div className={styles.detailContainer}>
          <div className={styles.subDetail}>
            {format(new Date(event.date), "Pp")}
          </div>
          {groupButton}
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

export const Event: FC<{ event: NFTEvent }> = ({ event }) => {
  // Keep track of when this compononent on the screen to resolve ens
  const ref = useRef();
  const isVisible = useOnScreen(ref);

  const getTitle = (event: NFTEvent): string => {
    let title = event.action;

    if (
      event.action === "Bought" ||
      event.action === "Received" ||
      event.action === "Minted"
    ) {
      title += " from ";
    } else {
      title += " to ";
    }

    return title;
  };

  const otherAddress =
    event.action === "Bought" ||
    event.action === "Received" ||
    event.action === "Minted"
      ? event.from
      : event.to;

  return (
    <div ref={ref} className={styles.eventCard} key={event.key}>
      <div className={styles.imgContainer}>
        <img
          className={styles.eventImg}
          src={event.assetImgUrl}
          onError={addDefaultSrc}
          loading="lazy"
          alt={`image for ${event.assetName}`}
        ></img>
      </div>
      <div className={styles.imgOverlay}>
        <h4 className={styles.nameLabel}>
          <a
            target="_blank"
            rel="noreferrer"
            href={event.assetUrl}
            className={styles.nameLabelLink}
          >
            {trunicate(event.assetName, 80)}
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href={event.collectionUrl}
            className={styles.subLabelLink}
          >
            {trunicate(event.collectionName, 50)}{" "}
          </a>
        </h4>
      </div>
      <div className={styles.eventDetails}>
        <div className={styles.titleContainer}>
          <h3 className={`${styles.title} ${styles.titleItem}`}>
            {getTitle(event)}
          </h3>
          <div className={styles.titleItem}>
            <AddressContainer
              address={otherAddress}
              shouldResolveENS={isVisible}
            />
          </div>
          {(event.action === "Sold" || event.action === "Bought") && (
            <h3 className={`${styles.priceDesc} ${styles.titleItem}`}>
              {"for"}
              <div className={styles.priceContainer}>
                <img
                  src="/ethereum_icon.svg"
                  className={styles.ethIcon}
                  alt="Ethereum Icon"
                />
                {`${formatEthFromWei(event.price)}`}
              </div>
            </h3>
          )}
        </div>
        <div className={styles.spaceBuffer} />
        <div className={styles.detailContainer}>
          <div className={styles.subDetail}>
            {format(new Date(event.date), "Pp")}
          </div>
          <div className={styles.iconContainer}>
            <a
              href={"https://etherscan.io/tx/" + event.transactionHash}
              target="_blank"
              rel="noreferrer"
              className={styles.linkIconContainer}
              style={{ marginRight: "7px" }}
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
              className={styles.linkIconContainer}
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
    </div>
  );
};

export const LoadingCard: FC = () => {
  return (
    <div className={styles.eventCard}>
      {/* Must expand with container */}
      <ContentLoader
        uniqueKey="loading-card-1"
        style={{
          borderRadius: "25px 25px 0px 0px",
          maxWidth: "100%",
          borderBottom: "var(--soft-border)",
        }}
        speed={2}
        viewBox="0 0 400 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="400" height="400" />
      </ContentLoader>

      {/* Should have static height */}
      <div
        style={{
          padding: "15px 20px",
          flex: 1,
        }}
      >
        <div
          style={{
            width: "95%",
            height: "22px",
            backgroundColor: "#f3f3f3",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            marginTop: "8px",
            width: "75%",
            height: "22px",
            backgroundColor: "#f3f3f3",
            borderRadius: "8px",
          }}
        />
      </div>
      <div
        style={{
          padding: "12px 20px",
          borderTop: "var(--soft-border)",
          borderRadius: "0px 0px 25px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "55%",
            height: "15px",
            backgroundColor: "#f3f3f3",
            borderRadius: "6px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              height: "24px",
              width: "24px",
              borderRadius: "50%",
              backgroundColor: "#f3f3f3",
              marginRight: "7px",
            }}
          />
          <div
            style={{
              height: "24px",
              width: "24px",
              borderRadius: "50%",
              backgroundColor: "#f3f3f3",
            }}
          />
        </div>
      </div>
    </div>
  );
};
