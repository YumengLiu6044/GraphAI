from dataclasses import dataclass, field
from typing import List, Dict
from pydantic import BaseModel, Field


@dataclass
class DataConfig:
    exclude_columns: List[str]
    target_column: str
    dataset: str
    data_file: str
    test_size: float
    data_size_threshold: int = -1
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


class DatasetSearchRequest(BaseModel):
    sort_by: str = "votes"
    tag_ids: List[str] = Field(default_factory=list)
    search: str = ""
    min_size: int = Field(default=0, ge=0, le=50*1024*1024)
    max_size: int = Field(default=50*1024*1024, ge=0, le=50*1024*1024)


@dataclass
class DatasetSearchResponseItem:
    title: str = ""
    owner: str = ""
    featured: bool = False
    size: int = 0
    last_updated: str = ""
    url: str = ""
    ref: str = ""
    votes: int = field(default=0)

@dataclass
class DatasetFileSearchResponse:
    files: List[dict[str: any]] = field(default_factory=list)

@dataclass
class DatasetColumnsResponse:
    data: Dict[str, List[any]] = field(default_factory=dict)