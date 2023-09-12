import {
  Box,
  Grid,
  Input,
  List,
  ListItem,
  Typography,
  styled
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DialogImage from '../common/DialogImage'
import {
  GridFilterModel,
  GridSortModel,
  DataGrid,
  GridSortDirection
} from '@mui/x-data-grid'
import {
  DatabaseType,
  DATABASE_SLICE_NAME,
  ImageUrls,
} from '../../store/slice/Database/DatabaseType'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import {
  getCellsDatabase,
  getCellsPublicDatabase,
} from '../../store/slice/Database/DatabaseActions'
import Loading from 'components/common/Loading'
import { TypeData } from 'store/slice/Database/DatabaseSlice'
import PaginationCustom from "../common/PaginationCustom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type CellProps = {
  user?: Object
}

let timeout: NodeJS.Timeout | undefined = undefined

const columns = (user?: boolean) => [
  {
    field: 'experiment_id',
    headerName: 'Experiment ID',
    filterOperators: [
      {
        label: 'Contains', value: 'contains',
        InputComponent: ({applyValue, item}: any) => {
          return <Input sx={{paddingTop: "16px"}} defaultValue={item.value || ''} onChange={(e) => {
                if(timeout) clearTimeout(timeout)
                timeout = setTimeout(() => {
                  applyValue({...item, value: e.target.value})
            }, 300)
          }
          } />
        }
      },
    ],
    type: "string",
    width: 160,
    renderCell: (params: { row: DatabaseType }) => params.row?.experiment_id,
  },
  user && {
    field: 'published',
    headerName: 'Published',
    renderCell: (params: { row: DatabaseType }) => (
      params.row.publish_status ? <CheckCircleIcon color={"success"} /> : null
    ),
    valueOptions: ['Published', 'No_Published'],
    type: 'singleSelect',
    width: 160,
  },
  {
    field: 'id',
    headerName: 'Cell ID',
    width: 160,
    filterable: false,
    renderCell: (params: { value: number }) => params.value,
  },
  {
    field: 'brain_area',
    headerName: 'Brain area',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.brain_area ?? 'NA',
  },
  {
    field: 'cre_driver',
    headerName: 'Cre driver',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.cre_driver ?? 'NA',
  },
  {
    field: 'reporter_line',
    headerName: 'Reporter line',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.reporter_line ?? 'NA',
  },
  {
    field: 'imaging_depth',
    headerName: 'Imaging depth',
    filterable: false,
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.imaging_depth,
  },
]

