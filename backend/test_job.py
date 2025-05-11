import importlib
import json
import os
import shutil
import pandas as pd
from typing import Type
from models import DataConfig, ModelConfig
from kaggle.api.kaggle_api_extended import KaggleApi

jobs_base_directory = "jobs"

class TrainingJob:
    def __init__(self, data_config: DataConfig, model_config: ModelConfig, job_id: str):
        self._api_client = KaggleApi()
        self._api_client.authenticate()

        self._data_config = data_config
        self._model_config = model_config

        self._job_directory = os.path.join(jobs_base_directory, job_id)

        self._X = None
        self._y = None
        self._model = None

        self._initialize_job_directory()
        self._load_data()
        self._get_model_class()


    def __del__(self):
        shutil.rmtree(self._job_directory)
        print(f"Deleted job: {self._job_directory}")


    def _initialize_job_directory(self):
        if os.path.exists(self._job_directory):
            shutil.rmtree(self._job_directory)

        os.makedirs(self._job_directory)
        print(f"Initialized job directory: {self._job_directory}")

    def _load_data(self):
        save_data_path = os.path.join(self._job_directory, self._data_config.data_path)

        self._api_client.dataset_download_files(
            self._data_config.dataset,
            path=save_data_path,
            quiet=True,
            unzip=True
        )

        data_file_path = os.path.join(save_data_path, self._data_config.data_file)
        dataframe = pd.read_csv(data_file_path)

        self._X = dataframe[self._data_config.input_columns]
        self._y = dataframe[self._data_config.target_column]

        print(f"Loaded data from {data_file_path}")

    def train_model(self):
        try:
            training_function = getattr(self, f"_train_model_{self._model_config.library}")
            training_function()

        except AttributeError:
            raise ValueError("Invalid library specified in config.")

    def _train_model_sklearn(self):
        self._model.fit(self._X, self._y)

    def _train_model_torch(self):
        ...

    def _get_model_class(self) -> Type | None:
        """Dynamically imports and returns the model class."""
        try:
            module = importlib.import_module(self._model_config.module_name)
            model_class = getattr(module, self._model_config.model_name)
            self._model = model_class(**self._model_config.model_params)
            print(f"Loaded model class: {model_class}")

        except ImportError as e:
            print(f"Error importing model class: {e}")


if __name__ == "__main__":
    job_id = "test_job"

    with open("test_job.json") as f:
        json_data = json.load(f)
        sample_data_config = DataConfig(**json_data["data_config"])
        sample_model_config = ModelConfig(**json_data["model_config"])

    job = TrainingJob(sample_data_config, sample_model_config, job_id)
