import { FC, useState } from "react";
import styles from "../styles/search.module.css";
import { CollectionInfo } from "../utils/data";
import { CollectionSearch } from "./collectionSearch";

export const Filter: FC<{
  address: string;
  startDate: string;
  endDate: string;
  collectionSlug: string;
  handleStartDateChange: (startDate: string) => void;
  handleEndDateChange: (endDate: string) => void;
  handleCollectionChange: (collectionSlug: string) => void;
}> = ({
  address,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  handleCollectionChange,
}) => {
  const [collection, setCollection] = useState<CollectionInfo>(null);

  const onStartDateChange = (event) => {
    handleStartDateChange(event.target.value);
  };

  const onEndDateChange = (event) => {
    handleEndDateChange(event.target.value);
  };

  const onCollectionChange = (option: CollectionInfo) => {
    setCollection(option);
    handleCollectionChange(option ? option.slug : "");
  };

  return (
    <div className={styles.controlsContainer}>
      <div style={{ flex: 1, minWidth: "200px", maxWidth: "600px" }}>
        <label>
          Collection:
          <br />
          <div style={{ marginTop: "3px" }}>
            <CollectionSearch
              value={collection}
              onChange={onCollectionChange}
              address={address}
            />
          </div>
        </label>
      </div>
      <label>
        from:
        <br />
        <input
          style={{
            marginTop: "3px",
            height: "38px",
            borderRadius: "10px",
            paddingLeft: "8px",
            fontSize: "16px",
            paddingRight: "4px",
          }}
          type="date"
          placeholder="from"
          value={startDate}
          onChange={onStartDateChange}
        />
      </label>
      <label>
        until:
        <br />
        <input
          style={{
            marginTop: "3px",
            height: "38px",
            borderRadius: "10px",
            paddingLeft: "8px",
            fontSize: "16px",
            paddingRight: "4px",
          }}
          type="date"
          placeholder="from"
          value={endDate}
          onChange={onEndDateChange}
        />
      </label>
    </div>
  );
};
