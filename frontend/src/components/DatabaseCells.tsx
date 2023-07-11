import { TableCell, Box, TableHead, TableRow, TableBody, styled } from "@mui/material";
import ImageChart from "./common/ImageChart";
import {useRef, useState} from "react";
import DialogImage from "./common/DialogImage";

type ColumnData = {
  label: string
  minWidth?: number
  maxWidth?: number
  type?: "image"
  key: string
  cursor?: string | ((v: string[]) => string)
}

type Data = {
  id: number
  fields: {
    brain_area: string,
    cre_driver: string,
    reporter_line: string,
    imaging_depth: number
  }
  cell_image_urls: string[]
  graph_urls: string[]
  created_time: string
  updated_time: string
}

const columns: ColumnData[] = [
  {
    label: "Brain area",
    minWidth: 70,
    key: "fields.brain_area"
  },
  {
    label: "Cre driver",
    minWidth: 70,
    key: "fields.cre_driver"
  },
  {
    label: "Reporter line",
    minWidth: 70,
    key: "fields.reporter_line"
  },
  {
    label: "Imaging depth",
    minWidth: 70,
    key: "fields.imaging_depth",
    cursor: (files?: string[]) => files && files.length > 1 ? 'pointer' : 'default'
  },
  {
    label: "Pixel Image",
    minWidth: 70,
    key: "cell_image_urls",
    type: "image"
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
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 3,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 5,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
    cell_image_urls: ["/static/pixel_image.png"],
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
}

const TableHeader = ({columns}: {columns: ColumnData[]}) => {
  return (
    <TableHead>
      <TableRow>
        {
          columns.map((item) => (
            <TableCellCustom
              key={item.key}
              checkHead={item.label.toLowerCase().includes("plot")}
              sx={{
                minWidth: item.minWidth,
              }}
            >
              <span>{item.label}</span>
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
  const [dataTable, setDataTable] = useState<Data[]>(datas.slice(0,6))
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
      setCount(12)
      setDataTable([...dataTable, ...datas.slice(count, count + 6)])
    }
  }

  const getColumns: ColumnData[] = dataGraphsTitle.map((graphTitle, index) => ({
        label: graphTitle,
        minWidth: 70,
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
          <TableHeader columns={[...columns, ...getColumns]} />
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
  height: "calc(100vh - 165px)",
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
})<{ checkHead: boolean }>(({theme, checkHead}) => ({
  color: "#FFF",
  background: !checkHead ? "#99dd99" : "#99dadd",
  borderLeft: `1px solid #FFF`,
  fontWeight: 700
}))

export default DatabaseCells;
