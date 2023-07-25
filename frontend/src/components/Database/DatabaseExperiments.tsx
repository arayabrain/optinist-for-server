import { Box, Pagination, styled } from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DialogImage from '../common/DialogImage'
import LaunchIcon from '@mui/icons-material/Launch'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import SwitchCustom from '../common/SwitchCustom'
import {
  GridCallbackDetails,
  GridEnrichedColDef,
  GridFilterModel,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import GroupsIcon from '@mui/icons-material/Groups'
import {
  DatabaseType,
  DATABASE_SLICE_NAME,
} from '../../store/slice/Database/DatabaseType'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import {
  getExperimentsDatabase,
  getExperimentsPublicDatabase,
  postPublist,
} from '../../store/slice/Database/DatabaseActions'
import Loading from 'components/common/Loading'
import { TypeData } from 'store/slice/Database/DatabaseSlice'

type PopupAttributesProps = {
  data: string
  open: boolean
  handleClose: () => void
  role?: boolean
  handleChangeAttributes: (e: any) => void
}

type DatabaseProps = {
  user?: Object
  cellPath: string
}

const columns = (
  handleOpenAttributes: (value: string) => void,
  handleOpenDialog: (value: string[]) => void,
  cellPath: string,
  navigate: (
    path: string,
    params: { [key: string]: string | undefined },
  ) => void,
) => [
  {
    field: 'experiment_id',
    headerName: 'Experiment ID',
    width: 160,
    filterable: false,
    sort: 'asc',
    renderCell: (params: { row: DatabaseType }) => params.row?.experiment_id,
  },
  {
    field: 'brain_area',
    headerName: 'Brain area',
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.brain_area,
    valueOptions: [1, 2, 3, 4, 5, 6, 7, 8],
    type: 'singleSelect',
    width: 160,
  },
  {
    field: 'cre_driver',
    headerName: 'Cre driver',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.cre_driver,
  },
  {
    field: 'reporter_line',
    headerName: 'Reporter line',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.reporter_line,
  },
  {
    field: 'imaging_depth',
    headerName: 'Imaging depth',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.imaging_depth,
  },
  {
    field: 'attributes',
    headerName: 'Attributes',
    width: 160,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() =>
          handleOpenAttributes(JSON.stringify(params.row?.attributes))
        }
      >
        {JSON.stringify(params.row?.attributes)}
      </Box>
    ),
  },
  {
    field: 'cells',
    headerName: 'Cells',
    width: 160,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() =>
          navigate(cellPath, { exp_id: params.row?.experiment_id })
        }
      >
        <LaunchIcon />
      </Box>
    ),
  },
  {
    field: 'cell_image_urls',
    headerName: 'Pixel Image',
    width: 160,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
        }}
        onClick={() => handleOpenDialog(params.row?.cell_image_urls)}
      >
        {params.row?.cell_image_urls?.length > 0 && (
          <img
            src={params.row?.cell_image_urls[0]}
            alt={''}
            width={'100%'}
            height={'100%'}
          />
        )}
      </Box>
    ),
  },
]

