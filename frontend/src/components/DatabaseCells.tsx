import { TableCell, Box, TableHead, TableRow, TableBody, styled } from "@mui/material";
import ImageChart from "./common/ImageChart";
import {useRef, useState} from "react";
import DialogImage from "./common/DialogImage";
import { ColumnData, HeaderType, OrderByType } from "./DatabaseExperiments";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { onSort } from "utils/database";

type Data = {
  id: number
  fields: {
    brain_area: string,
    cre_driver: string,
    reporter_line: string,
    imaging_depth: number
  }
  cell_image_urls: string
  graph_urls: string[]
  created_time: string
  updated_time: string
}

const columns: ColumnData[] = [
  {
    label: "Brain area",
    minWidth: 80,
    key: "fields.brain_area",
    sort: true,
    cursor: "poniter"
  },
  {
    label: "Cre driver",
    minWidth: 80,
    key: "fields.cre_driver",
    sort: true,
    cursor: "poniter"
  },
  {
    label: "Reporter line",
    minWidth: 80,
    key: "fields.reporter_line",
    sort: true,
    cursor: "poniter"
  },
  {
    label: "Imaging depth",
    minWidth: 80,
    key: "fields.imaging_depth",
    sort: true,
    cursor: "poniter"
  },
  {
    label: "Pixel Image",
    minWidth: 80,
    key: "cell_image_urls",
    type: "image",
    cursor: (files?: string[]) => files && files.length > 1 ? 'pointer' : 'default',
  },
]

const dataGraphsTitle: string[] = ["Plot1", "Plot2", "Plot3", "Plot4", "Plot5"]

const datas: Data[] = [
  {
    id: 0,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 1,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 2,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 3,
    fields: {
      brain_area: "1xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 4,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 5,
    fields: {
      brain_area: "1xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 6,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 7,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 8,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 9,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 10,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 11,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 12,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 13,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 14,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 15,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 16,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png", "/static/pie_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 17,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
]

type TableBodyDataBaseProps = {
  data: Data
  columns: ColumnData[]
  handleOpenDialog: Function

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
          columns.map((item) => (
            <TableCellCustom
              key={item.key}
              checkHead={item.key}
              onClick={() => item.sort && handleOrder(item.key)}
              sx={{
                minWidth: item.minWidth,
                cursor: item.sort ? "pointer" : "default",
                borderBottom: "none"
              }}
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
                    position: "absolute",
                    width: 16,
                    right: -10,
                    display: !orderBy || !item.sort || item.key !== keySort ? "none" : "block",
                    transform: `rotate(${orderBy === "ASC" ? 180 : 0}deg)`,
                    transition: "all 0.3s"
                  }}
                />
              </Box>
            </TableCellCustom>
              )
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
   }: TableBodyDataBaseProps) => {

    const handleClick = (key: string, record?: string | number | object | string[]) => {
      if(key === "cell_image_urls") {
        handleOpenDialog(record)
        return
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
              return (
                <TableCell key={column.key}>
                  <Box
                      onClick={() => handleClick(column.key, record)}
                      sx={{ cursor: typeof column.cursor === 'function' ? column.cursor(record) : column.cursor}}
                  >
                    { column.type === "image" ?
                        <ImageChart data={record as (string | string[])} /> : record
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

const DatabaseCells = () => {
  const [orderBy, setOrderBy] = useState<OrderByType>("")
  const [keySort, setKeySort] = useState("")
  const [dataTable, setDataTable] = useState<Data[]>(datas.slice(0,6))
  const [initDataTable, setInitDataTable] = useState<Data[]>(datas.slice(0,6))
  const [count, setCount] = useState(6)
  const [openDialog, setOpenDialog] = useState(false)
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

  const handleScroll = (event: any) => {
    if(!ref.current || !refTable.current) return
    if(event.currentTarget.scrollTop + ref.current?.clientHeight === refTable.current?.clientHeight) {
      setCount((pre) => pre + 6)
      setDataTable([...dataTable, ...datas.slice(count, count + 6)])
      setInitDataTable([...dataTable, ...datas.slice(count, count + 6)])
      handleSort([...dataTable, ...datas.slice(count, count + 6)], orderBy, keySort)
    }
  }

  const handleSort = (dataTable: Data[], orderBy: OrderByType, key: string) => {
    const newData = onSort(initDataTable, dataTable, orderBy, key)
    if(!newData) return
    setDataTable(newData)
  }

  const handleOrderBy = (key: string) => {
    setKeySort(key)
    if((key !== keySort && keySort) || !orderBy) {
      setOrderBy("ASC")
      handleSort(dataTable, "ASC", key)
      return
    }

    if(orderBy === "ASC") {
      setOrderBy("DESC")
      handleSort(dataTable, "DESC", key)
      return
    }
    setOrderBy("")
    handleSort(dataTable, "", key)
  }

  const getColumns: ColumnData[] = dataGraphsTitle.map((graphTitle, index) => ({
    label: graphTitle,
    minWidth: 80,
    key: `graph_urls.${index}`,
    type: "image"
  }
  ))

  return(
    <DatabaseCellsWrapper
      onScroll={handleScroll}
      ref={ref}
    >
      <DatabaseCellsTableWrapper ref={refTable}>
        <TableHeader
          columns={[...columns, ...getColumns]}
          orderBy={orderBy}
          handleOrderBy={handleOrderBy}
          keySort={keySort}
        />
        {
          dataTable.map((data, index) => {
            return (
              <TableBodyDataBase
                key={`${data.id}_${index}`}
                handleOpenDialog={handleOpenDialog}
                data={data}
                columns={[...columns, ...getColumns]}
              />
            )
          })
        }
        <DialogImage
          open={openDialog}
          data={dataDialog}
          handleCloseDialog={handleCloseDialog}
        />
      </DatabaseCellsTableWrapper>
    </DatabaseCellsWrapper>
  )
}

const DatabaseCellsWrapper = styled(Box)(({theme}) => ({
  width: "100%",
  height: "calc(100vh - 200px)",
  overflow: "scroll",
  border: "1px solid #000"
}))

const DatabaseCellsTableWrapper = styled("table")(({theme}) => ({
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

export default DatabaseCells;
