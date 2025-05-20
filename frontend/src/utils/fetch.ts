import {
	useDatasetSearchRequestStore,
	useDatasetSearchResponseStore,
	useIsLoadingDatasetSearchStore,
} from "./store";

const END_POINT = "http://0.0.0.0:8000/";

export async function searchDataset() {
	const searchRequest = useDatasetSearchRequestStore.getState();
	const setSearchResult = useDatasetSearchResponseStore.getState().setResponse;
	const setSelectedIndex = useDatasetSearchResponseStore.getState().setSelectedIndex;


	const isLoading = useIsLoadingDatasetSearchStore.getState().isLoading;
	const setIsLoading = useIsLoadingDatasetSearchStore.getState().setIsLoading;


	if (isLoading) return;

	setSelectedIndex(-1)

	const params = {
		search: searchRequest.search,
		sort_by: searchRequest.search_by,
		tag_ids: searchRequest.tag_ids,
		min_size: searchRequest.min_size,
		max_size: searchRequest.max_size,
	};

	setIsLoading(true);

	fetch(END_POINT + "searchDataset", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	})
		.then((result) => result.json())
		.then((data) => {
			console.log(data);
			setSearchResult(data);
		})
		.finally(() => {
			setIsLoading(false);
		});
}
