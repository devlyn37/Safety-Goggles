import axios from "axios";
import { Action, CollectionInfo } from "../types";
const OSBaseUrl = "/api/opensea-proxy";

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
  action: Action;
  key: string;
  transactionHash: string; // event's from opensea can have the same transaction hash, can't just store this in key (ex. mintpass transaction)
  price?: number;
}

/*
 * This function grabs collections from two sources, a wallet's most recent events, and a wallets held nfts.
 * collection stats (floor price + others) are only included with held collections but as of right now (late 2021)
 * are inaccurate. When needed, this data is supplemented with the real time stats endpoint (GetCollectionFloor).
 */
export const getCollections = async (
  address: string
): Promise<CollectionInfo[]> => {
  const collectionUrl = `${OSBaseUrl}/collections?${
    "asset_owner=" + address
  }&offset=0&limit=300`;
  const eventUrl = `${OSBaseUrl}/events?account_address=${address}&only_opensea=false&offset=0&limit=300`;

  const [heldCollections, recentEvents] = await Promise.all([
    axios.get(collectionUrl).then((res) => res.data),
    axios.get(eventUrl).then((res) => filterEvents(res.data.asset_events)),
  ]);

  const fromHeld: CollectionInfo[] = heldCollections.map(
    (c: any): CollectionInfo => ({
      name: c.name,
      slug: c.slug,
      imgUrl: c.image_url,
      holding: c.owned_asset_count,
    })
  );

  let fromEvents: CollectionInfo[] = recentEvents.map(
    (d: any): CollectionInfo => {
      // Account for bundle sales To-do expand this
      const asset = d.asset ?? d.asset_bundle.assets[0];

      return {
        name: asset.collection.name,
        slug: asset.collection.slug,
        imgUrl: asset.collection.image_url,
        holding: "0",
      };
    }
  );

  // Filter duplicate data from events for held collections
  let hash: Record<string, boolean> = {};
  fromHeld.forEach((c) => {
    hash[c.slug] = true;
  });

  fromEvents = fromEvents.filter((c) => {
    if (hash[c.slug]) {
      return false;
    } else {
      hash[c.slug] = true;
      return true;
    }
  });

  return [...fromHeld, ...fromEvents];
};

export const getCollection = async (
  collectionSlug: string
): Promise<CollectionInfo> => {
  const url = `${OSBaseUrl}/collection/${collectionSlug}`;
  const results = await axios.get(url);
  const collection = results.data.collection;

  // Set holding to zero by default, collections the user holds will be loaded already.
  return {
    name: collection.name,
    slug: collection.slug,
    imgUrl: collection.image_url,
    holding: "0",
    floor: collection.stats.floor_price,
  };
};

export const getCollectionFloor = async (
  collectionSlug: string
): Promise<string> => {
  const url = `${OSBaseUrl}/collection/${collectionSlug}/stats`;
  const results = await axios.get(url);
  return results.data.stats.floor_price;
};

export const getEvents = async (
  address: string,
  limit: number,
  offset: number,
  startDate?: string,
  endDate?: string,
  collectionSlug?: string,
  filter?: string
): Promise<[NFTEvent[], boolean]> => {
  let url = `${OSBaseUrl}/events?account_address=${address}&only_opensea=false&offset=${offset}&limit=${limit}`;

  // To-do lets use query string here

  if (startDate) {
    url += "&occurred_after=" + startDate + "T00:00:00";
  }

  if (endDate) {
    url += "&occurred_before=" + endDate + "T00:00:00";
  }

  if (collectionSlug) {
    url += "&collection_slug=" + collectionSlug;
  }

  if (filter) {
    url += "&event_type=" + filter;
  }

  const results = await axios.get(url);
  const data = results.data.asset_events;
  const moreData = data.length === limit;

  const events: NFTEvent[] = filterEvents(data).map((d) =>
    dataToEvent(d, address)
  );

  return [events, moreData];
};