const PopupAttributes = ({
  data,
  open,
  handleClose,
  role = false,
  handleChangeAttributes,
}: PopupAttributesProps) => {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogContent sx={{ minWidth: 400 }}>
          <DialogContentText>
            <Content
              readOnly={!role}
              value={data}
              onChange={handleChangeAttributes}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          {role && <Button onClick={handleClose}>Save</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const DatabaseExperiments = ({ user, cellPath }: DatabaseProps) => {
  const type: keyof TypeData = user ? 'private' : 'public'
  const { data: dataExperiments, loading } = useSelector(
    (state: RootState) => ({
      data: state[DATABASE_SLICE_NAME].data[type],
      loading: state[DATABASE_SLICE_NAME].loading,
    }),
  )

  const [dataDialog, setDataDialog] = useState<{
    type: string
    data: string | string[] | undefined
  }>({
    type: '',
    data: undefined,
  })
  const [searchParams, setParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const pagiFilter = useCallback(
    (page?: number) => {
      return `limit=${dataExperiments.limit}&offset=${
        page ? page - 1 : dataExperiments.offset
      }`
    },
    [dataExperiments.limit, dataExperiments.offset],
  )

  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort')

  const dataParams = useMemo(() => {
    return {
      offset: Number(offset) || 0,
      limit: Number(limit) || 50,
      sort: sort || [],
    }
  }, [offset, limit, sort])

  const dataParamsFilter = useMemo(
    () => ({
      brain_area: searchParams.get('brain_area') || undefined,
      cre_driver: searchParams.get('cre_driver') || undefined,
      reporter_line: searchParams.get('reporter_line') || undefined,
      imaging_depth: Number(searchParams.get('imaging_depth')) || undefined,
    }),
    [searchParams],
  )

  const fetchApi = () => {
    const api = !user ? getExperimentsPublicDatabase : getExperimentsDatabase
    dispatch(api({ ...dataParamsFilter, ...dataParams }))
  }

  useEffect(() => {
    fetchApi()
    //eslint-disable-next-line
  }, [dataParams, user])

  const handleOpenDialog = (data: string[]) => {
    setDataDialog({ type: 'image', data })
  }

  const handleCloseDialog = () => {
    setDataDialog({ type: '', data: undefined })
  }

  const handleOpenAttributes = (data: string) => {
    setDataDialog({ type: 'attribute', data })
  }

  const handleChangeAttributes = (event: any) => {
    setDataDialog(event.target.value)
  }

  const getParamsData = () => {
    const dataFilter = Object.keys(dataParamsFilter)
      .filter((key) => (dataParamsFilter as any)[key])
      .map((key) => `${key}=${(dataParamsFilter as any)[key]}`)
      .join('&')
      .replaceAll('fields.', '')
    return dataFilter
  }

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    const filter = getParamsData()
    setParams(
      `${filter}&sort=${dataParams.sort[0]}&sort=${
        dataParams.sort[1]
      }&${pagiFilter(page)}`,
    )
  }

  const handlePublish = (id: number, status: 'on' | 'off') => {
    dispatch(postPublist({ id, status }))
  }

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        setParams(`${filter}&sort=&sort=&${pagiFilter()}`)
        return
      }
      setParams(
        `${filter}&sort=${rowSelectionModel[0].field.replace(
          'fields.',
          '',
        )}&sort=${rowSelectionModel[0].sort}&${pagiFilter()}`,
      )
    },
    //eslint-disable-next-line
    [pagiFilter, getParamsData],
  )

  const handleFilter = (
    model: GridFilterModel | any,
    details: GridCallbackDetails,
  ) => {
    let filter: string
    if (!!model.items[0]?.value) {
      filter = model.items
        .filter((item: { [key: string]: string }) => item.value)
        .map((item: any) => {
          return `${item.field}=${item?.value}`
        })
        .join('&').replaceAll("fields.", "")
    } else {
      filter = ''
    }
    if (!model.items[0]) {
      setParams(
        `${filter}&sort=${dataParams.sort[0]}&sort=${
          dataParams.sort[1]
        }&${pagiFilter()}`,
      )
      return
    }
    setParams(
      `${filter}&sort=${dataParams.sort[0]}&sort=${
        dataParams.sort[1]
      }&${pagiFilter()}`,
    )
  }

  const getColumns = useMemo(() => {
    return (dataExperiments.header?.graph_titles || []).map(
      (graphTitle, index) => ({
        field: `graph_urls.${index}`,
        headerName: graphTitle,
        sortable: false,
        filterable: false,
        renderCell: (params: { row: DatabaseType }) => {
          return (
            <Box sx={{ display: 'flex' }}>
              {params.row.graph_urls[index] ? (
                <img
                  src={params.row.graph_urls[index]}
                  alt={''}
                  width={'100%'}
                  height={'100%'}
                />
              ) : null}
            </Box>
          )
        },
        width: 160,
      }),
    )
  }, [dataExperiments.header?.graph_titles])

  const ColumnPrivate = useMemo(() => {
    return [
      {
        field: 'share_type',
        headerName: '',
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params: { row: DatabaseType }) => (
          <Box sx={{ cursor: 'pointer' }}>
            <GroupsIcon />
          </Box>
        ),
      },
      {
        field: 'publish_status',
        headerName: '',
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params: { row: DatabaseType }) => (
          <Box
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              handlePublish(
                params.row.id,
                params.row.publish_status ? 'off' : 'on',
              )
            }
          >
            <SwitchCustom value={!!params.row.publish_status} />
          </Box>
        ),
      },
    ]
    //eslint-disable-next-line
  }, [])

  const columnsTable = [
    ...columns(handleOpenAttributes, handleOpenDialog, cellPath, navigate),
    ...getColumns,
  ].filter(Boolean) as GridEnrichedColDef[]

  return (
    <DatabaseExperimentsWrapper>
      <DataGridPro
        columns={
          user
            ? ([...columnsTable, ...ColumnPrivate] as any)
            : (columnsTable as any)
        }
        rows={dataExperiments?.items || []}
        hideFooter={true}
        filterMode={'server'}
        sortingMode={'server'}
        onSortModelChange={handleSort}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: dataParams.sort[0],
                sort: dataParams.sort[1] as GridSortDirection,
              },
            ],
          },
          filter: {
            filterModel: {
              items: [
                {
                  field: 'brain_area',
                  operator: 'is',
                  value: dataParamsFilter.brain_area,
                }
              ],
            },
          },
        }}
        onFilterModelChange={handleFilter as any}
      />
      <Pagination
        sx={{ marginTop: 2 }}
        count={dataExperiments.total}
        page={dataParams.offset + 1}
        onChange={handlePage}
      />
      <DialogImage
        open={dataDialog.type === 'image'}
        data={dataDialog.data}
        handleCloseDialog={handleCloseDialog}
      />
      <PopupAttributes
        handleChangeAttributes={handleChangeAttributes}
        data={dataDialog.data as string}
        open={dataDialog.type === 'attribute'}
        handleClose={handleCloseDialog}
        role={!!user}
      />
      {loading ? <Loading /> : null}
    </DatabaseExperimentsWrapper>
  )
}

const DatabaseExperimentsWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'calc(100vh - 250px)',
}))

const Content = styled('textarea')(({ theme }) => ({
  width: 400,
  height: 'fit-content',
}))

export default DatabaseExperiments
