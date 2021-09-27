import axios from "axios";

export interface NFTEvent {
  assetName: string;
  assetDescription: string;
  assetImgUrl: string;
  assetUrl: string;
  collectionName: string;
  collectionImgUrl: string;
  collectionUrl: string;
  collectionDescription: string;
  date: string;
  from: string;
  to: string;
  action: "Minted" | "Bought" | "Sold";
  key: string;
  price?: number;
}

export const getEvents = async (
  address: string,
  limit: number,
  offset: number
): Promise<NFTEvent[]> => {
  const url = `https://api.opensea.io/api/v1/events?account_address=${address}&only_opensea=false&offset=${offset}&limit=${limit}`;
  console.log(url);
  const results = await axios.get(url);
  const data = results.data.asset_events;
  console.log(data);
  console.log(openseaDataToEvents(data, address));

  return openseaDataToEvents(data, address);
};

const openseaDataToEvents = (data: any[], address: string): NFTEvent[] => {
  /* Data Mapping
		*	Related events are linked by transaction hashes, a standard sale of an NFT
		* will have a "successful" event and a "transfer" event each with the same
		* transaction hash.

		* To determine if something was purchased/sold rather than minted look at
		* the transaction.to_account property. From what I've seen so far, mint
		* events have the contract address, while sale events have the "OpenSea-Orders"
		* user name
	*/

  const events: NFTEvent[] = data
    .filter((d) => {
      const transfer = d.event_type === "transfer";
      const sale = d.event_type === "successful";

      if (sale) {
        return true;
      }

      if (transfer) {
        const minted =
          !d.transaction.to_account ||
          !d.transaction.to_account.user ||
          d.transaction.to_account.user.username !== "OpenSea-Orders";

        return minted;
      }
    })
    .map((d) => {
      console.log(d.event_type);
      if (d.event_type === "successful") {
        const bought =
          d.winner_account.address.toUpperCase() === address.toUpperCase();

        return {
          assetName: d.asset.name,
          assetDescription: d.asset.description,
          assetImgUrl: d.asset.image_url,
          assetUrl: `https://opensea.io/assets/${d.asset.asset_contract.address}/${d.token_id}`,
          collectionName: d.asset.collection.name,
          collectionUrl:
            d.asset.collection.external_url ??
            `https://opensea.io/collection/${d.asset.collection.name}}`,
          collectionDescription: d.asset.collection.description,
          collectionImgUrl: d.asset.collection.featured_image_url,
          date: d.transaction.timestamp,
          from: d.seller.address,
          to: d.winner_account.address,
          action: bought ? "Bought" : "Sold",
          key: d.transaction.transaction_hash,
          price: Number.parseInt(d.total_price),
        };
      } else if (d.event_type === "transfer") {
        return {
          assetName: d.asset.name,
          assetDescription: d.asset.description,
          assetImgUrl: d.asset.image_url,
          assetUrl: `https://opensea.io/assets/${d.asset.asset_contract.address}/${d.token_id}`,
          collectionName: d.asset.collection.name,
          collectionUrl:
            d.asset.collection.external_url ??
            `https://opensea.io/collection/${d.asset.collection.name}}`,
          collectionDescription: d.asset.collection.description,
          collectionImgUrl: d.asset.collection.featured_image_url,
          date: d.transaction.timestamp,
          from: d.from_account.address.toUpperCase(),
          to: d.to_account.address.toUpperCase(),
          action: "Minted",
          key: d.transaction.transaction_hash,
        };
      }
    });

  return events;
};