const DatabaseCells = ({ user }: CellProps) => {
  const type: keyof TypeData = user ? 'private' : 'public'

  const { data: dataCells, loading } = useSelector(
    (state: RootState) => ({
      data: state[DATABASE_SLICE_NAME].data[type],
      loading: state[DATABASE_SLICE_NAME].loading,
    }),
  )

  const [keyTable, setKeyTable] = useState(0)
  const [newParams, setNewParams] = useState('')
  const [dataDialog, setDataDialog] = useState<{
    type: string
    data?: string | string[]
    expId?: string
    nameCol?: string
  }>({
    type: '',
    data: undefined,
  })

  const [searchParams, setParams] = useSearchParams()
  const dispatch = useDispatch()

  const id = searchParams.get('id')
  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit') || 50
  const sort = searchParams.getAll('sort')

  const dataParams = useMemo(() => {
    return {
      exp_id: Number(id) || undefined,
      sort: [sort[0]?.replace('published', 'publish_status'), sort[1]] || [],
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    }
    //eslint-disable-next-line
  }, [offset, limit, JSON.stringify(sort), id])

  const dataParamsFilter = useMemo(
    () => ({
      experiment_id: searchParams.get('experiment_id') || undefined,
      publish_status: searchParams.get('published') || undefined,
      brain_area: searchParams.get('brain_area') || undefined,
      cre_driver: searchParams.get('cre_driver') || undefined,
      reporter_line: searchParams.get('reporter_line') || undefined,
      imaging_depth: Number(searchParams.get('imaging_depth')) || undefined,
    }),
    [searchParams],
  )

  const pagiFilter = useCallback(
    (page?: number) => {
      return `limit=${limit}&offset=${
          page ? (Number(limit) * (page - 1)) : offset || dataCells.offset
      }`
    },
    //eslint-disable-next-line
    [limit, offset, JSON.stringify(dataCells), dataCells.offset],
  )

  const fetchApi = () => {
    const api = !user ? getCellsPublicDatabase : getCellsDatabase
    let newPublish: number | undefined
    if(!dataParamsFilter.publish_status) newPublish = undefined
    else {
      if(dataParamsFilter.publish_status === 'Published') newPublish = 1
      else newPublish = 0
    }
    dispatch(api({ ...dataParamsFilter, publish_status: newPublish, ...dataParams }))
  }

  useEffect(() => {
    if (!window) return;
    window.addEventListener('popstate', function(event) {
      setKeyTable(pre => pre + 1)
    })
  }, [searchParams])

  useEffect(() => {
    setFilterModel({
      items: [
        {
          field: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key]) || '',
          operator: 'contains',
          value: Object.values(dataParamsFilter).find(value => value) || null,
        },
      ],
    })
    //eslint-disable-next-line
  }, [searchParams])

  useEffect(() => {
    if(!newParams) return
    setParams(newParams)
    //eslint-disable-next-line
  }, [newParams])

  useEffect(() => {
    fetchApi()
    //eslint-disable-next-line
  }, [JSON.stringify(dataParams), user, JSON.stringify(dataParamsFilter)])

  const handleOpenDialog = (data: ImageUrls[] | ImageUrls, expId?: string, graphTitle?: string) => {
    let newData: string | (string[]) = []
    if(Array.isArray(data)) {
      newData = data.map(d => d.url);
    } else newData = data.url
    setDataDialog({ type: 'image', data: newData, expId: expId, nameCol: graphTitle })
  }

  const handleCloseDialog = () => {
    setDataDialog({ type: '', data: undefined })
  }

  const getParamsData = () => {
    const dataFilter = Object.keys(dataParamsFilter)
      .filter((key) => (dataParamsFilter as any)[key])
      .map((key) => `${key}=${(dataParamsFilter as any)[key]}`)
      .join('&')
      .replaceAll('publish_status', 'published')
    return dataFilter
  }

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    const filter = getParamsData()
    setNewParams(
      `${filter}&${dataParams.sort[0] ? `sort=${dataParams.sort[0]}&sort=${dataParams.sort[1]}` : ''}&${pagiFilter(page)}`,
    )
  }

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        setNewParams(filter || dataParams.sort[0] || offset ? `${filter}&${pagiFilter()}` : '')
        return
      }
      setNewParams(
        `${filter}&${rowSelectionModel[0] ? `sort=${rowSelectionModel[0].field?.replaceAll(
            'publish_status',
            'published'
        )}&sort=${rowSelectionModel[0].sort}` : ''}&${pagiFilter()}`,
      )
    },
    //eslint-disable-next-line
    [pagiFilter],
  )

  const handleFilter = (model: GridFilterModel) => {
    setFilterModel(model)
    let filter = ''
    if (!!model.items[0]?.value) {
      filter = model.items
        .filter((item) => item.value)
        .map((item: any) => {
          return `${item.field}=${item?.value}`
        })
        .join('&').replace('publish_status', 'published')
    }
    const { sort } = dataParams
    setNewParams(
      sort[0] || filter || offset ? `${filter}&${sort[0] ? `sort=${sort[0]}&sort=${sort[1]}` : ''}&${pagiFilter()}` : '',
    )
  }

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [
      {
        field: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key])?.replace('publish_status', 'published') || '',
        operator: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key] && ['publish_status'].includes(key)) ? 'is' : 'contains',
        value: Object.values(dataParamsFilter).find(value => value),
      },
    ],
  });

  const handleLimit = (event: ChangeEvent<HTMLSelectElement>) => {
    let filter = ''
    filter = Object.keys(dataParamsFilter).filter(key => (dataParamsFilter as any)[key])
      .map((item: any) => {
        return `${item.field}=${item?.value}`
      })
      .join('&').replace('publish_status', 'published')
    const { sort } = dataParams
    setNewParams(
      `${filter}&${sort[0] ? `sort=${sort[0]}&sort=${sort[1]}` : ''}&limit=${Number(event.target.value)}&offset=0`,
    )
  }

  const getColumns = useMemo(() => {
    return (dataCells.header?.graph_titles || []).map(
      (graphTitle, index) => ({
      field: `graph_urls.${index}`,
      headerName: graphTitle,
      filterable: false,
      sortable: false,
      renderCell: (params: { row: DatabaseType }) => {
        const {row} = params
        const {graph_urls} = row
        const graph_url = graph_urls[index]
        if(!graph_url) return null
        return (
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', cursor: "pointer" }}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() =>
              handleOpenDialog(graph_url, params.row.experiment_id, graphTitle)
            }
          >
            <Grid item xs={3}>
              <List>
                {Object.entries(graph_url.params).map(([k, v]) => (
                  <ListItem dense disablePadding>
                    <Typography variant='caption' sx={{fontSize: 10}}>
                      {k}: {typeof v === 'number' ? v.toFixed(4) : v}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={9}>
              <img src={graph_url.thumb_url} alt={''} height={200} />
            </Grid>
          </Grid>
        )
      },
      width: 300,
    }),
    )
  }, [dataCells.header?.graph_titles])

  const columnsTable = [...columns(!!user), ...getColumns].filter(
    Boolean,
  ) as any

  return (
    <DatabaseExperimentsWrapper>
      <DataGrid
        key={keyTable}
        columns={[...columnsTable] as any}
        rows={dataCells?.items || []}
        rowHeight={220}
        hideFooter={true}
        filterMode={'server'}
        sortingMode={'server'}
        onSortModelChange={handleSort}
        filterModel={filterModel}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: dataParams.sort[0]?.replace('publish_status', 'published'),
                sort: dataParams.sort[1] as GridSortDirection,
              },
            ],
          },
        }}
        onFilterModelChange={handleFilter as any}
      />
      {
        dataCells?.items.length > 0 ?
        <PaginationCustom
          data={dataCells}
          handlePage={handlePage}
          handleLimit={handleLimit}
          limit={Number(limit)}
        /> : null
      }
      <DialogImage
        open={dataDialog.type === 'image'}
        data={dataDialog.data}
        nameCol={dataDialog.nameCol}
        expId={dataDialog.expId}
        handleCloseDialog={handleCloseDialog}
      />
      {loading ? <Loading /> : null}
    </DatabaseExperimentsWrapper>
  )
}

const DatabaseExperimentsWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'calc(100vh - 250px)',
}))

export default DatabaseCells
