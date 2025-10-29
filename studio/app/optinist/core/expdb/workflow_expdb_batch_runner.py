import shutil
from dataclasses import asdict

import yaml
from fastapi import BackgroundTasks, HTTPException, status
from zc import lockfile

from studio.app.common.core.logger import AppLogger
from studio.app.common.core.workflow.workflow import RunItem
from studio.app.common.core.workflow.workflow_reader import WorkflowConfigReader
from studio.app.common.core.workflow.workflow_runner import WorkflowRunner
from studio.app.common.core.workflow.workflow_writer import WorkflowConfigWriter
from studio.app.optinist.core.expdb.batch_const import LOCKFILE_NAME, ProcessCommand
from studio.app.optinist.core.expdb.expdb_data import (
    BatchProcFile,
    BatchProcFileExt,
    ExpDbPathIdsUtil,
)
from studio.app.optinist.core.expdb.expdb_validator import ExpDbValidator

logger = AppLogger.get_logger()


class WorkflowExpdbBatchRunner:
    BATCH_INPUT_NODE_NAME = "microscope_expdb"

    def __init__(self, workspace_id: str, unique_id: str, runItem: RunItem) -> None:
        self.workspace_id = workspace_id
        self.unique_id = unique_id
        self.runItem = runItem

    def run_batch_workflow(self, background_tasks: BackgroundTasks):
        # ------------------------------------------------------------
        # Validate workflow config
        # ------------------------------------------------------------

        workflow_config = WorkflowConfigWriter(
            workspace_id=self.workspace_id,
            unique_id=self.unique_id,
            nodeDict=self.runItem.nodeDict,
            edgeDict=self.runItem.edgeDict,
        ).create_config()

        is_valid_nodes = ExpDbValidator.validate_batch_nodes_in_workflow(
            workflow_config
        )

        if not is_valid_nodes:
            err_message = (
                "Invalid batch workflow nodes: "
                f"acceptable nodes={ExpDbValidator.BATCH_ACCEPTABLE_NODES}"
            )
            logger.error(err_message)

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err_message
            )

        # ------------------------------------------------------------
        # Save Batch Run Template Workflow
        # ------------------------------------------------------------

        WorkflowRunner(
            self.workspace_id, self.unique_id, self.runItem
        ).finish_workflow_without_run()

        # ------------------------------------------------------------
        # Write workflow yaml
        # ------------------------------------------------------------

        batch_input_node = WorkflowConfigReader.find_node_in_workflow(
            workflow_config, __class__.BATCH_INPUT_NODE_NAME
        )
        assert batch_input_node, f"Input not found: [{__class__.BATCH_INPUT_NODE_NAME}]"

        src_workflow_yaml_path = WorkflowConfigReader.get_config_yaml_path(
            self.workspace_id, self.unique_id
        )

        # Get the path to copy workflow yaml
        # Note: The path of the batch input node corresponds to the exp_id.
        exp_id = batch_input_node.data.path
        dest_workflow_yaml_path = ExpDbPathIdsUtil.create_expdb_file_path(
            exp_id,
            f"{exp_id}_workflow.yaml",
        )

        logger.info(f"Generate workflow yaml for batch [{dest_workflow_yaml_path}]")

        # Deploy the workflow yaml to the target directory
        shutil.copy(src_workflow_yaml_path, dest_workflow_yaml_path)

        # ------------------------------------------------------------
        # Write .proc file
        # ------------------------------------------------------------

        roi_method = ExpDbValidator.validate_batch_roi_method(workflow_config)
        assert roi_method, f"Invalid roi_method [{roi_method}]"

        # Generate .proc file contents
        proc_file = BatchProcFileExt(
            exp_id=exp_id,
            command=ProcessCommand.REGIST.value,
            roi_method=roi_method.value,
        )

        logger.info(f"Generate .proc for batch [{proc_file}]")

        # Write .proc file
        # Check the status to see if batch processing is running (check the lock file).
        # @see studio/app/optinist/core/expdb/batch_runner.py
        proc_lock_file = None
        try:
            proc_lock_file = lockfile.LockFile(LOCKFILE_NAME)

            # Write .proc file
            with open(proc_file.file_path, "w") as f:
                store_proc_file = BatchProcFile(
                    command=proc_file.command, roi_method=proc_file.roi_method
                )
                yaml.dump(asdict(store_proc_file), f)

        except lockfile.LockError as e:
            err_message = (
                f"Proc file lock error. already running. [expid: {exp_id}] - {e}"
            )
            logger.error(err_message)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err_message
            )
        finally:
            if proc_lock_file:
                proc_lock_file.close()
