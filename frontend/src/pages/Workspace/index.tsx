// import { useEffect } from 'react'
import { useSelector /*, useDispatch */ } from 'react-redux'
import { Box, styled, Button } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Loading from '../../components/common/Loading'
import {
  selectIsLoadingWorkspaceList,
  selectWorkspaceList,
} from 'store/slice/Workspace/WorkspaceSelector'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

const columns: GridColDef[] = [
  {
    field: 'workspace_id',
    headerName: 'ID',
    width: 160,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Link to={`/workspaces/${params.value}`}>{params.value}</Link>
    ),
  },
  {
    field: 'workspace_name',
    headerName: 'Workspace Name',
    width: 160,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Link to={`/workspaces/${params.value}`}>{params.value}</Link>
    ),
  },
  {
    field: 'owner',
    headerName: 'Owner',
    width: 160,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Link to={`/workspaces/${params.value}`}>{params.value}</Link>
    ),
  },
  {
    field: 'created',
    headerName: 'Created',
    width: 160,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Link to={`/workspaces/${params.value}`}>{params.value}</Link>
    ),
  },
  {
    field: 'workflow',
    headerName: '',
    width: 100,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Button>Workflow</Button>
    ),
  },
  {
    field: 'result',
    headerName: '',
    width: 100,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Button>Result</Button>
    ),
  },
  {
    field: 'download',
    headerName: '',
    width: 70,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Button>
          <SystemUpdateAltIcon />
        </Button>
    ),
  },
  {
    field: 'share',
    headerName: '',
    width: 70,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Button>
          <SystemUpdateAltIcon sx={{transform: 'rotate(180deg)'}}/>
        </Button>
    ),
  },
  {
    field: 'delete',
    headerName: '',
    width: 100,
    renderCell: (params: GridRenderCellParams<string>) => (
        <Button>Del</Button>
    ),
  },
]

const Workspaces = () => {
  // const dispatch = useDispatch()
  const workspaces = useSelector(selectWorkspaceList)
  const loading = useSelector(selectIsLoadingWorkspaceList)

  /* TODO: Add get workspace apis and actions
  useEffect(() => {
    dispatch(getWorkspaceList())
    //eslint-disable-next-line
  }, [])
  */

  return (
    <WorkspacesWrapper>
      <WorkspacesTitle>Workspaces</WorkspacesTitle>
      <DataGrid
        autoHeight
        rows={workspaces.map((ws) => ({
          id: ws.workspace_id,
          workspace_id: ws.workspace_id,
        }))}
        columns={columns}
      />
      {loading ? <Loading /> : null}
    </WorkspacesWrapper>
  )
}

const WorkspacesWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  overflow: 'auto',
}))

const WorkspacesTitle = styled('h1')(({ theme }) => ({}))

const ButtonCustom = styled(Button)(({theme}) => ({
  backgroundColor: "black"
}))

export default Workspaces
