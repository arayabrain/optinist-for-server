from typing import Dict

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

from studio.app.common.core.experiment.experiment_reader import ExptConfigReader
from studio.app.common.core.logger import AppLogger
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.core.workflow.workflow import Message, NodeItem, RunItem
from studio.app.common.core.workflow.workflow_result import WorkflowResult
from studio.app.common.core.workflow.workflow_runner import WorkflowRunner
from studio.app.common.core.workspace.workspace_dependencies import (
    is_workspace_available,
    is_workspace_owner,
)
from studio.app.dir_path import DIRPATH

router = APIRouter(prefix="/run", tags=["run"])

logger = AppLogger.get_logger()


@router.post(
    "/{workspace_id}",
    response_model=str,
    dependencies=[Depends(is_workspace_owner)],
)
async def run(workspace_id: str, runItem: RunItem, background_tasks: BackgroundTasks):
    try:
        unique_id = WorkflowRunner.create_workflow_unique_id()
        WorkflowRunner(workspace_id, unique_id, runItem).run_workflow(background_tasks)

        logger.info("run snakemake")

        return unique_id

    except Exception as e:
        logger.error(e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to run workflow.",
        )


@router.post(
    "/{workspace_id}/{uid}",
    response_model=str,
    dependencies=[Depends(is_workspace_owner)],
)
async def run_id(
    workspace_id: str, uid: str, runItem: RunItem, background_tasks: BackgroundTasks
):
    path = join_filepath(
        [DIRPATH.OUTPUT_DIR, workspace_id, uid, DIRPATH.EXPERIMENT_YML]
    )
    config = ExptConfigReader.read(path)

    # validate data filter param
    if config.success != "success":
        for node in runItem.nodeDict.values():
            if node.data.dataFilterParam:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    try:
        WorkflowRunner(workspace_id, uid, runItem).run_workflow(background_tasks)

        logger.info("run snakemake")
        logger.info("forcerun list: %s", runItem.forceRunList)

        return uid

    except Exception as e:
        logger.error(e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to run workflow.",
        )


@router.post(
    "/result/{workspace_id}/{uid}",
    response_model=Dict[str, Message],
    dependencies=[Depends(is_workspace_available)],
)
async def run_result(workspace_id: str, uid: str, nodeDict: NodeItem):
    try:
        return WorkflowResult(workspace_id, uid).get(nodeDict.pendingNodeIdList)
    except Exception as e:
        logger.error(e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to result workflow.",
        )


@router.post(
    "/cancel/{workspace_id}/{uid}",
    response_model=bool,
    dependencies=[Depends(is_workspace_owner)],
)
async def run_cancel(workspace_id: str, uid: str):
    try:
        return WorkflowResult(workspace_id, uid).cancel()
    except Exception as e:
        logger.error(e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cencel workflow.",
        )
