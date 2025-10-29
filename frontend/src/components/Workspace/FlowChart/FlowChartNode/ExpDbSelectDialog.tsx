import { memo, useContext, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useSnackbar } from "notistack"

import {
  Box,
  Button,
  Chip,
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

  // Multi select state - initialize from currentExperimentId when dialog opens
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    [],
  )

  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // Track previous open state to detect when dialog opens
  const prevOpenRef = useRef(false)

  // Update selectedRowIds ONLY when dialog opens (not when filter changes)
  useEffect(() => {
    // Only initialize when dialog transitions from closed to open
    if (open && !prevOpenRef.current) {
      if (multiSelect && Array.isArray(currentExperimentId)) {
        // Map experiment IDs to row IDs
        const rowIds = dataExperiments.items
          .filter((item) =>
            currentExperimentId.includes(item.experiment_id || ""),
          )
          .map((item) => item.id)
        setSelectedRowIds(rowIds)
      } else if (multiSelect) {
        // Reset to empty if currentExperimentId is not an array
        setSelectedRowIds([])
      }
    }
    // Update the previous open state
    prevOpenRef.current = open
  }, [open, multiSelect, currentExperimentId, dataExperiments.items])

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

  const isOkDisabled = !multiSelect && !experimentId

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
        {multiSelect && (
          <Box sx={{ display: "flex", alignItems: "center", mb: -4 }}>
            Selected{" "}
            <Chip
              label={selectedRowIds.length}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                fontSize: "0.75rem",
                height: "20px",
                fontWeight: "bold",
                mx: 0.5,
              }}
            />{" "}
            experiments
          </Box>
        )}
        <DatabaseExperiments
          user={user}
          cellPath="/console/cells"
          handleRowClick={handleRowClick}
          handleRowSelectionModelChange={handleRowSelectionModelChange}
          readonly
          multiSelect={multiSelect}
          hideImageColumns={hideImageColumns}
          initialRowSelection={selectedRowIds}
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
