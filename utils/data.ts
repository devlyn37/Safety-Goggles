import axios from "axios";

export const getEvents = async (
  address: string,
  limit: number,
  offset: number
) => {
  const url = `https://api.opensea.io/api/v1/events?account_address=${address}&only_opensea=false&offset=${offset}&limit=${limit}&event_type=transfer`;
  console.log(url);
  const results = await axios.get(url);
  const events = results.data.asset_events;
  console.log(events);
  return events;
};

export const groupEvents = (events: any[], address: string) => {
  let currCollection: string;
  let currBought: boolean;
  let currBucket: any[];
  const groups: any[][] = [];

  for (const event of events) {
    const collection = event.collection_slug;
    const bought =
      event.to_account.address.toUpperCase() === address.toUpperCase();

    if (currCollection !== collection || currBought !== bought) {
      currBucket = [event];
      groups.push(currBucket);
    } else {
      currBucket.push(event);
    }

    currCollection = collection;
    currBought = bought;
  }

  return groups;
};

export const mergeEventGroupings = (
  existing: any[][],
  newG: any[][]
): any[][] => {
  const lastExisting = existing[existing.length - 1][0];
  const firstNew = newG[0][0];

  if (
    lastExisting.asset.collection.name === firstNew.asset.collection.name &&
    lastExisting.to_account.address === firstNew.to_account.address &&
    lastExisting.from_account.address === firstNew.from_account.address
  ) {
    return [
      ...existing.slice(0, -1),
      [...existing[existing.length - 1], ...newG[0]],
      ...newG.slice(1),
    ];
  }

  return [...existing, ...newG];
};
