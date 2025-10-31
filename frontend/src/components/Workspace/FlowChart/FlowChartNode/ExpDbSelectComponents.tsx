import { memo, useState } from "react"
import { useSelector } from "react-redux"

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Box, Button, Chip, Tooltip, Typography } from "@mui/material"

import { ExpDbSelectDialog } from "components/Workspace/FlowChart/FlowChartNode/ExpDbSelectDialog"
import { selectExpDbRelatedInputNodeSelectedFilePath } from "store/slice/InputNode/InputNodeSelectors"

/**
 * Single selection version of ExpDbSelect
 * Used by ExpDbNode and MicroscopeExpdbFileNode
 */
export const ExpDbSelectSingle = memo(function ExpDbSelectSingle({
  nodeId,
}: {
  nodeId: string
}) {
  const [open, setOpen] = useState(false)
  const experimentId = useSelector(
    selectExpDbRelatedInputNodeSelectedFilePath(nodeId),
  )

  return (
    <div>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Select
      </Button>
      <ExpDbSelectDialog
        nodeId={nodeId}
        open={open}
        setOpen={setOpen}
        experimentIdSelector={selectExpDbRelatedInputNodeSelectedFilePath}
      />
      <Box sx={{ mt: 0.2 }}>
        <Typography variant="caption" sx={{ display: "block" }}>
          {experimentId ? "Selected experiment ID:" : "No experiment selected"}
        </Typography>
        {experimentId && (
          <Chip
            label={experimentId}
            variant="outlined"
            color="primary"
            size="small"
          />
        )}
      </Box>
    </div>
  )
})

/**
 * Multi-selection version of ExpDbSelect
 * Used by ExpdbBatchMicroscopeExpdbFileNode
 */
export const ExpDbSelectMulti = memo(function ExpDbSelectMulti({
  nodeId,
}: {
  nodeId: string
}) {
  const [open, setOpen] = useState(false)
  const experimentIds = useSelector(
    selectExpDbRelatedInputNodeSelectedFilePath(nodeId),
  )

  // Create tooltip content with experiment IDs list for preview
  const tooltipContent = () => {
    if (
      !experimentIds ||
      !Array.isArray(experimentIds) ||
      experimentIds.length === 0
    ) {
      return "No experiments selected"
    }

    const displayIds = experimentIds.slice(0, 100)
    const hasMore = experimentIds.length > 100

    return (
      <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          Selected Experiment IDs:
        </Typography>
        {displayIds.map((id: string, index: number) => (
          <Typography key={index} variant="body2" sx={{ fontSize: "0.75rem" }}>
            {id}
          </Typography>
        ))}
        {hasMore && (
          <Typography
            variant="body2"
            sx={{ mt: 1, fontStyle: "italic", fontSize: "0.75rem" }}
          >
            ... and {experimentIds.length - 100} more
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <div>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Select
      </Button>
      <ExpDbSelectDialog
        nodeId={nodeId}
        open={open}
        setOpen={setOpen}
        experimentIdSelector={selectExpDbRelatedInputNodeSelectedFilePath}
        multiSelect={true}
        hideImageColumns={true}
      />
      <Typography sx={{ mt: 0.5 }}>
        {experimentIds && experimentIds.length > 0 ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            Selected{" "}
            <Chip
              label={experimentIds.length}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.75rem", height: "20px", fontWeight: "bold" }}
            />{" "}
            experiments
            <Tooltip title={tooltipContent()} arrow placement="right">
              <InfoOutlinedIcon
                sx={{
                  fontSize: "1.25rem",
                  color: "primary.main",
                  cursor: "pointer",
                  ml: 0.5,
                }}
              />
            </Tooltip>
          </Box>
        ) : (
          "No experiments selected"
        )}
      </Typography>
    </div>
  )
})
