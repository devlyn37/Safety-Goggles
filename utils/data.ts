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
  console.log("hi");
  console.log(data);
  console.log(data.length);

  return openseaDataToEvents(data, address);
};

const openseaDataToEvents = (data: any[], address: string): NFTEvent[] => {
  /* Data Mapping
		*	Related events are linked by transaction hashes, a standard sale of an NFT
		* will have a "successful" event and a "tranfer" event each with the same
		* transaction hash.

		* To determine if something was purchased/sold rather than minted look at
		* the transaction.to_account property. From what I've seen so far, mint
		* events have the contract address, while sale events have the "OpenSea-Orders"
		* user name
	*/

  let events: NFTEvent[] = [];

  data.forEach((transfer) => {
    if (transfer.event_type !== "transfer") {
      return;
    }

    // Was it minted or bought/sold
    const successEvent = data.find((related) => {
      return (
        related.event_type === "successful" &&
        related.transaction.transaction_hash ===
          transfer.transaction.transaction_hash
      );
    });

    if (successEvent) {
      const bought =
        successEvent.winner_account.address.toUpperCase() ===
        address.toUpperCase();

      events.push({
        assetName: transfer.asset.name,
        assetDescription: transfer.asset.description,
        assetImgUrl: transfer.asset.image_url,
        assetUrl: `https://opensea.io/assets/${transfer.asset.asset_contract.address}/${transfer.token_id}`,
        collectionName: transfer.asset.collection.name,
        collectionUrl:
          transfer.asset.collection.external_url ??
          `https://opensea.io/collection/${transfer.asset.collection.name}}`,
        collectionDescription: transfer.asset.collection.description,
        collectionImgUrl: transfer.asset.collection.featured_image_url,
        date: transfer.transaction.timestamp,
        from: transfer.from_account.address.toUpperCase(),
        to: transfer.to_account.address.toUpperCase(),
        action: bought ? "Bought" : "Sold",
        price: Number.parseInt(successEvent.total_price),
        key: transfer.transaction.transaction_hash,
      });
    } else {
      // This means that the corresponding success event probably exists but wasn't loaded
      // because of pagination, this will show up when more are loaded
      if (
        transfer.transaction.user &&
        transfer.transaction.to_account.user.username === "OpenSea-Orders"
      ) {
        return;
      }

      events.push({
        assetName: transfer.asset.name,
        assetDescription: transfer.asset.description,
        assetImgUrl: transfer.asset.image_url,
        assetUrl: `https://opensea.io/assets/${transfer.asset.asset_contract.address}/${transfer.token_id}`,
        collectionName: transfer.asset.collection.name,
        collectionUrl:
          transfer.asset.collection.external_url ??
          `https://opensea.io/collection/${transfer.asset.collection.name}}`,
        collectionDescription: transfer.asset.collection.description,
        collectionImgUrl: transfer.asset.collection.featured_image_url,
        date: transfer.transaction.timestamp,
        from: transfer.from_account.address.toUpperCase(),
        to: transfer.to_account.address.toUpperCase(),
        action: "Minted",
        key: transfer.transaction.transaction_hash,
      });
    }
  });

  return events;
};

export const groupEvents = (events: NFTEvent[]): NFTEvent[][] => {
  let prevCollection: string;
  let prevAction: string;
  let prevBucket: NFTEvent[];
  const groups: NFTEvent[][] = [];

  for (const event of events) {
    const collection = event.collectionName;
    const action = event.action;

    if (prevCollection !== collection || prevAction !== action) {
      prevBucket = [event];
      groups.push(prevBucket);
    } else {
      prevBucket.push(event);
    }

    prevCollection = collection;
    prevAction = action;
  }

  return groups;
};

export const mergeEventGroupings = (
  existing: NFTEvent[][],
  newG: NFTEvent[][]
): NFTEvent[][] => {
  const lastExisting = existing[existing.length - 1][0];
  const firstNew = newG[0][0];

  if (
    lastExisting.collectionName === firstNew.collectionName &&
    lastExisting.action === firstNew.action &&
    lastExisting.to === firstNew.to &&
    lastExisting.from === firstNew.from
  ) {
    return [
      ...existing.slice(0, -1),
      [...existing[existing.length - 1], ...newG[0]],
      ...newG.slice(1),
    ];
  }

  return [...existing, ...newG];
};
