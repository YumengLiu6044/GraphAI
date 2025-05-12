import importlib
import json
import os
import shutil
import pandas as pd
from typing import Type
from sklearn.model_selection import train_test_split
from models import DataConfig, ModelConfig
from kaggle.api.kaggle_api_extended import KaggleApi
from sklearn.metrics import mean_squared_error, classification_report

jobs_base_directory = "jobs"

class TrainingJob:
    def __init__(self, data_config: DataConfig, model_config: ModelConfig, job_id: str, debug: bool = False):
        self._debug = debug

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
        self._get_model_class()

    def __del__(self):
        # shutil.rmtree(self._job_directory)

        if self._debug:
            print(f"Deleted job: {self._job_directory}")


    def _initialize_job_directory(self):
        if os.path.exists(self._job_directory):
            shutil.rmtree(self._job_directory)

        os.makedirs(self._job_directory)
        if self._debug:
            print(f"Initialized job directory: {self._job_directory}")

    def load_data(self):
        save_data_path = os.path.join(self._job_directory, self._data_config.data_path)

        self._api_client.dataset_download_files(
            self._data_config.dataset,
            path=save_data_path,
            quiet=True,
            unzip=True
        )

        data_file_path = os.path.join(save_data_path, self._data_config.data_file)
        dataframe = pd.read_csv(data_file_path)

        dataframe.dropna(inplace=True)
        dataframe.drop(columns=self._data_config.exclude_columns, inplace=True)

        dataframe = dataframe.convert_dtypes()

        # Convert all discrete values to numeric values
        for _, column in dataframe.items():
            if (isinstance(column.dtype, pd.StringDtype) or
                    isinstance(column.dtype, pd.CategoricalDtype)):
                dataframe[column.name], uniques = pd.factorize(dataframe[column.name])
                self._value_map[column.name] = {value: index for index, value in enumerate(uniques.tolist())}

        y = dataframe[self._data_config.target_column]
        X = dataframe.drop(self._data_config.target_column, axis=1)

        self._train_x, self._test_x, self._train_y, self._test_y = train_test_split(X, y, test_size=self._data_config.test_size)

        if self._debug:
            print(f"Loaded data from {data_file_path}")

    def train(self):
        try:
            training_function = getattr(self, f"_train_model_{self._model_config.library}")
            training_function()
            if self._debug:
                print(f"Trained model using {self._model_config.library}")

        except AttributeError:
            raise ValueError("Invalid library specified in config.")

    def _train_model_sklearn(self):
        self._model.fit(self._train_x, self._train_y)


    def _train_model_torch(self):
        ...

    def eval(self):
        try:
            eval_function = getattr(self, f"_eval_{self._model_config.library}")
            eval_function()
            if self._debug:
                print(f"evaluated model using {self._model_config.library}")

        except AttributeError:
            raise ValueError("Invalid library specified in config.")

    def _eval_sklearn(self):
        predictions = self._model.predict(self._test_x)
        if self._model_config.learning_type == "classification":
            print(classification_report(self._test_y, predictions))
        else:
            print(mean_squared_error(self._test_y, predictions))


    def _eval_torch(self):
        ...

    def _get_model_class(self) -> Type | None:
        """Dynamically imports and returns the model class."""
        try:
            module = importlib.import_module(self._model_config.module_name)
            model_class = getattr(module, self._model_config.model_name)
            self._model = model_class(**self._model_config.model_params)
            if self._debug:
                print(f"Loaded model class: {model_class}")

        except ImportError as e:
            print(f"Error importing model class: {e}")


if __name__ == "__main__":
    job_id = "test_job"

    with open("test_job.json") as f:
        json_data = json.load(f)
        sample_data_config = DataConfig(**json_data["data_config"])
        sample_model_config = ModelConfig(**json_data["model_config"])

    job = TrainingJob(sample_data_config, sample_model_config, job_id, debug=True)
    job.load_data()
    job.train()
    job.eval()

