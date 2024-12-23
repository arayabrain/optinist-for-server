import {
  ChangeEvent,
  memo,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useDispatch, useSelector } from "react-redux"

import CloseIcon from "@mui/icons-material/Close"
import { Input, InputProps } from "@mui/material"
import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Tab from "@mui/material/Tab"
import Tabs, { tabsClasses } from "@mui/material/Tabs"

import { DisplayDataItem } from "components/Workspace/Visualize/DisplayDataItem"
import {
  selectAlgorithmDataFilterParam,
  selectAlgorithmName,
} from "store/slice/AlgorithmNode/AlgorithmNodeSelectors"
import { updateFilterParams } from "store/slice/AlgorithmNode/AlgorithmNodeSlice"
import { TDim } from "store/slice/AlgorithmNode/AlgorithmNodeType"
import { NodeIdProps } from "store/slice/FlowElement/FlowElementType"
import {
  selectPipelineNodeResultOutputKeyList,
  selectPipelineNodeResultOutputFileDataType,
  selectPipelineNodeResultOutputFilePath,
} from "store/slice/Pipeline/PipelineSelectors"
import { selectVisualizeItemIdForWorkflowDialog } from "store/slice/VisualizeItem/VisualizeItemSelectors"
import {
  addItemForWorkflowDialog,
  deleteAllItemForWorkflowDialog,
} from "store/slice/VisualizeItem/VisualizeItemSlice"
import { arrayEqualityFn } from "utils/EqualityUtils"

interface AlgorithmOutputDialogProps {
  open: boolean
  onClose: () => void
  nodeId: string
  allowFilter?: boolean
}

export const AlgorithmOutputDialog = memo(function AlgorithmOutputDialog({
  open,
  onClose,
  nodeId,
  allowFilter,
}: AlgorithmOutputDialogProps) {
  const dispatch = useDispatch()
  const closeFn = () => {
    onClose()
    dispatch(deleteAllItemForWorkflowDialog())
  }
  return (
    <Dialog open={open} onClose={closeFn} fullWidth>
      <TitleWithCloseButton
        title={allowFilter ? "Filter Data" : undefined}
        onClose={closeFn}
        nodeId={nodeId}
      />
      <DialogContent dividers sx={{ pt: 1, px: 2 }}>
        {open && <OutputViewer nodeId={nodeId} />}
        {open && allowFilter ? <BoxFilter nodeId={nodeId} /> : null}
      </DialogContent>
    </Dialog>
  )
})

interface TitleWithCloseButtonProps extends NodeIdProps {
  onClose: () => void
  title?: string
}

const TitleWithCloseButton = memo(function TitleWithCloseButtonProps({
  nodeId,
  onClose,
  title,
}: TitleWithCloseButtonProps) {
  const nodeName = useSelector(selectAlgorithmName(nodeId))
  return (
    <DialogTitle sx={{ m: 0, p: 2 }}>
      {title ?? `Output of ${nodeName}`}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 10,
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  )
})

const OutputViewer = memo(function OutputViewer({ nodeId }: NodeIdProps) {
  const outputKeyList = useSelector(
    selectPipelineNodeResultOutputKeyList(nodeId),
    arrayEqualityFn,
  )
  const [selectedOutoutKey, setSelectedOutputKey] = useState(outputKeyList[0])
  return (
    <>
      <OutputSelectTabs
        outputKeyList={outputKeyList}
        selectedOutoutKey={selectedOutoutKey}
        onSelectOutput={setSelectedOutputKey}
      />
      <DisplayDataView nodeId={nodeId} outputKey={selectedOutoutKey} />
    </>
  )
})

const InputDim = (props: { title: string } & InputProps) => {
  const { title, ...p } = props
  return (
    <Box>
      <Box mb={1}>{title}</Box>
      <Input inputProps={{ style: { textAlign: "center" } }} {...p} />
    </Box>
  )
}

