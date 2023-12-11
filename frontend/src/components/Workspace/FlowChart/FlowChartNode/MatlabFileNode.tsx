import { ChangeEvent, memo, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Handle, NodeProps, Position } from "reactflow"

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
} from "@mui/material"

import { FileSelect } from "components/Workspace/FlowChart/FlowChartNode/FileSelect"
import { toHandleId } from "components/Workspace/FlowChart/FlowChartNode/FlowChartUtils"
import { NodeContainer } from "components/Workspace/FlowChart/FlowChartNode/NodeContainer"
import { HANDLE_STYLE } from "const/flowchart"
import { deleteFlowNodeById } from "store/slice/FlowElement/FlowElementSlice"
import { setInputNodeFilePath } from "store/slice/InputNode/InputNodeActions"
import {
  selectInputNodeDefined,
  selectMatlabInputNodeParamFieldName,
  selectMatlabInputNodeParamIndex,
  selectMatlabInputNodeSelectedFilePath,
} from "store/slice/InputNode/InputNodeSelectors"
import { setMatlabInputNodeParam } from "store/slice/InputNode/InputNodeSlice"
import { FILE_TYPE_SET } from "store/slice/InputNode/InputNodeType"

export interface MatlabFileNodeProps extends NodeProps {
  hideSettingDialog?: boolean
}

export const MatlabFileNode = memo(function MatlabFileNode(element: NodeProps) {
  const defined = useSelector(selectInputNodeDefined(element.id))
  if (defined) {
    return <MatlabFileNodeImpl {...element} />
  } else {
    return null
  }
})

export const MatlabFileNodeImpl = memo(function MatlabFileNodeImpl({
  id: nodeId,
  selected,
  hideSettingDialog,
}: MatlabFileNodeProps) {
  const dispatch = useDispatch()
  const filePath = useSelector(selectMatlabInputNodeSelectedFilePath(nodeId))
  const onChangeFilePath = (path: string) => {
    dispatch(setInputNodeFilePath({ nodeId, filePath: path }))
  }

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
      <FileSelect
        nodeId={nodeId}
        onChangeFilePath={(path) => {
          if (!Array.isArray(path)) {
            onChangeFilePath(path)
          }
        }}
        fileType={FILE_TYPE_SET.MATLAB}
        filePath={filePath ?? ""}
      />
      {!!filePath && !hideSettingDialog && (
        <MatlabParamSettingDialog nodeId={nodeId} />
      )}
      <Handle
        type="source"
        position={Position.Right}
        id={toHandleId(nodeId, "matlab", "MatlabData")}
        style={{ ...HANDLE_STYLE }}
      />
    </NodeContainer>
  )
})

const MatlabParamSettingDialog = memo(function MatlabParamSettingDialog({
  nodeId,
}: {
  nodeId: string
}) {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)

  const initialFieldName = useSelector(
    selectMatlabInputNodeParamFieldName(nodeId),
  )
  const [fieldName, setFieldName] = useState(initialFieldName)

  const initialIndex = useSelector(selectMatlabInputNodeParamIndex(nodeId))
  const [index, setIndex] = useState<number[] | string | undefined>(
    initialIndex,
  )
  const isArray = Array.isArray(index)
  const isValidIndex = isArray || index === undefined

  const onClickCancel = () => {
    setOpen(false)
    setFieldName(initialFieldName)
    setIndex(initialIndex)
  }

  const onClickOk = () => {
    setOpen(false)
    isValidIndex &&
      dispatch(
        setMatlabInputNodeParam({
          nodeId,
          param: { fieldName, index },
        }),
      )
  }

  const onBlur = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    let newValue: string | number[] = event.target.value
    newValue = newValue
      .split(",")
      .filter(Boolean)
      .map((e) => Number(e))
      .filter((e) => !isNaN(e))
    setIndex(newValue.length === 0 ? undefined : newValue)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <Dialog open={open}>
        <DialogTitle>Matlab Setting</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", p: 1, m: 1, alignItems: "flex-start" }}>
            <TextField
              label="field name"
              sx={{
                width: 100,
                margin: (theme) => theme.spacing(0, 1, 0, 1),
              }}
              type="string"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setFieldName(event.target.value)
              }}
              value={fieldName}
            />
            <TextField
              label="field index"
              sx={{
                width: 100,
                margin: (theme) => theme.spacing(0, 1, 0, 1),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setIndex(event.target.value)
              }}
              onBlur={onBlur}
              value={index}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickCancel} variant="outlined" color="inherit">
            cancel
          </Button>
          <Button onClick={onClickOk} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})
