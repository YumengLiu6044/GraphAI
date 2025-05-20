import { create } from "zustand";
import type { DatasetSearchRequest } from "./types";

export const useDatasetSearchRequestStore = create<DatasetSearchRequest>(
	(set) => ({
		search_by: "votes",
		tag_ids: null,
		search: "",
		min_size: 0,
		max_size: 50 * 1024 * 1024,
		setSearchBy: (searchBy) => set(() => ({ search_by: searchBy })),
		setTagIds: (tag_ids) => set(() => ({ tag_ids })),
		setSearch: (search) => set(() => ({ search })),
		setFileSizeLimit: (range) =>
			set(() => ({ min_size: range[0], max_size: range[1] })),
	})
);
