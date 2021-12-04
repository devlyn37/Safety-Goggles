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
