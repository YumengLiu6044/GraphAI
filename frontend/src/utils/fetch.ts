import {
	useDatasetSearchRequestStore,
	useDatasetSearchResponseStore,
	useFileSearchStore,
	useIsLoadingDatasetSearchStore,
} from "./store";

const END_POINT = "http://0.0.0.0:8000/";

export function searchDataset() {
	const searchRequest = useDatasetSearchRequestStore.getState();
	const { setResponse: setSearchResult, setSelectedIndex: setSelectedIndex } =
		useDatasetSearchResponseStore.getState();
	const { isLoading, setIsLoading: setIsLoading } =
		useIsLoadingDatasetSearchStore.getState();
	if (isLoading) return;

	setSelectedIndex(-1);

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

export function searchDatasetFiles() {
	const { selectedIndex, response } =
		useDatasetSearchResponseStore.getState();
	const { setFiles, setIsLoading, setSelectedFileIndex } = useFileSearchStore.getState();
	const ref = response[selectedIndex].ref;
	const url = END_POINT + "searchDatasetFiles/" + ref;
	setSelectedFileIndex(-1)
	setIsLoading(true);
	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			setFiles(data.files);
		})
		.finally(() => {
			setIsLoading(false);
		});
}
