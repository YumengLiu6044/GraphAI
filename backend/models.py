from dataclasses import dataclass
from typing import List, Dict

@dataclass
class DataConfig:
    normalize: bool
    input_columns: List[str]
    data_path: str
    target_column: str


@dataclass
class ModelConfig:
    model_name: str
    model_params: Dict[str, any]
    module_name: str
    library: str
    learning_type: str