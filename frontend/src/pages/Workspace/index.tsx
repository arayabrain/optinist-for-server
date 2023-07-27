import { useSelector, useDispatch } from 'react-redux'
import { Box, styled, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input, Pagination } from '@mui/material'
import {
  GridRenderCellParams,
  GridRowParams,
  DataGrid,
  GridEventListener
} from '@mui/x-data-grid'
import { DataGridPro, GridRowModesModel } from '@mui/x-data-grid-pro'
import { Link, useSearchParams } from 'react-router-dom'
import { selectCurrentUser } from 'store/slice/User/UserSelector'
import Loading from '../../components/common/Loading'
import {
  selectIsLoadingWorkspaceList, selectWorkspaceData,
} from 'store/slice/Workspace/WorkspaceSelector'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { delWorkspace, exportWorkspace, getWorkspaceList, importWorkspace, postWorkspace, putWorkspace } from 'store/slice/Workspace/WorkspacesActions'
import moment from 'moment'

type PopupType = {
  open: boolean
  handleClose: () => void
  handleOkDel?: () => void
  setNewWorkSpace?: (name: string) => void
  value?: string
  handleOkNew?: () => void
  handleOkSave?: () => void
  error?: string
}

const columns = (
    handleOpenPopupShare: () => void,
    handleOpenPopupDel: (id: number) => void,
    handleDownload: (id: number) => void,
    user?: {id: number}
  ) => (
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
        renderCell: (params: GridRenderCellParams<string>) => {
          return (
            <Box
              sx={{
                width: 180,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
              }}>
                {params.row.name}
              </span>
              {params.row.user_id === user?.id ? <EditIcon /> : ""}
            </Box>
          )
        },
      },
      {
        field: 'user',
        headerName: 'Owner',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<{name: string, id: number}>) => (
          <Box
            sx={{display: "flex", alignItems: "center", gap: 2}}
          >
            <span>{params.value?.name}</span>
            {params.value.id !== user?.id ? <PeopleOutlineIcon /> : ""}
          </Box>
        ),
      },
      {
        field: 'created_at',
        headerName: 'Created',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<string>) => (
          <span>{moment(params.value).format("YYYY/MM/DD HH:MM")}</span>
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
          <ButtonCustom onClick={() => handleDownload(params?.row?.id)}>
            <SystemUpdateAltIcon />
          </ButtonCustom>
        ),
      },
      {
        field: 'share',
        headerName: '',
        minWidth: 90,
        renderCell: (params: GridRenderCellParams<string>) => (
          params.row?.user_id === user?.id ?
            <ButtonCustom onClick={handleOpenPopupShare}>
              <PeopleOutlineIcon />
            </ButtonCustom> : ""
          )
      },
      {
        field: 'delete',
        headerName: '',
        minWidth: 130,
        renderCell: (params: GridRenderCellParams<string>) => (
          params.row?.user_id === user?.id ?
          <ButtonCustom onClick={() => handleOpenPopupDel(params.row.id)}>
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
        <DialogTitle>アクセス許可ユーザー</DialogTitle>
        <DialogContent>
          <DataGrid
            sx={{minHeight: 500}}
            onRowClick={handleShareTrue}
            rows={tableShare}
            columns={columnsShare(handleShareFalse) as any}
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

const PopupNew = ({
  open,
  handleClose,
  value,
  setNewWorkSpace,
  handleOkNew,
  error
}: PopupType) => {
  if(!setNewWorkSpace) return null
  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewWorkSpace(event.target.value)
  }

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{margin: 0}}
      >
        <DialogTitle>Create New Workspace</DialogTitle>
        <DialogContent sx={{minWidth: 300}}>
          <Input
            sx={{width: "80%"}}
            placeholder={"Workspace Name"}
            value={value || ""}
            onChange={handleName}
          />
          <br/>
          {error ? <span style={{color: "red"}}>{error}</span> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOkNew}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const PopupDelete = ({open, handleClose, handleOkDel}: PopupType) => {
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
          <Button onClick={handleOkDel}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const PopupSave = ({open, handleClose, handleOkSave}: PopupType) => {
  return (
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{margin: 0}}
        >
          <DialogTitle>Do you want save?</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleOkSave}>Ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
  )
}

