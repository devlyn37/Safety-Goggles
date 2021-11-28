import { FC } from "react";
import ContentLoader from "react-content-loader";
import { CollectionInfo } from "../utils/data";
import styles from "../styles/header.module.css";
import { addDefaultSrc } from "../utils/misc";

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
  loadingWallet,
  loadingCollection,
  errorMsg,
}) => {
  const preHydrate = ens === "" && address === "";
  const errorContent = <div className={styles.errorContainer}>{errorMsg}</div>;

  const regularContent = (
    <>
      <div className={styles.nameContainer}>
        {loadingWallet || preHydrate ? (
          <Placeholder />
        ) : (
          <>
            {ens && <h1 className={styles.ens}>{ens}</h1>}
            <div className={styles.address}>{address}</div>
          </>
        )}
      </div>
      {collection ? (
        <div className={styles.collection}>
          {loadingCollection ? (
            <CollectionPlaceholder />
          ) : (
            <>
              {" "}
              <img
                src={collection.imgUrl ?? "/no-image.jpeg"}
                onError={addDefaultSrc}
                className={styles.collectionImg}
                alt={`Collection Image for ${collection.name}`}
              />
              <div className={styles.collectionTextContainer}>
                <h3 className={styles.collectionName}>{collection.name}</h3>
                <div className={styles.collectionSubText}>
                  {`Floor: ${collection.floor} ETH, Holding: ${collection.holding}`}
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );

  return (
    <div className={styles.headingContainer}>
      {errorMsg ? errorContent : regularContent}
    </div>
  );
};

// To-do upon final styling update: make these close to actual

const CollectionPlaceholder: FC = (props) => {
  return (
    <ContentLoader
      uniqueKey="header-col"
      style={{ width: "396px", height: "70px" }}
      speed={2}
      viewBox="0 0 396 70"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="35" cy="35" r="35" />
      <rect x="80" y="10" rx="15" ry="15" width="170" height="30" />
      <rect x="80" y="45" rx="4" ry="4" width="250" height="15" />
    </ContentLoader>
  );
};

const Placeholder: FC = (props) => {
  return (
    <ContentLoader
      uniqueKey="header"
      style={{ width: "407px", height: "93px" }}
      speed={2}
      viewBox="0 0 407 93"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="10" rx="15" ry="15" width="250" height="36" />
      <rect x="0" y="63" rx="10" ry="10" width="407" height="30" />
    </ContentLoader>
  );
};
