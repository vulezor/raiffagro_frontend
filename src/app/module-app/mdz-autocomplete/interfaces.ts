export interface MdzAutocompleteOptions {
  height?: number;
  width?: number;
  top?: number;
  left?: number;
  url: string;
  filter?: {
    additionalFilters: string[];
    searchColumns: string[];
  };
  perPage: number;
  scrollHeight: number;
  direction: string;
}
