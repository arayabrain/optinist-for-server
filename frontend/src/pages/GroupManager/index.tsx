import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input, Tooltip, Typography,
} from '@mui/material'
import {
  GridEventListener,
  GridRenderCellParams,
  GridRowModes,
  GridValidRowModel,
  DataGrid, GridSortModel, GridFilterModel, GridSortDirection, GridSortItem
} from '@mui/x-data-grid'
import { useSearchParams } from 'react-router-dom'
import Loading from '../../components/common/Loading'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { exportWorkspace } from 'store/slice/Workspace/WorkspacesActions'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import {isAdmin, selectCurrentUser} from 'store/slice/User/UserSelector'
import { UserDTO } from 'api/users/UsersApiDTO'
import PaginationCustom from "../../components/common/PaginationCustom";
import { useSnackbar, VariantType } from "notistack";
import PopupSetGroupManager from "../../components/PopupSetGroupManager";
import { selectGroupManager, selectLoadingGroupManager } from "../../store/slice/GroupManager/GroupManagerSelectors";
import {
  changeNameGroupManager,
  deleteGroupManager,
  getGroupsManager,
  postGroupManager
} from "../../store/slice/GroupManager/GroupActions";
import {WAITING_TIME} from "../../@types";

type PopupType = {
  open: boolean
  handleClose: () => void
  handleOkDel?: () => void
  setNewGroupManager?: (name: string) => void
  value?: string
  handleOkNew?: () => void
  handleOkSave?: () => void
  error?: string
  nameGroupManager?: string
}

type InfoGroup = {
  open: boolean
  name: string
  id?: number
}

let timeout: NodeJS.Timeout | undefined = undefined

const columns = (
    admin: boolean,
    handleOpenPopupDel: (id: number, nameGroupManager: string) => void,
    handleDownload: (id: number) => void,
    user?: UserDTO,
    onEdit?: (id: number) => void,
    setOpenSetGroup?: ({open, name, id} : {open: boolean, name: string, id?: number}) => void,
    loading?: boolean
) => [
  {
    field: 'id',
    headerName: 'ID',
    filterable: false, // todo enable when api complete
    flex: 1,
    minWidth: 70,
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
        <span>{params.value}</span>
    ),
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    minWidth: 100,
    editable: true,
    filterable: true,
    filterOperators: [
      {
        label: 'Contains',
        value: 'contains',
        InputComponent: ({ applyValue, item }: any) => {
          return (
            <Input
              autoFocus={!loading}
              sx={{ paddingTop: '16px' }}
              defaultValue={item.value || ''}
              onChange={(e) => {
                if (timeout) clearTimeout(timeout)
                timeout = setTimeout(() => {
                  applyValue({ ...item, value: e.target.value })
                }, WAITING_TIME)
              }}
            />
          )
        },
      },
    ],
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => {
      const { row, value } = params
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Tooltip title={value} placement="top">
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
          {value}
        </span>
          </Tooltip>
          {
            admin ? (
              <ButtonIcon onClick={() => onEdit?.(row.id)}>
                <EditIcon style={{ fontSize: 16 }} />
              </ButtonIcon>
            ): null
          }
        </Box>
      )
    },
  },
  {
    field: 'users_count',
    headerName: 'Users',
    filterable: false, // todo enable when api complete
    flex: 2,
    minWidth: 100,
    renderCell: (
      params: GridRenderCellParams<{ name: string; id: number }>,
    ) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer'
        }}
        onClick={() => setOpenSetGroup?.({open: true, name: params.row.name, id: params.row.id})}
      >
        <Typography
          sx={{
            textDecoration: 'underline' ,
            color: 'blue',
            cursor: 'pointer'
          }}
          >
            {params.value}
          </Typography>
        </Box>
    ),
  },
  {
    field: 'delete',
    headerName: '',
    flex: 1,
    minWidth: 70,
    filterable: false, // todo enable when api complete
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) =>
      params.row.users_count === 0 ? (
        <ButtonIcon onClick={() => handleOpenPopupDel(params.row.id, params.row.name)}>
          <DeleteIcon color='error' />
        </ButtonIcon>
      ) : null
  },
]

const PopupNew = (
  {
    open,
    handleClose,
    value,
    setNewGroupManager,
    handleOkNew,
    error,
  }: PopupType) => {
  if (!setNewGroupManager) return null
  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroupManager(event.target.value)
  }

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={{ margin: 0 }}>
        <DialogTitle>New Group</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Input
            sx={{ width: '80%' }}
            placeholder={'Group Manager Name'}
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

