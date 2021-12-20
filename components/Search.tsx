import { FC, useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../styles/search.module.css";

export const Search: FC<{
  handleSearch: (input: string) => Promise<void>;
}> = ({ handleSearch }) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearchInputchange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styles.searchBarContainer}>
      <input
        value={searchInput}
        onChange={handleSearchInputchange}
        type="text"
        placeholder="Enter address or ENS"
        className={styles.searchBarInput}
      ></input>
      <button onClick={handleSearchSubmit} className={styles.searchBarButton} disabled={searchInput.length === 0}>
        <FaSearch />
      </button>
    </form>
  );
};
