import { FC } from "react";
import ContentLoader from "react-content-loader";
import { CollectionInfo } from "../utils/data";

export const Header: FC<{
  ens: string;
  address: string;
  startDate: string;
  endDate: string;
  collection: CollectionInfo | null;
  loadingCollection: boolean;
  loadingWallet: boolean;
}> = ({ ens, address, collection, loadingWallet, loadingCollection }) => {
  if (loadingWallet) {
    return <Placeholder />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: "40px",
        marginTop: "20px",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <h1 style={{ margin: "0px 0px 5px 0px", fontSize: "2.2em" }}>
        Activity of {ens ? ens : address}
      </h1>
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
    >
      <img
        src={collection.imgUrl}
        style={{
          height: "45px",
          width: "45px",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />
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
        <h3
          style={{
            margin: "0px 0px 5px 0px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {collection.name}
        </h3>
        <div style={{ color: "gray" }}>
          {`floor: ${collection.floor}, holding: ${collection.holding}`}
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
