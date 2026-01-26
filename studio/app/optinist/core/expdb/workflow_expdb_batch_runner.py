import shutil

from fastapi import BackgroundTasks, HTTPException, status
from zc import lockfile

from studio.app.common.core.experiment.experiment_writer import ExptConfigWriter
from studio.app.common.core.logger import AppLogger
from studio.app.common.core.workflow.workflow import RunItem, WorkflowRunStatus
from studio.app.common.core.workflow.workflow_reader import WorkflowConfigReader
from studio.app.common.core.workflow.workflow_runner import WorkflowRunner
from studio.app.common.core.workflow.workflow_writer import WorkflowConfigWriter
from studio.app.optinist.core.expdb.batch_const import (
    LOCKFILE_NAME,
    ProcessCommand,
    SupportedRoiMethod,
)
from studio.app.optinist.core.expdb.expdb_data import ExpDbPathIdsUtil, ProcessResult
from studio.app.optinist.core.expdb.expdb_validator import (
    ExpDbValidator,
    ExpDbValidatorConfig,
)
from studio.app.optinist.core.expdb.proc_file_data import ProcFile
from studio.app.optinist.core.expdb.proc_file_writer import ProcFileWriter

logger = AppLogger.get_logger()


class WorkflowExpdbBatchRunner:
    BATCH_INPUT_NODE_NAME = ExpDbValidator._BATCH_INPUT_NODE_NAME

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
                f" [uid: {self.workspace_id}/{self.unique_id}]"
                f" acceptable nodes={ExpDbValidator.BATCH_ACCEPTABLE_NODES}"
            )

            # Switch validation processing by validation strict mode
            if ExpDbValidatorConfig.USE_STRICT_VALIDATION:
                # If in strict mode, an exception is thrown.
                logger.error(err_message)
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err_message
                )
            else:
                # If not in strict mode, processing continues.
                logger.warning(err_message)
                pass

        # ------------------------------------------------------------
        # Save Batch Run Template Workflow
        # ------------------------------------------------------------

        WorkflowRunner(
            self.workspace_id, self.unique_id, self.runItem
        ).finish_workflow_without_run()

        # ------------------------------------------------------------
        # Preparing for batch run reservation processing
        # ------------------------------------------------------------

        batch_input_node = WorkflowConfigReader.find_node_in_workflow(
            workflow_config, __class__.BATCH_INPUT_NODE_NAME
        )
        assert batch_input_node, f"Input not found: [{__class__.BATCH_INPUT_NODE_NAME}]"

        # Note: The path of the batch input node corresponds to the experiment_ids.
        experiment_ids = batch_input_node.data.path
        experiment_ids = sorted(experiment_ids)

        # Get the roi_method specified in the workflow
        roi_method = ExpDbValidator.validate_batch_roi_method(workflow_config)
        assert roi_method, f"Invalid roi_method [{roi_method}]"

        # ------------------------------------------------------------
        # Batch run reservation processing
        # ------------------------------------------------------------

        logger.info(
            "Start analysis batch run reservation."
            f" [uid: {self.workspace_id}/{self.unique_id}]"
            f" [experiment_ids: {experiment_ids}]"
            f" [roi_method: {roi_method.value}]"
            f" [workflow config: {workflow_config}]"
        )

        processResult = ProcessResult()

        # Execute batch reservation process (for the number of exp_ids)
        for exp_id in experiment_ids:
            try:
                self.__reserve_expdb_batch_run(roi_method, exp_id)
                processResult.success_ids.append(exp_id)
            except Exception as e:
                err_message = (
                    "An error occurred while reserving the analysis batch run."
                    f" [uid: {self.workspace_id}/{self.unique_id}]"
                    f" [exp_id: {exp_id}] - {e}"
                )
                logger.error(err_message, exc_info=True)
                processResult.failure_ids.append(exp_id)

        # Checking the processing results
        if processResult.has_error():
            log_message = (
                "Complete analysis batch run reservation. [status: warning]"
                f" [uid: {self.workspace_id}/{self.unique_id}]"
                f" [success count: {len(processResult.success_ids)}]"
                f" [failure count: {len(processResult.failure_ids)}]"
                f" [failure_ids: {processResult.failure_ids}]"
            )
            logger.warning(log_message)

            # Write error status to experiment.yaml
            update_params = {"success": WorkflowRunStatus.ERROR.value}
            ExptConfigWriter(self.workspace_id, self.unique_id).overwrite(update_params)

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=log_message
            )
        else:
            log_message = (
                "Complete analysis batch run reservation. [status: success]"
                f" [uid: {self.workspace_id}/{self.unique_id}]"
                f" [success count: {len(processResult.success_ids)}]"
                f" [success_ids: {processResult.success_ids}]"
            )
            logger.info(log_message)

    def __reserve_expdb_batch_run(self, roi_method: SupportedRoiMethod, exp_id: str):
        # ------------------------------------------------------------
        # Write workflow yaml
        # ------------------------------------------------------------

        # Get the path from copy workflow yaml
        src_workflow_yaml_path = WorkflowConfigReader.get_config_yaml_path(
            self.workspace_id, self.unique_id
        )

        # Get the path to copy workflow yaml
        dest_workflow_yaml_path = ExpDbPathIdsUtil.create_expdb_file_path(
            exp_id,
            f"{exp_id}_workflow.yaml",
        )

        logger.info(f"Generate workflow yaml for batch [{dest_workflow_yaml_path}]")

        # Deploy the workflow yaml to the target directory
        shutil.copy(src_workflow_yaml_path, dest_workflow_yaml_path)

        # ------------------------------------------------------------
        # Write batch proc file
        # ------------------------------------------------------------

        # Generate proc file contents
        proc_file = ProcFile(
            command=ProcessCommand.REGIST.value,
            roi_method=roi_method.value,
        )

        logger.info(f"Generate batch proc file [{proc_file}]")

        # Write proc file
        # Check the status to see if batch processing is running (check the lock file).
        # @see studio.app.optinist.core.expdb.batch_runner.__process_preprocess
        proc_lock_file = None
        try:
            proc_lock_file = lockfile.LockFile(LOCKFILE_NAME)

            # Write proc file
            ProcFileWriter.write(exp_id, proc_file)

        except lockfile.LockError as e:
            err_message = (
                f"Proc file lock error. already running. [exp_id: {exp_id}] - {e}"
            )
            logger.error(err_message)
            raise e
        finally:
            if proc_lock_file:
                proc_lock_file.close()
