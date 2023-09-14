import { Box, Input, styled } from '@mui/material'
import {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react'
import { useSearchParams } from 'react-router-dom'
import DialogImage from '../common/DialogImage'
import {
  GridFilterModel,
  GridSortModel,
  DataGrid,
  GridSortDirection,
  GridSortItem
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
    width: 120,
  },
  {
    field: 'id',
    headerName: 'Cell ID',
    width: 120,
    filterable: false,
    renderCell: (params: { value: number }) => params.value,
  },
  {
    field: 'brain_area',
    headerName: 'Brain area',
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.brain_area ?? 'NA',
  },
  {
    field: 'cre_driver',
    headerName: 'Cre driver',
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.cre_driver ?? 'NA',
  },
  {
    field: 'reporter_line',
    headerName: 'Reporter line',
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.reporter_line ?? 'NA',
  },
  {
    field: 'imaging_depth',
    headerName: 'Imaging depth',
    filterable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.imaging_depth ?? 'NA',
  },
]

const statistics = () => [
  {
    field: 'p_value_resp',
    headerName: 'p_value_resp',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.p_value_resp ?? 'NA',
  },
  {
    field: 'p_value_sel',
    headerName: 'p_value_sel',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.p_value_sel ?? 'NA',
  },
  {
    field: 'p_value_ori_resp',
    headerName: 'p_value_ori_resp',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.p_value_ori_resp ?? 'NA',
  },
  {
    field: 'p_value_ori_sel',
    headerName: 'p_value_ori_sel',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.p_value_ori_sel ?? 'NA',
  },
  {
    field: 'dir_vector_angle',
    headerName: 'dir_vector_angle',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.dir_vector_angle ?? 'NA',
  },
  {
    field: 'ori_vector_angle',
    headerName: 'ori_vector_angle',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.ori_vector_angle ?? 'NA',
  },
  {
    field: 'di',
    headerName: 'di',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.di ?? 'NA',
  },
  {
    field: 'oi',
    headerName: 'oi',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.oi ?? 'NA',
  },
  {
    field: 'dsi',
    headerName: 'dsi',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.dsi ?? 'NA',
  },
  {
    field: 'osi',
    headerName: 'osi',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.osi ?? 'NA',
  },
  {
    field: 'r_best_dir',
    headerName: 'r_best_dir',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.r_best_dir ?? 'NA',
  },
  {
    field: 'dir_tuning_width',
    headerName: 'dir_tuning_width',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.dir_tuning_width ?? 'NA',
  },
  {
    field: 'ori_tuning_width',
    headerName: 'ori_tuning_width',
    filterable: false,
    sortable: false,
    width: 120,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.statistics?.ori_tuning_width ?? 'NA',
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

  const [model, setModel] = useState<{filter: GridFilterModel, sort: any}>({
    filter: {
      items: [
        {
          field: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key])?.replace('publish_status', 'published') || '' ,
          operator: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key]) === 'publish_status' ? 'is' : 'contains',
          value: Object.values(dataParamsFilter).find(value => value) || null,
        },
      ],
    },
    sort: [{
      field: dataParams.sort[0]?.replace('publish_status', 'published') || '',
      sort: dataParams.sort[1] as GridSortDirection
    }]
  })

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
    setModel({
      filter: {
        items: [
          {
            field: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key])?.replace('publish_status', 'published') || '' ,
            operator: Object.keys(dataParamsFilter).find(key => (dataParamsFilter as any)[key]) === 'publish_status' ? 'is' : 'contains',
            value: Object.values(dataParamsFilter).find(value => value) || null,
          },
        ],
      },
      sort: [{
        field: dataParams.sort[0]?.replace('publish_status', 'published') || '',
        sort: dataParams.sort[1] as GridSortDirection
      }]
    })
    //eslint-disable-next-line
  }, [dataParams, dataParamsFilter])

  useEffect(() => {
    let param = newParams
    if(newParams[0] === '&') param = newParams.slice(1, param.length)
    if(param === window.location.search.replace("?", "")) return;
    setParams(param)
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
    if(!dataCells) return
    const filter = getParamsData()
    const param = `${filter}${dataParams.sort[0] ? `${filter ? '&' : ''}sort=${dataParams.sort[0]}&sort=${dataParams.sort[1]}&` : ''}${pagiFilter(page)}`
    setNewParams(param)
  }

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      setModel({
        ...model, sort: rowSelectionModel
      })
      let param
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        param = filter || dataParams.sort[0] || offset ? `${filter ? `${filter}&` : ''}${pagiFilter()}` : ''
        setNewParams(param)
        return
      }
      param = `${filter}${rowSelectionModel[0] ? `${filter ? '&' : ''}sort=${rowSelectionModel[0].field?.replaceAll(
          'publish_status',
          'published'
      )}&sort=${rowSelectionModel[0].sort}&` : ''}${pagiFilter()}`
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
        .map((item: any) => {
          return `${item.field}=${item?.value}`
        })
        .join('&').replace('publish_status', 'published')
    }
    const { sort } = dataParams
    const param = sort[0] || filter || offset ? `${filter}${sort[0] ? `${filter ? '&' : ''}sort=${sort[0]}&sort=${sort[1]}` : ''}&${pagiFilter()}` : ''
    setNewParams(param)
  }

  const handleLimit = (event: ChangeEvent<HTMLSelectElement>) => {
    if(!dataCells) return
    let filter = ''
    filter = Object.keys(dataParamsFilter).filter(key => (dataParamsFilter as any)[key])
      .map((item: any) => `${item}=${(dataParamsFilter as any)[item]}`)
      .join('&').replace('publish_status', 'published')
    const { sort } = dataParams
    const param = `${filter}${sort[0] ? `${filter ? '&' : ''}sort=${sort[0]}&sort=${sort[1]}` : ''}&limit=${Number(event.target.value)}&offset=0`
    setNewParams(param)
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
          <Box
            sx={{ display: 'flex', cursor: "pointer" }}
            onClick={() => handleOpenDialog(graph_url, params.row.experiment_id, graphTitle)}
          >
            <img
              src={graph_url.thumb_url}
              alt={''}
              width={'100%'}
              height={'100%'}
            />
          </Box>
        )
      },
      width: 160,
    }),
    )
  }, [dataCells.header?.graph_titles])

  const columnsTable = [...columns(!!user), ...getColumns, ...statistics()].filter(
    Boolean,
  ) as any

  return (
    <DatabaseExperimentsWrapper>
      <DataGrid
        columns={[...columnsTable] as any}
        rows={dataCells?.items || []}
        rowHeight={128}
        hideFooter={true}
        filterMode={'server'}
        sortingMode={'server'}
        onSortModelChange={handleSort}
        filterModel={model.filter}
        sortModel={model.sort as GridSortItem[]}
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
