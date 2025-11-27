import { REACT_FLOW_NODE_TYPE_KEY, FILE_TYPE } from "config/fileTypes.config"
import { WORKSPACE_TYPE } from "const/Workspace"
import { FILE_TYPE_SET } from "store/slice/InputNode/InputNodeType"

/**
 * Check if the workspace type is EXPDB_BATCH
 */
const isExpdbBatchWorkspace = (workspaceType?: number): boolean => {
  return workspaceType === WORKSPACE_TYPE.EXPDB_BATCH
}

/**
 * Get the appropriate file type for the initial node based on workspace type
 */
export const getInitialNodeFileType = (workspaceType?: number): FILE_TYPE => {
  return isExpdbBatchWorkspace(workspaceType)
    ? FILE_TYPE_SET.EXPDB_BATCH_MICROSCOPE_EXPDB
    : FILE_TYPE_SET.EXPDB
}

/**
 * Get the appropriate React Flow node type for the initial node based on workspace type
 */
export const getInitialNodeType = (workspaceType?: number): string => {
  return isExpdbBatchWorkspace(workspaceType)
    ? REACT_FLOW_NODE_TYPE_KEY.ExpdbBatchMicroscopeExpdbFileNode
    : REACT_FLOW_NODE_TYPE_KEY.ExpDbNode
}