const BoxFilter = ({ nodeId }: { nodeId: string }) => {
  const dataFilterParams = useSelector(selectAlgorithmDataFilterParam(nodeId))
  const dispatch = useDispatch()

  const getData = useCallback(
    (value?: TDim[]) =>
      value
        ?.map((r) => {
          if (!isNaN(r.start!) && !isNaN(r.end!)) return `${r.start}:${r.end}`
          if (!isNaN(r.start!)) return r.start
          if (!isNaN(r.end!)) return r.end
          return ""
        })
        .toString(),
    [],
  )

  const { dim1, dim2, dim3, roi } = useMemo(() => {
    return {
      dim1: getData(dataFilterParams?.dim1),
      dim2: getData(dataFilterParams?.dim2),
      dim3: getData(dataFilterParams?.dim3),
      roi: getData(dataFilterParams?.roi),
    }
  }, [dataFilterParams, getData])

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const regex = /[^0-9,:]/g
      const value = event.target.value.replace(regex, "")
      const values = value.split(",").map((v) => {
        if (!v) return ""
        const array = v.split(":")
        const dim: TDim = {}
        if (array[0] !== undefined) dim.start = Number(array[0])
        if (array[1] !== undefined) dim.end = Number(array[1])
        return dim
      })
      const name = event.target.name
      dispatch(
        updateFilterParams({
          nodeId,
          dataFilter: { ...dataFilterParams, [name]: values },
          isUpdateFilter: true, // TODO Check update with data response
        }),
      )
    },
    [dataFilterParams, dispatch, nodeId],
  )

  return (
    <Box display="flex" gap={2} textAlign="center" pt={2}>
      <InputDim
        title="Dim 1"
        name="dim1"
        placeholder="1:128"
        value={dim1 || ""}
        onChange={onChange}
      />
      <InputDim
        title="Dim 2"
        name="dim2"
        placeholder="1:128"
        value={dim2 || ""}
        onChange={onChange}
      />
      <InputDim
        title="Dim 3"
        name="dim3"
        placeholder="1:1000"
        value={dim3 || ""}
        onChange={onChange}
      />
      <InputDim
        title="ROI"
        name="roi"
        placeholder="1:23,50:52"
        value={roi || ""}
        onChange={onChange}
      />
    </Box>
  )
}

interface OutputSelectTabsProps {
  selectedOutoutKey: string
  outputKeyList: string[]
  onSelectOutput: (selectedKey: string) => void
}

const OutputSelectTabs = memo(function OutputSelectTabs({
  selectedOutoutKey,
  outputKeyList,
  onSelectOutput,
}: OutputSelectTabsProps) {
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    onSelectOutput(newValue)
  }
  return (
    <Tabs
      value={selectedOutoutKey}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        [`& .${tabsClasses.scrollButtons}`]: {
          "&.Mui-disabled": { opacity: 0.3 },
        },
      }}
    >
      {outputKeyList.map((outputKey) => (
        <Tab
          key={outputKey}
          value={outputKey}
          label={outputKey}
          sx={{
            textTransform: "none",
          }}
        />
      ))}
    </Tabs>
  )
})

interface DisplayDataViewProps extends NodeIdProps {
  outputKey: string
}

const DisplayDataView = memo(function DisplayDataView({
  nodeId,
  outputKey,
}: DisplayDataViewProps) {
  const dispatch = useDispatch()
  const filePath = useSelector(
    selectPipelineNodeResultOutputFilePath(nodeId, outputKey),
  )
  const dataType = useSelector(
    selectPipelineNodeResultOutputFileDataType(nodeId, outputKey),
  )
  const itemId = useSelector(
    selectVisualizeItemIdForWorkflowDialog(nodeId, filePath, dataType),
  )
  useEffect(() => {
    if (itemId === null) {
      dispatch(addItemForWorkflowDialog({ nodeId, filePath, dataType }))
    }
  }, [dispatch, nodeId, filePath, dataType, itemId])
  return (
    <Box sx={{ mx: 1, my: 2 }}>
      {itemId != null && <DisplayDataItem itemId={itemId} />}
    </Box>
  )
})
