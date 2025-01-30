import { memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { enqueueSnackbar } from "notistack"

import WarningIcon from "@mui/icons-material/Warning"
import IconButton from "@mui/material/IconButton"

import { ConfirmDialog } from "components/common/ConfirmDialog"
import { getExperiments } from "store/slice/Experiments/ExperimentsActions"
import { reset } from "store/slice/VisualizeItem/VisualizeItemSlice"
import {
  importSampleData,
  reproduceWorkflow,
} from "store/slice/Workflow/WorkflowActions"
import { selectCurrentWorkspaceId } from "store/slice/Workspace/WorkspaceSelector"
import { AppDispatch } from "store/store"

interface CondaNoticeButtonProps {
  condaName: string
}

export const CondaNoticeButton = memo(function CondaNoticeButton({
  condaName,
}: CondaNoticeButtonProps) {
  const [open, setOpen] = useState(false)
  const openDialog = () => {
    setOpen(true)
  }

  const dispatch = useDispatch<AppDispatch>()
  const workspaceId = useSelector(selectCurrentWorkspaceId) || -1

  const handleOk = async (condaName: string) => {
    // Import create-conda-env workflow
    await dispatch(importSampleData({ workspaceId }))
      .unwrap()
      .then(() => {
        // *Here, success snackbar display is off.
        dispatch(reset())
        dispatch(getExperiments())
      })
      .catch(() => {
        enqueueSnackbar("Failed to import import", { variant: "error" })
        return // break on error
      })

    // Reproduce create-conda-env workflow
    const uid = `setup_conda_${condaName}`
    await dispatch(reproduceWorkflow({ workspaceId, uid }))
      .unwrap()
      .then(() => {
        // *Here, success snackbar display is off.
        dispatch(reset())
      })
      .catch(() => {
        enqueueSnackbar("Failed to reproduce", { variant: "error" })
        return // break on error
      })

    // TODO: RUN reproduced workflow.
    // (WIP)
  }

  return (
    <>
      <IconButton
        style={{ padding: 0, color: "orange" }}
        size="small"
        onClick={openDialog}
      >
        <WarningIcon />
      </IconButton>
      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        onConfirm={() => handleOk(condaName)}
        title="Conda Environment Verification"
        content={
          <>
            <p>
              Conda environment <strong>&quot;{condaName}&quot;</strong> does
              not exist. Create an environment?
            </p>
            <p style={{ display: "flex", alignItems: "center" }}>
              <WarningIcon
                style={{
                  marginRight: 8,
                  color: "orange",
                }}
                fontSize="medium"
              />
              Start Conda environment creation workflow. Current workflow will
              be cleared.
            </p>
          </>
        }
        confirmLabel="Start Create"
        iconType="info"
      />
    </>
  )
})
