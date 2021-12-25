import { FC } from "react";
import styles from "../styles/control.module.css";

export const Control: FC<{
  handleShowFilters: () => void;
  showFilters: boolean;
}> = ({ handleShowFilters, showFilters }) => (
  <menu className={styles.container}>
    <li>
      <button className={styles.filterToggle} onClick={handleShowFilters}>
        {showFilters ? " Hide Filters" : "Filters"}
      </button>
    </li>
    <li>Most Recent</li>
  </menu>
);
