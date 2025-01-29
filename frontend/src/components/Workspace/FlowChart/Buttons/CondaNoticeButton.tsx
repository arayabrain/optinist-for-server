import { memo, useState } from "react"

import WarningIcon from "@mui/icons-material/Warning"
import IconButton from "@mui/material/IconButton"

import { ConfirmDialog } from "components/common/ConfirmDialog"

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
  const handleOk = () => {
    // TODO: Requires implementation
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
        onConfirm={handleOk}
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
        confirmLabel="Run Create"
        iconType="info"
      />
    </>
  )
})
