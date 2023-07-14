import { Box, Pagination, styled } from "@mui/material";
import { useState } from "react";
import DialogImage from "./common/DialogImage";
import { DataGrid } from '@mui/x-data-grid';

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

const dataGraphsTitle: string[] = ["Plot1", "Plot2", "Plot3", "Plot4", "Plot5"]

const datas: Data[] = [
  {
    id: 0,
    fields: {
      brain_area: "1xxxx",
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
    id: 1,
    fields: {
      brain_area: "1xxxx",
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
    id: 2,
    fields: {
      brain_area: "1xxxx",
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
    id: 4,
    fields: {
      brain_area: "1xxxx",
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
    id: 5,
    fields: {
      brain_area: "1xxxx",
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
    id: 6,
    fields: {
      brain_area: "1xxxx",
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
      brain_area: "1xxxx",
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
    id: 8,
    fields: {
      brain_area: "1xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 9,
    fields: {
      brain_area: "1xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    cell_image_urls: "/static/pixel_image.png",
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  }
]

const DatabaseCells = () => {
  const [dataTable] = useState<Data[]>(datas)
  const [openDialog, setOpenDialog] = useState(false)
  const [dataDialog, setDataDialog] = useState<string[] | string>()

  const columns = [
    {
      field: "brain_area",
      headerName: "Brain area",
      width: 160,
    },
    {
      field: "cre_driver",
      headerName: "Cre driver",
      width: 160,
    },
    {
      field: "reporter_line",
      headerName: "Reporter line",
      width: 160,
    },
    {
      field: "imaging_depth",
      headerName: "Imaging depth",
      width: 160,
    },
    {
      field: "cell_image_urls",
      headerName: "Pixel Image",
      width: 160,
      renderCell: (params: any) => (
        <Box sx={{cursor: "pointer"}}
             onClick={() => handleOpenDialog(params.row.cell_image_urls)}>
          <img
            src={params.row.cell_image_urls}
            alt={""}
            width={"auto"}
            height={"auto"}
          />
        </Box>
      ),
    }
  ]

  const handleOpenDialog = (data: string[]) => {
    if(data.length === 1) return
    setOpenDialog(true)
    setDataDialog(data)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const getColumns: any = dataGraphsTitle.map((graphTitle, index) => (
    {
      field: `graph_urls.${index}`,
      headerName: graphTitle,
      renderCell: (params: any) => {
        return (
          <Box>
            {
              params.row.graph_urls[index] ?
                <img
                  src={params.row.graph_urls[index]}
                  alt={""}
                  width={"auto"}
                  height={"auto"}
                /> : null
            }
          </Box>
        )
      },
      width: 160,
    }
  ))

  const newData = dataTable.map((data) => {
    const { fields, ...items } = data
    return ({
      ...items, ...fields
    })
  })

  return(
    <DatabaseCellsWrapper>
      <DataGrid
          {...datas}
          columns={[...columns, ...getColumns]}
          rows={newData}
          hideFooter={true}
      />
      <Pagination sx={{marginTop: 2}} count={10} />
      <DialogImage
        open={openDialog}
        data={dataDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </DatabaseCellsWrapper>
  )
}

const DatabaseCellsWrapper = styled(Box)(({theme}) => ({
  width: "100%",
  height: "calc(100vh - 250px)",
}))

export default DatabaseCells;
