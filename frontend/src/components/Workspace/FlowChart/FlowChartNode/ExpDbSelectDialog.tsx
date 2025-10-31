import { memo, useContext, useEffect, useMemo, useRef, useState } from "react"
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

  // Multi select state - manage by experiment_id (not row id) to persist across pagination
  // Use ref to keep stable reference across pagination
  const selectedExperimentIdsRef = useRef<string[]>([])
  const [selectedExperimentIds, setSelectedExperimentIds] = useState<string[]>(
    [],
  )

  // Custom setter that updates both state and ref synchronously
  const updateSelectedExperimentIds = (newIds: string[]) => {
    selectedExperimentIdsRef.current = newIds
    setSelectedExperimentIds(newIds)
  }

  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // Track previous open state to detect when dialog opens
  const prevOpenRef = useRef(false)

  // Initialize selectedExperimentIds ONLY when dialog opens
  useEffect(() => {
    // Only initialize when dialog transitions from closed to open
    if (open && !prevOpenRef.current) {
      if (multiSelect && Array.isArray(currentExperimentId)) {
        updateSelectedExperimentIds(currentExperimentId)
      } else if (multiSelect) {
        updateSelectedExperimentIds([])
      }
    }
    // Update the previous open state
    prevOpenRef.current = open
  }, [open, multiSelect, currentExperimentId])

  // Convert selectedExperimentIds to row IDs for current page
  // This ensures selectedRowIds is always in sync with selectedExperimentIds
  const selectedRowIds = useMemo(() => {
    return dataExperiments.items
      .filter((item) =>
        selectedExperimentIds.includes(item.experiment_id || ""),
      )
      .map((item) => item.id)
  }, [dataExperiments.items, selectedExperimentIds])

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
      // Convert current page selection to experiment IDs
      const currentPageExpIds = dataExperiments.items
        .filter((item) => selectionModel.includes(item.id))
        .map((item) => item.experiment_id)
        .filter((id): id is string => id !== undefined)

      // Get experiment IDs that are NOT on the current page
      const currentPageAllExpIds = dataExperiments.items
        .map((item) => item.experiment_id)
        .filter((id): id is string => id !== undefined)

      const otherPagesExpIds = selectedExperimentIdsRef.current.filter(
        (id) => !currentPageAllExpIds.includes(id),
      )

      // Merge: keep selections from other pages + current page selection
      const mergedExpIds = [...otherPagesExpIds, ...currentPageExpIds]

      updateSelectedExperimentIds(mergedExpIds)
    }
  }

  const onClickCancel = () => {
    setOpen(false)
    setExperimentId(undefined)
    updateSelectedExperimentIds([])
  }

  const onClickOk = () => {
    try {
      let newFilePath: string | string[] | undefined

      if (multiSelect) {
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
            updateSelectedExperimentIds([])
          },
          handleCancel: () => {},
        })
      } else {
        dispatch(setInputNodeFilePath({ nodeId, filePath: newFilePath! }))
        setOpen(false)
        updateSelectedExperimentIds([])
      }
    } catch (e) {
      enqueueSnackbar("Select experiment failed", { variant: "error" })
    }
  }

  const isOkDisabled = multiSelect ? false : !experimentId

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
              label={selectedExperimentIds.length}
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
