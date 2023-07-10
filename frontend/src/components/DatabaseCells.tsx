import {Box, styled, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import ImageChart from "./common/ImageChart";
import {useState} from "react";
import DialogImage from "./common/DialogImage";

type ColumnData = {
  label: string
  minWidth?: number
  maxWidth?: number
  type?: "image"
  key: string
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

type NewData = {
  id: number
  brain_area: string,
  cre_driver: string,
  reporter_line: string,
  imaging_depth: number
  cell_image_urls: string[]
  created_time: string
  updated_time: string
  plot1?: string
  plot2?: string
  plot3?: string
  plot4?: string
  plot5?: string
}

const graphsTitle: string[] = ["Plot1", "Plot2", "Plot3", "Plot4", "Plot5"]

const columns: ColumnData[] = [
  {
    label: "Brain area",
    minWidth: 70,
    key: "brain_area"
  },
  {
    label: "Cre driver",
    minWidth: 70,
    key: "cre_driver"
  },
  {
    label: "Reporter line",
    minWidth: 70,
    key: "reporter_line"
  },
  {
    label: "Imaging depth",
    minWidth: 70,
    key: "imaging_depth"
  },
  {
    label: "Pixel Image",
    minWidth: 70,
    key: "cell_image_urls",
    type: "image"
  },
]

const datas: Data[] = [
  {
    id: 0,
    fields: {
      brain_area: "xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: ["/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png", "/images/pixel_image.png"],
    graph_urls: ["/images/pie_chart.png"],
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
    cell_image_urls: ["/images/pixel_image.png"],
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
    cell_image_urls: ["/images/pixel_image.png"],
    graph_urls: ["/images/pie_chart.png", "/images/bar_chart.png", "/images/bar_chart.png"],
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
    cell_image_urls: ["/images/pixel_image.png"],
    graph_urls: [""],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
]

type TableBodyDataBaseProps = {
  data: NewData
  columns: ColumnData[]
  handleOpenDialog: Function
}

const TableHeaderCells = ({columns}: {columns: ColumnData[]}) => {
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

const TableBodyDataBaseCells = ({data, columns, handleOpenDialog}: TableBodyDataBaseProps) => {

  return (
      <TableBody>
        <TableRow>
          {
            columns.map((column) => {
              let record = data[column.key as keyof NewData]
              if(column.key === "attributes"){
                record = JSON.stringify(record)
              }
              return (
                  <TableCell key={column.key}>
                    { column.type === "image" ?
                        <Box
                            onClick={() => column.key === "cell_image_urls" && handleOpenDialog(record)}
                            sx={{ cursor: record && (record as string[]).length > 1 ? "pointer" : "auto" }}
                        >
                          <ImageChart
                              data={record as (string | string[])}
                          />
                        </Box>:
                        record
                    }
                  </TableCell>
              )
            })
          }
        </TableRow>
      </TableBody>
  )
}

const DatabaseCells = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [dataDialog, setDataDialog] = useState<string[]>()

  const handleOpenDialog = (data: string[]) => {
    if(data.length === 1) return
    setOpenDialog(true)
    setDataDialog(data)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const getColumns: ColumnData[] = graphsTitle.map((graphTitle) => ({
        label: graphTitle,
        minWidth: 70,
        key: graphTitle,
        type: "image"
      }
  ))

  return (
      <DatabaseCellsWrapper>
        <TableHeaderCells columns={[...columns, ...getColumns]} />
        {
          datas.map((data) => {
            const { fields, graph_urls, ...newData } = data
            let dataPlot: {[key: string]: string} = {}
            graph_urls.forEach((graph_url, index) => {
              dataPlot[graphsTitle[index]] = graph_url
            })
            return (
                <TableBodyDataBaseCells
                    key={data.id}
                    handleOpenDialog={handleOpenDialog}
                    data={{...newData, ...fields, ...dataPlot}}
                    columns={[...columns, ...getColumns]}
                />
            )
          })
        }
        {
            openDialog &&
            <DialogImage data={dataDialog} handleCloseDialog={handleCloseDialog} />
        }
      </DatabaseCellsWrapper>
  )
}

const DatabaseCellsWrapper = styled("table")(({theme}) => ({
  width: "100vw",
  height: "auto",
  overflow: "scroll"
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
