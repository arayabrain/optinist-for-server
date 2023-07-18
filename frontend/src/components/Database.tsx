import { Box, Pagination, styled } from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DialogImage from './common/DialogImage'
import LaunchIcon from '@mui/icons-material/Launch'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import SwitchCustom from './common/SwitchCustom'
import {
  DataGrid,
  GridEnrichedColDef,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid'
import GroupsIcon from '@mui/icons-material/Groups'
import {
  DatabaseType,
  DATABASE_SLICE_NAME,
} from 'store/slice/Database/DatabaseType'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/store'
import {
  getExperimentsDatabase,
  getExperimentsPublicDatabase,
  getCellsDatabase,
  getCellsPublicDatabase,
} from 'store/slice/Database/DatabaseActions'

type PopupAttributesProps = {
  data: string
  open: boolean
  handleClose: () => void
  role?: boolean
  handleChangeAttributes: (e: any) => void
}

type DataParamsFilter = {
  brain_area: string
  cre_driver: string
  reporter_line: string
  imaging_depth: number
}

type DatabaseProps = {
  setTypeTable: (type: string) => void
  user?: Object
  isCell?: boolean
}

const columns = (
  handleOpenAttributes: (value: string) => void,
  setTypeTable: (value: string) => void,
  handleOpenDialog: (value: string[]) => void,
  isCell?: boolean,
) => [
  !isCell && {
    field: 'experiment_id',
    headerName: 'Experiment ID',
    width: 160,
    filterable: false,
    sort: 'asc',
    renderCell: (params: { row: DatabaseType }) => params.row.experiment_id,
  },
  {
    field: 'brain_area',
    headerName: 'Brain area',
    width: 160,
    renderCell: (params: { row: DatabaseType }) => params.row.fields.brain_area,
  },
  {
    field: 'cre_driver',
    headerName: 'Cre driver',
    width: 160,
    renderCell: (params: { row: DatabaseType }) => params.row.fields.cre_driver,
  },
  {
    field: 'reporter_line',
    headerName: 'Reporter line',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields.reporter_line,
  },
  {
    field: 'imaging_depth',
    headerName: 'Imaging depth',
    width: 160,
    renderCell: (params: { row: DatabaseType }) =>
      params.row.fields.imaging_depth,
  },
  !isCell && {
    field: 'attributes',
    headerName: 'Attributes',
    width: 160,
    filterable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() =>
          handleOpenAttributes(JSON.stringify(params.row.attributes))
        }
      >
        {JSON.stringify(params.row.attributes)}
      </Box>
    ),
  },
  !isCell && {
    field: 'cells',
    headerName: 'Cells',
    width: 160,
    filterable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box sx={{ cursor: 'pointer' }} onClick={() => setTypeTable('cells')}>
        <LaunchIcon />
      </Box>
    ),
  },
  {
    field: 'cell_image_urls',
    headerName: 'Pixel Image',
    width: 160,
    filterable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
        }}
        onClick={() => handleOpenDialog(params.row.cell_image_urls)}
      >
        {params.row.cell_image_urls.length > 0 && (
          <img
            src={params.row.cell_image_urls[0]}
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

const Database = ({ setTypeTable, user, isCell }: DatabaseProps) => {
  const dataExperiments = useSelector(
    (state: RootState) => state[DATABASE_SLICE_NAME].data,
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

  const dataParamsSort = useMemo(() => {
    return {
      offset: Number(searchParams.get('offset')) || 0,
      limit: Number(searchParams.get('limit')) || 50,
      sort: searchParams.getAll('sort') || [],
    }
  }, [searchParams])

  const dataParamsFilter: DataParamsFilter = {
    brain_area: searchParams.get('brain_area') || '',
    cre_driver: searchParams.get('cre_driver') || '',
    reporter_line: searchParams.get('reporter_line') || '',
    imaging_depth: Number(searchParams.get('imaging_depth')) || 0,
  }

  useEffect(() => {
    let api = isCell ? getCellsDatabase : getExperimentsDatabase
    if (!user) {
      api = isCell ? getCellsPublicDatabase : getExperimentsPublicDatabase
    }
    dispatch(api(dataParamsSort))
    //eslint-disable-next-line
  }, [dataParamsSort, user, isCell])

  const handleOpenDialog = (data: string[]) => {
    setDataDialog({ type: 'image', data })
  }

  const handleCloseDialog = () => {
    setDataDialog({ type: '', data: undefined })
  }

  const handleOpenAttributes = (data: string) => {
    if (isCell) return
    setDataDialog({ type: 'attribute', data })
  }

  const handleChangeAttributes = (event: any) => {
    setDataDialog(event.target.value)
  }

  const getFilter = () => {
    const dataFilter = Object.keys(dataParamsFilter)
      .filter((key) => dataParamsFilter[key as keyof DataParamsFilter])
      .map((item) => `${item}=${(dataParamsFilter as any)[item]}`)
      .join('&')
    return dataFilter
  }

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    const filter = getFilter()
    setParams(
      `${filter}&sort=${dataParamsSort.sort[0]}&sort=${dataParamsSort.sort[1]}&${pagiFilter}`,
    )
  }
  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      const filter = getFilter()
      if (!rowSelectionModel[0]) {
        setParams(`${filter}&sort=&sort=&${pagiFilter}`)
        return
      }
      setParams(
        `${filter}&sort=${rowSelectionModel[0].field}&sort=${rowSelectionModel[0].sort}&${pagiFilter}`,
      )
      //eslint-disable-next-line
    },
    [pagiFilter, getFilter],
  )

  const handleFilter = (rowSelectionModel: GridFilterModel) => {
    let filter: string
    if (!!rowSelectionModel.items[0]?.value) {
      //todo multiple filter with version pro. Issue task #55
      filter = `${rowSelectionModel.items[0]?.columnField}=${rowSelectionModel.items[0]?.value}`
    } else {
      filter = ''
    }
    if (!rowSelectionModel.items[0]) {
      setParams(
        `${filter}&sort=${dataParamsSort.sort[0]}&sort=${dataParamsSort.sort[1]}&${pagiFilter}`,
      )
      return
    }
    setParams(
      `${filter}&sort=${dataParamsSort.sort[0]}&sort=${dataParamsSort.sort[1]}&${pagiFilter}`,
    )
  }

  const getColumns = useMemo(() => {
    return (dataExperiments.header?.graph_titles || []).map(
      (graphTitle, index) => ({
        field: `graph_urls.${index}`,
        headerName: graphTitle,
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
    if (isCell) return []
    return [
      {
        field: 'share_type',
        headerName: '',
        width: 160,
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
        filterable: false,
        renderCell: (params: { row: DatabaseType }) => (
          <Box sx={{ cursor: 'pointer' }}>
            <SwitchCustom value={!!params.row.publish_status} />
          </Box>
        ),
      },
    ]
  }, [isCell])

  const columnsTable = [
    ...columns(handleOpenAttributes, setTypeTable, handleOpenDialog, isCell),
    ...getColumns,
  ].filter(Boolean) as GridEnrichedColDef[]

  return (
    <DatabaseExperimentsWrapper>
      <DataGrid
        columns={user ? [...columnsTable, ...ColumnPrivate] : columnsTable}
        rows={dataExperiments?.items || []}
        hideFooter={true}
        filterMode={'server'}
        sortingMode={'server'}
        onSortModelChange={handleSort}
        onFilterModelChange={handleFilter}
      />
      <Pagination
        sx={{ marginTop: 2 }}
        count={dataExperiments.total}
        page={dataParamsSort.offset + 1}
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

export default Database
