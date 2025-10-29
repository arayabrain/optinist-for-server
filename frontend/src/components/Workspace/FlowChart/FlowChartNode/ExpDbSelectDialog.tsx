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
  ) => (state: RootState) => string | string[] | undefined
  setOpen: (open: boolean) => void
  multiSelect?: boolean
  hideImageColumns?: boolean
}

export const ExpDbSelectDialog = memo(function ExpDbSelectDialog({
  nodeId,
  open,
  experimentIdSelector,
  setOpen,
  multiSelect = false,
  hideImageColumns = false,
}: ExpDbSelectDialogProps) {
  const { onOpenClearWorkflowIdDialog } = useContext(DialogContext)
  const currentPipelineUid = useSelector(selectPipelineLatestUid)
  const currentExperimentId = useSelector(experimentIdSelector(nodeId))
  const user = useSelector(selectCurrentUser)
  const dataExperiments = useSelector((state: RootState) => {
    const type = user ? "private" : "public"
    return state[DATABASE_SLICE_NAME].data[type]
  })

  // Single select state
  const [experimentId, setExperimentId] = useState<string | undefined>(
    undefined,
  )

  // Multi select state
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    [],
  )

  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const handleRowClick: GridEventListener<"rowClick"> = (
    params: GridRowParams<DatabaseType>,
  ) => {
    if (!multiSelect) {
      setExperimentId(params.row.experiment_id)
    }
  }

  const handleRowSelectionModelChange = (
    selectionModel: GridRowSelectionModel,
  ) => {
    if (multiSelect) {
      setSelectedRowIds(selectionModel)
    }
  }

  const onClickCancel = () => {
    setOpen(false)
    setExperimentId(undefined)
    setSelectedRowIds([])
  }

  const onClickOk = () => {
    try {
      let newFilePath: string | string[] | undefined

      if (multiSelect) {
        // Map selected row IDs to experiment_ids
        const selectedExperimentIds = dataExperiments.items
          .filter((item) => selectedRowIds.includes(item.id))
          .map((item) => item.experiment_id)
          .filter((id): id is string => id !== undefined)
        newFilePath = selectedExperimentIds
      } else {
        newFilePath = experimentId
      }

      const hasChanged = multiSelect
        ? JSON.stringify(currentExperimentId) !== JSON.stringify(newFilePath)
        : currentExperimentId !== newFilePath

      if (currentPipelineUid && hasChanged) {
        onOpenClearWorkflowIdDialog({
          open: true,
          handleOk: () => {
            dispatch(setInputNodeFilePath({ nodeId, filePath: newFilePath! }))
            setOpen(false)
            setSelectedRowIds([])
          },
          handleCancel: () => {},
        })
      } else {
        dispatch(setInputNodeFilePath({ nodeId, filePath: newFilePath! }))
        setOpen(false)
        setSelectedRowIds([])
      }
    } catch (e) {
      enqueueSnackbar("Select experiment failed", { variant: "error" })
    }
  }

  const isOkDisabled = multiSelect ? selectedRowIds.length === 0 : !experimentId

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
          handleRowSelectionModelChange={handleRowSelectionModelChange}
          readonly
          multiSelect={multiSelect}
          hideImageColumns={hideImageColumns}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onClickOk} variant="contained" disabled={isOkDisabled}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
})
