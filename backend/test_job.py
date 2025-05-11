import importlib
import json
import os
import pandas as pd
from dataclasses import dataclass
from typing import List, Dict, Type
from models import DataConfig, ModelConfig




class TrainingJob:
    def __init__(self):
        self._data_config = None
        self._model_config = None
        self._X = None
        self._y = None
        self._model = None

        self._file_id = os.path.basename(__file__).split('.')[0]

        self.load_config()
        self.load_data()
        self.get_model_class()

    def load_config(self):
        config_path = f"/kaggle/input/config-data/{self._file_id}.json"
        # debug statement for local testing
        # config_path = "../sample_data/test_job.json"

        with open(config_path) as f:
            json_data = json.load(f)
            self._data_config = DataConfig(**json_data["data_config"])
            self._model_config = ModelConfig(**json_data["model_config"])

    def load_data(self):
        dataframe = pd.read_csv(self._data_config.data_path)
        self._X = dataframe[self._data_config.input_columns]
        self._y = dataframe[self._data_config.target_column]

    def train_model(self):
        try:
            training_function = getattr(self, f"train_model_{self._model_config.learning_type}")
            training_function()
        except AttributeError:
            raise ValueError("Invalid library specified in config.")

    def train_model_sklearn(self):
        self._model.fit(self._X, self._y)

    def train_model_torch(self):
        ...

    def get_model_class(self) -> Type | None:
        """Dynamically imports and returns the model class."""
        try:
            module = importlib.import_module(self._model_config.module_name)
            model_class = getattr(module, self._model_config.model_name)
            self._model = model_class(**self._model_config.model_params)

        except ImportError as e:
            print(f"Error importing model class: {e}")
