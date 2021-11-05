import { FC } from "react";
import styles from "../styles/filter.module.css";
import { CollectionInfo } from "../utils/data";
import dynamic from "next/dynamic";
import ContentLoader from "react-content-loader";

const CollectionSearch = dynamic(
  () => import("./collectionSearch").then((mod) => mod.CollectionSearch),
  {
    loading: () => <CollectionPlaceholder />,
    ssr: false,
  }
);

export const Filter: FC<{
  disabled: boolean;
  collections: CollectionInfo[];
  startDate: string;
  endDate: string;
  loadingWallet: boolean;
  loadingCollections: boolean;
  collection: CollectionInfo;
  filter: "successful" | "transfer" | "";
  handleStartDateChange: (startDate: string) => void;
  handleEndDateChange: (endDate: string) => void;
  handleCollectionChange: (col: CollectionInfo) => void;
  handleFilterChange: (filter: string) => void;
  collectionErrorMsg: string;
}> = ({
  disabled,
  collections,
  startDate,
  endDate,
  loadingWallet,
  loadingCollections,
  collection,
  filter,
  handleStartDateChange,
  handleEndDateChange,
  handleCollectionChange,
  handleFilterChange,
  collectionErrorMsg,
}) => {
  const onStartDateChange = (event) => {
    handleStartDateChange(event.target.value);
  };

  const onEndDateChange = (event) => {
    handleEndDateChange(event.target.value);
  };

  const handleBuySellChange = () => {
    handleFilterChange(filter === "successful" ? "" : "successful");
  };

  const handleMintTransChange = () => {
    handleFilterChange(filter === "transfer" ? "" : "transfer");
  };

  const checks = (
    <div className={styles.item}>
      <div className={styles.label}>Activity Type</div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <label
          style={{
            marginTop: "4px",
            height: "38px",
            borderRadius: "10px",
            paddingLeft: "8px",
            fontSize: "16px",
            paddingRight: "12px",
            color: "dimgray",
            backgroundColor: "#f2f2f2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "20px",
          }}
        >
          <input
            disabled={disabled}
            type="checkbox"
            checked={filter === "successful"}
            onChange={handleBuySellChange}
            style={{ marginRight: "8px" }}
          />
          Buy and Sell
        </label>
        <label
          style={{
            marginTop: "4px",
            height: "38px",
            borderRadius: "10px",
            paddingLeft: "8px",
            fontSize: "16px",
            paddingRight: "12px",
            color: "dimgray",
            backgroundColor: "#f2f2f2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            disabled={disabled}
            type="checkbox"
            checked={filter === "transfer"}
            onChange={handleMintTransChange}
            style={{ marginRight: "8px" }}
          />
          Mint and Transfer
        </label>
      </div>
    </div>
  );

  const dates = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
      className={styles.item}
    >
      <div className={styles.label}>Date Range</div>

      <label>
        <span
          style={{ color: "dimgray", display: "inline-block", width: "55px" }}
        >
          From
        </span>
        <input
          style={{
            marginTop: "4px",
            height: "38px",
            borderRadius: "10px",
            paddingLeft: "8px",
            fontSize: "16px",
            paddingRight: "4px",
            color: "dimgray",
            border: "none",
            backgroundColor: "#f2f2f2",
            marginBottom: "20px",
          }}
          disabled={disabled}
          type="date"
          placeholder="from"
          value={startDate}
          onChange={onStartDateChange}
        />
      </label>
      <label>
        <span
          style={{ color: "dimgray", display: "inline-block", width: "55px" }}
        >
          To
        </span>
        <input
          style={{
            marginTop: "4px",
            height: "38px",
            borderRadius: "10px",
            paddingLeft: "8px",
            fontSize: "16px",
            paddingRight: "4px",
            border: "none",
            color: "dimgray",
            backgroundColor: "#f2f2f2",
          }}
          disabled={disabled}
          type="date"
          placeholder="from"
          value={endDate}
          onChange={onEndDateChange}
        />
      </label>
    </div>
  );

  return (
    <div className={styles.container}>
      {collectionErrorMsg && (
        <div className={styles.errorContainer}>{collectionErrorMsg}</div>
      )}
      <label className={styles.item}>
        <div className={styles.label}>Collection</div>
        <div style={{ marginTop: "5px" }}>
          <CollectionSearch
            disabled={disabled}
            collections={collections}
            loading={loadingCollections}
            value={collection}
            onChange={handleCollectionChange}
          />
        </div>
      </label>
      {dates}
      {checks}
    </div>
  );
};

const CollectionPlaceholder: FC = (props) => {
  return (
    <ContentLoader
      style={{ width: "355px", height: "38px" }}
      speed={2}
      viewBox="0 0 355 38"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx="10" ry="10" width="355" height="38" />
    </ContentLoader>
  );
};
