import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import moment from "moment"
import { enqueueSnackbar, VariantType } from "notistack"

import { Article } from "@mui/icons-material"
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch"
import DomainIcon from "@mui/icons-material/Domain"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import GroupsIcon from "@mui/icons-material/Groups"
import PublicIcon from "@mui/icons-material/Public"
import PublicOffIcon from "@mui/icons-material/PublicOff"
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Input,
  styled,
  Tooltip,
} from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterModel,
  GridSortDirection,
  GridSortItem,
  GridSortModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid"

import { SHARE, WAITING_TIME } from "@types"
import { UserDTO } from "api/users/UsersApiDTO"
import { ConfirmDialog } from "components/common/ConfirmDialog"
import DialogImage from "components/common/DialogImage"
import Loading from "components/common/Loading"
import PaginationCustom from "components/common/PaginationCustom"
import SelectFilter from "components/common/SelectFilter"
import SwitchCustom from "components/common/SwitchCustom"
import PopupShareGroup from "components/Database/PopupShareGroup"
import {
  getExperimentsDatabase,
  getExperimentsCatalogsDatabase,
  getExperimentsPublicDatabase,
  getListShare,
  getOptionsFilter,
  postPublish,
  postPublishAll,
  putAttributes,
} from "store/slice/Database/DatabaseActions"
import { TypeData } from "store/slice/Database/DatabaseSlice"
import {
  DATABASE_SLICE_NAME,
  DatabaseType,
  FilterParams,
  ImageUrls,
} from "store/slice/Database/DatabaseType"
import { isAdminOrManager } from "store/slice/User/UserSelector"
import { AppDispatch, RootState } from "store/store"
import { useUrlParamsSync } from "utils/useUrlParamsSync"

