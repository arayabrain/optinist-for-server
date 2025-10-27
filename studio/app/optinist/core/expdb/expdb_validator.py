from studio.app.common.core.workflow.workflow_reader import WorkflowConfigReader
from studio.app.common.schemas.workflow import WorkflowConfig


class ExpDbValidator:
    # List of Layout-Capable Nodes
    _BATCH_ACCEPTABLE_REQUIRED_NODES = frozenset(
        {
            "microscope_expdb",
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
