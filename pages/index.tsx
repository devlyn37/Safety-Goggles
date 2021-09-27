import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getEvents, NFTEvent } from "../utils/data";
import { Audio } from "@agney/react-loading";
import Timeline from "../components/timeline";
import { FaSearch } from "react-icons/fa";

const etherScanAPIKey = "K14P3TW12QCI2VDR3YIDY7XA9Y5XP2D232";

export default function Home() {
  const [lastSearched, SetLastSearched] = useState<string>(
    "0x3B3525F60eeea4a1eF554df5425912c2a532875D"
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [ens, setEns] = useState<string>("");
  const [loadingEns, setLoadingEns] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [data, setData] = useState<NFTEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const loadMore = () => {
    setPage(page + 1);
  };

  const handleSearchInputchange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("submitting, search input = " + searchInput);
    SetLastSearched(searchInput);
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

  useEffect(() => {
    const resolveEns = async () => {
      setLoadingEns(true);

      try {
        const [address, ens] = await resolveSearchInput(lastSearched);
        setAddress(address);
        setEns(ens);
      } catch (e) {
        setErrorMsg(e.message);
      }

      setLoadingEns(false);
    };

    if (lastSearched) {
      resolveEns();
    }
  }, [lastSearched]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const events = await getEvents(address, 2, 2 * (page - 1));

        if (events.length) {
          if (page > 1) {
            setData([...data, ...events]);
          } else {
            setData(events);
          }
        }
      } catch (e) {
        setErrorMsg(e.message);
        throw e;
      }

      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address, page]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        minHeight: "100vh",
      }}
    >
      <form
        style={{
          padding: "20px 20px 0px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
        onSubmit={handleSearchSubmit}
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
      </form>
      <div
        style={{
          width: "100%",
          padding: "0px 30px 30px 30px",
          fontSize: "30px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Activity of {loadingEns ? "..." : ens ?? address}
      </div>
      {/* //overflowY is important here for some reason with the timeline styling, take a close look later */}
      <div
        style={{
          width: "100%",
          flex: 1,
          overflowY: "scroll",
          minHeight: "1vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {errorMsg ? (
          <div>{errorMsg}</div>
        ) : loading && page === 1 ? (
          <Audio width="100" />
        ) : (
          <Timeline
            data={data}
            address={address}
            loadMore={loadMore}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
