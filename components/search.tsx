import { FC, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ethers } from "ethers";
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
    <form
      onSubmit={handleSearchSubmit}
      style={{
        padding: "20px 0px 0px 0px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          padding: "20px 20px 0px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <input
          value={searchInput}
          onChange={handleSearchInputchange}
          type="text"
          placeholder="Address/ENS"
          style={{
            flex: "1",
            minWidth: "30px", //To account for default input sizing smh
            height: "55px",
            padding: "0px 15px",
            marginRight: "20px",
            border: "3px solid black",
            borderRadius: "10px",
            fontSize: "20px",
          }}
        ></input>
        <button
          onClick={handleSearchSubmit}
          style={{
            height: "55px",
            padding: "0px 15px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "50%",
            fontSize: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaSearch />
        </button>
      </div>
      <div
        style={{
          padding: "0px 20px 0px 20px",
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {address || ens ? (
          <div
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            Activity of ${loadingEns ? "..." : ens ?? address}
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
        <div
          style={{
            margin: "0px 20px 0px 20px",
            padding: "10px 20px 10px 20px",
            backgroundColor: "lightpink",
          }}
        >
          {errorMsg}
        </div>
      ) : null}
    </form>
  );
};
