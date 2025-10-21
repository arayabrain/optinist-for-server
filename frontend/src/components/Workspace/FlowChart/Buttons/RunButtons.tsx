import { ChangeEvent, memo, MouseEvent, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"

import { useSnackbar } from "notistack"

import { PlayArrow } from "@mui/icons-material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import BlockIcon from "@mui/icons-material/Block"
import ReplayIcon from "@mui/icons-material/Replay"
import ScheduleIcon from "@mui/icons-material/Schedule"
import { IconButton, Tooltip } from "@mui/material"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Grow from "@mui/material/Grow"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Paper from "@mui/material/Paper"
import Popper from "@mui/material/Popper"
import TextField from "@mui/material/TextField"

import { WORKSPACE_TYPE } from "const/Workspace"
import { UseRunPipelineReturnType } from "store/slice/Pipeline/PipelineHook"
import {
  selectPipelineIsStartedSuccess,
  selectPipelineRunBtn,
} from "store/slice/Pipeline/PipelineSelectors"
import { setRunBtnOption } from "store/slice/Pipeline/PipelineSlice"
import {
  RUN_BTN_LABELS,
  RUN_BTN_OPTIONS,
  RUN_BTN_TYPE,
} from "store/slice/Pipeline/PipelineType"
import { selectCurrentWorkspaceType } from "store/slice/Workspace/WorkspaceSelector"

export const RunButtons = memo(function RunButtons(
  props: UseRunPipelineReturnType,
) {
  const {
    uid,
    runDisabled,
    filePathIsUndefined,
    algorithmNodeNotExist,
    handleCancelPipeline,
    handleRunPipeline,
    handleExpdbBatchRunPipeline,
    handleRunPipelineByUid,
  } = props

  const dispatch = useDispatch()

  const runBtnOption = useSelector(selectPipelineRunBtn)
  const isStartedSuccess = useSelector(selectPipelineIsStartedSuccess)
  const workspaceType = useSelector(selectCurrentWorkspaceType)

  const sendingRunRequest = useRef(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [expdbBatchDialogOpen, setExpdbBatchDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const handleClick = () => {
    let errorMessage: string | null = null
    if (algorithmNodeNotExist) {
      errorMessage = "please add some algorithm nodes to the flowchart"
    }
    if (filePathIsUndefined) {
      errorMessage = "please select input file"
    }
    if (errorMessage != null) {
      enqueueSnackbar(errorMessage, {
        variant: "error",
      })
    } else {
      if (runBtnOption === RUN_BTN_OPTIONS.RUN_NEW) {
        setDialogOpen(true)
      } else {
        if (sendingRunRequest.current) return
        sendingRunRequest.current = true
        handleRunPipelineByUid()
        setTimeout(() => {
          sendingRunRequest.current = false
        }, 3000)
      }
    }
  }
  const onClickDialogRun = (name: string) => {
    if (sendingRunRequest.current) return
    sendingRunRequest.current = true
    handleRunPipeline(name)
    setTimeout(() => {
      sendingRunRequest.current = false
    }, 3000)
    setDialogOpen(false)
  }
  const onClickCancel = () => {
    handleCancelPipeline()
  }
  const onClickExpdbBatchRun = () => {
    let errorMessage: string | null = null
    if (algorithmNodeNotExist) {
      errorMessage = "please add some algorithm nodes to the flowchart"
    }
    if (filePathIsUndefined) {
      errorMessage = "please select input file"
    }
    if (errorMessage != null) {
      enqueueSnackbar(errorMessage, {
        variant: "error",
      })
    } else {
      setExpdbBatchDialogOpen(true)
    }
  }
  const onClickDialogExpdbBatchRun = (name: string) => {
    if (sendingRunRequest.current) return
    sendingRunRequest.current = true
    handleExpdbBatchRunPipeline(name)
    setTimeout(() => {
      sendingRunRequest.current = false
    }, 3000)
    setExpdbBatchDialogOpen(false)
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const handleMenuItemClick = (
    event: MouseEvent<HTMLLIElement>,
    option: RUN_BTN_TYPE,
  ) => {
    dispatch(setRunBtnOption({ runBtnOption: option }))
    setMenuOpen(false)
  }
  const handleToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen)
  }
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }
    setMenuOpen(false)
  }
  const uidExists = uid != null
  const isNormalWorkspace =
    workspaceType === undefined ||
    [WORKSPACE_TYPE.DEFAULT, WORKSPACE_TYPE.NORMAL].includes(workspaceType)
  const isExpdbBatchWorkspace = workspaceType === WORKSPACE_TYPE.EXPDB_BATCH

  return (
    <>
      {/* Show Run All/Run buttons only for non-batch workspaces */}
      {isNormalWorkspace && (
        <>
          <ButtonGroup
            sx={{
              margin: 1,
            }}
            variant="contained"
            ref={anchorRef}
            disabled={runDisabled}
          >
            <Button
              onClick={handleClick}
              startIcon={
                runBtnOption === RUN_BTN_OPTIONS.RUN_ALREADY ? (
                  <ReplayIcon />
                ) : (
                  <PlayArrow />
                )
              }
            >
              {RUN_BTN_LABELS[runBtnOption]}
            </Button>
            <Button size="small" onClick={handleToggle}>
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={menuOpen}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList>
                      {Object.values(RUN_BTN_OPTIONS).map((option) => (
                        <MenuItem
                          key={option}
                          disabled={
                            !uidExists && option === RUN_BTN_OPTIONS.RUN_ALREADY
                          }
                          selected={option === runBtnOption}
                          onClick={(event) =>
                            handleMenuItemClick(event, option)
                          }
                        >
                          {RUN_BTN_LABELS[option]}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </>
      )}

      {/* Show Cancel button for all workspace types when workflow is running */}
      {isStartedSuccess && (
        <Tooltip title="Cancel Workflow">
          <IconButton onClick={onClickCancel}>
            <BlockIcon color="error" />
          </IconButton>
        </Tooltip>
      )}

      {/* Show Batch Run button only for batch workspaces */}
      {isExpdbBatchWorkspace && (
        <Button
          variant="contained"
          sx={{ margin: 1 }}
          onClick={onClickExpdbBatchRun}
          disabled={runDisabled}
          startIcon={<ScheduleIcon />}
        >
          Batch Run
        </Button>
      )}

      <RunDialog
        open={dialogOpen}
        handleRun={onClickDialogRun}
        handleClose={() => setDialogOpen(false)}
      />
      <RunDialog
        open={expdbBatchDialogOpen}
        handleRun={onClickDialogExpdbBatchRun}
        handleClose={() => setExpdbBatchDialogOpen(false)}
      />
    </>
  )
})

interface RunDialogProps {
  open: boolean
  handleRun: (name: string) => void
  handleClose: () => void
}

const RunDialog = memo(function RunDialog({
  open,
  handleClose,
  handleRun,
}: RunDialogProps) {
  const [name, setName] = useState("New flow")
  const [error, setError] = useState<string | null>(null)
  const onClickRun = () => {
    if (name !== "") {
      handleRun(name)
    } else {
      setError("name is empty")
    }
  }
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    if (event.target.value !== "") {
      setError(null)
    }
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Name and run workflow</DialogTitle>
      <DialogContent>
        <TextField
          label="name"
          autoFocus
          margin="dense"
          fullWidth
          variant="standard"
          onChange={onChangeName}
          error={error != null}
          helperText={error}
          value={name}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onClickRun} variant="contained">
          Run
        </Button>
      </DialogActions>
    </Dialog>
  )
})
