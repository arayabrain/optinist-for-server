import os
import re
from typing import Dict, List

from studio.app.common.core.experiment.experiment import ExptOutputPathIds
from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.core.workflow.workflow import (
    Edge,
    Node,
    NodeData,
    NodePosition,
    NodeType,
    Style,
)
from studio.app.common.schemas.workflow import WorkflowConfig
from studio.app.dir_path import DIRPATH


class WorkflowConfigReader:
    @classmethod
    def get_config_yaml_path(cls, workspace_id: str, unique_id: str) -> str:
        path = join_filepath(
            [DIRPATH.OUTPUT_DIR, workspace_id, unique_id, DIRPATH.WORKFLOW_YML]
        )
        return path

    @classmethod
    def get_config_yaml_wild_path(cls, workspace_id: str) -> str:
        path = join_filepath(
            [DIRPATH.OUTPUT_DIR, workspace_id, "*", DIRPATH.WORKFLOW_YML]
        )
        return path

    @classmethod
    def read(cls, workspace_id: str, unique_id: str) -> WorkflowConfig:
        filepath = cls.get_config_yaml_path(workspace_id, unique_id)
        config = ConfigReader.read(filepath)
        assert config, f"Invalid config yaml file: [{filepath}] [{config}]"

        return cls._create_workflow_config(config)

    @classmethod
    def read_from_path(cls, filepath: str) -> WorkflowConfig:
        ids = ExptOutputPathIds(os.path.dirname(filepath))
        return cls.read(ids.workspace_id, ids.unique_id)

    @classmethod
    def _read_from_any_path(cls, filepath: str) -> WorkflowConfig:
        assert os.path.exists(filepath), f"Config yaml file not found: [{filepath}]"

        config = ConfigReader.read(filepath)
        assert config, f"Invalid config yaml file: [{filepath}] [{config}]"

        return cls._create_workflow_config(config)

    @classmethod
    def read_from_bytes(cls, content: bytes) -> WorkflowConfig:
        config = ConfigReader.read_from_bytes(content)
        assert config, f"Invalid config yaml: [{config}]"

        return cls._create_workflow_config(config)

    @classmethod
    def _create_workflow_config(cls, config: dict) -> WorkflowConfig:
        return WorkflowConfig(
            nodeDict=cls.read_nodeDict(config["nodeDict"]),
            edgeDict=cls.read_edgeDict(config["edgeDict"]),
        )

    @classmethod
    def read_nodeDict(cls, config: dict) -> Dict[str, Node]:
        return {
            key: Node(
                id=key,
                type=value["type"],
                data=NodeData(**value["data"]),
                position=NodePosition(**value["position"]),
                style=Style(**value["style"]),
            )
            for key, value in config.items()
        }

    @classmethod
    def read_edgeDict(cls, config: dict) -> Dict[str, Edge]:
        return {
            key: Edge(
                id=key,
                type=value["type"],
                animated=value["animated"],
                source=value["source"],
                sourceHandle=value["sourceHandle"],
                target=value["target"],
                targetHandle=value["targetHandle"],
                style=Style(**value["style"]),
            )
            for key, value in config.items()
        }

    @staticmethod
    def find_node_in_workflow(config: WorkflowConfig, node_name: str) -> Node:
        """
        Find the specified node in the WorkflowConfig

        - Notes:
          - The property to be compared changes depending on the type of node.
            (Data node or Algo node. following the specifications of workflow.yaml)
          - If there are multiple nodes with the same name, return the first one.
        """
        matched_node: Node = None

        for _, node in config.nodeDict.items():
            # NOTE: Switching the property to compare by node type
            checking_node_name = (
                node.data.path if node.type == NodeType.ALGO else node.data.fileType
            )

            if re.search(rf"\b{node_name}$", checking_node_name):
                matched_node = node
                break

        return matched_node

    @classmethod
    def exists_node_in_workflow(cls, config: WorkflowConfig, node_name: str) -> bool:
        node = cls.find_node_in_workflow(config, node_name)
        return node is not None

    @staticmethod
    def extract_node_names_in_workflow(config: WorkflowConfig) -> List[str]:
        """
        Extract each node names contained in the WorkflowConfig

        - Notes:
          - The property to be compared changes depending on the type of node.
            (Data node or Algo node. following the specifications of workflow.yaml)
        """
        node_names = []

        for _, node in config.nodeDict.items():
            # NOTE: Switching the property to compare by node type
            node_name = (
                os.path.basename(node.data.path)
                if node.type == NodeType.ALGO
                else node.data.fileType
            )
            node_names.append(node_name)

        return node_names
