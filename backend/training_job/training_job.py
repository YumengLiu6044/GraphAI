import os
import shutil
import zipfile
import numpy as np
import pandas as pd
from typing import Type
from sklearn.model_selection import train_test_split
from kaggle.api.kaggle_api_extended import KaggleApi
from backend.models import DataConfig, ScikitModelConfig, PytorchModelConfig
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
        self._initialize_job_directory()

    def __del__(self):
        if self._job_completed:
            shutil.rmtree(self._job_directory)

        if self._debug:
            print(f"Deleted job: {self._job_directory}")


    def _initialize_job_directory(self):
        if not os.path.exists(self._job_directory):
            os.makedirs(self._job_directory)

        if self._debug:
            print(f"Initialized job directory: {self._job_directory}")

    def load_data(self):
        save_data_path = self._job_directory
        data_file_path = os.path.join(save_data_path, self._data_config.data_file)

        # Prevent redownloading data
        if not os.path.exists(data_file_path):
            self._api_client.dataset_download_file(
                self._data_config.dataset,
                self._data_config.data_file,
                path=save_data_path,
                quiet=self._debug
            )

            renamed_data_file_path = data_file_path.replace(".csv", ".zip")
            os.rename(data_file_path, renamed_data_file_path)
            try:
                with zipfile.ZipFile(renamed_data_file_path, 'r') as zip_ref:
                    zip_ref.extractall(save_data_path)

                os.remove(renamed_data_file_path)

            except zipfile.BadZipFile:
                os.rename(renamed_data_file_path, data_file_path)

        dataframe = pd.read_csv(data_file_path)
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
            print(f"Loaded data from {data_file_path}")

    def train(self):
        ...

    def eval(self):
        ...

    def _get_model_class(self) -> Type | None:
        ...
