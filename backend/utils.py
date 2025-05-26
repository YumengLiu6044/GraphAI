import pandas as pd
from kaggle.api.kaggle_api_extended import KaggleApi
from kagglesdk.datasets.types.dataset_api_service import ApiDownloadDatasetRequest
import requests
from io import BytesIO, StringIO
from zipfile import ZipFile


def load_dataset_from_kaggle(api_client: KaggleApi, owner_slug: str, dataset_slug: str, file_name: str) -> pd.DataFrame:
    with api_client.build_kaggle_client() as kaggle:
        request = ApiDownloadDatasetRequest()
        request.owner_slug = owner_slug
        request.dataset_slug = dataset_slug
        request.file_name = file_name
        response = kaggle.datasets.dataset_api_client.download_dataset(request)

        dataset_url = response.url

    response = requests.get(dataset_url)
    response.raise_for_status()

    content_type = response.headers.get('Content-Type')

    dataframe = None

    if content_type == 'text/csv':
        ascii_text = ''.join(c for c in response.text if ord(c) < 128)
        content = StringIO(ascii_text)
        dataframe = pd.read_csv(content)
        print(dataframe.head())

    else:
        with ZipFile(BytesIO(response.content)) as zip_ref:
            with zip_ref.open(file_name) as f:
                dataframe = pd.read_csv(f)

    return dataframe
