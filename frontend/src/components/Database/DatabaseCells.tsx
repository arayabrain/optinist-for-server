import { Box, Input, Pagination, styled } from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DialogImage from '../common/DialogImage'
import {
  GridFilterModel,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type CellProps = {
  user?: Object
}

let timeout: NodeJS.Timeout | undefined = undefined

const columns = (handleOpenDialog: (value: ImageUrls[], expId?: string) => void, user?: boolean) => [
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
      params.row.fields?.brain_area,
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
    filterable: false,
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields?.imaging_depth,
  },
  {
    field: 'cell_image_url',
    headerName: 'Pixel Image',
    width: 160,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => {
      const { cell_image_url } = params.row
      if (!cell_image_url) return null
      return (
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
          }}
          onClick={() => handleOpenDialog([cell_image_url])}
        >
          <img
            src={params.row?.cell_image_url?.thumb_url}
            alt={''}
            width={'100%'}
            height={'100%'}
          />
      </Box>
    )}
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

  const pagiFilter = useCallback(
    (page?: number) => {
      return `limit=${dataCells.limit}&offset=${
        page ? page - 1 : dataCells.offset
      }`
    },
    [dataCells.limit, dataCells.offset],
  )

  const id = searchParams.get('id')
  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit')
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
    setParams(
      `${filter}&sort=${dataParams.sort[0]}&sort=${dataParams.sort[1]}&${pagiFilter(page)}`,
    )
  }

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        setParams(`${filter}&${pagiFilter()}`)
        return
      }
      setParams(
        `${filter}&sort=${rowSelectionModel[0].field?.replaceAll(
          'publish_status', 
          'published'
        )}&sort=${rowSelectionModel[0].sort}&${pagiFilter()}`,
      )
    },
    //eslint-disable-next-line
    [pagiFilter, getParamsData],
  )

  const handleFilter = (model: GridFilterModel) => {
    let filter = ''
    if (!!model.items[0]?.value) {
      filter = model.items
        .filter((item) => item.value)
        .map((item: any) => {
          return `${item.field}=${item?.value}`
        })
        .join('&')?.replaceAll('publish_status', 'published')
    }
    else {
      return
    }
    const { sort } = dataParams
    setParams(
      `${filter}&sort=${sort[0] || ''}&sort=${sort[1] || ''}&${pagiFilter()}`,
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

  const columnsTable = [...columns(handleOpenDialog, !!user), ...getColumns].filter(
    Boolean,
  ) as any

  return (
    <DatabaseExperimentsWrapper>
      <DataGridPro
        columns={[...columnsTable] as any}
        rows={dataCells?.items || []}
        hideFooter={true}
        filterMode={'server'}
        sortingMode={'server'}
        onSortModelChange={handleSort}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: dataParams.sort[0]?.replace('publish_status', 'published'),
                sort: dataParams.sort[1] as GridSortDirection,
              },
            ],
          },
          filter: {
            filterModel: {
              items: [
                {
                  field: 'experiment_id',
                  operator: 'contains',
                  value: dataParamsFilter.experiment_id,
                },
                {
                  field: 'published',
                  operator: 'is',
                  value: dataParamsFilter.publish_status,
                },
                {
                  field: 'brain_area',
                  operator: 'contains',
                  value: dataParamsFilter.brain_area,
                },
                {
                  field: 'cre_driver',
                  operator: 'contains',
                  value: dataParamsFilter.cre_driver,
                },
                {
                  field: 'reporter_line',
                  operator: 'contains',
                  value: dataParamsFilter.reporter_line,
                },
                {
                  field: 'imaging_depth',
                  operator: 'contains',
                  value: dataParamsFilter.imaging_depth,
                },
              ],
            },
          },
        }}
        onFilterModelChange={handleFilter as any}
      />
      <Pagination
          sx={{ marginTop: 2 }}
          count={Math.ceil(dataCells.total / dataCells.limit)}
          page={Math.ceil(dataCells.offset / dataCells.limit) + 1}
          onChange={handlePage}
      />
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
