import { FC } from "react";
import ContentLoader from "react-content-loader";

export const Header: FC<{
  ens: string;
  address: string;
  startDate: string;
  endDate: string;
  collectionSlug: string;
  loading: boolean;
}> = ({ ens, address, startDate, endDate, collectionSlug, loading }) => {
  return loading ? (
    <Placeholder />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1 style={{ margin: "0px 0px 5px 0px" }}>
          Activity of {ens ? ens : address}
          {collectionSlug ? " with collection " + collectionSlug : ""}
        </h1>
        <div style={{ color: "dimgray", fontSize: "16px" }}>
          {startDate ? "From: " + startDate : ""}{" "}
          {endDate ? "Until: " + endDate : ""}
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