export type Data = {
  id: number
  fields: {
    brain_area?: string
    promoter?: string
    indicator?: string
    imaging_depth?: number
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

type PopupBaseProps = {
  data?: string | string[]
  open: boolean
  handleClose: () => void
  title: string
  expId?: string
  readOnly?: boolean
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit?: () => void
  showSaveButton?: boolean
}

type PopupAttributesProps = {
  data?: string | string[]
  open: boolean
  handleClose: () => void
  role?: boolean
  handleChangeAttributes: (e: ChangeEvent<HTMLTextAreaElement>) => void
  expId?: string
  onSubmit: () => void
  readonly?: boolean
}

type PopupLogsProps = {
  data?: string | string[]
  open: boolean
  handleClose: () => void
  expId?: string
}

type DatabaseProps = {
  user?: UserDTO
  cellPath: string
  handleRowClick?: GridEventListener<"rowClick">
  handleRowSelectionModelChange?: (
    selectionModel: GridRowSelectionModel,
  ) => void
  readonly?: boolean
  metadataEditable?: boolean
  multiSelect?: boolean
  hideImageColumns?: boolean
  initialRowSelection?: GridRowSelectionModel
  useExperimentsCatalogsApi?: boolean
}

let timeout: NodeJS.Timeout | undefined = undefined

const LIST_FILTER_IS = [
  "publish_status",
  "brain_area",
  "promoter",
  "indicator",
  "imaging_depth",
]

const columns = (
  handleOpenAttributes: (value: string, id: number, expId?: string) => void,
  handleOpenLogs: (value: string, expId?: string) => void,
  handleOpenDialog: (value: ImageUrls[], exp_id?: string) => void,
  cellPath: string,
  navigate: (path: string) => void,
  user: boolean,
  readonly?: boolean,
  loading: boolean = false,
  options?: FilterParams,
  useExperimentsCatalogsApi: boolean = false,
) => [
  {
    field: "experiment_id",
    headerName: "Experiment ID",
    width: 160,
    filterOperators: [
      {
        label: "Contains",
        value: "contains",
        InputComponent: ({ applyValue, item }: GridFilterInputValueProps) => {
          return (
            <Input
              autoFocus={!loading}
              sx={{ paddingTop: "16px" }}
              defaultValue={item.value || ""}
              onChange={(e) => {
                if (timeout) clearTimeout(timeout)
                timeout = setTimeout(() => {
                  applyValue({ ...item, value: e.target.value })
                }, WAITING_TIME)
              }}
            />
          )
        },
      },
    ],
    type: "string",
    renderCell: (params: { row: DatabaseType }) => (
      <Tooltip title={params.row?.experiment_id}>
        <SpanCustom>{params.row?.experiment_id}</SpanCustom>
      </Tooltip>
    ),
  },
  user && {
    field: "published",
    headerName: "Published",
    renderCell: (params: { row: DatabaseType }) =>
      params.row.publish_status ? <CheckCircleIcon color={"success"} /> : null,
    valueOptions: ["Published", "No_Published"],
    type: "singleSelect",
    width: 120,
  },
  {
    field: "brain_area",
    headerName: "Brain area",
    renderCell: (params: { row: DatabaseType }) => {
      return (
        <Tooltip title={params.row.fields?.brain_area}>
          <SpanCustom>{params.row.fields?.brain_area ?? "NA"}</SpanCustom>
        </Tooltip>
      )
    },
    filterOperators: [
      {
        label: "Is any of",
        value: "isAnyOf",
        InputComponent: ({ applyValue, item }: GridFilterInputValueProps) => {
          if (!options) return null
          return (
            <SelectFilter
              options={options?.brain_areas}
              loading={loading}
              applyValue={applyValue}
              item={item}
              timeout={timeout}
            />
          )
        },
      },
    ],
    width: 120,
  },
  {
    field: "promoter",
    headerName: "Promoter",
    width: 120,
    filterOperators: [
      {
        label: "Is any of",
        value: "isAnyOf",
        InputComponent: ({ applyValue, item }: GridFilterInputValueProps) => {
          if (!options) return null
          return (
            <SelectFilter
              options={options?.promoters}
              loading={loading}
              applyValue={applyValue}
              item={item}
              timeout={timeout}
            />
          )
        },
      },
    ],
    renderCell: (params: { row: DatabaseType }) => {
      return (
        <Tooltip title={params.row.fields?.promoter}>
          <SpanCustom>{params.row.fields?.promoter ?? "NA"}</SpanCustom>
        </Tooltip>
      )
    },
  },
  {
    field: "indicator",
    headerName: "Indicator",
    width: 120,
    filterOperators: [
      {
        label: "Is any of",
        value: "isAnyOf",
        InputComponent: ({ applyValue, item }: GridFilterInputValueProps) => {
          if (!options) return null
          return (
            <SelectFilter
              options={options?.indicators}
              loading={loading}
              applyValue={applyValue}
              item={item}
              timeout={timeout}
            />
          )
        },
      },
    ],
    renderCell: (params: { row: DatabaseType }) => {
      return (
        <Tooltip title={params.row.fields?.indicator}>
          <SpanCustom>{params.row.fields?.indicator ?? "NA"}</SpanCustom>
        </Tooltip>
      )
    },
  },
  {
    field: "imaging_depth",
    headerName: "Imaging depth",
    width: 120,
    filterOperators: [
      {
        label: "Is any of",
        value: "isAnyOf",
        InputComponent: ({ applyValue, item }: GridFilterInputValueProps) => {
          if (!options) return null
          return (
            <SelectFilter
              options={options?.imaging_depths}
              loading={loading}
              applyValue={applyValue}
              item={item}
              timeout={timeout}
            />
          )
        },
      },
    ],
    renderCell: (params: { row: DatabaseType }) => {
      return (
        <Tooltip title={params.row.fields?.imaging_depth}>
          <SpanCustom>{params.row.fields?.imaging_depth ?? "NA"}</SpanCustom>
        </Tooltip>
      )
    },
  },
  {
    field: "attributes",
    headerName: "Attributes",
    width: 120,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => {
      const inputValue = JSON.stringify(params?.row?.attributes ?? {}).trim()
      const parsedJSON = JSON.parse(inputValue)
      const formattedJSON = JSON.stringify(parsedJSON, null, 2)
      const value = formattedJSON
      return (
        <Box
          sx={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation()
            handleOpenAttributes(
              value,
              params?.row?.id,
              params?.row?.experiment_id,
            )
          }}
        >
          <AssignmentOutlinedIcon color={"primary"} />
        </Box>
      )
    },
  },
  useExperimentsCatalogsApi && {
    field: "processing_log",
    headerName: "Processing Log",
    width: 140,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => {
      const inputValue = JSON.stringify(
        params?.row?.processing_log || {},
      ).trim()
      const parsedJSON = JSON.parse(inputValue)
      const formattedJSON = JSON.stringify(parsedJSON, null, 2)
      const value = formattedJSON
      return (
        <Box
          sx={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation()
            handleOpenLogs(value, params?.row?.experiment_id)
          }}
        >
          <Article color={"primary"} />
        </Box>
      )
    },
  },
  !readonly && {
    field: "cells",
    headerName: "Cells",
    width: 120,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => (
      <Box
        sx={{ cursor: "pointer", color: "dodgerblue" }}
        onClick={() =>
          navigate(`${cellPath}?experiment_id=${params.row?.experiment_id}`)
        }
      >
        <ContentPasteSearchIcon />
      </Box>
    ),
  },
  {
    field: "cell_image_urls",
    headerName: "Pixel Image",
    width: 160,
    filterable: false,
    sortable: false,
    renderCell: (params: { row: DatabaseType }) => {
      return (
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
          }}
          onClick={() => handleOpenDialog(params.row?.cell_image_urls)}
        >
          {params.row?.cell_image_urls?.length > 0 && (
            <img
              src={params.row?.cell_image_urls[0].thumb_urls[0]}
              alt={""}
              width={"100%"}
              height={"100%"}
            />
          )}
        </Box>
      )
    },
  },
]

