import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { ExperimentUidContext } from './ExperimentTable'
import {
  selectExperimentFunctionHasNWB,
  selectExperimentFunctionMessage,
  selectExperimentFunctionName,
  selectExperimentFunctionNodeIdList,
  selectExperimentFunctionStatus,
} from 'store/slice/Experiments/ExperimentsSelectors'
import { ExperimentStatusIcon } from './ExperimentStatusIcon'
import { arrayEqualityFn } from 'utils/EqualityUtils'
import { NWBDownloadButton } from './Button/DownloadButton'
import { IconButton, Popover } from '@mui/material'

export const CollapsibleTable = React.memo<{
  open: boolean
}>(({ open }) => {
  return (
    <TableRow>
      <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Details
            </Typography>
            <Table size="small" aria-label="purchases">
              <Head />
              <Body />
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
})

const Head = React.memo(() => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Function</TableCell>
        <TableCell>nodeID</TableCell>
        <TableCell>Success</TableCell>
        <TableCell>NWB</TableCell>
      </TableRow>
    </TableHead>
  )
})

const Body = React.memo(() => {
  const uid = React.useContext(ExperimentUidContext)
  const nodeIdList = useSelector(
    selectExperimentFunctionNodeIdList(uid),
    arrayEqualityFn,
  )
  return (
    <TableBody>
      {nodeIdList.map((nodeId) => (
        <TableRowOfFunction nodeId={nodeId} />
      ))}
    </TableBody>
  )
})

const TableRowOfFunction = React.memo<{
  nodeId: string
}>(({ nodeId }) => {
  const uid = React.useContext(ExperimentUidContext)
  const name = useSelector(selectExperimentFunctionName(uid, nodeId))
  const status = useSelector(selectExperimentFunctionStatus(uid, nodeId))
  const hasNWB = useSelector(selectExperimentFunctionHasNWB(uid, nodeId))
  const message = useSelector(selectExperimentFunctionMessage(uid, nodeId))
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  return (
    <TableRow key={nodeId}>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell>{nodeId}</TableCell>
      <TableCell>
        <IconButton onClick={handleClick} disabled={!message}>
          <ExperimentStatusIcon status={status} />
        </IconButton>
        <Popover
          id="function-error-message"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 2 }}>{message}</Typography>
        </Popover>
      </TableCell>
      <TableCell>
        <NWBDownloadButton name={name} nodeId={nodeId} hasNWB={hasNWB} />
      </TableCell>
    </TableRow>
  )
})
