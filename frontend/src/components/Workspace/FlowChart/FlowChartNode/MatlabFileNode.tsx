import React, { CSSProperties } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import {
  selectInputNodeDefined,
  selectMatlabInputNodeParamFieldName,
  selectMatlabInputNodeParamIndex,
  selectMatlabInputNodeSelectedFilePath,
} from 'store/slice/InputNode/InputNodeSelectors'
import { setInputNodeFilePath } from 'store/slice/InputNode/InputNodeActions'
import { alpha, useTheme } from '@mui/material/styles'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
} from '@mui/material'
import { deleteFlowElementsById } from 'store/slice/FlowElement/FlowElementSlice'
import { FileSelect } from './FileSelect'
import { toHandleId } from './FlowChartUtils'
import { FILE_TYPE_SET } from 'store/slice/InputNode/InputNodeType'
import { setMatlabInputNodeParam } from 'store/slice/InputNode/InputNodeSlice'

const sourceHandleStyle: CSSProperties = {
  width: 8,
  height: 15,
  top: 15,
  border: '1px solid',
  borderColor: '#555',
  borderRadius: 0,
}

export interface MatlabFileNodeProps extends NodeProps {
  hideSettingDialog?: boolean
}

export const MatlabFileNode = React.memo<NodeProps>((element) => {
  const defined = useSelector(selectInputNodeDefined(element.id))

  if (defined) {
    return <MatlabFileNodeImpl {...element} />
  } else {
    return null
  }
})

export const MatlabFileNodeImpl = React.memo<MatlabFileNodeProps>(
  ({ id: nodeId, selected, hideSettingDialog }) => {
    const dispatch = useDispatch()
    const filePath = useSelector(selectMatlabInputNodeSelectedFilePath(nodeId))
    const onChangeFilePath = (path: string) => {
      dispatch(setInputNodeFilePath({ nodeId, filePath: path }))
    }
    const theme = useTheme()

    const onClickDeleteIcon = () => {
      dispatch(deleteFlowElementsById(nodeId))
    }

    return (
      <div
        style={{
          height: '100%',
          width: '250px',
          background: selected
            ? alpha(theme.palette.primary.light, 0.1)
            : undefined,
        }}
      >
        <button
          className="flowbutton"
          onClick={onClickDeleteIcon}
          style={{ color: 'black', position: 'absolute', top: -10, right: 10 }}
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
          filePath={filePath ?? ''}
        />
        {!!filePath && !hideSettingDialog && (
          <MatlabParamSettingDialog nodeId={nodeId} />
        )}
        <Handle
          type="source"
          position={Position.Right}
          id={toHandleId(nodeId, 'matlab', 'MatlabData')}
          style={sourceHandleStyle}
        />
      </div>
    )
  },
)

const MatlabParamSettingDialog = React.memo<{
  nodeId: string
}>(({ nodeId }) => {
  const dispatch = useDispatch()

  const [open, setOpen] = React.useState(false)

  const initialFieldName = useSelector(
    selectMatlabInputNodeParamFieldName(nodeId),
  )
  const [fieldName, setFieldName] = React.useState(initialFieldName)

  const initialIndex = useSelector(selectMatlabInputNodeParamIndex(nodeId))
  const [index, setIndex] = React.useState<number[] | string | undefined>(
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
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    let newValue: string | number[] = event.target.value
    newValue = newValue
      .split(',')
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
          <Box sx={{ display: 'flex', p: 1, m: 1, alignItems: 'flex-start' }}>
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
          <Button onClick={onClickOk} color="primary" variant="outlined">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})
