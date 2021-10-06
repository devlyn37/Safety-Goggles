import React, { useState, useEffect } from "react";
import { resolveWallet } from "../utils/data";
import Timeline from "../components/timeline";
import { Search, SearchCriteria } from "../components/search";
import { useRouter } from "next/dist/client/router";

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState<{
    address: string;
    ens: string;
    startDate: string;
    endDate: string;
    page: number;
    collectionSlug?: string;
  }>({
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

  const handleSearch = (search: SearchCriteria): void => {
    console.log("Handle Search");

    setSearch({
      address: search.address,
      ens: search.ens,
      startDate: search.startDate,
      endDate: search.endDate,
      page: 1,
      collectionSlug: search.collectionSlug,
    });

    const url = `/?wallet=${search.ens ?? search.address}${
      search.startDate ? "&startDate=" + search.startDate : ""
    }${search.endDate ? "&endDate=" + search.endDate : ""}${
      search.collectionSlug ? "&collectionSlug=" + search.collectionSlug : ""
    }`;

    router.push(url, undefined, { shallow: true });
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
        startDate={router.query.startDate as string}
        endDate={router.query.endDate as string}
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
          <Timeline search={search} loadMore={loadMore} />
        ) : null}
      </div>
    </div>
  );
}
