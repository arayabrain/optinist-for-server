import React from 'react'
import { CSSProperties } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import { useDispatch, useSelector } from 'react-redux'
import { alpha, useTheme } from '@mui/material/styles'
import { setInputNodeFilePath } from 'store/slice/InputNode/InputNodeActions'
import {
  selectExpDbInputNodeSelectedFilePath,
  selectInputNodeDefined,
} from 'store/slice/InputNode/InputNodeSelectors'
import { deleteFlowNodeById } from 'store/slice/FlowElement/FlowElementSlice'
import { toHandleId } from './FlowChartUtils'
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { selectCurrentUser } from 'store/slice/User/UserSelector'
import DatabaseExperiments from 'components/Database/DatabaseExperiments'
import { GridEventListener, GridRowParams } from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import { DatabaseType } from 'store/slice/Database/DatabaseType'

const sourceHandleStyle: CSSProperties = {
  width: 8,
  height: 15,
  top: 15,
  border: '1px solid',
  borderColor: '#555',
  borderRadius: 0,
}

export const ExpDbNode = React.memo<NodeProps>((element) => {
  const defined = useSelector(selectInputNodeDefined(element.id))
  if (defined) {
    return <ExpDbFileNodeImple {...element} />
  } else {
    return null
  }
})

const ExpDbFileNodeImple = React.memo<NodeProps>(({ id: nodeId, selected }) => {
  const dispatch = useDispatch()

  const theme = useTheme()

  const onClickDeleteIcon = () => {
    dispatch(deleteFlowNodeById(nodeId))
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
      <ExpDbSelect nodeId={nodeId} />
      <Handle
        type="source"
        position={Position.Right}
        id={toHandleId(nodeId, 'expdb', 'ExpDbData')}
        style={sourceHandleStyle}
      />
    </div>
  )
})

const ExpDbSelect = React.memo<{ nodeId: string }>(({ nodeId }) => {
  const [open, setOpen] = React.useState(false)
  const experimentId = useSelector(selectExpDbInputNodeSelectedFilePath(nodeId))

  return (
    <div style={{ padding: 5 }}>
      <ButtonGroup size="small" style={{ marginRight: 4 }}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Select
        </Button>
        <ExpDbSelectDialog nodeId={nodeId} open={open} setOpen={setOpen} />
      </ButtonGroup>
      <div>
        <Typography>
          {experimentId
            ? `Selected experiment id: ${experimentId}`
            : 'No experiment selected'}
        </Typography>
      </div>
    </div>
  )
})

const ExpDbSelectDialog = React.memo<{
  nodeId: string
  open: boolean
  setOpen: (open: boolean) => void
}>(({ nodeId, open, setOpen }) => {
  const user = useSelector(selectCurrentUser)
  const [experimentId, setExperimentId] = React.useState<string | undefined>(
    undefined,
  )
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const handleRowClick: GridEventListener<'rowClick'> = (
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
      console.error(e)
      enqueueSnackbar('Select experiment failed', { variant: 'error' })
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
        <Button onClick={onClickOk} variant="contained" disabled={!experimentId}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
})
