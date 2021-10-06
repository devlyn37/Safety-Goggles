import { FC, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../styles/search.module.css";
import { CollectionSearch } from "./collectionSearch";
import { CollectionInfo, resolveWallet } from "../utils/data";

export interface SearchCriteria {
  address: string;
  ens: string;
  startDate: string;
  endDate: string;
  collectionSlug: string;
}

export const Search: FC<{
  handleSearch: (search: SearchCriteria) => void;
  startDate: string;
  endDate: string;
  wallet: string;
}> = ({ handleSearch, startDate, endDate, wallet }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [ens, setEns] = useState<string>("");
  const [loadingEns, setLoadingEns] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [collection, setCollection] = useState<CollectionInfo>(null);

  // Keep input updated to reflect searches from url
  useEffect(() => {
    if (startDate) {
      setStartDateInput(startDate);
    }

    if (endDate) {
      setEndDateInput(endDate);
    }

    const resolve = async () => {
      const [address, ens] = await resolveWallet(wallet);
      setAddress(address);
      setEns(ens);
    };

    if (wallet) {
      if (!searchInput) {
        setSearchInput(wallet);
      }
      resolve();
    }
  }, [startDate, endDate, wallet]);

  const handleSearchInputchange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDateInput(event.target.value);
    console.log(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDateInput(event.target.value);
    console.log(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoadingEns(true);

    try {
      const [address, ens] = await resolveWallet(searchInput);
      setAddress(address);
      setEns(ens);
      handleSearch({
        address: address,
        ens: ens,
        startDate: startDateInput,
        endDate: endDateInput,
        collectionSlug: collection ? collection.slug : "",
      });

      setCollection(null);
      setErrorMsg("");
    } catch (e) {
      setErrorMsg(e.message);
    }

    setLoadingEns(false);
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
      <div className={styles.controlsContainer}>
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
            value={startDateInput}
            onChange={handleStartDateChange}
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
            value={endDateInput}
            onChange={handleEndDateChange}
          />
        </label>
        {address || wallet ? (
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label>
              Collection:
              <br />
              <div style={{ marginTop: "3px" }}>
                <CollectionSearch
                  value={collection}
                  onChange={setCollection}
                  address={address}
                />
              </div>
            </label>
          </div>
        ) : null}
      </div>
      {errorMsg ? ( // To-do style
        <div className={styles.errorMessage}>{errorMsg}</div>
      ) : null}
    </form>
  );
};
