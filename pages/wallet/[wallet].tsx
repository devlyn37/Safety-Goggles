import React, { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  getCollections,
  getCollection,
  getCollectionFloor,
} from "../../utils/data";
import { CollectionInfo, Filter, SearchCriteria } from "../../types";
import { resolveWallet } from "../../utils/ens";
import Timeline from "../../components/Timeline";
import { useRouter } from "next/dist/client/router";
import { Filter as FilterComp } from "../../components/Filter";
import { Header } from "../../components/Header";
import { ParsedUrlQueryInput } from "querystring";
import { Control } from "../../components/Control";
import { Nav } from "../../components/Nav";
import Head from "next/head";
import styles from "../../styles/wallet.module.css";

interface Params extends ParsedUrlQueryInput {
  wallet?: string;
  startDate?: string;
  endDate?: string;
  collectionSlug?: string;
  filter?: Filter;
}

export default function Home() {
  const router = useRouter();
  const smallScreen = useMediaQuery("(max-width: 700px)");

  const [search, setSearch] = useState<SearchCriteria>({
    address: "",
    ens: "",
    startDate: "",
    endDate: "",
    filter: "",
    collectionSlug: "",
    page: 1,
  });

  const [walletErrorMsg, setWalletErrorMsg] = useState<string>("");
  const [collectionErrorMsg, setCollectionErrorMsg] = useState<string>("");
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionInfo | null>(null);
  const [loadingCollection, setLoadingCollection] = useState<boolean>(false);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setShowFilters(!smallScreen);
  }, [smallScreen]);

  const loadMore = () => {
    setSearch({ ...search, page: search.page + 1 });
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateUrl = useCallback(
    (s: SearchCriteria) => {
      const query: Params = {};

      if (s.ens || s.address) {
        query.wallet = s.ens ?? s.address;
      }

      if (s.startDate) {
        query.startDate = s.startDate;
      }

      if (s.endDate) {
        query.endDate = s.endDate;
      }

      if (s.collectionSlug) {
        query.collectionSlug = s.collectionSlug;
      }

      if (s.filter) {
        query.filter = s.filter;
      }

      router.push({ pathname: "/wallet/[wallet]", query: query }, undefined, {
        shallow: true,
      });
    },
    [router]
  );

  const handleSearch = useCallback(
    async (
      input: string,
      setUrl: boolean = true,
      startDate?: string,
      endDate?: string,
      filter?: Filter,
      collectionSlug?: string
    ) => {
      let address, ens;

      setCollection(null);
      setLoadingWallet(true);
      setLoadingCollections(true);
      setWalletErrorMsg("");

      if (collectionSlug) {
        setLoadingCollection(true);
      }

      try {
        [address, ens] = await resolveWallet(input);

        const s: SearchCriteria = {
          address: address,
          ens: ens,
          startDate: startDate ?? "",
          endDate: endDate ?? "",
          filter: filter ?? "",
          page: 1,
          collectionSlug: collectionSlug ?? "",
        };
        setSearch(s);

        if (setUrl) {
          updateUrl(s);
        }
      } catch (e) {
        // To-do handle different cases more extensivly
        setWalletErrorMsg(e.message);
        setLoadingWallet(false);
        return;
      }

      setLoadingWallet(false);

      try {
        const usersCollections = await getCollections(address);
        setCollections(usersCollections);

        // User arriving from shared link or refreshing etc
        if (collectionSlug) {
          let collection = usersCollections.find(
            (c: CollectionInfo) => c.slug === collectionSlug
          );

          if (!collection) {
            collection = await getCollection(collectionSlug);
          } else {
            const floor = await getCollectionFloor(collectionSlug);
            collection.floor = floor;
          }

          setCollection(collection);
        }

        setCollectionErrorMsg("");
      } catch (e) {
        setCollectionErrorMsg(e.message);
      }

      setLoadingCollections(false);
      setLoadingCollection(false);
    },
    [updateUrl]
  );

  const handleStartDateChange = (startDate: string) => {
    const s = { ...search, startDate: startDate, page: 1 };
    setSearch(s);
    updateUrl(s);
  };

  const handleEndDateChange = (endDate: string) => {
    const s = { ...search, endDate: endDate, page: 1 };
    setSearch(s);
    updateUrl(s);
  };

  const handleCollectionChange = (collection: CollectionInfo) => {
    const s = {
      ...search,
      collectionSlug: collection ? collection.slug : "",
      page: 1,
    };

    if (collection) {
      const loadData = async () => {
        setLoadingCollection(true);
        const floor = await getCollectionFloor(collection.slug);
        collection.floor = floor;
        setLoadingCollection(false);
      };

      loadData();
    }

    setCollection(collection);

    setSearch(s);
    updateUrl(s);
  };

  const handleFilterChange = (filter: Filter) => {
    const s = { ...search, filter: filter, page: 1 };
    setSearch(s);
    updateUrl(s);
  };

  useEffect(() => {
    const validateParams = (query: ParsedUrlQueryInput): string => {
      let err = "";
      const paramWL = [
        "wallet",
        "startDate",
        "endDate",
        "collectionSlug",
        "filter",
      ];

      Object.keys(query).forEach((param: string) => {
        const val = query[param];

        if (paramWL.includes(param) && typeof val !== "string") {
          err += `Invalid ${param} parameter\n`;
        }

        val as string;

        if (
          param === "filter" &&
          val !== "" &&
          val !== "successful" &&
          val != "transfer"
        ) {
          err += `filter ${val} is not valid`;
        }
      });

      return err;
    };

    const matchingParamAndState = (
      search: SearchCriteria,
      query: Params
    ): boolean => {
      const startMatch =
        query.startDate === search.startDate ||
        (!query.startDate && !search.startDate);
      const endMatch =
        query.endDate === search.endDate || (!query.endDate && !search.endDate);
      const filterMatch =
        search.filter === query.filter || (!query.filter && !search.filter);
      const collectionMatch =
        (!search.collectionSlug && !query.collectionSlug) ||
        query.collectionSlug === search.collectionSlug;

      const walletMatch =
        (!search.address && !query.wallet) ||
        search.address === query.wallet ||
        search.ens === query.wallet ||
        search.ens.slice(0, -4) === query.wallet;

      return (
        walletMatch && startMatch && endMatch && collectionMatch && filterMatch
      );
    };

    const handleParams = async () => {
      const err = validateParams(router.query);
      if (err) {
        setWalletErrorMsg(err);
        return;
      }

      const { wallet, startDate, endDate, collectionSlug, filter } =
        router.query as Params;

      // If the state matches the url already, that means that this change in query params
      // was caused in the client after a user adjusted the search of the filtering
      if (matchingParamAndState(search, router.query)) {
        return;
      }

      if (!wallet && search.address) {
        // The user has navigated back to base page
        setSearch({
          address: "",
          ens: "",
          startDate: "",
          endDate: "",
          filter: "",
          page: 1,
          collectionSlug: "",
        });
        return;
      }

      // Past this point its actions like url changes and pressing back
      await handleSearch(
        wallet,
        false,
        startDate ?? "",
        endDate ?? "",
        filter,
        collectionSlug
      );
    };

    handleParams();
  }, [router.query, handleSearch]);

  return (
    <>
      <Head>
        <title>{router.query.wallet}</title>
        <meta
          property="og:title"
          content="View a wallet with Safety Goggles"
          title="fb-title"
        />
        <meta
          property="twitter:title"
          content="View a wallet with Safety Goggles"
          key="twitter-title"
        />
      </Head>

      <div
        className={`${styles.pageContainer} ${
          showFilters ? "" : styles.collapsedContainer
        }`}
      >
        <div className={styles.nav}>
          <Nav handleSearch={handleSearch} />
        </div>
        <div className={styles.header}>
          <Header
            address={search.address}
            ens={search.ens}
            endDate={search.endDate}
            startDate={search.startDate}
            collection={collection}
            loadingCollection={loadingCollection}
            loadingWallet={loadingWallet}
            errorMsg={walletErrorMsg}
          />
        </div>
        <div className={styles.control}>
          <Control
            showFilters={showFilters}
            handleShowFilters={handleShowFilters}
          ></Control>
        </div>
        <div
          className={`${styles.side} ${
            showFilters ? "" : styles.collapsedSide
          }`}
        >
          <div className={styles.sidestick}>
            <FilterComp
              disabled={!!walletErrorMsg}
              collections={collections}
              startDate={search.startDate}
              endDate={search.endDate}
              collection={collection}
              filter={search.filter}
              loadingWallet={loadingWallet}
              loadingCollections={loadingCollections}
              handleCollectionChange={handleCollectionChange}
              handleEndDateChange={handleEndDateChange}
              handleStartDateChange={handleStartDateChange}
              handleFilterChange={handleFilterChange}
              collectionErrorMsg={collectionErrorMsg}
            />
          </div>
        </div>
        <div
          className={`${styles.main} ${styles.column} ${
            showFilters ? styles.collapsedMain : styles.onlyMain
          }`}
        >
          <Timeline
            search={search}
            loadMore={loadMore}
            loadingWallet={loadingWallet}
            externalErrorMsg={walletErrorMsg}
          />
        </div>
      </div>
    </>
  );
}
