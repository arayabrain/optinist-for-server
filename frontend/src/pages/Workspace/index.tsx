// import { useEffect } from 'react'
import { useSelector /*, useDispatch */ } from 'react-redux'
import { Box, styled, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import {
  DataGrid,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Loading from '../../components/common/Loading'
import {
  selectIsLoadingWorkspaceList,
  // selectWorkspaceList,
} from 'store/slice/Workspace/WorkspaceSelector'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';

type PopupType = {
  open: boolean
  handleClose: () => void
}

const columns = (handleOpenPopupShare: () => void, handleOpenPopupDel: () => void) => (
    [
      {
        field: 'id',
        headerName: 'ID',
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<string>) => (
          <span>{params.value}</span>
        ),
      },
      {
        field: 'name',
        headerName: 'Workspace Name',
        minWidth: 200,
        editable: true,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span>{params.value}</span>
            {params.row.owner !== "User 2" ? <EditIcon /> : ""}
          </Box>
        ),
      },
      {
        field: 'owner',
        headerName: 'Owner',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Box
            sx={{display: "flex", alignItems: "center", gap: 2}}
          >
            <span>{params.value}</span>
            {params.value === "User 2" ? <GroupsIcon /> : ""}
          </Box>
        ),
      },
      {
        field: 'created',
        headerName: 'Created',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<string>) => (
          <span>{params.value}</span>
        ),
      },
      {
        field: 'workflow',
        headerName: '',
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<string>) => (
          <LinkCustom to={"#"}>
            Workflow
          </LinkCustom>
        ),
      },
      {
        field: 'result',
        headerName: '',
        minWidth: 130,
        renderCell: (params: GridRenderCellParams<string>) => (
            <LinkCustom to={"#"}>
              Result
            </LinkCustom>
        ),
      },
      {
        field: 'download',
        headerName: '',
        minWidth: 90,
        renderCell: (params: GridRenderCellParams<string>) => (
          <ButtonCustom>
            <SystemUpdateAltIcon />
          </ButtonCustom>
        ),
      },
      {
        field: 'share',
        headerName: '',
        minWidth: 90,
        renderCell: (params: GridRenderCellParams<string>) => (
          params.row.owner !== "User 2" ?
            <ButtonCustom onClick={handleOpenPopupShare}>
              <SystemUpdateAltIcon sx={{transform: 'rotate(180deg)'}}/>
            </ButtonCustom> : ""
        ),
      },
      {
        field: 'delete',
        headerName: '',
        minWidth: 130,
        renderCell: (params: GridRenderCellParams<string>) => (
          params.row.owner !== "User 2" ?
            <ButtonCustom onClick={handleOpenPopupDel}>
              Del
            </ButtonCustom> : ""
        ),
      },
    ]
)

const columnsShare = (handleShareFalse: (parmas: GridRenderCellParams<string>) => void) => (
    [
      {
        field: "name",
        headerName: "Name",
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<string>) => (
            <span>{params.row.name}</span>
        ),
      },
      {
        field: "lab",
        headerName: "Lab",
        minWidth: 280,
        renderCell: (params: GridRenderCellParams<string>) => (
            <span>{params.row.email}</span>
        ),
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 280,
        renderCell: (params: GridRenderCellParams<string>) => (
            <span>{params.row.email}</span>
        ),
      },
      {
        field: "share",
        headerName: "",
        minWidth: 130,
        renderCell: (params: GridRenderCellParams<string>) => {
          if(!params.row.share) return ""
          return (
              <Button onClick={() => handleShareFalse(params)}>
                <CancelIcon color={"error"}/>
              </Button>
          )
        }
      },
    ]
)

const data = [
  {
    id: 1,
    owner: "User 1",
    name: "Name 1",
    created: "YYYY/MM/DD HH:MI",
    share: false
  },
  {
    id: 2,
    owner: "User 2",
    name: "Name 2",
    created: "YYYY/MM/DD HH:MI",
    share: true
  },
  {
    id: 3,
    owner: "User 1",
    name: "Name 3",
    created: "YYYY/MM/DD HH:MI",
    share: true
  }
]

