import importlib.util
from typing import List

from studio.app.common.core.workflow.workflow_reader import WorkflowConfigReader
from studio.app.common.schemas.workflow import WorkflowConfig
from studio.app.optinist.core.expdb.batch_const import SupportedRoiMethod


class ExpDbValidator:
    _BATCH_INPUT_NODE_NAME = "expdb_batch_microscope_expdb"

    # List of Layout-Capable Nodes
    _BATCH_ACCEPTABLE_REQUIRED_NODES = frozenset(
        {
            _BATCH_INPUT_NODE_NAME,
            "preprocessing",
            "analyze_stats",
        }
    )
    _BATCH_ACCEPTABLE_OPTIONAL_NODES = frozenset(
        {
            "caiman_cnmf_preprocessing",
            "suite2p_preprocessing",
        }
    )
    BATCH_ACCEPTABLE_NODES = list(
        _BATCH_ACCEPTABLE_REQUIRED_NODES | _BATCH_ACCEPTABLE_OPTIONAL_NODES
    )

    @classmethod
    def validate_batch_nodes_in_workflow(cls, config: WorkflowConfig) -> bool:
        acceptable_nodes = set(cls._BATCH_ACCEPTABLE_REQUIRED_NODES)
        check_nodes = WorkflowConfigReader.extract_node_names_in_workflow(config)

        # Note: Only one of the optional nodes is accepted.
        is_optional_node_exists = False
        for accept_optional_node in cls._BATCH_ACCEPTABLE_OPTIONAL_NODES:
            if accept_optional_node in check_nodes:
                is_optional_node_exists = True
                acceptable_nodes.add(accept_optional_node)
                break  # Break when one item is added.

        # Set default optional node
        if not is_optional_node_exists:
            return False

        # Exact match check for node list
        acceptable_nodes_matched = sorted(check_nodes) == sorted(list(acceptable_nodes))

        return acceptable_nodes_matched

    @classmethod
    def validate_batch_roi_method(cls, config: WorkflowConfig) -> SupportedRoiMethod:
        check_nodes = WorkflowConfigReader.extract_node_names_in_workflow(config)

        # Note: Only one of the optional nodes is accepted.
        roi_node_name = None
        for accept_optional_node in cls._BATCH_ACCEPTABLE_OPTIONAL_NODES:
            if accept_optional_node in check_nodes:
                roi_node_name = accept_optional_node
                break  # Break when one item is added.

        return (
            SupportedRoiMethod.get_roi_method_from_node(roi_node_name)
            if roi_node_name
            else SupportedRoiMethod.UNSUPPORTED
        )


class ExpDbEnviromentValidator:
    @staticmethod
    def check_available_roi_methods() -> List[SupportedRoiMethod]:
        result: List[SupportedRoiMethod] = []

        # Check caiman availability
        if importlib.util.find_spec("caiman") is not None:
            result.append(SupportedRoiMethod.CAIMAN)

            # In environments where caiman is available,
            #   roi_method:unsupported is also included in the processing.
            # Note: The processing of roi_method:unsupported is actually
            #   independent of caiman, but to prevent the unsupported method
            #   from being executed multiple times, it is executed only
            #   in specific environments.
            result.append(SupportedRoiMethod.UNSUPPORTED)

        # Check suite2p availability
        if importlib.util.find_spec("suite2p") is not None:
            result.append(SupportedRoiMethod.SUITE2P)

        return result