const PopupDelete = ({open, handleClose, handleOkDel, nameGroupManager}: PopupType) => {
  if(!open) return null
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={{ margin: 0 }}>
        <DialogTitle>Do you want delete Workspace "{nameGroupManager}"?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOkDel}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const GroupManager = () => {
  const dispatch = useDispatch()
  const admin = useSelector(isAdmin)
  const loading = useSelector(selectLoadingGroupManager)
  const data = useSelector(selectGroupManager)
  const user = useSelector(selectCurrentUser)

  const [open, setOpen] = useState({
    del: false,
    new: false,
    shareId: 0,
  })
  const [newParams, setNewParams] = useState(window.location.search.replace("?", ""))
  const [groupManagerDel, setGroupManagerDel] = useState<{id: number, name: string}>()
  const [newGroupManager, setNewGroupManager] = useState<string>()
  const [openSetGroup, setOpenSetGroup] = useState<InfoGroup>({
    open: false,
    name: '',
    id: undefined
  })
  const [error, setError] = useState('')
  const [initName, setInitName] = useState('')
  const [rowModesModel, setRowModesModel] = useState<any>({})
  const [searchParams, setParams] = useSearchParams()

  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit') || 50
  const sort = searchParams.getAll('sort')

  const dataParams = useMemo(() => {
    return {
      offset: Number(offset) || 0,
      limit: Number(limit) || 50,
      sort: [sort[0], sort[1]] || [],
    }
    //eslint-disable-next-line
  }, [offset, limit, JSON.stringify(sort)])

  const dataParamsFilter = useMemo(
    () => ({
      name: searchParams.get('name') || undefined
    }),
    [searchParams],
  )

  const [model, setModel] = useState<{filter: GridFilterModel, sort: any}>({
    filter: {
      items: [
        {
          field: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key]) || '' ,
          operator: 'contains',
          value: Object.values(dataParamsFilter).find(value => value) || null,
        },
      ],
    },
    sort: [{
      field: dataParams.sort[0] || '',
      sort: dataParams.sort[1] as GridSortDirection
    }]
  })

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (variant: VariantType, mess: string) => {
    enqueueSnackbar(mess, { variant });
  };

  useEffect(() => {
    dispatch(getGroupsManager({...dataParams, ...dataParamsFilter}))
    //eslint-disable-next-line
  }, [dataParams])

  useEffect(() => {

  }, [dataParamsFilter])

  useEffect(() => {
    let param = newParams
    if(newParams[0] === '&') param = newParams.slice(1, param.length)
    if(param === window.location.search.replace("?", "")) return;
    setParams(param)
    //eslint-disable-next-line
  }, [newParams])

  const handleOpenPopupDel = (id: number, name: string) => {
    setGroupManagerDel({id, name})
    setOpen({ ...open, del: true })
  }

  const handleOkDel = async () => {
    if (!groupManagerDel) return
    const data = await dispatch(deleteGroupManager({ id: groupManagerDel.id, params: dataParams }))
    if((data as any).error) {
      handleClickVariant('error', 'Group Manager deletion failed!')
    }
    else {
      handleClickVariant('success', 'Group Manager has been deleted successfully!')
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

  const onEditName = (id: number) => {
    setRowModesModel((pre: any) => ({ ...pre, [id]: { mode: GridRowModes.Edit } }))
  }

  const handleOkNew = async () => {
    if (!newGroupManager) {
      setError("Group Manager Name cann't empty")
      return
    }
    const data = await dispatch(postGroupManager(newGroupManager))
    if((data as any).error) {
      handleClickVariant('error', 'Group manager creation failed!')
    }
    else {
      handleClickVariant('success', 'Group manager has been created successfully!')
    }
    await dispatch(getGroupsManager(dataParams))
    setOpen({ ...open, new: false })
    setError('')
    setNewGroupManager('')
  }

  const onProcessRowUpdateError = (newRow: any) => {
    return newRow
  }

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    const filter = getParamsData()
    const param = `${filter}${dataParams.sort[0]? `${filter ? '&' : ''}sort=${dataParams.sort[0]}&sort=${dataParams.sort[1]}` : ''}&${pagiFilter(page)}`
    setNewParams(param)
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

  const onCellClick: GridEventListener<'cellClick'> | undefined = (event: any) => {
    if (event.field === 'name') return
    setRowModesModel((pre: any) => {
      const object: any = {}
      Object.keys(pre).forEach(key => {
        object[key] = {
          mode: GridRowModes.View, ignoreModifications: false
        }
      })
      return object
    })
  }

  const processRowUpdate = async (newRow: any) => {
    if (!newRow.name) {
      handleClickVariant('error', "Group manager Name cann't empty")
      return { ...newRow, name: initName }
    }
    if (newRow.name === initName) return newRow
    const data = await dispatch(changeNameGroupManager({ name: newRow.name, id: newRow.id }))
    if((data as any).error) {
      handleClickVariant('error', 'Group manager name edit failed!')
    }
    else {
      handleClickVariant('success', 'Group manager name edited successfully!')
    }
    await dispatch(getGroupsManager(dataParams))
    return newRow
  }

  const handleLimit = (event: ChangeEvent<HTMLSelectElement>) => {
    setParams(
      `limit=${Number(event.target.value)}&offset=0`,
    )
  }

  const handleClose = () => {
    setOpenSetGroup({
      open: false,
      name: '',
      id: undefined
    })
  }

  const getParamsData = () => {
    const dataFilter = Object.keys(dataParamsFilter)
      .filter((key) => (dataParamsFilter as any)[key])
      .map((key) => `${key}=${(dataParamsFilter as any)[key]}`)
      .join('&')
    return dataFilter
  }

  const pagiFilter = useCallback(
      (page?: number) => {
        return `limit=${limit}&offset=${
            page ? Number(limit) * (page - 1) : offset || data.offset
        }`
      },
      //eslint-disable-next-line
      [limit, offset, JSON.stringify(data), data.offset],
  )

  const handleSort = useCallback(
      (rowSelectionModel: GridSortModel) => {
        setModel({
          ...model, sort: rowSelectionModel
        })
        let param
        const filter = getParamsData()
        if (!rowSelectionModel[0]) {
          param = filter || dataParams.sort[0] || offset ? `${filter ? `${filter}&` : ''}${pagiFilter()}` : ''
        } else {
          param = `${filter}${rowSelectionModel[0] ? `${filter ? '&' : ''}sort=${rowSelectionModel[0].field}&sort=${rowSelectionModel[0].sort}` : ''}&${pagiFilter()}`
        }
        setNewParams(param)
      },
      //eslint-disable-next-line
      [pagiFilter, model],
  )

  const handleFilter = (modelFilter: GridFilterModel) => {
    setModel({
      ...model, filter: modelFilter
    })
    let filter = ''
    if (!!modelFilter.items[0]?.value) {
      filter = modelFilter.items
        .filter((item) => item.value)
        .map((item: any) => `${item.field}=${item?.value}`)
        .join('&')
    }
    const { sort } = dataParams
    const param = sort[0] || filter || offset ? `${filter}${sort[0] ? `${filter ? '&' : ''}sort=${sort[0]}&sort=${sort[1]}` : ''}&${pagiFilter()}` : ''
    setNewParams(param)
  }

  useEffect(() => {
    if(Object.keys(dataParamsFilter).every(key => !(dataParamsFilter as any)[key])) return
    setModel({
      filter: {
        items: [
          {
            field: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key]) || '' ,
            operator: 'contains',
            value: Object.values(dataParamsFilter).find(value => value) || null,
          },
        ],
      },
      sort: [{
        field: dataParams.sort[0] || '',
        sort: dataParams.sort[1] as GridSortDirection
      }]
    })
    //eslint-disable-next-line
  }, [dataParams, dataParamsFilter])

  return (
    <GroupManagerWrapper>
      <GroupManagerTitle>Group Manager</GroupManagerTitle>
      {
        admin ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              marginBottom: 2,
            }}
          >
            <Button
              sx={{
                background: '#000000c4',
                '&:hover': { backgroundColor: '#00000090' },
              }}
              variant="contained"
              onClick={handleOpenPopupNew}>Add</Button>
          </Box>
        ) : null
      }
      {
        user ?
          <Box
            sx={{
              minHeight: 500,
              height: 'calc(100vh - 350px)',
            }}
          >
            <DataGrid
              filterMode={'server'}
              sortingMode={'server'}
              onCellClick={onCellClick}
              rows={data?.items || []}
              editMode="row"
              rowModesModel={rowModesModel}
              columns={
                columns(
                  admin,
                  handleOpenPopupDel,
                  handleDownload,
                  user,
                  onEditName,
                  setOpenSetGroup,
                  loading
                ).filter(Boolean) as any
              }
              sortModel={model.sort as GridSortItem[]}
              filterModel={model.filter}
              onSortModelChange={handleSort}
              onRowModesModelChange={handleRowModesModelChange}
              isCellEditable={(params) => admin}
              onProcessRowUpdateError={onProcessRowUpdateError}
              onRowEditStop={onRowEditStop}
              processRowUpdate={processRowUpdate as any}
              onFilterModelChange={handleFilter as any}
              hideFooter={true}
            />
          </Box> : null
      }
      {
        data && data?.items?.length > 0 ?
          <PaginationCustom
            data={data}
            handlePage={handlePage}
            handleLimit={handleLimit}
            limit={Number(limit)}
          /> : null
      }
      <PopupDelete
        open={open.del}
        handleClose={handleClosePopupDel}
        handleOkDel={handleOkDel}
        nameGroupManager={groupManagerDel?.name}
      />
      <PopupNew
        open={open.new}
        handleClose={handleClosePopupNew}
        setNewGroupManager={setNewGroupManager}
        value={newGroupManager}
        error={error}
        handleOkNew={handleOkNew}
      />
      <PopupSetGroupManager
        infoGroup={openSetGroup}
        handleClose={handleClose}
        dataParams={dataParams}
      />
      {loading ? <Loading /> : null}
    </GroupManagerWrapper>
  )
}

const GroupManagerWrapper = styled(Box)(({ theme }) => ({
  margin: 'auto',
  width: '90vw',
  padding: theme.spacing(2),
  overflow: 'auto',
}))

const GroupManagerTitle = styled('h1')(({ theme }) => ({}))

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

export default GroupManager
