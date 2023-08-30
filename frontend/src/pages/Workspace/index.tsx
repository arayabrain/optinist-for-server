import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  Tooltip,
} from '@mui/material'
import {
  GridEventListener,
  GridRenderCellParams,
  GridRowModes,
  GridValidRowModel,
  DataGrid,
} from '@mui/x-data-grid'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '../../components/common/Loading'
import {
  selectIsLoadingWorkspaceList,
  selectWorkspaceData,
  selectWorkspaceListUserShare,
} from 'store/slice/Workspace/WorkspaceSelector'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  delWorkspace,
  exportWorkspace,
  getListUserShareWorkSpaces,
  getWorkspaceList,
  importWorkspace,
  postWorkspace,
  putWorkspace,
} from 'store/slice/Workspace/WorkspacesActions'
import PopupShare from 'components/PopupShare'
import moment from 'moment'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import GroupsIcon from '@mui/icons-material/Groups'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { selectCurrentUser } from 'store/slice/User/UserSelector'
import { UserDTO } from 'api/users/UsersApiDTO'
import { isMine } from 'utils/checkRole'
import PaginationCustom from '../../components/common/PaginationCustom'
import { useSnackbar, VariantType } from 'notistack'

type PopupType = {
  open: boolean
  handleClose: () => void
  handleOkDel?: () => void
  setNewWorkSpace?: (name: string) => void
  value?: string
  handleOkNew?: () => void
  handleOkSave?: () => void
  error?: string
  nameWorkspace?: string
}

const columns = (
  handleOpenPopupShare: (id: number) => void,
  handleOpenPopupDel: (id: number, nameWorkspace: string) => void,
  handleDownload: (id: number) => void,
  handleNavWorkflow: (id: number) => void,
  handleNavRecords: (id: number) => void,
  user?: UserDTO,
  onEdit?: (id: number) => void,
) => [
  {
    field: 'id',
    headerName: 'ID',
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    flex: 1,
    minWidth: 70,
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
      <span>{params.value}</span>
    ),
  },
  {
    field: 'name',
    headerName: 'Workspace Name',
    flex: 2,
    minWidth: 100,
    editable: true,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => {
      const { row, value } = params
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Tooltip title={value} placement="top">
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}
            >
              {value}
            </span>
          </Tooltip>
          {isMine(user, row?.user?.id) ? (
            <ButtonIcon onClick={() => onEdit?.(row.id)}>
              <EditIcon style={{ fontSize: 16 }} />
            </ButtonIcon>
          ) : null}
        </Box>
      )
    },
  },
  {
    field: 'user',
    headerName: 'Owner',
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    flex: 2,
    minWidth: 100,
    renderCell: (
      params: GridRenderCellParams<{ name: string; id: number }>,
    ) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {params.value ? (
          <>
            <span>{params.value?.name}</span>
            {!isMine(user, params?.value.id) ? <GroupsIcon /> : ''}
          </>
        ) : null}
      </Box>
    ),
  },
  {
    field: 'created_at',
    headerName: 'Created',
    flex: 2,
    minWidth: 100,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
      <span
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-all',
          overflowWrap: 'break-word',
        }}
      >
        {moment(params.value).format('YYYY/MM/DD hh:mm')}
      </span>
    ),
  },
  {
    field: 'workflow',
    headerName: '',
    flex: 1,
    minWidth: 160,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => handleNavWorkflow(params.row.id)}
      >
        Workflow
      </Button>
    ),
  },
  {
    field: 'records',
    headerName: '',
    flex: 1,
    minWidth: 100,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleNavRecords(params.row.id)}
        >
          Records
        </Button>
      )
    },
  },
  {
    field: 'download',
    headerName: '',
    flex: 1,
    minWidth: 70,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
      <ButtonIcon onClick={() => handleDownload(params?.row?.id)}>
        <SystemUpdateAltIcon />
      </ButtonIcon>
    ),
  },
  {
    field: 'share',
    headerName: '',
    flex: 1,
    minWidth: 70,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) =>
      isMine(user, params.row?.user?.id) ? (
        <ButtonIcon onClick={() => handleOpenPopupShare(params.row.id)}>
          <GroupsIcon color={params.row.shared_count ? 'primary' : 'inherit'} />
        </ButtonIcon>
      ) : null,
  },
  {
    field: 'delete',
    headerName: '',
    flex: 1,
    minWidth: 70,
    filterable: false, // todo enable when api complete
    sortable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) =>
      isMine(user, params.row?.user?.id) ? (
        <ButtonIcon
          onClick={() => handleOpenPopupDel(params.row.id, params.row.name)}
        >
          <DeleteIcon color="error" />
        </ButtonIcon>
      ) : null,
  },
]

