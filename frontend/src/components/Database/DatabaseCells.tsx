import { Box, Pagination, styled } from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DialogImage from '../common/DialogImage'
import {
  GridCallbackDetails,
  GridEnrichedColDef,
  GridFilterModel,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import {
  DatabaseType,
  DATABASE_SLICE_NAME,
} from '../../store/slice/Database/DatabaseType'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import {
  getCellsDatabase,
  getCellsPublicDatabase,
} from '../../store/slice/Database/DatabaseActions'
import Loading from 'components/common/Loading'
import { TypeData } from 'store/slice/Database/DatabaseSlice'

type CellProps = {
  user?: Object
}

const columns = (handleOpenDialog: (value: string[]) => void) => [
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
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
        }}
        onClick={() => params.row?.cell_image_url && handleOpenDialog([params.row.cell_image_url])}
      >
        {params.row?.cell_image_url && (
          <img
            src={params.row?.cell_image_url}
            alt={''}
            width={'100%'}
            height={'100%'}
          />
        )}
      </Box>
    ),
  },
]

const DatabaseCells = ({ user }: CellProps) => {
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
  const dispatch = useDispatch()

  const pagiFilter = useMemo(() => {
    return `limit=${dataExperiments.limit}&offset=${dataExperiments.offset}`
  }, [dataExperiments.limit, dataExperiments.offset])

  const exp_id = searchParams.get('exp_id')
  const offset = searchParams.get('offset')
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort')

  const dataParams = useMemo(() => {
    return {
      exp_id: Number(exp_id) || undefined,
      offset: Number(offset) || 0,
      limit: Number(limit) || 50,
      sort: sort || [],
    }
  }, [offset, limit, sort, exp_id])

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
    const api = !user ? getCellsPublicDatabase : getCellsDatabase
    dispatch(api({...dataParamsFilter, ...dataParams}))
  }

  useEffect(() => {
    fetchApi()
    //eslint-disable-next-line
  }, [dataParams, user, dataParamsFilter])

  const handleOpenDialog = (data: string[]) => {
    setDataDialog({ type: 'image', data })
  }

  const handleCloseDialog = () => {
    setDataDialog({ type: '', data: undefined })
  }

  const getParamsData = () => {
    const dataFilter = Object.keys(dataParamsFilter)
      .filter((key) => (dataParamsFilter as any)[key])
      .map((key) => `${key}=${(dataParamsFilter as any)[key]}`)
      .join('&')
    return dataFilter
  }

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    const filter = getParamsData()
    setParams(
      `${filter}&sort=${dataParams.sort[0]}&sort=${dataParams.sort[1]}&${pagiFilter}`,
    )
  }

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        setParams(`${filter}&sort=&sort=&${pagiFilter}`)
        return
      }
      setParams(
        `${filter}&sort=${rowSelectionModel[0].field}&sort=${rowSelectionModel[0].sort}&${pagiFilter}`,
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
          .join('&')
    } else {
      filter = ''
    }
    const {sort} = dataParams
    setParams(`${filter}&sort=${sort[0] || ''}&sort=${sort[1] || ''}&${pagiFilter}`)
  }

  const getColumns = useMemo(() => {
    return (dataExperiments.header?.graph_titles || []).map(
      (graphTitle, index) => ({
        field: `graph_urls.${index}`,
        headerName: graphTitle,
        filterable: false,
        sortable: false,
        renderCell: (params: { row: DatabaseType }) => {
          return (
            <Box sx={{ display: 'flex' }}>
              {params.row.graph_urls?.[index]?.[0] ? (
                <img
                  src={params.row.graph_urls?.[index]?.[0] }
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

  const columnsTable = [...columns(handleOpenDialog), ...getColumns].filter(
    Boolean,
  ) as GridEnrichedColDef[]

  return (
    <DatabaseExperimentsWrapper>
      <DataGridPro
        columns={[...columnsTable] as any}
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
        count={dataExperiments.total}
        page={dataParams.offset + 1}
        onChange={handlePage}
      />
      <DialogImage
        open={dataDialog.type === 'image'}
        data={dataDialog.data}
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
