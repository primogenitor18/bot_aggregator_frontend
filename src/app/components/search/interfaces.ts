export interface IProviderSearchResult {
  [key: string]: any;
}

export interface ISearchResult {
  providerName: string;
  data: IProviderSearchResult[];
}
