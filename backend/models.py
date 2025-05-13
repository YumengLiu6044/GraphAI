from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class DataConfig:
    exclude_columns: List[str]
    data_path: str
    target_column: str
    dataset: str
    data_file: str
    test_size: float
    batch_size: int = 0

@dataclass
class Layer:
    layer_id: int
    layer: str
    activation: str = ""
    output_layers: List[int] = field(default_factory=list)
    input_layers: List[int] = field(default_factory=list)
    layer_params: Dict[str, any] = field(default_factory=dict)

@dataclass
class PytorchModelConfig:
    learning_type: str
    input_shape: List[int] = field(default_factory=list)
    epochs: int = 10
    learning_rate: float = 0.01
    module_name: str = ""
    loss_function: str = ""
    layers: List[Layer] = field(default_factory=list[Layer])
    model_params: Dict[str, any] = field(default_factory=dict)

@dataclass
class ScikitModelConfig:
    module_name: str
    learning_type: str
    input_shape: List[int] = field(default_factory=list)
    epochs: int = 10
    model_name: str = ""
    loss_function: str = ""
    model_params: Dict[str, any] = field(default_factory=dict)