import importlib.util
from typing import List

from studio.app.common.core.workflow.workflow_reader import WorkflowConfigReader
from studio.app.common.schemas.workflow import WorkflowConfig
from studio.app.optinist.core.expdb.batch_const import SupportedRoiMethod


class ExpDbValidatorConfig:
    # If flag USE_STRICT_VALIDATION is true,
    #   validation of ExpDbBatch processing will be strict.
    #
    # - Validation of analysis batch workflow configuration
    #   - True case:
    #       - If a strict workflow is not configured in the Workflow screen,
    #         a validation error will occur.
    #   - False case:
    #       - Validation of workflow configuration is omitted in the Workflow screen.
    #       - However, if the minimum required node (roi node) is missing,an error
    #          will be detected in the subsequent analysis batch processing phase.
    #
    # - Display control of algorithm nodes selectable in the Workflow screen
    #   - True case:
    #       - Only nodes related to the analysis batch can be selected.
    #   - False case:
    #       - All nodes, not just analysis batches, can be selected.
    USE_STRICT_VALIDATION = False  # default is False


class ExpDbValidator:
    _BATCH_INPUT_NODE_NAME = "expdb_batch_microscope_expdb"

    # List of Layout-Capable Nodes
    _BATCH_ACCEPTABLE_REQUIRED_NODES = frozenset(
        {
            _BATCH_INPUT_NODE_NAME,
            "preprocessing",
        }
    )
    _BATCH_ACCEPTABLE_OPTIONAL_ROI_NODES = frozenset(
        {
            "caiman_cnmf_preprocessing",
            "suite2p_preprocessing",
        }
    )
    _BATCH_ANALYZE_STAT_SUB_NODES = frozenset(
        {
            "stat_file_convert",
            "anova1_mult",
            "vector_average",
            "curvefit_tuning",
        }
    )
    _BATCH_ACCEPTABLE_OPTIONAL_ANALYZE_NODES = frozenset(
        {
            frozenset({"analyze_stats"}),
            _BATCH_ANALYZE_STAT_SUB_NODES,
        }
    )
    BATCH_ACCEPTABLE_NODES = (
        list(_BATCH_ACCEPTABLE_REQUIRED_NODES),
        list(_BATCH_ACCEPTABLE_OPTIONAL_ROI_NODES),
        list(_BATCH_ACCEPTABLE_OPTIONAL_ANALYZE_NODES),
    )

    @classmethod
    def validate_batch_nodes_in_workflow(cls, config: WorkflowConfig) -> bool:
        check_nodes = WorkflowConfigReader.extract_node_names_in_workflow(config)

        # 1) Add required nodes to the acceptable list
        acceptable_nodes = set(cls._BATCH_ACCEPTABLE_REQUIRED_NODES)

        # 2) Only one of the optional roi nodes is accepted.
        is_roi_node_exists = False
        for accept_roi_node in sorted(cls._BATCH_ACCEPTABLE_OPTIONAL_ROI_NODES):
            if accept_roi_node in check_nodes:
                is_roi_node_exists = True
                acceptable_nodes.add(accept_roi_node)
                break  # Break when one item is added.

        if not is_roi_node_exists:
            return False

        # 3) Only one of the optional analyze nodes is accepted.
        is_analyze_node_exists = False
        for accept_analyze_node in sorted(cls._BATCH_ACCEPTABLE_OPTIONAL_ANALYZE_NODES):
            if set(accept_analyze_node).issubset(check_nodes):
                is_analyze_node_exists = True
                acceptable_nodes |= accept_analyze_node
                break  # Break when one item is added.

        if not is_analyze_node_exists:
            return False

        # 4) Exact match check for node list
        acceptable_nodes_matched = sorted(check_nodes) == sorted(list(acceptable_nodes))

        return acceptable_nodes_matched

    @classmethod
    def validate_batch_roi_method(cls, config: WorkflowConfig) -> SupportedRoiMethod:
        check_nodes = WorkflowConfigReader.extract_node_names_in_workflow(config)

        # Note: Only one of the optional nodes is accepted.
        roi_node_name = None
        for accept_optional_node in sorted(cls._BATCH_ACCEPTABLE_OPTIONAL_ROI_NODES):
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
