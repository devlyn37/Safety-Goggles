import { FC, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ethers } from "ethers";
import styles from "../styles/search.module.css";
const etherScanAPIKey = "K14P3TW12QCI2VDR3YIDY7XA9Y5XP2D232";

export interface SearchCriteria {
  address: string;
  startDate: string;
  endDate: string;
}

export const Search: FC<{ updateSearch: (search: SearchCriteria) => void }> = ({
  updateSearch,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [ens, setEns] = useState<string>("");
  const [loadingEns, setLoadingEns] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

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
    console.log(
      "submitting, search input = " +
        searchInput +
        " start date = " +
        startDate +
        " end date = " +
        endDate
    );

    setLoadingEns(true);

    try {
      const [address, ens] = await resolveSearchInput(searchInput);
      setAddress(address);
      setEns(ens);
      updateSearch({
        address: address,
        startDate: startDate,
        endDate: endDate,
      });
      setErrorMsg("");
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
        {address || ens ? (
          <div className={styles.addresses}>
            Activity of {loadingEns ? "..." : ens ?? address}
          </div>
        ) : null}
        <label>
          from:
          <br />
          <input
            style={{ marginTop: "5px" }}
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
            style={{ marginTop: "5px" }}
            type="date"
            placeholder="from"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </label>
      </div>
      {errorMsg ? ( // To-do style
        <div className={styles.errorMessage}>{errorMsg}</div>
      ) : null}
    </form>
  );
};
