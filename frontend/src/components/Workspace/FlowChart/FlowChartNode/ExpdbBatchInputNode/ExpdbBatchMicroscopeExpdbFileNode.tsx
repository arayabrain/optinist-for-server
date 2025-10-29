import { memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Handle, NodeProps, Position } from "reactflow"

import { Button, Chip, Typography } from "@mui/material"

import { ExpDbSelectDialog } from "components/Workspace/FlowChart/FlowChartNode/ExpDbSelectDialog"
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
  selectExpDbRelatedInputNodeSelectedFilePath,
  selectInputNodeDefined,
  selectInputNodeFileType,
} from "store/slice/InputNode/InputNodeSelectors"

export const ExpdbBatchMicroscopeExpdbFileNode = memo(
  function ExpdbBatchMicroscopeExpdbFileNode(element: NodeProps) {
    const defined = useSelector(selectInputNodeDefined(element.id))
    if (defined) {
      return <ExpdbBatchMicroscopeExpdbFileNodeImple {...element} />
    } else {
      return null
    }
  },
)

const ExpdbBatchMicroscopeExpdbFileNodeImple = memo(
  function ExpdbBatchMicroscopeExpdbFileNodeImple({
    id: nodeId,
    selected: elementSelected,
  }: NodeProps) {
    const dispatch = useDispatch()

    const returnType = "MicroscopeExpdbData"
    const microscopeColor = useHandleColor(returnType)

    // Get displayName dynamically from nodeId
    const fileType = useSelector(selectInputNodeFileType(nodeId))
    const config = getFileTypeConfig(fileType)
    const displayLabel = config?.displayName || fileType

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
        <ExpDbSelect nodeId={nodeId} />
        <Handle
          type="source"
          position={Position.Right}
          id={toHandleId(nodeId, "microscope", returnType)}
          style={{ ...HANDLE_STYLE, background: microscopeColor }}
          isValidConnection={isValidConnection}
        />
      </NodeContainer>
    )
  },
)

const ExpDbSelect = memo(function ExpDbSelect({ nodeId }: { nodeId: string }) {
  const [open, setOpen] = useState(false)
  const experimentIds = useSelector(
    selectExpDbRelatedInputNodeSelectedFilePath(nodeId),
  )

  return (
    <div>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Select
      </Button>
      <ExpDbSelectDialog
        nodeId={nodeId}
        open={open}
        setOpen={setOpen}
        experimentIdSelector={selectExpDbRelatedInputNodeSelectedFilePath}
        multiSelect={true}
        hideImageColumns={true}
      />
      <Typography>
        {experimentIds && experimentIds.length > 0 ? (
          <>
            Selected{" "}
            <Chip
              label={experimentIds.length}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.75rem", height: "20px", fontWeight: "bold" }}
            />{" "}
            experiments
          </>
        ) : (
          "No experiments selected"
        )}
      </Typography>
    </div>
  )
})
