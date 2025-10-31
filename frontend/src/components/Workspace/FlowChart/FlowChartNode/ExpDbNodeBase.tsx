import React, { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Handle, NodeProps, Position } from "reactflow"

import { Typography } from "@mui/material"

import {
  isValidConnection,
  toHandleId,
} from "components/Workspace/FlowChart/FlowChartNode/FlowChartUtils"
import { useHandleColor } from "components/Workspace/FlowChart/FlowChartNode/HandleColorHook"
import { NodeContainer } from "components/Workspace/FlowChart/FlowChartNode/NodeContainer"
import { getFileTypeConfig } from "config/fileTypes.config"
import { HANDLE_STYLE } from "const/flowchart"
import { deleteFlowNodeById } from "store/slice/FlowElement/FlowElementSlice"
import {
  selectInputNodeDefined,
  selectInputNodeFileType,
} from "store/slice/InputNode/InputNodeSelectors"

/**
 * Configuration for different ExpDb node types
 */
export interface ExpDbNodeConfig {
  returnType: string
  handleName: string
  multiSelect?: boolean
  hideImageColumns?: boolean
}

/**
 * Props for ExpDbNodeBase
 */
interface ExpDbNodeBaseProps extends NodeProps {
  config: ExpDbNodeConfig
  SelectComponent: React.ComponentType<{ nodeId: string }>
}

/**
 * Factory function to create ExpDb node components with different configurations
 */
export function createExpDbNode(
  displayName: string,
  config: ExpDbNodeConfig,
  SelectComponent: React.ComponentType<{ nodeId: string }>,
) {
  return memo(function ExpDbNodeWrapper(element: NodeProps) {
    const defined = useSelector(selectInputNodeDefined(element.id))
    if (defined) {
      return (
        <ExpDbNodeBase
          {...element}
          config={config}
          SelectComponent={SelectComponent}
        />
      )
    } else {
      return null
    }
  })
}

/**
 * Base implementation for ExpDb-related nodes
 * This component contains all the common logic shared between:
 * - ExpDbNode
 * - MicroscopeExpdbFileNode
 * - ExpdbBatchMicroscopeExpdbFileNode
 */
const ExpDbNodeBase = memo(function ExpDbNodeBase({
  id: nodeId,
  selected: elementSelected,
  config,
  SelectComponent,
}: ExpDbNodeBaseProps) {
  const dispatch = useDispatch()

  const { returnType, handleName } = config
  const handleColor = useHandleColor(returnType)

  // Get displayName dynamically from nodeId
  const fileType = useSelector(selectInputNodeFileType(nodeId))
  const fileTypeConfig = getFileTypeConfig(fileType)
  const displayLabel = fileTypeConfig?.displayName || fileType

  const onClickDeleteIcon = () => {
    dispatch(deleteFlowNodeById(nodeId))
  }

  return (
    <NodeContainer nodeId={nodeId} selected={elementSelected}>
      <Typography>{displayLabel}</Typography>
      <button
        className="flowbutton"
        onClick={onClickDeleteIcon}
        style={{ color: "black", position: "absolute", top: -10, right: 10 }}
      >
        ×
      </button>
      <SelectComponent nodeId={nodeId} />
      <Handle
        type="source"
        position={Position.Right}
        id={toHandleId(nodeId, handleName, returnType)}
        style={{ ...HANDLE_STYLE, background: handleColor }}
        isValidConnection={isValidConnection}
      />
    </NodeContainer>
  )
})
