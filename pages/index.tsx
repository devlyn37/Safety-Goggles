import React, { useState, useEffect, FC } from "react";
import { CollectionInfo, resolveWallet } from "../utils/data";
import Timeline from "../components/timeline";
import { Search } from "../components/search";
import { useRouter } from "next/dist/client/router";
import { Filter } from "../components/filter";
import { Header } from "../components/header";

export interface SearchCriteria {
  address: string;
  ens: string;
  startDate: string;
  endDate: string;
  page: number;
  collection: CollectionInfo | null;
}

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState<SearchCriteria>({
    address: "",
    ens: "",
    startDate: "",
    endDate: "",
    collection: null,
    page: 1,
  });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);

  const loadMore = () => {
    setSearch({ ...search, page: search.page + 1 });
  };

  const handleSearch = async (input: string) => {
    console.log("Handle Search");

    try {
      setLoadingWallet(true);
      const [address, ens] = await resolveWallet(input); // Add loading here

      const s: SearchCriteria = {
        address: address,
        ens: ens,
        startDate: "",
        endDate: "",
        page: 1,
        collection: null,
      };

      setSearch(s);
      updateUrl(s);

      setErrorMsg("");
    } catch (e) {
      setErrorMsg(e.message);
    }

    setLoadingWallet(false);
  };

  const updateUrl = (s: SearchCriteria) => {
    const url = `/?wallet=${s.ens ?? s.address}${
      s.startDate ? "&startDate=" + s.startDate : ""
    }${s.endDate ? "&endDate=" + s.endDate : ""}${
      s.collection ? "&collectionSlug=" + s.collection.slug : ""
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

  const handleCollectionChange = (collection: CollectionInfo) => {
    const s = { ...search, collection: collection };
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
        collection: null,
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
            <Header
              address={search.address}
              ens={search.ens}
              endDate={search.endDate}
              startDate={search.startDate}
              collectionSlug={search.collection ? search.collection.slug : ""}
              loading={loadingWallet}
            />
            <Filter
              address={search.address}
              startDate={search.startDate}
              endDate={search.endDate}
              collection={search.collection}
              loadingWallet={loadingWallet}
              handleCollectionChange={handleCollectionChange}
              handleEndDateChange={handleEndDateChange}
              handleStartDateChange={handleStartDateChange}
            />
            <Timeline
              search={search}
              loadMore={loadMore}
              loadingWallet={loadingWallet}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
