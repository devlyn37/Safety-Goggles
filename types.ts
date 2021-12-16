export interface CollectionInfo {
  name: string;
  slug: string;
  imgUrl: string;
  holding: string;
  floor?: string;
}

export type Filter = "successful" | "transfer" | "";
export type Action = "Minted" | "Bought" | "Sold" | "Sent" | "Received";

export interface SearchCriteria {
  address: string;
  ens: string;
  startDate: string;
  endDate: string;
  filter: Filter;
  page: number;
  collectionSlug: string;
}

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
