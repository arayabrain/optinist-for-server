import { TableCell, Box, TableHead, TableRow, TableBody, styled } from "@mui/material";
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/slice/User/UserSelector'
import ImageChart from "./common/ImageChart";
import { useRef, useState } from "react";
import DialogImage from "./common/DialogImage";
import LaunchIcon from '@mui/icons-material/Launch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SwitchCustom from "./common/SwitchCustom";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

type OrderByType = "ASC" | "DESC" | ""

type HeaderType = {
  columns: ColumnData[]
  orderBy: OrderByType
  handleOrderBy: (key: string) => void
  keySort: string
}

type ColumnData = {
  label: string
  minWidth?: number
  maxWidth?: number
  type?: "image"
  key: string
  cursor?: string | ((v: string[]) => string)
  action?: boolean
  sort?: boolean
}

type Data = {
  id: number
  fields: {
    brain_area: string,
    cre_driver: string,
    reporter_line: string,
    imaging_depth: number
  }
  experiment_id: string
  attributes: string
  cell_image_urls: string[]
  graph_urls: string[]
  created_time: string
  updated_time: string
}

const columns: ColumnData[] = [
  {
    label: "Experiment ID",
    minWidth: 100,
    key: "experiment_id"
  },
  {
    label: "Brain area",
    minWidth: 70,
    key: "fields.brain_area",
    sort: true
  },
  {
    label: "Cre driver",
    minWidth: 70,
    key: "fields.cre_driver",
    sort: true
  },
  {
    label: "Reporter line",
    minWidth: 70,
    key: "fields.reporter_line",
    sort: true
  },
  {
    label: "Imaging depth",
    minWidth: 70,
    key: "fields.imaging_depth",
    sort: true,
    cursor: (files?: string[]) => files && files.length > 1 ? 'pointer' : 'default'
  },
  {
    label: "Attributes",
    minWidth: 70,
    key: "attributes",
    cursor: 'pointer'
  },
  {
    label: "Cells",
    minWidth: 70,
    key: "cells",
    cursor: 'pointer'
  },
  {
    label: "Pixel Image",
    minWidth: 70,
    key: "cell_image_urls",
    type: "image",
    cursor: (files?: string[]) => files && files.length > 1 ? 'pointer' : 'default'
  },
]

const dataGraphsTitle: string[] = ["Plot1", "Plot2", "Plot3", "Plot4", "Plot5"]

