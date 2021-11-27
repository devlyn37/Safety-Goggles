import { FC } from "react";
import styles from "../styles/control.module.css";

export const Control: FC<{
  handleShowFilters: () => void;
  showFilters: boolean;
}> = ({ handleShowFilters, showFilters }) => (
  <div className={styles.container}>
    <button className={styles.filterToggle} onClick={handleShowFilters}>
      {showFilters ? " Hide Filters" : "Filters"}
    </button>
    <div>Most Recent</div>
  </div>
);
