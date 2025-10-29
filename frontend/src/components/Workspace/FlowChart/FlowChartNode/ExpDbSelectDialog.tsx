import { memo, useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useSnackbar } from "notistack"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import {
  GridEventListener,
  GridRowParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid"

import DatabaseExperiments from "components/Database/DatabaseExperiments"
import { DialogContext } from "components/Workspace/FlowChart/Dialog/DialogContext"
import {
  DATABASE_SLICE_NAME,
  DatabaseType,
} from "store/slice/Database/DatabaseType"
import { setInputNodeFilePath } from "store/slice/InputNode/InputNodeActions"
import { selectPipelineLatestUid } from "store/slice/Pipeline/PipelineSelectors"
import { selectCurrentUser } from "store/slice/User/UserSelector"
import { RootState } from "store/store"

interface ExpDbSelectDialogProps {
  nodeId: string
  open: boolean
  experimentIdSelector: (
    nodeId: string,
  ) => (state: RootState) => string | undefined
  setOpen: (open: boolean) => void
}

export const ExpDbSelectDialog = memo(function ExpDbSelectDialog({
  nodeId,
  open,
  experimentIdSelector,
  setOpen,
}: ExpDbSelectDialogProps) {
  const { onOpenClearWorkflowIdDialog } = useContext(DialogContext)
  const currentPipelineUid = useSelector(selectPipelineLatestUid)
  const currentExperimentId = useSelector(experimentIdSelector(nodeId))
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
      if (currentPipelineUid && currentExperimentId !== experimentId) {
        onOpenClearWorkflowIdDialog({
          open: true,
          handleOk: () => {
            dispatch(setInputNodeFilePath({ nodeId, filePath: experimentId! }))
            setOpen(false)
          },
          handleCancel: () => {},
        })
      } else {
        dispatch(setInputNodeFilePath({ nodeId, filePath: experimentId! }))
        setOpen(false)
      }
    } catch (e) {
      enqueueSnackbar("Select experiment failed", { variant: "error" })
    }
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="lg"
      onClose={(event, reason) => {
        if (reason === "escapeKeyDown") {
          onClickCancel()
        }
      }}
    >
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
