import importlib
import json
import os
import shutil
import zipfile
import numpy as np
import pandas as pd
from typing import Type

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, classification_report

from backend.models import Layer
from models import DataConfig, ScikitModelConfig, PytorchModelConfig
from kaggle.api.kaggle_api_extended import KaggleApi

from torch.utils.data import TensorDataset, DataLoader
from torch.nn import Module
import torch.nn.functional as F
import torch

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

        self._api_client.dataset_download_file(
            self._data_config.dataset,
            self._data_config.data_file,
            path=save_data_path,
            quiet=self._debug
        )

        data_file_path = os.path.join(save_data_path, self._data_config.data_file)
        renamed_data_file_path = data_file_path.replace(".csv", ".zip")
        os.rename(data_file_path, renamed_data_file_path)
        try:
            with zipfile.ZipFile(renamed_data_file_path, 'r') as zip_ref:
                zip_ref.extractall(save_data_path)

            os.remove(renamed_data_file_path)

        except zipfile.BadZipFile:
            os.rename(renamed_data_file_path, data_file_path)

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


class TrainingJobSklearn(TrainingJob):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def train(self):
        self._get_model_class()
        self._model.fit(self._train_x, self._train_y)

    def eval(self):
        predictions = self._model.predict(self._test_x)
        if self._model_config.learning_type == "classification":
            print(classification_report(self._test_y, predictions))
        else:
            print(mean_squared_error(self._test_y, predictions))

    def _get_model_class(self):
        """Dynamically imports and returns the model class."""
        try:
            module = importlib.import_module(self._model_config.module_name)
            model_class = getattr(module, self._model_config.model_name)
            self._model = model_class(**self._model_config.model_params)
            if self._debug:
                print(f"Loaded model class: {model_class}")

        except ImportError as e:
            print(f"Error importing model class: {e}")


class MergeBranch:
    @staticmethod
    def _concat(branch1, branch2):
        return torch.cat((branch1, branch2), dim=1)

    @staticmethod
    def _add(branch1, branch2):
        return branch1 + branch2

    @staticmethod
    def _multiply(branch1, branch2):
        return branch1 * branch2

    @staticmethod
    def _average(branch1, branch2):
        return (branch1 + branch2) / 2

    @staticmethod
    def _max(branch1, branch2):
        return torch.max(branch1, branch2)

    @staticmethod
    def _bmm(branch1, branch2):
        return torch.bmm(branch1, branch2.transpose(1, 2))

class TrainingJobPytorch(TrainingJob):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._train_loader = None
        self._test_loader = None

        self._model_config.layers = [Layer(**layer) for layer in self._model_config.layers]

        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._criterion = getattr(F, self._model_config.loss_function)

    def load_data(self):
        super().load_data()

        # Convert NumPy arrays to PyTorch tensors
        x_train_tensor = torch.tensor(self._train_x, dtype=torch.float32)
        y_train_tensor = torch.tensor(self._train_y, dtype=torch.long)

        x_test_tensor = torch.tensor(self._test_x, dtype=torch.float32)
        y_test_tensor = torch.tensor(self._test_y, dtype=torch.long)

        # Create datasets
        train_dataset = TensorDataset(x_train_tensor, y_train_tensor)
        test_dataset = TensorDataset(x_test_tensor, y_test_tensor)

        # Create data loaders
        self._train_loader = DataLoader(train_dataset, batch_size=self._data_config.batch_size, shuffle=True)
        self._test_loader = DataLoader(test_dataset, batch_size=self._data_config.batch_size, shuffle=False)

    def _get_model_class(self):
        model_config = self._model_config
        class GeneratedNetwork(Module):
            def __init__(self):
                super(GeneratedNetwork, self).__init__()

                # generate layers
                for layer in model_config.layers:
                    layer_class = getattr(torch.nn, layer.layer)
                    layer_obj = layer_class(**layer.layer_params)
                    layer_var = f"{layer.layer}_{layer.layer_id}"
                    setattr(self, layer_var, layer_obj)

            def forward(self, x):
                if len(model_config.input_shape) != 0:
                    x = x.reshape(-1, *model_config.input_shape)

                # No layer will contain input layers that are not yet defined
                # A mapping of each layer to their output: ex. 1: x
                output_dict = {}

                # A mapping of layer id to the list of output_layers
                dependency_dict = {}

                for layer in model_config.layers:
                    layer_obj = getattr(self, f"{layer.layer}_{layer.layer_id}")

                    try:
                        inputs = [output_dict[input_layer_id] for input_layer_id in layer.input_layers] or [x]
                    except KeyError:
                        raise KeyError(f"Input layer {layer.input_layers} not found in output_dict")

                    if len(inputs) == 1:
                        output = layer_obj(inputs[0])
                        if activation_type := layer.activation:
                            activation_class = getattr(F, activation_type)
                            output = activation_class(output)

                    elif len(inputs) == 2:
                        merging_func = getattr(MergeBranch, f"_{layer.layer}")
                        output = merging_func(*inputs)

                    else:
                        raise ValueError("Only two inputs are supported per layer. Use merge blocks")

                    output_dict[layer.layer_id] = output

                    # Clean up output_dict to reduce memory footprint
                    for input_layer_id in layer.input_layers:
                        if not any(output_dict.get(dependency_layer_id) is None
                                   for dependency_layer_id in dependency_dict[input_layer_id]):
                            output_dict[input_layer_id] = None


                    dependency_dict[layer.layer_id] = layer.output_layers

                return output_dict[model_config.layers[-1].layer_id]

        self._model = GeneratedNetwork()

    def train(self):
        self._get_model_class()

        self._model.to(self._device)

        optimizer = torch.optim.SGD(self._model.parameters(), lr=self._model_config.learning_rate)

        for epoch in range(self._model_config.epochs):
            self._model.train()
            running_loss = 0.0

            for inputs, labels in self._train_loader:
                inputs, labels = inputs.to(self._device), labels.to(self._device)

                optimizer.zero_grad()
                outputs = self._model(inputs)
                loss = self._criterion(outputs, labels)
                loss.backward()
                optimizer.step()

                running_loss += loss.item()

            avg_loss = running_loss / len(self._train_loader)
            print(f"Epoch [{epoch + 1}/{self._model_config.epochs}], Loss: {avg_loss:.4f}")

    def eval(self):
        self._model.eval()
        correct = 0
        total = 0
        running_loss = 0.0

        with torch.no_grad():
            for inputs, labels in self._test_loader:
                inputs = inputs.to(self._device, non_blocking=True)
                labels = labels.to(self._device, non_blocking=True)

                outputs = self._model(inputs)
                loss = self._criterion(outputs, labels)
                running_loss += loss.item()

                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        avg_loss = running_loss / len(self._test_loader)
        accuracy = 100 * correct / total
        print(f"Test Accuracy: {accuracy:.2f}%")
        return avg_loss, accuracy



if __name__ == "__main__":
    job_id = "test_job"

    with open("test_job_torch.json") as f:
        json_data = json.load(f)
        sample_data_config = DataConfig(**json_data["data_config"])
        sample_model_config = PytorchModelConfig(**json_data["model_config"])

        job = TrainingJobPytorch(sample_data_config, sample_model_config, job_id, debug=True)
        job.load_data()
        job.train()
        job.eval()

