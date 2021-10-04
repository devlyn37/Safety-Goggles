import { FC, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ethers } from "ethers";
import styles from "../styles/search.module.css";
import { CollectionSearch } from "./collectionSearch";
import { CollectionInfo } from "../utils/data";

const etherScanAPIKey = "K14P3TW12QCI2VDR3YIDY7XA9Y5XP2D232";

export interface SearchCriteria {
  address: string;
  ens: string;
  startDate: string;
  endDate: string;
  collection: CollectionInfo;
}

export const Search: FC<{
  handleSearch: (search: SearchCriteria) => void;
}> = ({ handleSearch }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [ens, setEns] = useState<string>("");
  const [loadingEns, setLoadingEns] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [collection, setCollection] = useState<CollectionInfo>(undefined);

  const handleSearchInputchange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    console.log(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    console.log(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoadingEns(true);

    try {
      const [address, ens] = await resolveSearchInput(searchInput);
      setAddress(address);
      setEns(ens);
      handleSearch({
        address: address,
        ens: ens,
        startDate: startDate,
        endDate: endDate,
        collection: collection,
      });

      setCollection(null);
      setErrorMsg("");
      setEndDate("");
      setStartDate("");
    } catch (e) {
      setErrorMsg(e.message);
    }

    setLoadingEns(false);
  };

  const resolveSearchInput = async (
    input: string
  ): Promise<[string, string]> => {
    const provider = new ethers.providers.EtherscanProvider(1, etherScanAPIKey);
    let address;
    let ens;

    // Todo this is hacky, use a regex or something
    // If the input is a normal address, otherwise its an ens address
    if (input.length === 42) {
      address = input;
      ens = await provider.lookupAddress(address);
    } else {
      ens = input;
      if (ens.slice(-4) !== ".eth") {
        ens += ".eth";
      }

      address = await provider.resolveName(ens);
    }

    if (address === null) {
      throw new Error("Provided ENS name does not have an associated wallet");
    }

    return [address, ens];
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
            value={startDate}
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
            value={endDate}
            onChange={handleEndDateChange}
          />
        </label>
        {address ? (
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
