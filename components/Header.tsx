import { FC } from "react";
import ContentLoader from "react-content-loader";
import { CollectionInfo } from "../utils/data";
import styles from "../styles/header.module.css";
import { addDefaultSrc } from "../utils/misc";
import { AddressContainer } from "./AddressContainer";

export const Header: FC<{
  ens: string;
  address: string;
  startDate: string;
  endDate: string;
  collection: CollectionInfo | null;
  loadingCollection: boolean;
  loadingWallet: boolean;
  errorMsg: string;
}> = ({
  ens,
  address,
  collection,
  loadingCollection,
  loadingWallet,
  errorMsg,
}) => {
  const preHydrate = ens === "" && address === "";

  if (errorMsg) {
    return (
      <div className={styles.headingContainer}>
        <div className={styles.errorContainer}>{errorMsg}</div>
      </div>
    );
  }

  return (
    <div className={styles.headingContainer}>
      <div className={styles.nameContainer}>
        {loadingWallet || preHydrate ? (
          <Placeholder />
        ) : (
          <>
            {ens && <h1 className={styles.ens}>{ens}</h1>}
            <AddressContainer address={address} large />
          </>
        )}
      </div>
      {(loadingCollection || collection) && (
        <CollectionDisplay
          collection={collection}
          loading={loadingCollection}
        />
      )}
    </div>
  );
};

const CollectionDisplay: FC<{ collection: CollectionInfo; loading: boolean }> =
  ({ collection, loading }) => {
    if (loading) {
      return <CollectionPlaceholder />;
    }

    return (
      <div className={styles.collection}>
        <img
          src={collection.imgUrl ?? "/no-image.jpeg"}
          onError={addDefaultSrc}
          className={styles.collectionImg}
          alt={`Collection Image for ${collection.name}`}
        />
        <div className={styles.collectionTextContainer}>
          <h3 className={styles.collectionName}>{collection.name}</h3>
          <div className={styles.collectionStats}>
            <div className={styles.label}>
              {"Floor"}
              <div className={`${styles.priceContainer} ${styles.stat}`}>
                <img src="/ethereum_icon.svg" className={styles.ethIcon} />
                {collection.floor}
              </div>
            </div>
            <div className={styles.label}>
              {"Holds"}
              <div className={styles.stat}>{collection.holding}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

const CollectionPlaceholder: FC = (props) => {
  return (
    <div className={styles.collection}>
      <ContentLoader
        uniqueKey="header-col"
        style={{ width: "220px", height: "45px" }}
        speed={2}
        viewBox="0 0 220 45"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <circle cx="22.5" cy="22.5" r="22.5" />
        <rect x="60" y="0" rx="6" ry="6" width="160" height="20" />
        <rect x="60" y="25" rx="6" ry="6" width="145" height="20" />
      </ContentLoader>
    </div>
  );
};

const Placeholder: FC = (props) => {
  return (
    <ContentLoader
      uniqueKey="header"
      style={{ width: "208px", height: "93px" }}
      speed={2}
      viewBox="0 0 208 93"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="10" rx="15" ry="15" width="208" height="36" />
      <rect x="0" y="63" rx="10" ry="10" width="150" height="30" />
    </ContentLoader>
  );
};
