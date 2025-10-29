from studio.app.common.core.workflow.workflow import Node, NodeData
from studio.app.common.core.workflow.workflow_writer import WorkflowConfigWriter
from studio.app.common.schemas.workflow import WorkflowConfig
from studio.app.optinist.core.expdb.expdb_validator import ExpDbValidator

workspace_id = "default"
unique_id = "expdb_test"

nodeDict_ = {
    "input_0": Node(
        id="input_0",
        type="MicroscopeExpdbFileNode",
        data=NodeData(
            label="M000000_ori001",
            param={},
            path="M000000_ori001",
            type="input",
            fileType="microscope_expdb",
        ),
        position={},
        style={},
    ),
    "preprocessing_0001": Node(
        id="preprocessing_0001",
        type="AlgorithmNode",
        data=NodeData(
            label="preprocessing",
            param={},
            path="expdb/preprocess_components/preprocessing",
            type="algorithm",
        ),
        position={},
        style={},
    ),
    "suite2p_preprocessing_0001": Node(
        id="suite2p_preprocessing_0001",
        type="AlgorithmNode",
        data=NodeData(
            label="suite2p_preprocessing",
            param={},
            path="expdb/preprocess_components/suite2p_preprocessing",
            type="algorithm",
        ),
        position={},
        style={},
    ),
    "caiman_cnmf_preprocessing_0001": Node(
        id="caiman_cnmf_preprocessing_0001",
        type="AlgorithmNode",
        data=NodeData(
            label="caiman_cnmf_preprocessing",
            param={},
            path="expdb/preprocess_components/caiman_cnmf_preprocessing",
            type="algorithm",
        ),
        position={},
        style={},
    ),
    "analyze_stats_0001": Node(
        id="analyze_stats_0001",
        type="AlgorithmNode",
        data=NodeData(
            label="analyze_stats",
            param={},
            path="expdb/analysis_preset/analyze_stats",
            type="algorithm",
        ),
        position={},
        style={},
    ),
}

edgeDict_ = {}


def test_validate_batch_nodes():
    print("Valid expdb batch nodes:", ExpDbValidator.BATCH_ACCEPTABLE_NODES)

    # ======================================================================
    # Valid Cases
    # ======================================================================

    # ----------------------------------------
    # Case. Valid 1
    # ----------------------------------------

    nodeDict = nodeDict_.copy()
    del nodeDict["suite2p_preprocessing_0001"]

    is_valid_nodes = __test_validate_batch_nodes(nodeDict)
    assert is_valid_nodes

    # ----------------------------------------
    # Case. Valid 2
    # ----------------------------------------

    nodeDict = nodeDict_.copy()
    del nodeDict["caiman_cnmf_preprocessing_0001"]

    is_valid_nodes = __test_validate_batch_nodes(nodeDict)
    assert is_valid_nodes

    # ======================================================================
    # Invalid Cases
    # ======================================================================

    # ----------------------------------------
    # Case. Invalid 1
    # ----------------------------------------

    nodeDict = nodeDict_.copy()

    is_valid_nodes = __test_validate_batch_nodes(nodeDict)
    assert not is_valid_nodes

    # ----------------------------------------
    # Case. Invalid 2
    # ----------------------------------------

    nodeDict = nodeDict_.copy()
    del nodeDict["suite2p_preprocessing_0001"]
    del nodeDict["caiman_cnmf_preprocessing_0001"]

    is_valid_nodes = __test_validate_batch_nodes(nodeDict)
    assert not is_valid_nodes

    # ----------------------------------------
    # Case. Invalid 3
    # ----------------------------------------

    nodeDict = nodeDict_.copy()
    del nodeDict["analyze_stats_0001"]

    is_valid_nodes = __test_validate_batch_nodes(nodeDict)
    assert not is_valid_nodes


def __test_validate_batch_nodes(nodeDict: dict):
    workflow_config = WorkflowConfigWriter(
        workspace_id=workspace_id,
        unique_id=unique_id,
        nodeDict=nodeDict,
        edgeDict=edgeDict_,
    ).create_config()
    assert isinstance(workflow_config, WorkflowConfig)

    is_valid_nodes = ExpDbValidator.validate_batch_nodes_in_workflow(workflow_config)

    return is_valid_nodes
