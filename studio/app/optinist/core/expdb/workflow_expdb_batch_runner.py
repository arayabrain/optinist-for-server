from fastapi import BackgroundTasks

from studio.app.common.core.logger import AppLogger
from studio.app.common.core.workflow.workflow import RunItem
from studio.app.common.core.workflow.workflow_runner import WorkflowRunner

logger = AppLogger.get_logger()


class WorkflowExpdbBatchRunner:
    def __init__(self, workspace_id: str, unique_id: str, runItem: RunItem) -> None:
        self.workspace_id = workspace_id
        self.unique_id = unique_id
        self.runItem = runItem

    def run_batch_workflow(self, background_tasks: BackgroundTasks):
        # ------------------------------------------------------------
        # Save Batch Run Template Workflow
        # ------------------------------------------------------------
        WorkflowRunner(
            self.workspace_id, self.unique_id, self.runItem
        ).finish_workflow_without_run()

        # TODO: Subsequent processing needs to be implemented (Kick analysis batch)
