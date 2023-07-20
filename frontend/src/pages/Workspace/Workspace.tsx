import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { STANDALONE_WORKSPACE_ID, IS_STANDALONE } from 'const/Mode'
import { useRunPipeline } from 'store/slice/Pipeline/PipelineHook'
import Experiment from 'components/Workspace/Experiment/Experiment'
import FlowChart from 'components/Workspace/FlowChart/FlowChart'
import Visualize from 'components/Workspace/Visualize/Visualize'
import {
  clearCurrentWorkspace,
  setCurrentWorkspace,
} from 'store/slice/Workspace/WorkspaceSlice'
import {
  selectActiveTab,
  selectWorkspaceList,
} from 'store/slice/Workspace/WorkspaceSelector'
import { fetchExperiment } from 'store/slice/Experiments/ExperimentsActions'

const Workspace: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const runPipeline = useRunPipeline() // タブ切り替えによって結果取得処理が止まってしまうのを回避するため、タブの親レイヤーで呼び出している
  const workspaces = useSelector(selectWorkspaceList)

  const { workspaceId } = useParams<{ workspaceId: string }>()

  useEffect(() => {
    if (IS_STANDALONE) {
      dispatch(setCurrentWorkspace(STANDALONE_WORKSPACE_ID))
    } else if (workspaceId) {
      if (
        workspaces
          .map((workspace) => workspace.workspace_id)
          .includes(workspaceId)
      ) {
        dispatch(setCurrentWorkspace(workspaceId))
        dispatch(fetchExperiment(workspaceId))
      } else {
        navigate('/console/workspaces')
      }
    }
    return () => {
      dispatch(clearCurrentWorkspace())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, dispatch])

  const activeTab = useSelector(selectActiveTab)

  return (
    <RootDiv>
      <TabPanel value={activeTab} index={0}>
        <FlowChart {...runPipeline} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Visualize />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <Experiment />
      </TabPanel>
    </RootDiv>
  )
}

const RootDiv = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  height: '100%',
}))

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      style={{ height: 'calc(100% - 58px)' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  )
}

export default Workspace
