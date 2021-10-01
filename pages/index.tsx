import React, { useState, useEffect } from "react";
import { getEvents, NFTEvent } from "../utils/data";
import { Audio } from "@agney/react-loading";
import Timeline from "../components/timeline";
import { Search, SearchCriteria } from "../components/search";

export default function Home() {
  const [search, setSearch] = useState<SearchCriteria>({
    address: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState<NFTEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const loadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const events = await getEvents(
          search.address,
          60,
          60 * (page - 1),
          search.startDate,
          search.endDate
        );

        if (page > 1) {
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
  }, [search, page]);

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
      <Search updateSearch={setSearch} />
      {/* //overflowY is important here for some reason with the timeline styling, take a close look later */}
      <div
        style={{
          width: "100%",
          flex: 1,
          minHeight: "1vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {errorMsg ? (
          <div>{errorMsg}</div>
        ) : loading && page === 1 ? (
          <Audio width="100" />
        ) : search.address ? (
          <Timeline
            data={data}
            address={search.address}
            loadMore={loadMore}
            loading={loading}
          />
        ) : null}
      </div>
    </div>
  );
}
