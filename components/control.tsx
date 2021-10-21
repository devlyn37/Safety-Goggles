import { FC } from "react";

export const Control: FC<{
  handleShowFilters: () => void;
  showFilters: boolean;
}> = ({ handleShowFilters, showFilters }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #f2f2f2",
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
);