const determineAction = (openseaData: any, address: string): Action => {
  if (
    openseaData.event_type !== "successful" &&
    openseaData.event_type !== "transfer"
  ) {
    throw new Error(
      "Opensea events that aren't of the type transfer or successful should be filtered out before determining type"
    );
  }

  if (openseaData.event_type === "successful") {
    return openseaData.winner_account.address.toUpperCase() ===
      address.toUpperCase()
      ? "Bought"
      : "Sold";
  }

  const transactionStarter = openseaData.transaction.from_account;
  const transactionParticipant = openseaData.transaction.to_account;
  const reciever = openseaData.to_account;
  const sender = openseaData.from_account;

  /*
   * This needs to be improved as I understand the data and different cases better
   * For example a case that is currently broken is nfts being purchased from other marketplaces
   * http://localhost:3000/?wallet=0x1eb59fb4c8b6675ba2a8f4153f99bdef6ca24696&contract_address=rarible&filter=transfer
   */
  if (
    transactionParticipant &&
    transactionStarter.address.toUpperCase() ===
      reciever.address.toUpperCase() &&
    transactionStarter.address.toUpperCase() === address.toUpperCase() &&
    transactionParticipant.address !== reciever.address &&
    transactionParticipant.address !== sender.address
  ) {
    return "Minted";
  } else if (sender.address.toUpperCase() === address.toUpperCase()) {
    return "Sent";
  } else {
    return "Received";
  }
};

const dataToEvent = (d: any, address: string): NFTEvent => {
  /* Data Mapping
	 	*	Related events are linked by transaction hashes, a standard sale of an NFT
		* will have a "successful" event and a "transfer" event each with the same
		* transaction hash.

		* To determine if something was purchased/sold rather than minted look at
		* the transaction.to_account property. From what I've seen so far, mint
		* events have the contract address, while sale events have the "OpenSea-Orders"
		* user name
	*/

  const action: Action = determineAction(d, address);
  const successAction: Boolean = action === "Bought" || action === "Sold";

  const from: string = successAction
    ? d.seller?.address
    : action === "Minted"
    ? d.contract_address
    : d.from_account?.address;

  const to: string = successAction
    ? d.winner_account?.address
    : d.to_account?.address;

  const collectionImgUrl: string =
    d.asset.collection?.featured_image_url ??
    d.asset.collection?.image_url ??
    d.asset.collection?.banner_image_url;

  const collectionUrl: string =
    d.asset.collection?.external_url ??
    `https://opensea.io/collection/${d.asset.collection.slug}`;

  const event: NFTEvent = {
    assetName: d.asset.name ?? d.asset.token_id,
    assetDescription: d.asset.description,
    assetImgUrl: d.asset.image_url,
    assetUrl: `https://opensea.io/assets/${d.asset.asset_contract.address}/${d.asset.token_id}`,
    collectionName: d.asset.collection?.name,
    collectionUrl: collectionUrl,
    collectionDescription: d.asset.collection?.description,
    collectionImgUrl: collectionImgUrl,
    date: new Date(d.transaction.timestamp).toUTCString(),
    from: from,
    to: to,
    action: action,
    key: d.transaction.transaction_hash + d.asset.id,
    transactionHash: d.transaction.transaction_hash,
  };

  if (successAction) {
    event.price = Number.parseInt(d.total_price);
  }

  return event;
};

/*
 * for each purchase or sale, OpenSea event data contains 2 events:
 * one for the sale, one for the transfer. This function filters out
 * the transfer events for sales so that we know any transfer events
 * in the data are independent.
 */
const filterEvents = (data: any[]): any[] => {
  const filter = (d) => {
    const transfer = d.event_type === "transfer";
    const sale = d.event_type === "successful";

    // Just filter out until more is known about these cases
    if (!d.transaction || !d.asset) {
      return false;
    }

    if (sale) {
      return true;
    }

    if (transfer) {
      const saleTransfer =
        d.transaction.to_account &&
        d.transaction.to_account.user &&
        d.transaction.to_account.user.username === "OpenSea-Orders";
      return !saleTransfer;
    }
  };

  return data.filter(filter);
};

/*
 * This function groups similar events together, ex. a wallet bought 10 nfts
 * from the same collection in a row.
 */
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
