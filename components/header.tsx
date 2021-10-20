import { FC } from "react";
import ContentLoader from "react-content-loader";
import { CollectionInfo } from "../utils/data";
import styles from "../styles/header.module.css";

export const Header: FC<{
  ens: string;
  address: string;
  startDate: string;
  endDate: string;
  showFilters: boolean;
  collection: CollectionInfo | null;
  loadingCollection: boolean;
  loadingWallet: boolean;
  handleShowFilters: () => void;
}> = ({
  ens,
  address,
  collection,
  showFilters,
  loadingWallet,
  loadingCollection,
  handleShowFilters,
}) => {
  if (loadingWallet) {
    return <Placeholder />;
  }

  return (
    <div
      style={{
        padding: "20px 0px 15px 0px",
        borderBottom: "2px solid #F2F2F2",
      }}
    >
      <div style={{ marginBottom: "55px" }}>
        <div className={styles.headingContainer}>
          <div className={styles.name}>
            <h1 className={styles.heading}>{ens ? ens : address}</h1>
            <div
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "5px 10px",
                border: "1px solid lightgray",
                borderRadius: "10px",
                width: "100%",
                color: "dimgray",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {address}
            </div>
          </div>
          {loadingCollection ? (
            <ContentLoader
              style={{ width: "300px", height: "38px", borderRadius: "15px" }}
              speed={2}
              viewBox="0 0 300 38"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="0" y="0" rx="0" ry="0" width="10000" height="10000" />
            </ContentLoader>
          ) : collection ? (
            <CollectionDisplay collection={collection} />
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "10px",
            backgroundColor: "#F2F2F2",
            border: "none",
            fontSize: "16px",
            borderRadius: "15px",
          }}
          onClick={handleShowFilters}
        >
          {showFilters ? " Hide Filters" : "Filters"}
        </button>
        <div>Most Recent</div>
      </div>
    </div>
  );
};

const CollectionDisplay: FC<{
  collection: CollectionInfo;
}> = ({ collection }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      className={styles.collection}
    >
      <img src={collection.imgUrl} className={styles.collectionImg} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <h3 className={styles.collectionName}>{collection.name}</h3>
        <div style={{ color: "gray" }}>
          {`Floor: ${collection.floor} ETH, Holding: ${collection.holding}`}
        </div>
      </div>
    </div>
  );
};

const Placeholder: FC = (props) => {
  return (
    <div
      style={{
        marginBottom: "30px",
        marginTop: "20px",
        height: "38px",
        width: "300px",
        borderRadius: "25px",
      }}
    >
      <ContentLoader
        style={{ width: "100%", height: "100%", borderRadius: "15px" }}
        speed={2}
        viewBox="0 0 300 38"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="10000" height="10000" />
      </ContentLoader>
    </div>
  );
};
