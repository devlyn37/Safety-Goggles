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
  action: "Minted" | "Bought" | "Sold" | "transfer" | "successful"; // transfer and successful represent an incomplete event
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

  const events: NFTEvent[] = [];
  const transfers = data.filter((d) => d.event_type === "transfer");
  const successfuls = data.filter((d) => d.event_type === "successful");

  transfers.forEach((transfer, i) => {
    const successIndex = successfuls.findIndex((s) => {
      return (
        s.transaction.transaction_hash === transfer.transaction.transaction_hash
      );
    });

    // Bought or Sold
    if (successIndex) {
      const successEvent = successfuls[successIndex];
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

      transfers.splice(i, 1);
      successfuls.splice(successIndex, 1);
      return;
    }

    // Minted
    if (
      !transfer.transaction.user ||
      transfer.transaction.to_account.user.username !== "OpenSea-Orders"
    ) {
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

      transfers.splice(i, 1);
      return;
    }
  });

  // Any event data remaining in the transfer or successful arrays is incomplete
  // and will likely be completed when more data is loaded
  successfuls.forEach((event) => {
    events.push({
      assetName: event.asset.name,
      assetDescription: event.asset.description,
      assetImgUrl: event.asset.image_url,
      assetUrl: `https://opensea.io/assets/${event.asset.asset_contract.address}/${event.token_id}`,
      collectionName: event.asset.collection.name,
      collectionUrl:
        event.asset.collection.external_url ??
        `https://opensea.io/collection/${event.asset.collection.name}}`,
      collectionDescription: event.asset.collection.description,
      collectionImgUrl: event.asset.collection.featured_image_url,
      date: event.transaction.timestamp,
      from: event.seller.address,
      to: event.winner_account.address,
      action: event.event_type,
      key: event.transaction.transaction_hash,
      price: Number.parseInt(event.total_price),
    });
  });

  transfers.forEach((event) => {
    events.push({
      assetName: event.asset.name,
      assetDescription: event.asset.description,
      assetImgUrl: event.asset.image_url,
      assetUrl: `https://opensea.io/assets/${event.asset.asset_contract.address}/${event.token_id}`,
      collectionName: event.asset.collection.name,
      collectionUrl:
        event.asset.collection.external_url ??
        `https://opensea.io/collection/${event.asset.collection.name}}`,
      collectionDescription: event.asset.collection.description,
      collectionImgUrl: event.asset.collection.featured_image_url,
      date: event.transaction.timestamp,
      from: event.from_account.address,
      to: event.to_account.address,
      action: event.event_type,
      key: event.transaction.transaction_hash,
    });
  });

  return events;
};

export const mergeData = (
  existing: NFTEvent[],
  newG: NFTEvent[],
  address: string
): NFTEvent[] => {
  const filledExisting = existing.map((event) => {
    const transfer = event.action === "transfer";
    const successful = event.action === "successful";

    if (transfer || successful) {
      const missingInfoIndex = newG.findIndex(
        (newEvent) => newEvent.key === event.key
      );

      newG.splice(missingInfoIndex, 1);

      if (!missingInfoIndex) {
        return event;
      }

      const missingInfo = newG[missingInfoIndex];
      const transferEvent = transfer ? event : missingInfo;
      const successEvent = successful ? event : missingInfo;

      const bought = successEvent.to.toUpperCase() === address.toUpperCase();
      return {
        ...successEvent,
        action: bought ? "Bought" : "Sold",
      } as NFTEvent;
    }

    return event;
  });

  return [...filledExisting, ...newG];
};
