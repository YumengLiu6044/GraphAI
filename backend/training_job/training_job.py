import dotenv
dotenv.load_dotenv()

import os
import numpy as np
import pandas as pd
from typing import Type
from pandas import DataFrame
from sklearn.model_selection import train_test_split
from kaggle.api.kaggle_api_extended import KaggleApi
from backend.models import DataConfig, ScikitModelConfig, PytorchModelConfig
from backend.utils import load_dataset_from_kaggle
jobs_base_directory = "jobs"

class TrainingJob:
    def __init__(
            self,
            data_config: DataConfig,
            model_config: ScikitModelConfig | PytorchModelConfig,
            job_id: str,
            debug: bool = False
        ):
        self._debug = debug

        self._job_completed = False

        self._api_client = KaggleApi()
        self._api_client.authenticate()

        self._data_config = data_config
        self._model_config = model_config

        self._job_directory = os.path.join(jobs_base_directory, job_id)

        self._train_x = None
        self._train_y = None
        self._test_x = None
        self._test_y = None

        self._model = None

        # Mapping of column names to dictionary of source value to converted value
        self._value_map = {}

    def __del__(self):
        if self._debug:
            print(f"Deleted job: {self._job_directory}")


    def _load_dataframe(self) -> DataFrame:
        owner_slug, dataset_slug = self._data_config.dataset.split("/")
        file_name = self._data_config.data_file
        return load_dataset_from_kaggle(self._api_client, owner_slug, dataset_slug, file_name)

    def load_data(self):
        dataframe = self._load_dataframe()

        if (threshold := self._data_config.data_size_threshold) > 0:
            dataframe = dataframe.sample(threshold)

        dataframe.dropna(inplace=True)
        dataframe.drop(columns=self._data_config.exclude_columns, inplace=True)
        dataframe = dataframe.convert_dtypes()

        # Convert all discrete values to numeric values
        for _, column in dataframe.items():
            if (isinstance(column.dtype, pd.StringDtype) or
                    isinstance(column.dtype, pd.CategoricalDtype)):
                dataframe[column.name], uniques = pd.factorize(dataframe[column.name])
                self._value_map[column.name] = {value: index for index, value in enumerate(uniques.tolist())}

        y: np.ndarray = dataframe[self._data_config.target_column].to_numpy(dtype=np.float32)
        X: np.ndarray = dataframe.drop(self._data_config.target_column, axis=1).to_numpy(dtype=np.float32)

        self._train_x, self._test_x, self._train_y, self._test_y = train_test_split(X, y, test_size=self._data_config.test_size)

        if self._debug:
            print(f"Loaded data from successfully")

    def train(self):
        ...

    def eval(self):
        ...

    def _get_model_class(self) -> Type | None:
        ...