const dataShare = [
  {
    id: 1,
    name: "User 1",
    lab: "Labxxxx",
    email: "aaaaa@gmail.com",
    share: false
  },
  {
    id: 2,
    name: "User 2",
    lab: "Labxxxx",
    email: "aaaaa@gmail.com",
    share: true
  },
  {
    id: 3,
    name: "User 3",
    lab: "Labxxxx",
    email: "aaaaa@gmail.com",
    share: true
  }
]

const PopupShare = ({open, handleClose}: PopupType) => {
  const [tableShare, setTableShare] = useState(dataShare)
  if(!open) return <></>
  const handleShareTrue = (params: GridRowParams) => {
    if(params.row.share) return
    const index = tableShare.findIndex(item => item.id === params.id)
    setTableShare(pre => {
      pre[index].share = true
      return pre
    })
  }

  const handleShareFalse = (params: GridRenderCellParams<string>) => {
    const indexSearch = tableShare.findIndex(item => item.id === params.id)
    const newData = tableShare.map((item, index) => {
      if(index === indexSearch) return {...item, share: false}
      return item
    })
    setTableShare(newData)
  }

  return (
    <Box>
      <DialogCustom
        open={open}
        onClose={handleClose}
        sx={{margin: 0}}
      >
        <DialogTitle>Share Workspace</DialogTitle>
        <DialogTitle>Permitted users</DialogTitle>
        <DialogContent>
          <DataGrid
            sx={{minHeight: 500}}
            onRowClick={handleShareTrue}
            rows={tableShare}
            columns={columnsShare(handleShareFalse)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </DialogCustom>
    </Box>
  )
}

const PopupDelete = ({open, handleClose}: PopupType) => {
  if(!open) return <></>
  return (

    <Box>
      <Dialog
          open={open}
          onClose={handleClose}
          sx={{margin: 0}}
      >
        <DialogTitle>Do you want delete?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const Workspaces = () => {
  // const dispatch = useDispatch()
  // const workspaces = useSelector(selectWorkspaceList)
  const loading = useSelector(selectIsLoadingWorkspaceList)
  const [openShare, setOpenShare] = useState(false)
  const [openDel, setOpenDel] = useState(false)

  /* TODO: Add get workspace apis and actions
  useEffect(() => {
    dispatch(getWorkspaceList())
    //eslint-disable-next-line
  }, [])
  */
  const handleOpenPopupShare = () => {
    setOpenShare(true)
  }

  const handleClosePopupShare = () => {
    setOpenShare(false)
  }

  const handleOpenPopupDel = () => {
    setOpenDel(true)
  }

  const handleClosePopupDel = () => {
    setOpenDel(false)
  }

  return (
    <WorkspacesWrapper>
      <WorkspacesTitle>Workspaces</WorkspacesTitle>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          marginBottom: 2
        }}
      >
        <ButtonCustom>Import</ButtonCustom>
        <ButtonCustom>New</ButtonCustom>
      </Box>
      <DataGrid
        autoHeight
        rows={data}
        columns={columns(handleOpenPopupShare, handleOpenPopupDel)}
        isCellEditable={(params) => params.row.owner === "User 1"}
      />
      {loading ? <Loading /> : null}
      <PopupShare open={openShare} handleClose={handleClosePopupShare} />
      <PopupDelete open={openDel} handleClose={handleClosePopupDel} />
    </WorkspacesWrapper>
  )
}

const WorkspacesWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  overflow: 'auto',
}))

const WorkspacesTitle = styled('h1')(({ theme }) => ({}))

const ButtonCustom = styled(Button)(({theme}) => ({
  backgroundColor: "#000000c4",
  color: "#FFF",
  fontSize: 16,
  padding: theme.spacing(0.5, 1.25),
  textTransform: "unset",
  "&:hover": {
    backgroundColor: "#000000fc",
  }
}))

const LinkCustom = styled(Link)(({theme}) => ({
  backgroundColor: "#000000c4",
  color: "#FFF",
  fontSize: 16,
  padding: theme.spacing(0.5, 1.5),
  textTransform: "unset",
  textDecoration: "unset",
  borderRadius: 5,
  "&:hover": {
    backgroundColor: "#000000fc",
  }
}))

const DialogCustom = styled(Dialog)(({theme}) => ({
  "& .MuiDialog-container": {
    "& .MuiPaper-root": {
      width: "70%",
      maxWidth: "890px",
    },
  },
}))

export default Workspaces
