import { FC, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../styles/search.module.css";

export interface SearchCriteria {
  address: string;
  ens: string;
  startDate: string;
  endDate: string;
  collectionSlug: string;
}

export const Search: FC<{
  handleSearch: (input: string) => Promise<void>;
  wallet: string;
}> = ({ handleSearch, wallet }) => {
  const [searchInput, setSearchInput] = useState<string>("");

  // Keep input updated to reflect searches from url
  useEffect(() => {
    if (wallet && !searchInput) {
      setSearchInput(wallet);
    }
  }, [wallet]);

  const handleSearchInputchange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styles.container}>
      <div className={styles.searchBarContainer}>
        <input
          value={searchInput}
          onChange={handleSearchInputchange}
          type="text"
          placeholder="Address/ENS"
          className={styles.searchBarInput}
        ></input>
        <button onClick={handleSearchSubmit} className={styles.searchBarButton}>
          <FaSearch />
        </button>
      </div>
    </form>
  );
};
