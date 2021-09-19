import axios from "axios";
import { FC, useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { AiOutlineEllipsis, AiFillCaretDown } from "react-icons/ai";
import { ethers } from "ethers";
import { convertUNIXTimestamp } from "../utils/time";

const etherScanAPIKey = "K14P3TW12QCI2VDR3YIDY7XA9Y5XP2D232";

export default function Home() {
  const [data, setData] = useState<Array<[any, any]>>([]);
  const [page, setPage] = useState<number>(1);
  const [lastSearched, SetLastSearched] = useState<string>(
    "0x3B3525F60eeea4a1eF554df5425912c2a532875D"
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [ens, setEns] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const getData = async (page, address, offset) => {
    const url = `https://api.etherscan.io/api
		?module=account
		&action=tokennfttx
		&address=${address}
		&page=${page}
		&offset=${offset}
		&sort=desc
		&apikey=${etherScanAPIKey}`;

    try {
      const results = await axios.get(url);
      const transactions = results.data.result;
      const tokenIdContractAddressPairs: Array<[string, string]> =
        transactions.map((t) => [t.tokenID, t.contractAddress]);

      let tokenIds = "";
      let contractAddresses = "";
      tokenIdContractAddressPairs.forEach((pair) => {
        tokenIds += `token_ids=${pair[0]}&`;
        contractAddresses += `asset_contract_addresses=${pair[1]}&`;
      });

      const openSeaURL = `https://api.opensea.io/api/v1/assets?${tokenIds}${contractAddresses}order_direction=desc&offset=0`;

      const nftResults = await axios.get(openSeaURL);
      const nfts = nftResults.data.assets;

      const combined = transactions.map((t, i) => [t, nfts[i]]);
      return combined;
    } catch (e) {
      console.log("oi" + e.message);
    }
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const handleSearchInputchange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("submitting, search input = " + searchInput);
    setPage(1);
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
    const loadData = async () => {
      setLoading(true);

      try {
        const [address, ens] = await resolveSearchInput(lastSearched);
        setAddress(address);
        setEns(ens);

        const newData = await getData(page, address, 10);
        console.log(newData);

        if (page === 1) {
          setData(newData);
        } else {
          setData([...data, ...newData]);
        }

        setErrorMsg("");
      } catch (e) {
        setErrorMsg(e.message);
      }

      setLoading(false);
    };

    if (lastSearched) {
      loadData();
    }
  }, [page, lastSearched]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <nav
        style={{
          padding: "30px 30px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        <div style={{ fontSize: "50px" }}>DSVR</div>
        <form onSubmit={handleSearchSubmit}>
          <input
            value={searchInput}
            onChange={handleSearchInputchange}
            type="text"
            placeholder="Address/ENS"
            style={{
              height: "55px",
              padding: "0px 15px",
              marginRight: "20px",
              border: "3px solid black",
              borderRadius: "10px",
              fontSize: "20px",
            }}
          ></input>
          <input
            type="submit"
            value="Search"
            style={{
              height: "55px",
              padding: "0px 15px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontSize: "20px",
            }}
          ></input>
        </form>
      </nav>
      {errorMsg ? (
        <div>{errorMsg}</div>
      ) : loading && page === 1 ? (
        <div>loading...</div>
      ) : (
        <>
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
            Activity of {ens ?? address}
          </div>
          <VerticalTimeline className="vertical-timeline-custom-line">
            {data.map(([transaction, nft]) =>
              nft ? (
                <VerticalTimelineElement
                  contentStyle={{
                    border: "3px solid black",
                    boxShadow: "none",
                  }}
                  contentArrowStyle={{ borderRight: "9px solid  black" }}
                  className="vertical-timeline-element--work"
                  date={convertUNIXTimestamp(transaction.timeStamp)}
                  iconStyle={{
                    background: "rgb(33, 150, 243)",
                    color: "#fff",
                    border: "4px solid black",
                    boxShadow: "none",
                  }}
                >
                  <h3
                    className="vertical-timeline-element-title"
                    style={{ marginBottom: "5px" }}
                  >
                    {transaction.to.toUpperCase() === address.toUpperCase()
                      ? "Minted or Bought"
                      : "Sold or Transfered"}{" "}
                    <a
                      href={`https://opensea.io/assets/${nft.asset_contract.address}/${nft.token_id}`}
                      style={{
                        color: "rgb(33, 150, 243)",
                        textDecoration: "underline",
                      }}
                    >
                      {nft.name}
                    </a>
                  </h3>
                  <h4 className="vertical-timeline-element-subtitle">
                    from{" "}
                    <a
                      href={
                        nft.collection.external_url ??
                        `https://opensea.io/collection/${nft.collection.name}`
                      }
                      style={{
                        color: "rgb(33, 150, 243)",
                        textDecoration: "underline",
                      }}
                    >
                      {nft.collection.name}{" "}
                    </a>
                  </h4>
                  <NftDisplay
                    description={nft.description}
                    imgUrl={nft.image_url}
                  />
                </VerticalTimelineElement>
              ) : null
            )}
            <VerticalTimelineElement
              iconOnClick={loadMore}
              iconStyle={{
                background: "green",
                color: "#fff",
                border: "3px solid black",
                boxShadow: "none",
              }}
              icon={loading ? <AiOutlineEllipsis /> : <AiFillCaretDown />}
            />
          </VerticalTimeline>
        </>
      )}
    </div>
  );
}

const NftDisplay: FC<{ description: string; imgUrl: string }> = ({
  description,
  imgUrl,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      margin: "20px 0px",
      wordBreak: "break-all",
    }}
  >
    <img src={imgUrl}></img>
    <p>{description}</p>
  </div>
);
