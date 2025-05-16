from enum import Enum
from .training_job import TrainingJob
from torch.nn import Module
from torch.utils.data import DataLoader, TensorDataset
import torch.nn.functional as F
import torch
from backend.models import Layer, PytorchModelConfig, DataConfig


class MergeBranch(Enum):
    concat = "concat"
    add = "add"
    multiply = "multiply"
    average = "average"
    max = "max"
    bmm = "bmm"

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
    def __init__(
            self,
            data_config: DataConfig,
            model_config: PytorchModelConfig,
            job_id: str,
            debug: bool = False
        ):
        super().__init__(data_config, model_config, job_id, debug)

        self._train_loader = None
        self._test_loader = None

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

                self.layers = torch.nn.ModuleDict()

                for layer in model_config.layers:
                    try:
                        layer_class = getattr(torch.nn, layer.layer)
                        layer_obj = layer_class(**layer.layer_params)
                        layer_name = f"{layer.layer}_{layer.layer_id}"
                        self.layers[layer_name] = layer_obj
                    except AttributeError:
                        pass  # Handle custom or unsupported layers here

            def forward(self, x):
                if len(model_config.input_shape) != 0:
                    x = x.reshape(-1, *model_config.input_shape)

                # No layer will contain input layers that are not yet defined
                # A mapping of each layer to their output: ex. 1: x
                output_dict = {}

                # A mapping of layer id to the list of output_layers
                dependency_dict = {}

                for layer in model_config.layers:
                    try:
                        inputs = [output_dict[input_layer_id] for input_layer_id in layer.input_layers] or [x]
                    except KeyError:
                        raise KeyError(f"Input layer {layer.input_layers} not found in output_dict")

                    if len(inputs) == 1:
                        layer_obj = self.layers[f"{layer.layer}_{layer.layer_id}"]
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
                        if not any(dependent_layer_id not in output_dict
                                   for dependent_layer_id in dependency_dict[input_layer_id]):
                            output_dict[input_layer_id] = None


                    dependency_dict[layer.layer_id] = layer.output_layers

                return output_dict[model_config.layers[-1].layer_id]

        self._model = GeneratedNetwork()

    def train(self):
        self._get_model_class()
        if self._debug:
            print(self._model)

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
            if self._debug:
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
        if self._debug:
            print(f"Test Accuracy: {accuracy:.2f}%")

        self._job_completed = True

        return avg_loss, accuracy
