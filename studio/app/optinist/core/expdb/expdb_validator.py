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

    @staticmethod
    def validate_batch_nodes_in_workflow(config: WorkflowConfig) -> bool:
        acceptable_nodes = set(__class__._BATCH_ACCEPTABLE_REQUIRED_NODES)
        check_nodes = WorkflowConfigReader.extract_node_names_in_workflow(config)

        # Note: Only one of the optional nodes is accepted.
        is_optional_node_exists = False
        for accept_optional_node in __class__._BATCH_ACCEPTABLE_OPTIONAL_NODES:
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

    @staticmethod
    def validate_batch_roi_method(config: WorkflowConfig) -> SupportedRoiMethod:
        check_nodes = WorkflowConfigReader.extract_node_names_in_workflow(config)

        # Note: Only one of the optional nodes is accepted.
        roi_node_name = None
        for accept_optional_node in __class__._BATCH_ACCEPTABLE_OPTIONAL_NODES:
            if accept_optional_node in check_nodes:
                roi_node_name = accept_optional_node
                break  # Break when one item is added.

        return (
            SupportedRoiMethod.get_roi_method_from_node(roi_node_name)
            if roi_node_name
            else None
        )