const Workspaces = () => {
  const dispatch = useDispatch()
  const loading = useSelector(selectIsLoadingWorkspaceList)
  const data = useSelector(selectWorkspaceData)
  const user = useSelector(selectCurrentUser)
  const [open, setOpen] = useState({share: false, del: false, new: false, save: false})
  const [idDel, setIdDel] = useState<number>()
  const [newWorkspace, setNewWorkSpace] = useState<string>()
  const [dataEdit, setDataEdit] = useState<{name?: string, id?: number}>()
  const [error, setError] = useState("")

  const [rows, setRows] = useState(data.items);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [searchParams, setParams] = useSearchParams()

  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit')

  const dataParams = useMemo(() => {
    return {
      offset: Number(offset) || 0,
      limit: Number(limit) || 50,
    }
    //eslint-disable-next-line
  }, [offset, limit])

  useEffect(() => {
    dispatch(getWorkspaceList(dataParams))
    //eslint-disable-next-line
  }, [dataParams])

  const handleOpenPopupShare = () => {
    setOpen({...open, share: true})
  }

  const handleClosePopupShare = () => {
    setOpen({...open, share: false})
  }

  const handleOpenPopupDel = (id: number) => {
    setIdDel(id)
    setOpen({...open, del: true})
  }

  const handleOkDel = async () => {
    if(!idDel) return
    await dispatch(delWorkspace({id: idDel, params: dataParams}))
    setOpen({...open, del: false})
  }

  const handleClosePopupDel = () => {
    setOpen({...open, del: false})
  }

  const handleOpenPopupNew = () => {
    setOpen({...open, new: true})
  }

  const handleClosePopupNew = () => {
    setOpen({...open, new: false})
    setError("")
  }

  const handleClosePopupSave = () => {
    setOpen({...open, save: false})
  }

  const handleOkSave = async () => {
    if(!dataEdit) return
    await dispatch(putWorkspace({name: dataEdit.name, id: dataEdit.id, params: dataParams}))
    setOpen({...open, save: false})
  }

  const handleOkNew = async () => {
    if(!newWorkspace) {
      setError("is not empty")
      return
    }
    await dispatch(postWorkspace({name: newWorkspace, params: dataParams}))
    setOpen({...open, new: false})
    setError("")
    setNewWorkSpace("")
  }

  const processRowUpdate = (newRow: any) => {
    if(!newRow?.name) {
      alert("Workspace Name cann't empty")
      return {...newRow, name: '12312321'}
    }
    setOpen({...open, save: true})
    setDataEdit({id: newRow?.id, name: newRow?.name})
    return newRow;
  };

  const onProcessRowUpdateError = (newRow: any) => {
    return newRow
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(importWorkspace({}))
  }

  const pagi = useCallback(
      (page?: number) => {
        return `limit=${data.limit}&offset=${
            page ? page - 1 : data.offset
        }`
      },
      [data.limit, data.offset],
  )

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    setParams(`&${pagi(page)}`)
  }

  const handleDownload = async (id: number) => {
    dispatch(exportWorkspace(id))
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

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
        <label htmlFor="upload-image">
          <Button
            sx={{
              background: "#000000c4",
              "&:hover": {
                backgroundColor: "#000000fc",
              }
            }}
            variant="contained"
            component="span">
            Import
          </Button>
          <input
            id="upload-image"
            hidden
            accept="*"
            type="file"
            onChange={handleFileUpload}
          />
        </label>
        <ButtonCustom onClick={handleOpenPopupNew}>New</ButtonCustom>
      </Box>
      <Box
        sx={{
          minHeight: 500,
          height: 'calc(100vh - 350px)'
      }}>
        <DataGridPro
          rows={data?.items}
          editMode="cell"
          columns={columns(handleOpenPopupShare, handleOpenPopupDel, handleDownload, user) as any}
          isCellEditable={(params) => params.row.user?.id === user?.id}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          hideFooter={true}
        />
      </Box>
      <Pagination
        sx={{ marginTop: 2 }}
        count={data.total}
        page={data.offset + 1}
        onChange={handlePage}
      />
      <PopupShare open={open.share} handleClose={handleClosePopupShare} />
      <PopupDelete open={open.del} handleClose={handleClosePopupDel} handleOkDel={handleOkDel} />
      <PopupSave open={open.save} handleClose={handleClosePopupSave} handleOkSave={handleOkSave} />
      <PopupNew
        open={open.new}
        handleClose={handleClosePopupNew}
        setNewWorkSpace={setNewWorkSpace}
        value={newWorkspace}
        error={error}
        handleOkNew={handleOkNew}
      />
      {loading ? <Loading /> : null}
    </WorkspacesWrapper>
  )
}

const WorkspacesWrapper = styled(Box)(({ theme }) => ({
  margin: "auto",
  width: "90vw",
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