const PopupBase = ({
  data,
  open,
  handleClose,
  title,
  expId,
  readOnly = true,
  onChange,
  onSubmit,
  showSaveButton = false,
}: PopupBaseProps) => {
  const [error, setError] = useState("")
  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str)
      setError("")
    } catch {
      setError("format JSON invalid")
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    isValidJSON(e.target.value)
    onChange?.(e)
  }

  useEffect(() => {
    const handleClosePopup = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
        return
      }
    }

    document.addEventListener("keydown", handleClosePopup)
    return () => {
      document.removeEventListener("keydown", handleClosePopup)
    }
    //eslint-disable-next-line
  }, [])

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            padding: "16px 24px 0",
          }}
        >
          <Box sx={{ fontWeight: 600, fontSize: "1.1rem" }}>{title}</Box>
          {expId && (
            <Chip
              label={expId}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontSize: "0.8rem" }}
            />
          )}
        </Box>
        <DialogContent sx={{ minWidth: 400 }}>
          <DialogContentText>
            <Content readOnly={readOnly} value={data} onChange={handleChange} />
            <span style={{ color: "red", display: "block" }}>{error}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant={"outlined"}
            autoFocus
            onClick={() => {
              handleClose()
              setError("")
            }}
          >
            Close
          </Button>
          {showSaveButton && (
            <Button variant={"contained"} disabled={!!error} onClick={onSubmit}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const PopupAttributes = ({
  data,
  open,
  handleClose,
  role = false,
  handleChangeAttributes,
  onSubmit,
  readonly,
  expId,
}: PopupAttributesProps) => {
  return (
    <PopupBase
      data={data}
      open={open}
      handleClose={handleClose}
      title="Attributes"
      expId={expId}
      readOnly={!role || readonly}
      onChange={handleChangeAttributes}
      onSubmit={onSubmit}
      showSaveButton={role && !readonly}
    />
  )
}

const PopupLogs = ({ data, open, handleClose, expId }: PopupLogsProps) => {
  return (
    <PopupBase
      data={data}
      open={open}
      handleClose={handleClose}
      title="Logs"
      expId={expId}
      readOnly={true}
    />
  )
}
const DatabaseExperiments = ({
  user,
  cellPath,
  handleRowClick,
  handleRowSelectionModelChange,
  readonly,
  metadataEditable,
  multiSelect = false,
  hideImageColumns = false,
  initialRowSelection = [],
  useExperimentsCatalogsApi = false,
}: DatabaseProps) => {
  const type: keyof TypeData = user ? "private" : "public"
  const adminOrManager = useSelector(isAdminOrManager)
  const {
    data: dataExperiments,
    loading,
    filterParams,
  } = useSelector(
    (state: RootState) => ({
      data: state[DATABASE_SLICE_NAME].data[type],
      loading: state[DATABASE_SLICE_NAME].loading,
      filterParams: state[DATABASE_SLICE_NAME].filterParams,
    }),
    shallowEqual,
  )

  const [openPublishAll, setOpenPublishAll] = useState<{
    title: string
    open: boolean
    type: "on" | "off"
    content: string
  }>({
    content: "",
    title: "",
    open: false,
    type: "on",
  })
  const { searchParams, setNewParams } = useUrlParamsSync()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [openShare, setOpenShare] = useState<{ open: boolean; id?: number }>({
    open: false,
  })
  const [listCheck, setListCheck] = useState<number[]>([])
  const [checkBoxAll, setCheckBoxAll] = useState(false)
  const [openShareGroup, setOpenShareGroup] = useState(false)
  const [dataDialog, setDataDialog] = useState<{
    id?: number
    type?: string
    data?: string | string[]
    expId?: string
    nameCol?: string
    shareType?: number
  }>({
    type: "",
    data: undefined,
  })
  const [fieldFilter, setFieldFilter] = useState("")
  const [valueFilter, setValueFilter] = useState<string | string[]>("")

  const offset = searchParams.get("offset") || 0
  const limit = searchParams.get("limit") || 50
  const sort = searchParams.getAll("sort")

  const { dataShare } = useSelector(
    (state: RootState) => ({
      dataShare: state[DATABASE_SLICE_NAME].listShare,
    }),
    shallowEqual,
  )

  const handleClickVariant = (variant: VariantType, mess: string) => {
    enqueueSnackbar(mess, { variant })
  }

  const pagiFilter = useCallback(
    (page?: number) => {
      return `limit=${limit}&offset=${
        page ? Number(limit) * (page - 1) : offset || dataExperiments.offset
      }`
    },
    //eslint-disable-next-line
    [limit, offset, JSON.stringify(dataExperiments), dataExperiments.offset],
  )

  const dataParams = useMemo(() => {
    return {
      offset: Number(offset) || 0,
      limit: Number(limit) || 50,
      sort:
        sort.length > 0
          ? [sort[0]?.replace("published", "publish_status"), sort[1]]
          : [],
    }
    //eslint-disable-next-line
  }, [offset, limit, JSON.stringify(sort)])

  const dataParamsFilter = useMemo(
    () => ({
      experiment_id: searchParams.get("experiment_id") || undefined,
      publish_status: searchParams.get("published") || undefined,
      brain_area: searchParams.getAll("brain_area") || undefined,
      promoter: searchParams.getAll("promoter") || undefined,
      indicator: searchParams.getAll("indicator") || undefined,
      imaging_depth: searchParams.getAll("imaging_depth") || undefined,
    }),
    [searchParams],
  )

  const [model, setModel] = useState<{
    filter: GridFilterModel
    sort: GridSortModel
  }>({
    filter: {
      items: [
        {
          field:
            Object.keys(dataParamsFilter)
              .find(
                (key) => dataParamsFilter[key as keyof typeof dataParamsFilter],
              )
              ?.replace("publish_status", "published") || "",
          operator: LIST_FILTER_IS.includes(
            Object.keys(dataParamsFilter).find(
              (key) => dataParamsFilter[key as keyof typeof dataParamsFilter],
            ) || "publish_status",
          )
            ? "isAnyOf"
            : "contains",
          value: Object.values(dataParamsFilter).find((value) => value) || null,
        },
      ],
    },
    sort: [
      {
        field: dataParams.sort[0]?.replace("publish_status", "published") || "",
        sort: dataParams.sort[1] as GridSortDirection,
      },
    ],
  })

  const fetchApi = () => {
    const api = !user
      ? getExperimentsPublicDatabase
      : useExperimentsCatalogsApi
        ? getExperimentsCatalogsDatabase
        : getExperimentsDatabase
    let newPublish: number | undefined
    if (!dataParamsFilter.publish_status) newPublish = undefined
    else {
      if (dataParamsFilter.publish_status === "Published") newPublish = 1
      else newPublish = 0
    }
    dispatch(
      api({ ...dataParamsFilter, publish_status: newPublish, ...dataParams }),
    )
  }

  useEffect(() => {
    const key = Object.keys(dataParamsFilter).find((key) => {
      const value = dataParamsFilter[key as keyof typeof dataParamsFilter]
      return (
        (!Array.isArray(value) && value) ||
        (Array.isArray(value) && value.length)
      )
    }) as keyof typeof dataParamsFilter
    if (key) {
      setFieldFilter(key)
      setValueFilter(dataParamsFilter[key] as string[])
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (
      Object.keys(dataParamsFilter).every(
        (key) => !dataParamsFilter[key as keyof typeof dataParamsFilter],
      )
    ) {
      return
    }
    if (!fieldFilter?.trim()?.length) return
    setModel({
      filter: {
        items: [
          {
            field: fieldFilter?.replace("publish_status", "published") || "",
            operator: LIST_FILTER_IS.includes(fieldFilter || "publish_status")
              ? "isAnyOf"
              : "contains",
            value: valueFilter || null,
          },
        ],
      },
      sort: [
        {
          field:
            dataParams.sort[0]?.replace("publish_status", "published") || "",
          sort: dataParams.sort[1] as GridSortDirection,
        },
      ],
    })
    //eslint-disable-next-line
  }, [dataParams, dataParamsFilter, fieldFilter, valueFilter])

  useEffect(() => {
    dispatch(getOptionsFilter())
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (dataExperiments.items.length === 0) {
      setCheckBoxAll(false)
      return
    }
    const newListId = dataExperiments.items.map((item) => item.id)
    const isCheck = newListId.every((id) => listCheck.includes(id))
    setCheckBoxAll(isCheck)
  }, [dataExperiments, listCheck])

  useEffect(() => {
    fetchApi()
    //eslint-disable-next-line
  }, [JSON.stringify(dataParams), user, JSON.stringify(dataParamsFilter)])

  useEffect(() => {
    if (!openShare.open || !openShare.id) return
    dispatch(getListShare({ id: openShare.id }))
    //eslint-disable-next-line
  }, [openShare])

  useEffect(() => {
    setCheckBoxAll(false)
    //eslint-disable-next-line
  }, [offset, limit, JSON.stringify(dataParamsFilter)])

  const handleOpenDialog = (
    data: ImageUrls[] | ImageUrls,
    expId?: string,
    graphTitle?: string,
  ) => {
    let newData: string[] = []
    if (Array.isArray(data)) {
      newData = data.flatMap((d) => d.urls || [])
    } else if (data && data.urls) {
      newData = Array.isArray(data.urls) ? data.urls : [data.urls]
    }
    setDataDialog({
      type: "image",
      data: newData,
      expId: expId,
      nameCol: graphTitle,
    })
  }

  const handleCloseDialog = () => {
    setDataDialog({ type: "", data: undefined })
  }

  const handleOpenAttributes = (data: string, id: number, expId?: string) => {
    setDataDialog({ id: id, type: "attribute", data, expId })
  }

  const handleOpenLogs = (data: string, expId?: string) => {
    setDataDialog({ type: "logs", data, expId })
  }

  const handleChangeAttributes = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDataDialog((pre) => ({ ...pre, data: event.target.value }))
  }

  const onSubmitAttributes = async () => {
    const { id, data } = dataDialog
    if (!id || !data) return
    const res = await dispatch(
      putAttributes({
        id: id,
        attributes: data as string,
        params: { ...dataParamsFilter, ...dataParams },
      }),
    )
    if ((res as { payload: boolean }).payload === true) {
      handleClickVariant("success", "Successfully updated attributes!")
      setDataDialog({ ...dataDialog, id: undefined, type: "" })
      return
    }
    handleClickVariant("error", "Update attributes failed!")
  }

  const handleOpenShare = (expId?: string, value?: number, id?: number) => {
    setDataDialog({ expId: expId, shareType: value })
    setOpenShare({ open: true, id: id })
  }

  const getParamsData = () => {
    const dataFilter = Object.keys(dataParamsFilter)
      .filter((key) => {
        const value = dataParamsFilter[key as keyof typeof dataParamsFilter]
        if (Array.isArray(value)) {
          return !!value[0]
        }
        return value
      })
      .map((key) => {
        const value = dataParamsFilter[key as keyof typeof dataParamsFilter]
        if (Array.isArray(value)) {
          return value.map((item) => `${key}=${item}`).join("&")
        }
        return `${key}=${
          dataParamsFilter[key as keyof typeof dataParamsFilter]
        }`
      })
      .join("&")
      .replaceAll("publish_status", "published")
    return dataFilter
  }

  const handlePage = (e: ChangeEvent<unknown>, page: number) => {
    const filter = getParamsData()
    const param = `${filter}${
      dataParams.sort[0]
        ? `${filter ? "&" : ""}sort=${dataParams.sort[0]}&sort=${
            dataParams.sort[1]
          }`
        : ""
    }&${pagiFilter(page)}`
    setNewParams(param)
  }

  const handlePublish = async (id: number, status: "on" | "off") => {
    let newPublish: number | undefined
    if (!dataParamsFilter.publish_status) newPublish = undefined
    else {
      if (dataParamsFilter.publish_status === "Published") newPublish = 1
      else newPublish = 0
    }
    await dispatch(
      postPublish({
        id,
        status,
        params: {
          ...dataParamsFilter,
          publish_status: newPublish,
          ...dataParams,
        },
      }),
    )
  }

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      setModel({
        ...model,
        sort: rowSelectionModel,
      })
      let param
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        param =
          filter || dataParams.sort[0] || offset
            ? `${filter ? `${filter}&` : ""}${pagiFilter()}`
            : ""
      } else {
        param = `${filter}${
          rowSelectionModel[0]
            ? `${filter ? "&" : ""}sort=${rowSelectionModel[0].field?.replace(
                "publish_status",
                "published",
              )}&sort=${rowSelectionModel[0].sort}`
            : ""
        }&${pagiFilter()}`
      }
      setNewParams(param.replace("publish_status", "published"))
      setCheckBoxAll(false)
    },
    //eslint-disable-next-line
    [pagiFilter, model],
  )

  const handleFilter = (modelFilter: GridFilterModel) => {
    if (modelFilter.items.length === 0) {
      const data = Object.keys(dataParamsFilter).filter((key) => {
        const value = dataParamsFilter[key as keyof typeof dataParamsFilter]
        if (Array.isArray(value) && value.length === 0) {
          return false
        }
        return !!value
      })
      setModel({
        ...model,
        filter: {
          items: [
            {
              field: data[0],
              operator: "isAnyOf",
              value:
                dataParamsFilter[data[0] as keyof typeof dataParamsFilter] ||
                "",
            },
          ],
        },
      })
      return
    }

    setModel({
      ...model,
      filter: modelFilter,
    })
    setFieldFilter(modelFilter.items[0]?.field)
    setValueFilter(modelFilter.items[0]?.value)
    let filter = ""
    if (modelFilter.items[0]?.value) {
      filter = modelFilter.items
        .filter((item) => item.value)
        .map((item: GridFilterItem) => {
          if (Array.isArray(item.value)) {
            return item.value.map((value) => `${item.field}=${value}`).join("&")
          }
          return `${item.field}=${item?.value}`
        })[0]
        .replace("publish_status", "published")
    }
    const { sort } = dataParams
    const param =
      sort[0] || filter || offset
        ? `${filter}${
            sort[0] ? `${filter ? "&" : ""}sort=${sort[0]}&sort=${sort[1]}` : ""
          }&${pagiFilter()}`
        : ""
    setNewParams(param.replace("publish_status", "published"))
    setCheckBoxAll(false)
  }

  const handleLimit = (event: ChangeEvent<HTMLSelectElement>) => {
    let filter = ""
    filter = Object.keys(dataParamsFilter)
      .filter((key) => dataParamsFilter[key as keyof typeof dataParamsFilter])
      .map((key) => {
        const value = dataParamsFilter[key as keyof typeof dataParamsFilter]
        if (Array.isArray(value)) {
          return value.map((item) => `${key}=${item}`).join("&")
        }
        return `${key}=${
          dataParamsFilter[key as keyof typeof dataParamsFilter]
        }`
      })
      .join("&")
      .replace("publish_status", "published")
    const { sort } = dataParams
    const param = `${filter}${
      sort[0] ? `${filter ? "&" : ""}sort=${sort[0]}&sort=${sort[1]}` : ""
    }&limit=${Number(event.target.value)}&offset=0`
    setNewParams(param)
  }

  const handlePublishCancel = () => {
    setOpenPublishAll({
      ...openPublishAll,
      open: false,
    })
  }

  const handleOpenPublishAll = (
    title: string,
    content: string,
    type: "on" | "off",
  ) => {
    setOpenPublishAll({
      title: title,
      content: content,
      open: true,
      type: type,
    })
  }

  const handlePublishOk = () => {
    setOpenPublishAll({
      ...openPublishAll,
      open: false,
    })
    dispatch(
      postPublishAll({
        status: openPublishAll.type,
        params: {
          ...dataParamsFilter,
          ...dataParams,
        },
        listCheck,
      }),
    )
  }

  const getColumns = useMemo(() => {
    return (dataExperiments.header?.graph_titles || []).map(
      (graphTitle, index) => ({
        field: `graph_urls.${index}`,
        headerName: graphTitle,
        sortable: false,
        filterable: false,
        renderCell: (params: { row: DatabaseType }) => {
          const { row } = params
          const { graph_urls } = row
          const graph_url = graph_urls[index]

          if (!graph_url) {
            // eslint-disable-next-line no-console
            console.log(`No graph_url for ${graphTitle}`)
            return null
          }

          // Check if we have URLs to display
          if (!graph_url.thumb_urls || graph_url.thumb_urls.length === 0) {
            // eslint-disable-next-line no-console
            console.log(`No thumbnail URLs to display for ${graphTitle}`)
            return null
          }

          return (
            <Box
              sx={{ display: "flex", cursor: "pointer" }}
              onClick={() => {
                handleOpenDialog(graph_url, row.experiment_id, graphTitle)
              }}
            >
              {/* Just display the first thumbnail */}
              <img
                src={graph_url.thumb_urls[0]}
                alt={""}
                width={"100%"}
                height={"100%"}
                onError={(e) => {
                  // eslint-disable-next-line no-console
                  console.error(`Error loading thumbnail for ${graphTitle}:`, e)
                  e.currentTarget.style.display = "none"
                }}
              />
            </Box>
          )
        },
        width: 160,
      }),
    )
  }, [dataExperiments.header?.graph_titles])

  const ColumnPrivate = () => {
    return [
      {
        field: "updated_time",
        headerName: "Timestamp",
        width: 160,
        filterable: false,
        sortable: false,
        renderCell: (params: { row: DatabaseType }) => {
          return (
            <Tooltip title={params.row?.updated_at}>
              <SpanCustom>
                {moment(params.row?.updated_at).format("YYYY/MM/DD HH:mm")}
              </SpanCustom>
            </Tooltip>
          )
        },
      },
    ]
  }

  const ColumnCheckbox = () => {
    return [
      {
        field: "checkbox",
        renderHeader: () => (
          <Checkbox
            checked={checkBoxAll}
            onChange={(e: ChangeEvent) => {
              const target = e.target as HTMLInputElement
              setCheckBoxAll(target.checked)
              if (!target.checked) {
                const listIdData = dataExperiments.items.map((item) => item.id)
                const newListId: number[] = listCheck.filter(
                  (item) => !listIdData.includes(item),
                )
                setListCheck([...newListId])
              } else {
                const newList = dataExperiments.items.map((item) => item.id)
                setListCheck([
                  ...listCheck,
                  ...newList.filter((item) => !listCheck.includes(item)),
                ])
              }
            }}
          />
        ),
        sortable: false,
        filterable: false,
        width: 70,
        type: "string",
        renderCell: (params: { row: DatabaseType }) => (
          <Checkbox
            checked={listCheck.includes(params.row.id)}
            onChange={(e: ChangeEvent) => {
              const newData = listCheck.filter((id) => id !== params.row.id)
              const target = e.target as HTMLInputElement
              if (!target.checked) {
                setCheckBoxAll(false)
                setListCheck(newData)
              } else setListCheck([...listCheck, params.row.id])
            }}
          />
        ),
      },
    ]
  }

  const ColumnManage = () => {
    return [
      {
        field: "share_type",
        headerName: "Share",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: { value: number; row: DatabaseType }) => {
          const { value, row } = params
          return (
            <Box
              sx={{ cursor: "pointer", color: "darkgray" }}
              onClick={() => handleOpenShare(row.experiment_id, value, row.id)}
            >
              {value === SHARE.ORGANIZATION ? (
                <DomainIcon color="primary" />
              ) : (
                <GroupsIcon
                  color={`${value === SHARE.NOSHARE ? "inherit" : "primary"}`}
                />
              )}
            </Box>
          )
        },
      },
      {
        field: "publish_status",
        headerName: "Publish",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: { row: DatabaseType }) => (
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() =>
              handlePublish(
                params.row.id,
                params.row.publish_status ? "off" : "on",
              )
            }
          >
            <SwitchCustom value={!!params.row.publish_status} />
          </Box>
        ),
      },
    ]
  }

  let columnsTable = [
    ...columns(
      handleOpenAttributes,
      handleOpenLogs,
      handleOpenDialog,
      cellPath,
      navigate,
      !!user,
      readonly,
      loading,
      filterParams,
      useExperimentsCatalogsApi,
    ),
    ...getColumns,
  ].filter(Boolean) as GridColDef[]

  // Filter columns if hidePixcelColumns is true
  if (hideImageColumns) {
    const firstImageColumnIndex = columnsTable.findIndex(
      (col) => col.field === "cell_image_urls",
    )
    if (firstImageColumnIndex !== -1) {
      columnsTable = columnsTable.slice(0, firstImageColumnIndex)
    }
  }

  /**
   * Preserve scroll position when row selection changes in multi-select mode
   * DataGrid automatically scrolls to selected rows, which causes unwanted flickering
   * This logic captures the scroll position before selection and restores it after rendering
   */
  const dataGridContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollPositionRef = useRef({ top: 0, left: 0 })

  const getVirtualScroller = useCallback(() => {
    return dataGridContainerRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller",
    ) as HTMLElement | null
  }, [])

  const saveScrollPosition = useCallback(() => {
    const scroller = getVirtualScroller()
    if (scroller) {
      scrollPositionRef.current = {
        top: scroller.scrollTop,
        left: scroller.scrollLeft,
      }
    }
  }, [getVirtualScroller])

  const restoreScrollPosition = useCallback(() => {
    const scroller = getVirtualScroller()
    if (scroller) {
      scroller.scrollTop = scrollPositionRef.current.top
      scroller.scrollLeft = scrollPositionRef.current.left
    }
  }, [getVirtualScroller])

  const handleRowSelectionChange = useCallback(
    (newSelection: GridRowSelectionModel) => {
      if (!multiSelect) {
        handleRowSelectionModelChange?.(newSelection)
        return
      }

      saveScrollPosition()
      handleRowSelectionModelChange?.(newSelection)

      // Restore after React renders the updated selection state
      setTimeout(() => {
        restoreScrollPosition()
      }, 0)
    },
    [
      multiSelect,
      handleRowSelectionModelChange,
      saveScrollPosition,
      restoreScrollPosition,
    ],
  )

  return (
    <DatabaseExperimentsWrapper>
      {user ? (
        <Box sx={{ height: 40, margin: "0 0 0.5rem 0" }}>
          {!readonly && adminOrManager ? (
            <WrapperIcons check={!!(listCheck.length > 0)}>
              <Tooltip title={"bulk share"} placement={"top"}>
                <span>
                  <IconButton
                    size={"large"}
                    onClick={() =>
                      listCheck.length !== 0 && setOpenShareGroup(true)
                    }
                    sx={{
                      cursor: listCheck.length > 0 ? "pointer" : "default",
                      color: (theme) =>
                        listCheck.length > 0
                          ? theme.palette.primary.main
                          : "#d0d0d0",
                    }}
                    disabled={!!(listCheck.length === 0)}
                  >
                    <GroupAddIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={"bulk publish"} placement={"top"}>
                <span>
                  <IconButton
                    size={"large"}
                    onClick={() =>
                      listCheck.length !== 0 &&
                      handleOpenPublishAll(
                        "Bulk Publish",
                        `Publish "${listCheck.length} records" at once. Is this OK?`,
                        "on",
                      )
                    }
                    sx={{
                      cursor: listCheck.length > 0 ? "pointer" : "default",
                      color: (theme) =>
                        listCheck.length > 0
                          ? theme.palette.primary.main
                          : "#d0d0d0",
                    }}
                    disabled={!!(listCheck.length === 0)}
                  >
                    <PublicIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={"bulk unpublish"} placement={"top"}>
                <span>
                  <IconButton
                    size={"large"}
                    onClick={() =>
                      listCheck.length !== 0 &&
                      handleOpenPublishAll(
                        "Bulk UnPublish",
                        `Unpublish "${listCheck.length} records" at once. Is this OK?`,
                        "off",
                      )
                    }
                    sx={{
                      cursor: listCheck.length > 0 ? "pointer" : "default",
                      color: (theme) =>
                        listCheck.length > 0
                          ? theme.palette.primary.main
                          : "#d0d0d0",
                    }}
                    disabled={!!(listCheck.length === 0)}
                  >
                    <PublicOffIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </WrapperIcons>
          ) : null}
        </Box>
      ) : null}
      <Box
        ref={dataGridContainerRef}
        sx={{ flex: 1, minHeight: 0, display: "flex" }}
      >
        <DataGrid
          columns={
            [
              ...(user && adminOrManager && !readonly ? ColumnCheckbox() : []),
              ...columnsTable,
              ...(user ? ColumnPrivate() : []),
              ...(user && adminOrManager && !readonly ? ColumnManage() : []),
            ] as GridColDef[]
          }
          sortModel={model.sort as GridSortItem[]}
          rows={dataExperiments?.items || []}
          rowHeight={128}
          hideFooter={true}
          filterMode={"server"}
          sortingMode={"server"}
          onSortModelChange={handleSort}
          filterModel={model.filter}
          onFilterModelChange={handleFilter}
          onRowClick={handleRowClick}
          checkboxSelection={multiSelect}
          rowSelectionModel={initialRowSelection}
          onRowSelectionModelChange={handleRowSelectionChange}
          sx={{ flex: 1 }}
        />
      </Box>
      {dataExperiments?.items.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <PaginationCustom
            data={dataExperiments}
            handlePage={handlePage}
            handleLimit={handleLimit}
            limit={Number(limit)}
          />
        </Box>
      ) : null}
      <DialogImage
        open={dataDialog.type === "image"}
        data={dataDialog.data}
        expId={dataDialog.expId}
        nameCol={dataDialog.nameCol}
        handleCloseDialog={handleCloseDialog}
      />
      <PopupAttributes
        handleChangeAttributes={handleChangeAttributes}
        data={dataDialog.data}
        open={dataDialog.type === "attribute"}
        handleClose={handleCloseDialog}
        onSubmit={onSubmitAttributes}
        role={!!adminOrManager && !!user}
        readonly={!metadataEditable}
        expId={dataDialog.expId}
      />
      <PopupLogs
        data={dataDialog.data}
        open={dataDialog.type === "logs"}
        handleClose={handleCloseDialog}
        expId={dataDialog.expId}
      />
      <Loading loading={loading} />
      {openShare.open && openShare.id ? (
        <PopupShareGroup
          type={"share"}
          listCheck={listCheck}
          id={openShare.id}
          open={openShare.open}
          data={dataDialog as { expId: string; shareType: number }}
          usersShare={dataShare}
          handleClose={(isSubmit) => {
            if (isSubmit) fetchApi()
            setOpenShare({ ...openShare, open: false })
          }}
        />
      ) : null}
      {openShareGroup && (
        <PopupShareGroup
          type={"multiShare"}
          listCheck={listCheck}
          usersShare={dataShare}
          open={openShareGroup}
          data={dataDialog as { expId: string; shareType: number }}
          handleClose={() => setOpenShareGroup(false)}
          paramsUrl={{ ...dataParams, ...dataParamsFilter }}
        />
      )}
      <ConfirmDialog
        open={openPublishAll.open}
        title={openPublishAll.title}
        content={openPublishAll.content}
        onCancel={handlePublishCancel}
        onConfirm={handlePublishOk}
      />
    </DatabaseExperimentsWrapper>
  )
}

const DatabaseExperimentsWrapper = styled(Box)(() => ({
  width: "100%",
  height: "calc(100vh - 220px)",
  display: "flex",
  flexDirection: "column",
}))

const Content = styled("textarea")(() => ({
  width: 400,
  height: 300,
  whiteSpace: "pre-wrap",
}))

const WrapperIcons = styled(Box, {
  shouldForwardProp: (props) => props !== "check",
})<{ check: boolean }>(() => ({
  display: "flex",
  justifyContent: "end",
  gap: 10,
  height: 50,
  svg: {
    width: 35,
    height: 35,
  },
  button: {
    height: 50,
    width: 50,
  },
  "button: hover": {
    backgroundColor: "#1976d257",
  },
}))

export const SpanCustom = styled("span")(() => ({
  display: "inline-block",
  textOverflow: "ellipsis",
  overflow: "hidden",
}))

export default DatabaseExperiments
