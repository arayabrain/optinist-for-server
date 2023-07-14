import { Box, Pagination, styled } from "@mui/material";
import { useState } from "react";
import DialogImage from "./common/DialogImage";
import LaunchIcon from '@mui/icons-material/Launch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SwitchCustom from "./common/SwitchCustom";
import { DataGrid } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';

export type Data = {
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
  share_type: number
  publish_status: number
  created_time: string
  updated_time: string
}

const dataGraphsTitle: string[] = ["Plot1", "Plot2", "Plot3", "Plot4", "Plot5"]

const datas: Data[] = [
  {
    id: 0,
    experiment_id: "0",
    fields: {
      brain_area: "1xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: '{13}',
    cell_image_urls: ["/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png", "/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png"],
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 1,
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
    share_type: 0,
    publish_status: 0,
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 3,
    experiment_id: "3",
    fields: {
      brain_area: "1xxxx",
      cre_driver: "1xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: [""],
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
  {
    id: 10,
    experiment_id: "10",
    fields: {
      brain_area: "1xxxx",
      cre_driver: "xxxx",
      reporter_line: "xxxx",
      imaging_depth: 0,
    },
    attributes: "{}",
    cell_image_urls: ["/static/pixel_image.png"],
    graph_urls: ["/static/pie_chart.png", "/static/bar_chart.png", "/static/bar_chart.png"],
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
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
    share_type: 0,
    publish_status: 0,
    created_time: "2023-07-06T09:24:45.904Z",
    updated_time: "2023-07-06T09:24:45.904Z",
  },
]

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

const DatabaseExperiments = ({setTypeTable, user}: {setTypeTable: (type: string) => void, user?: Object}) => {
  const [dataTable] = useState<Data[]>(datas)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAttributes, setOpenAttributes] = useState(false)
  const [dataDialog, setDataDialog] = useState<string[] | string>()

  const columns = [
    {
      field: "experiment_id",
      headerName: "Experiment ID",
      width: 160,
      renderCell: (params: { row: Data }) => params.row.experiment_id
    },
    {
      field: "brain_area",
      headerName: "Brain area",
      width: 160,
      renderCell: (params: { row: Data }) => params.row.fields.brain_area,
    },
    {
      field: "cre_driver",
      headerName: "Cre driver",
      width: 160,
      renderCell: (params: { row: Data }) => params.row.fields.cre_driver,
    },
    {
      field: "reporter_line",
      headerName: "Reporter line",
      width: 160,
      renderCell: (params: { row: Data }) => params.row.fields.reporter_line,
    },
    {
      field: "imaging_depth",
      headerName: "Imaging depth",
      width: 160,
      renderCell: (params: { row: Data }) => params.row.fields.imaging_depth,
    },
    {
      field: "attributes",
      headerName: "Attributes",
      width: 160,
      renderCell: (params: { row: Data }) => (
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => handleOpenAttributes(params.row.attributes)}
        >
          {params.row.attributes}
        </Box>
      )
    },
    {
      field: "cells",
      headerName: "Cells",
      width: 160,
      renderCell: (params: { row: Data }) => (
        <Box sx={{cursor: "pointer"}} onClick={() => setTypeTable("cells")}>
          <LaunchIcon />
        </Box>
      )
    },
    {
      field: "cell_image_urls",
      headerName: "Pixel Image",
      width: 160,
      renderCell: (params: { row: Data }) => (
        <Box
          sx={{
            cursor: "pointer",
            display : "flex"
          }}
           onClick={() => handleOpenDialog(params.row.cell_image_urls)}>
          <img
            src={params.row.cell_image_urls[0]}
            alt={""}
            width={"100%"}
            height={"100%"}
          />
        </Box>
      )
    }
  ]

  const handleOpenDialog = (data: string[]) => {
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

  const handleChangeAttributes = (event: any) => {
    setDataDialog(event.target.value)
  }

  const getColumns = dataGraphsTitle.map((graphTitle, index) => (
  {
    field: `graph_urls.${index}`,
    headerName: graphTitle,
    renderCell: (params: { row: Data }) => {
      return (
        <Box sx={{ display: "flex" }}>
        {
          params.row.graph_urls[index] ?
            <img
              src={params.row.graph_urls[index]}
              alt={""}
              width={"100%"}
              height={"100%"}
            /> : null
        }
      </Box>
      )
    },
    width: 160,
  }
  ))

  return(
  <DatabaseExperimentsWrapper>
    <DataGrid
      {...datas}
      columns={ user ? [...columns, ...getColumns,
        {
          field: "share_type",
          headerName: "",
          width: 160,
          renderCell: (params: { row: Data }) => (
            <Box sx={{cursor: "pointer"}}>
              <GroupsIcon />
            </Box>
          ),
        },
        {
          field: "publish_status",
          headerName: "",
          width: 160,
          renderCell: (params: { row: Data }) => (
            <Box sx={{cursor: "pointer"}}>
              <SwitchCustom value={!!params.row.publish_status} />
            </Box>
          ),
        }] : [...columns, ...getColumns]}
      rows={dataTable}
      hideFooter={true}
    />
    <Pagination sx={{marginTop: 2}} count={10} />
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
  </DatabaseExperimentsWrapper>
  )
}

const DatabaseExperimentsWrapper = styled(Box)(({theme}) => ({
  width: "100%",
  height: "calc(100vh - 250px)",
}))

const Content = styled('textarea')(({theme}) => ({
  width: 400,
  height: "fit-content"
}))

export default DatabaseExperiments;
