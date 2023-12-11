import { memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Handle, NodeProps, Position } from "reactflow"

import { useSnackbar } from "notistack"

import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { GridEventListener, GridRowParams } from "@mui/x-data-grid"

import DatabaseExperiments from "components/Database/DatabaseExperiments"
import { toHandleId } from "components/Workspace/FlowChart/FlowChartNode/FlowChartUtils"
import { useHandleColor } from "components/Workspace/FlowChart/FlowChartNode/HandleColorHook"
import { NodeContainer } from "components/Workspace/FlowChart/FlowChartNode/NodeContainer"
import { HANDLE_STYLE } from "const/flowchart"
import { DatabaseType } from "store/slice/Database/DatabaseType"
import { deleteFlowNodeById } from "store/slice/FlowElement/FlowElementSlice"
import { setInputNodeFilePath } from "store/slice/InputNode/InputNodeActions"
import {
  selectExpDbInputNodeSelectedFilePath,
  selectInputNodeDefined,
} from "store/slice/InputNode/InputNodeSelectors"
import { selectCurrentUser } from "store/slice/User/UserSelector"

export const ExpDbNode = memo(function ExpDbNode(element: NodeProps) {
  const defined = useSelector(selectInputNodeDefined(element.id))
  if (defined) {
    return <ExpDbFileNodeImple {...element} />
  } else {
    return null
  }
})

const ExpDbFileNodeImple = memo(function ExpDbFileNodeImple({
  id: nodeId,
  selected,
}: NodeProps) {
  const dispatch = useDispatch()

  const returnType = "ExpDbData"
  const expdbColor = useHandleColor(returnType)

  const onClickDeleteIcon = () => {
    dispatch(deleteFlowNodeById(nodeId))
  }

  return (
    <NodeContainer nodeId={nodeId} selected={selected}>
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
        id={toHandleId(nodeId, "expdb", returnType)}
        style={{ ...HANDLE_STYLE, background: expdbColor }}
      />
    </NodeContainer>
  )
})

const ExpDbSelect = memo(function ExpDbSelect({ nodeId }: { nodeId: string }) {
  const [open, setOpen] = useState(false)
  const experimentId = useSelector(selectExpDbInputNodeSelectedFilePath(nodeId))

  return (
    <div>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Select
      </Button>
      <ExpDbSelectDialog nodeId={nodeId} open={open} setOpen={setOpen} />
      <Typography>
        {experimentId
          ? `Selected experiment id: ${experimentId}`
          : "No experiment selected"}
      </Typography>
    </div>
  )
})

interface ExpDbSelectDialogProps {
  nodeId: string
  open: boolean
  setOpen: (open: boolean) => void
}

const ExpDbSelectDialog = memo(function ExpDbSelectDialog({
  nodeId,
  open,
  setOpen,
}: ExpDbSelectDialogProps) {
  const user = useSelector(selectCurrentUser)
  const [experimentId, setExperimentId] = useState<string | undefined>(
    undefined,
  )
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const handleRowClick: GridEventListener<"rowClick"> = (
    params: GridRowParams<DatabaseType>,
  ) => {
    setExperimentId(params.row.experiment_id)
  }

  const onClickCancel = () => {
    setOpen(false)
    setExperimentId(undefined)
  }

  const onClickOk = () => {
    try {
      setOpen(false)
      dispatch(setInputNodeFilePath({ nodeId, filePath: experimentId! }))
    } catch (e) {
      enqueueSnackbar("Select experiment failed", { variant: "error" })
    }
  }

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle>Experiments</DialogTitle>
      <DialogContent dividers>
        <DatabaseExperiments
          user={user}
          cellPath="/console/cells"
          handleRowClick={handleRowClick}
          readonly
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onClickOk}
          variant="contained"
          disabled={!experimentId}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
})
