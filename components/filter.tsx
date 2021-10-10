import { FC } from "react";
import styles from "../styles/search.module.css";
import { CollectionInfo } from "../utils/data";
import { CollectionSearch } from "./collectionSearch";
import ContentLoader from "react-content-loader";

export const Filter: FC<{
  address: string;
  startDate: string;
  endDate: string;
  loadingWallet: boolean;
  collection: CollectionInfo;
  handleStartDateChange: (startDate: string) => void;
  handleEndDateChange: (endDate: string) => void;
  handleCollectionChange: (col: CollectionInfo) => void;
}> = ({
  address,
  startDate,
  endDate,
  loadingWallet,
  collection,
  handleStartDateChange,
  handleEndDateChange,
  handleCollectionChange,
}) => {
  const onStartDateChange = (event) => {
    handleStartDateChange(event.target.value);
  };

  const onEndDateChange = (event) => {
    handleEndDateChange(event.target.value);
  };

  return (
    <div className={styles.controlsContainer}>
      {loadingWallet ? (
        <Placeholder />
      ) : (
        <div style={{ flex: 1, minWidth: "200px", maxWidth: "600px" }}>
          <label style={{ color: "dimgray" }}>
            Collection:
            <br />
            <div style={{ marginTop: "5px" }}>
              <CollectionSearch
                value={collection}
                onChange={handleCollectionChange}
                address={address}
              />
            </div>
          </label>
        </div>
      )}
      {loadingWallet ? (
        <Placeholder />
      ) : (
        <label style={{ color: "dimgray" }}>
          from:
          <br />
          <input
            style={{
              marginTop: "4px",
              height: "38px",
              borderRadius: "10px",
              paddingLeft: "8px",
              fontSize: "16px",
              paddingRight: "4px",
              color: "dimgray",
              border: "solid 1px lightgray",
              backgroundColor: "white",
            }}
            type="date"
            placeholder="from"
            value={startDate}
            onChange={onStartDateChange}
          />
        </label>
      )}
      {loadingWallet ? (
        <Placeholder />
      ) : (
        <label style={{ color: "dimgray" }}>
          until:
          <br />
          <input
            style={{
              marginTop: "4px",
              height: "38px",
              borderRadius: "10px",
              paddingLeft: "8px",
              fontSize: "16px",
              paddingRight: "4px",
              border: "solid 1px lightgray",
              color: "dimgray",
              backgroundColor: "white",
            }}
            type="date"
            placeholder="from"
            value={endDate}
            onChange={onEndDateChange}
          />
        </label>
      )}
    </div>
  );
};

const Placeholder: FC = (props) => {
  return (
    <div
      style={{
        height: "60px",
        width: "175px",
        borderRadius: "25px",
      }}
    >
      <ContentLoader
        style={{ width: "100%", height: "100%", borderRadius: "15px" }}
        speed={2}
        viewBox="0 0 175 60"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="10000" height="10000" />
      </ContentLoader>
    </div>
  );
};
