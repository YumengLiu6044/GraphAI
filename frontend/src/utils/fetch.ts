import type { DatasetSearchRequest } from "./types";

export function searchKaggleDataset(query: string){
  const searchRequet: DatasetSearchRequest = {
    search: query
  }
}