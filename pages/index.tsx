import React, { useState, useEffect } from "react";
import { resolveWallet } from "../utils/data";
import Timeline from "../components/timeline";
import { Search, SearchCriteria } from "../components/search";
import { useRouter } from "next/dist/client/router";
import { Filter } from "../components/filter";

interface SearchState {
  address: string;
  ens: string;
  startDate: string;
  endDate: string;
  page: number;
  collectionSlug?: string;
}

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState<SearchState>({
    address: "",
    ens: "",
    startDate: "",
    endDate: "",
    collectionSlug: "",
    page: 1,
  });

  const [errorMsg, setErrorMsg] = useState<string>("");

  const loadMore = () => {
    setSearch({ ...search, page: search.page + 1 });
  };

  const handleSearch = async (input: string) => {
    console.log("Handle Search");

    try {
      const [address, ens] = await resolveWallet(input); // Add loading here
      setSearch({
        ...search,
        address: address,
        ens: ens,
        startDate: "",
        endDate: "",
        collectionSlug: "",
      });
      setErrorMsg("");
    } catch (e) {
      setErrorMsg(e.message);
    }

    const url = `/?wallet=${search.ens ?? search.address}`;
    router.push(url, undefined, { shallow: true });
  };

  const updateUrl = (s: SearchState) => {
    const url = `/?wallet=${s.ens ?? s.address}${
      s.startDate ? "&startDate=" + s.startDate : ""
    }${s.endDate ? "&endDate=" + s.endDate : ""}${
      s.collectionSlug ? "&collectionSlug=" + s.collectionSlug : ""
    }`;
    router.push(url, undefined, { shallow: true });
  };

  const handleStartDateChange = (startDate: string) => {
    const s = { ...search, startDate: startDate };
    setSearch(s);
    updateUrl(s);
  };

  const handleEndDateChange = (endDate: string) => {
    const s = { ...search, endDate: endDate };
    setSearch(s);
    updateUrl(s);
  };

  const handleCollectionChange = (collectionSlug: string) => {
    const s = { ...search, collectionSlug: collectionSlug };
    setSearch(s);
    updateUrl(s);
  };

  useEffect(() => {
    const { wallet, startDate, endDate, collectionSlug } = router.query;
    const handleParams = async () => {
      if (
        Array.isArray(wallet) ||
        Array.isArray(startDate) ||
        Array.isArray(endDate) ||
        Array.isArray(collectionSlug)
      ) {
        setErrorMsg("Invalid wallet parameter");
        return;
      }

      const [address, ens] = await resolveWallet(wallet);
      setSearch({
        address: address,
        ens: ens,
        startDate: startDate,
        endDate: endDate,
        page: 1,
        collectionSlug: collectionSlug,
      });
    };

    // Initially query is an empty object, don't run then
    // only run if the user has just landed on the page
    // with query params
    if (wallet && search.address === "") {
      console.log("running");
      handleParams();
    }
  }, [router.query]);

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
      <Search
        handleSearch={handleSearch}
        wallet={router.query.wallet as string}
      />
      <div
        style={{
          width: "100%",
          flex: 1,
          minHeight: "1vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "0px 20px",
        }}
      >
        {errorMsg ? (
          <div>{errorMsg}</div>
        ) : search.address ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ margin: "0px 0px 5px 0px" }}>
                  Activity of {search.ens ? search.ens : search.address}
                  {search.collectionSlug
                    ? " with collection " + search.collectionSlug
                    : ""}
                </h1>
                <div style={{ color: "dimgray", fontSize: "16px" }}>
                  {search.startDate ? "From: " + search.startDate : ""}{" "}
                  {search.endDate ? "Until: " + search.endDate : ""}
                </div>
              </div>
            </div>
            <Filter
              address={search.address}
              startDate={search.startDate}
              endDate={search.endDate}
              collectionSlug={search.collectionSlug}
              handleCollectionChange={handleCollectionChange}
              handleEndDateChange={handleEndDateChange}
              handleStartDateChange={handleStartDateChange}
            />
            <Timeline search={search} loadMore={loadMore} />
          </>
        ) : null}
      </div>
    </div>
  );
}