const datas: Data[] = [
  {
    id: 0,
    experiment_id: "0",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: '{13}',
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 1,
    experiment_id: "1",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 2,
    experiment_id: "2",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 3,
    experiment_id: "3",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 4,
    experiment_id: "4",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: '{13}',
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 5,
    experiment_id: "5",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 6,
    experiment_id: "6",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 7,
    experiment_id: "7",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 8,
    experiment_id: "8",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: '{13}',
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 9,
    experiment_id: "9",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 10,
    experiment_id: "10",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 11,
    experiment_id: "11",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 12,
    experiment_id: "12",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 13,
    experiment_id: "13",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 14,
    experiment_id: "14",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: '{13}',
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 15,
    experiment_id: "15",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 16,
    experiment_id: "16",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png", "/static/pie_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 17,
    experiment_id: "17",
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
]

type TableBodyDataBaseProps = {
  data: Data
  columns: ColumnData[]
  handleOpenDialog: Function
  handleOpenAttributes: Function
  setTypeTable: (type: string) => void
}

type PopupAttributesProps = {
  data: string
  open: boolean
  handleClose: () => void
  role?: boolean
  handleChangeAttributes: (e: any) => void
}

const PopupAttributes =
  ({
   data,
   open,
   handleClose,
   role = false,
   handleChangeAttributes
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
            <Content readOnly={!role} value={data} onChange={handleChangeAttributes} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>Close</Button>
          {
            role && <Button onClick={handleClose}>Save</Button>
          }
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const TableHeader =
  ({
    columns,
    orderBy,
    handleOrderBy,
    keySort
  }: HeaderType) => {
  const handleOrder = (key: string) => {
    handleOrderBy(key)
  }

  return (
    <TableHead>
      <TableRow>
        {
          columns.map((item) => {
            return (
              <TableCellCustom
                key={item.key}
                checkHead={item.key}
                sx={{
                  minWidth: item.minWidth,
                  cursor: item.sort ? "pointer" : "default",
                  borderBottom: "none"
                }}
                onClick={() => handleOrder(item.key)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%"
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "100%",
                      textAlign: "center"
                    }}
                  >
                    {item.label}
                  </span>
                  <ArrowDownwardIcon
                    sx={{
                      position: "relative",
                      width: 16,
                      right: -10,
                      display: !orderBy || !item.sort || item.key !== keySort ? "none" : "block",
                      transform: `rotate(${orderBy === "ASC" ? 0 : 180}deg)`,
                      transition: "all 0.3s"
                    }}
                  />
                </Box>
              </TableCellCustom>
            )
          }
          )}
      </TableRow>
    </TableHead>
  )
}

const TableBodyDataBase =
  ({
     data,
     columns,
     handleOpenDialog,
     handleOpenAttributes,
     setTypeTable
  }: TableBodyDataBaseProps) => {

  const handleClick = (key: string, record?: string | number | object | string[]) => {
    if(key === "cell_image_urls") {
      handleOpenDialog(record)
      return
    }
    if(key === "cells") {
      setTypeTable("cells")
      return
    }
    if(key === "attributes") {
      handleOpenAttributes(record)
    }
  }

  const getData = (data: Data, key: string) => {
    let newData: any = data
    if(key.includes(".")) {
      const keys = key.split('.')
      keys.forEach(k => {
        let newKey = isNaN(Number(k)) ? k : Number(k);
        newData = newData?.[newKey];
      })
    } else newData = data[key as keyof Data]
    return newData;
  }

  return (
    <TableBody>
      <TableRow>
        {
          columns.map((column) => {
            let record = getData(data, column.key as string)
            if(column.key === "action") record = <SwitchCustom value={true} />
            return (
              <TableCell
                  sx={{
                    border: "none"
                  }}
                  key={column.key}>
                <Box
                  onClick={() => handleClick(column.key, record)}
                  sx={{ cursor: typeof column.cursor === 'function' ? column.cursor(record) : column.cursor}}
                >
                  { column.type === "image" ?
                  <ImageChart data={record as (string | string[])} />
                  : column.key === "cells" ? <LaunchIcon /> : record
                  }
                </Box>
              </TableCell>
            )
          })
        }
      </TableRow>
    </TableBody>
  )
}

const DatabaseExperiments = ({setTypeTable}: {setTypeTable: (type: string) => void}) => {
  const user = useSelector(selectCurrentUser)
  const [dataTable, setDataTable] = useState<Data[]>(datas.slice(0,6))
  const [orderBy, setOrderBy] = useState<OrderByType>("")
  const [keySort, setKeySort] = useState("")
  const [count, setCount] = useState(6)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAttributes, setOpenAttributes] = useState(false)
  const [dataDialog, setDataDialog] = useState<string[] | string>()
  const refTable = useRef<HTMLTableElement | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  const handleOpenDialog = (data: string[]) => {
    if(data.length === 1) return
    setOpenDialog(true)
    setDataDialog(data)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleOpenAttributes = (data: string) => {
    setDataDialog(data)
    setOpenAttributes(true)
  }

  const handleCloseAttributes = () => {
    setOpenAttributes(false)
  }

  const handleScroll = (event: any) => {
    if(!ref.current || !refTable.current) return
    if(event.currentTarget.scrollTop + ref.current?.clientHeight === refTable.current?.clientHeight) {
      setCount(12)
      setDataTable([...dataTable, ...datas.slice(count, count + 6)])
    }
  }

  const handleOrderBy = (key: string) => {
    setKeySort(key)
    if(key !== keySort && keySort) {
      setOrderBy("ASC")
      return
    }

    if(!orderBy) {
      setOrderBy("ASC")
      return
    }

    if(orderBy === "ASC") {
      setOrderBy("DESC")
      return
    }
    setOrderBy("")
  }

  const handleChangeAttributes = (event: any) => {
    setDataDialog(event.target.value)
  }

  const getColumns: ColumnData[] = dataGraphsTitle.map((graphTitle, index) => ({
    label: graphTitle,
    minWidth: 70,
    key: `graph_urls.${index}`,
    type: "image"
    }
  ))

  return(
  <DatabaseExperimentsWrapper
    onScroll={handleScroll}
    ref={ref}
  >
    <DatabaseExperimentsTableWrapper ref={refTable}>
    <TableHeader
        columns={ user ? [...columns, ...getColumns, {
                  label: "",
                  minWidth: 70,
                  key: "action"
                }] : [...columns, ...getColumns]}
        orderBy={orderBy}
        handleOrderBy={handleOrderBy}
        keySort={keySort}
    />
    {
      dataTable.map((data, index) => {
        return (
          <TableBodyDataBase
            key={`${data.id}_${index}`}
            setTypeTable={setTypeTable}
            handleOpenAttributes={handleOpenAttributes}
            handleOpenDialog={handleOpenDialog}
            data={data}
            columns={user ? [...columns, ...getColumns, {
              label: "",
              minWidth: 70,
              key: "action"
            }] : [...columns, ...getColumns]}
          />
        )
      })
    }
    <DialogImage
      open={openDialog}
      data={dataDialog}
      handleCloseDialog={handleCloseDialog}
    />
    <PopupAttributes
        handleChangeAttributes={handleChangeAttributes}
        data={dataDialog as string}
        open={openAttributes}
        handleClose={handleCloseAttributes}
        role={!!user}
    />
    </DatabaseExperimentsTableWrapper>
  </DatabaseExperimentsWrapper>
  )
}

const DatabaseExperimentsWrapper = styled(Box)(({theme}) => ({
  width: "100%",
  height: "calc(100vh - 180px)",
  overflow: "scroll",
  border: "1px solid #000"
}))

const DatabaseExperimentsTableWrapper = styled("table")(({theme}) => ({
  width: "100%",
  height: "100%",
  overflow: "scroll",
}))

const TableCellCustom = styled(TableCell, {
  shouldForwardProp: props => props !== "checkHead"
})<{ checkHead: string }>(({theme, checkHead}) => ({
  color: "#FFF",
  background: checkHead.includes("graph_urls") ? "#99dadd" : checkHead === "action" ? "#fff" : "#99dd99",
  borderLeft: `1px solid #FFF`,
  fontWeight: 700
}))

const Content = styled('textarea')(({theme}) => ({
  width: 400,
  height: "fit-content"
}))

export default DatabaseExperiments;
