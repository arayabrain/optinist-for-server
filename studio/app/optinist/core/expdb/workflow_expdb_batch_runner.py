from fastapi import BackgroundTasks, HTTPException, status

from studio.app.common.core.logger import AppLogger
from studio.app.common.core.workflow.workflow import RunItem
from studio.app.common.core.workflow.workflow_runner import WorkflowRunner
from studio.app.common.core.workflow.workflow_writer import WorkflowConfigWriter
from studio.app.optinist.core.expdb.expdb_validator import ExpDbValidator

logger = AppLogger.get_logger()


class WorkflowExpdbBatchRunner:
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

        # TODO: Subsequent processing needs to be implemented (Kick analysis batch)
