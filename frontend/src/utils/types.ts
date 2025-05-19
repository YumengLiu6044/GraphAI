import type { NavigateFunction } from "react-router-dom"


export type SidebarOption = {
	iconName: string,
	action: string,
	shortcut?: string,
	onClick?: (navigate?: NavigateFunction) => void
}

export type DatasetSearchRequest = {
  sort_by?: string; // default: "votes"
  tag_ids?: string[] | null; // default: null
  page?: number; // default: 1
  search?: string; // default: ""
  min_size?: number; // default: 0, between 0 and 50*1024*1024
  max_size?: number; // default: 50*1024*1024, between 0 and 50*1024*1024
};

export type DatasetSearchResponseItem = {
  title: string;
  subtitle: string;
  owner: string;
  last_updated: string;
  votes: number;
  tags: string[];
};
