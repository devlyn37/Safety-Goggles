import React, { useState, useEffect } from "react";
import { CollectionInfo, getEvents, NFTEvent } from "../utils/data";
import { Audio } from "@agney/react-loading";
import Timeline from "../components/timeline";
import { Search, SearchCriteria } from "../components/search";

export default function Home() {
  const [search, setSearch] = useState<{
    address: string;
    ens: string;
    startDate: string;
    endDate: string;
    page: number;
    collection?: CollectionInfo;
  }>({
    address: "",
    ens: "",
    startDate: "",
    endDate: "",
    page: 1,
  });

  const [data, setData] = useState<NFTEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const loadMore = () => {
    setSearch({ ...search, page: search.page + 1 });
  };

  const handleSearch = (search: SearchCriteria): void => {
    console.log("Handle Search");
    setSearch({ ...search, page: 1 });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const events = await getEvents(
          search.address,
          60,
          60 * (search.page - 1),
          search.startDate,
          search.endDate,
          search.collection ? search.collection.slug : undefined
        );

        if (search.page > 1) {
          setData([...data, ...events]);
        } else {
          setData(events);
        }
      } catch (e) {
        setErrorMsg(e.message);
        throw e;
      }

      setLoading(false);
    };

    if (search.address) {
      loadData();
    }
  }, [search]);

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
      <Search handleSearch={handleSearch} />
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
        ) : loading && search.page === 1 ? (
          <div style={{ alignSelf: "center" }}>
            <Audio width="100" />
          </div>
        ) : search.address ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "30px",
                marginTop: "20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ margin: "0px 0px 5px 0px" }}>
                  Activity of {search.ens ? search.ens : search.address}
                  {search.collection
                    ? " with collection " + search.collection.name
                    : ""}
                </h1>
                <div style={{ color: "dimgray", fontSize: "16px" }}>
                  {search.startDate ? "From: " + search.startDate : ""}{" "}
                  {search.endDate ? "Until: " + search.endDate : ""}
                </div>
              </div>
            </div>
            <Timeline
              data={data}
              address={search.address}
              loadMore={loadMore}
              loading={loading}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