const PopupNew = ({
  open,
  handleClose,
  value,
  setNewWorkSpace,
  handleOkNew,
  error,
}: PopupType) => {
  if (!setNewWorkSpace) return null
  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewWorkSpace(event.target.value)
  }

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={{ margin: 0 }}>
        <DialogTitle>New Workspace</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Input
            sx={{ width: '80%' }}
            placeholder={'Workspace Name'}
            value={value || ''}
            onChange={handleName}
          />
          <br />
          {error ? <span style={{ color: 'red' }}>{error}</span> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOkNew}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const PopupDelete = ({
  open,
  handleClose,
  handleOkDel,
  nameWorkspace,
}: PopupType) => {
  if (!open) return null
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={{ margin: 0 }}>
        <DialogTitle>
          Do you want delete Workspace "{nameWorkspace}"?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOkDel}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const Workspaces = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectIsLoadingWorkspaceList)
  const listUserShare = useSelector(selectWorkspaceListUserShare)
  const data = useSelector(selectWorkspaceData)
  const user = useSelector(selectCurrentUser)
  const [open, setOpen] = useState({
    share: false,
    del: false,
    new: false,
    shareId: 0,
  })
  const [workspaceDel, setWorkspaceDel] = useState<{
    id: number
    name: string
  }>()
  const [newWorkspace, setNewWorkSpace] = useState<string>()
  const [error, setError] = useState('')
  const [initName, setInitName] = useState('')
  const [rowModesModel, setRowModesModel] = useState<any>({})
  const [searchParams, setParams] = useSearchParams()

  const { enqueueSnackbar } = useSnackbar()

  const handleClickVariant = (variant: VariantType, mess: string) => {
    enqueueSnackbar(mess, { variant })
  }

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

  const handleOpenPopupShare = (shareId: number) => {
    setOpen({ ...open, share: true, shareId })
  }

  useEffect(() => {
    if (!open.share || !open.shareId) return
    dispatch(getListUserShareWorkSpaces({ id: open.shareId }))
    //eslint-disable-next-line
  }, [open.share, open.shareId])

  const handleClosePopupShare = () => {
    setOpen({ ...open, share: false })
  }

  const handleOpenPopupDel = (id: number, name: string) => {
    setWorkspaceDel({ id, name })
    setOpen({ ...open, del: true })
  }

  const handleOkDel = async () => {
    if (!workspaceDel) return
    const data = await dispatch(
      delWorkspace({ id: workspaceDel.id, params: dataParams }),
    )
    if ((data as any).error) {
      handleClickVariant('error', 'Workspace deletion failed!')
    } else {
      handleClickVariant(
        'success',
        'The workspace has been deleted successfully!',
      )
    }
    setOpen({ ...open, del: false })
  }

  const handleClosePopupDel = () => {
    setOpen({ ...open, del: false })
  }

  const handleOpenPopupNew = () => {
    setOpen({ ...open, new: true })
  }

  const handleClosePopupNew = () => {
    setOpen({ ...open, new: false })
    setError('')
  }

  const handleNavWorkflow = (id: number) => {
    navigate(`/console/workspaces/${id}`)
  }

  const handleNavRecords = (id: number) => {
    navigate(`/console/workspaces/${id}`, { state: { tab: 2 } })
  }

  const onEditName = (id: number) => {
    setRowModesModel((pre: any) => ({
      ...pre,
      [id]: { mode: GridRowModes.Edit },
    }))
  }

  const handleOkNew = async () => {
    if (!newWorkspace) {
      setError("Workspace Name cann't empty")
      return
    }
    const data = await dispatch(postWorkspace({ name: newWorkspace }))
    if ((data as any).error) {
      handleClickVariant('error', 'Workspace creation failed!')
    } else {
      handleClickVariant(
        'success',
        'The workspace has been created successfully!',
      )
    }
    await dispatch(getWorkspaceList(dataParams))
    setOpen({ ...open, new: false })
    setError('')
    setNewWorkSpace('')
  }

  const onProcessRowUpdateError = (newRow: any) => {
    return newRow
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(importWorkspace({}))
  }

  const pagi = useCallback(
    (page?: number) => {
      return `limit=${data.limit}&offset=${
        page ? (page - 1) * data.limit : data.offset
      }`
    },
    [data?.limit, data?.offset],
  )

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    setParams(`&${pagi(page)}`)
  }

  const handleDownload = async (id: number) => {
    dispatch(exportWorkspace(id))
  }

  const handleRowModesModelChange = (newRowModesModel: any) => {
    setRowModesModel(newRowModesModel)
  }

  const onRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    setInitName(params.row.name)
  }

  const onCellClick: GridEventListener<'cellClick'> | undefined = (
    event: any,
  ) => {
    if (event.field === 'name') return
    setRowModesModel((pre: any) => {
      const object: any = {}
      Object.keys(pre).forEach((key) => {
        object[key] = {
          mode: GridRowModes.View,
          ignoreModifications: false,
        }
      })
      return object
    })
  }

  const processRowUpdate = async (newRow: any) => {
    if (!newRow.name) {
      handleClickVariant('error', "Workspace Name cann't empty")
      return { ...newRow, name: initName }
    }
    if (newRow.name === initName) return newRow
    const data = await dispatch(
      putWorkspace({ name: newRow.name, id: newRow.id }),
    )
    if ((data as any).error) {
      handleClickVariant('error', 'Workspace name edit failed!')
    } else {
      handleClickVariant('success', 'Workspace name edited successfully!')
    }
    await dispatch(getWorkspaceList(dataParams))
    return newRow
  }

  const handleLimit = (event: ChangeEvent<HTMLSelectElement>) => {
    setParams(`limit=${Number(event.target.value)}&offset=0`)
  }

  return (
    <WorkspacesWrapper>
      <WorkspacesTitle>Workspaces</WorkspacesTitle>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          marginBottom: 2,
        }}
      >
        <label htmlFor="upload-image">
          <Button
            sx={{
              background: '#000000c4',
              '&:hover': { backgroundColor: '#00000090' },
            }}
            variant="contained"
            component="span"
          >
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
        <Button
          sx={{
            background: '#000000c4',
            '&:hover': { backgroundColor: '#00000090' },
          }}
          variant="contained"
          onClick={handleOpenPopupNew}
        >
          New
        </Button>
      </Box>
      {user ? (
        <Box
          sx={{
            minHeight: 500,
            height: 'calc(100vh - 350px)',
          }}
        >
          <DataGrid
            // todo enable when api complete
            // filterMode={'server'}
            // sortingMode={'server'}
            // onSortModelChange={handleSort}
            // onFilterModelChange={handleFilter as any}
            onCellClick={onCellClick}
            rows={data?.items}
            editMode="row"
            rowModesModel={rowModesModel}
            columns={
              columns(
                handleOpenPopupShare,
                handleOpenPopupDel,
                handleDownload,
                handleNavWorkflow,
                handleNavRecords,
                user,
                onEditName,
              ).filter(Boolean) as any
            }
            onRowModesModelChange={handleRowModesModelChange}
            isCellEditable={(params) => isMine(user, params.row.user?.id)}
            onProcessRowUpdateError={onProcessRowUpdateError}
            onRowEditStop={onRowEditStop}
            processRowUpdate={processRowUpdate as any}
            hideFooter={true}
          />
        </Box>
      ) : null}
      {data?.items.length > 0 ? (
        <PaginationCustom
          data={data}
          handlePage={handlePage}
          handleLimit={handleLimit}
          limit={Number(limit)}
        />
      ) : null}
      {open.share ? (
        <PopupShare
          isWorkspace
          title="Share Workspace"
          usersShare={listUserShare}
          open={open.share}
          handleClose={(_isSubmit: boolean) => {
            if (_isSubmit) {
              dispatch(getWorkspaceList(dataParams))
            }
            handleClosePopupShare()
          }}
          id={open.shareId}
          data={{ expId: '', shareType: 0 }}
        />
      ) : null}
      <PopupDelete
        open={open.del}
        handleClose={handleClosePopupDel}
        handleOkDel={handleOkDel}
        nameWorkspace={workspaceDel?.name}
      />
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
  margin: 'auto',
  width: '90vw',
  padding: theme.spacing(2),
  overflow: 'auto',
}))

const WorkspacesTitle = styled('h1')(({ theme }) => ({}))

const ButtonIcon = styled('button')(({ theme }) => ({
  minWidth: '32px',
  minHeight: '32px',
  width: '32px',
  height: '32px',
  color: '#444',
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: 'transparent',
  '&:hover': {
    background: 'rgb(239 239 239)',
  },
}))

export default Workspaces
