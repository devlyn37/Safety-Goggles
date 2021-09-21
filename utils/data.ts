import axios from "axios";
const etherScanAPIKey = "K14P3TW12QCI2VDR3YIDY7XA9Y5XP2D232";

export const getData = async (
  page,
  address,
  offset
): Promise<Array<[any, any]>> => {
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
    console.log(combined);
    return combined;
  } catch (e) {
    console.log("oi" + e.message);
  }
};

export const groupData = (
  data: Array<[any, any]>,
  address: string
): Array<Array<[any, any]>> => {
  const buckets: Array<Array<[any, any]>> = [];

  // Group together similar actions
  let currCollection: string;
  let currBought: boolean;
  let currBucket: Array<[any, any]>;

  for (const [transaction, nft] of data) {
    if (!nft) {
      continue;
    }

    const collection = nft.collection.name;
    const bought = transaction.to.toUpperCase() === address.toUpperCase();

    if (currCollection !== collection || currBought !== bought) {
      currBucket = [[transaction, nft]];
      buckets.push(currBucket);
    } else {
      currBucket.push([transaction, nft]);
    }

    currCollection = collection;
    currBought = bought;
  }

  return buckets;
};
