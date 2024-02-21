import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  getCellsApi,
  getCellsPublicApi,
  getExperimentsApi,
  getExperimentsPublicApi,
  getListShareApi,
  getOptionsFilterApi,
  postListUserShareApi,
  postMultiShareApi,
  postPublishAllApi,
  postPublishApi,
} from "api/database"
import {
  DATABASE_SLICE_NAME,
  DatabaseDTO,
  DatabaseParams,
  FilterParams,
  ListShareDTO,
  MultiShareType,
} from "store/slice/Database/DatabaseType"

export const getExperimentsDatabase = createAsyncThunk<
  DatabaseDTO,
  DatabaseParams
>(`${DATABASE_SLICE_NAME}/getExperimentsList`, async (params, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getExperimentsApi(params)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getCellsDatabase = createAsyncThunk<DatabaseDTO, DatabaseParams>(
  `${DATABASE_SLICE_NAME}/getCellsList`,
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await getCellsApi(params)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const getExperimentsPublicDatabase = createAsyncThunk<
  DatabaseDTO,
  DatabaseParams
>(
  `${DATABASE_SLICE_NAME}/getExperimentsPublicList`,
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await getExperimentsPublicApi(params)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const getCellsPublicDatabase = createAsyncThunk<
  DatabaseDTO,
  DatabaseParams
>(`${DATABASE_SLICE_NAME}/getCellsPublicList`, async (params, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getCellsPublicApi(params)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const postPublish = createAsyncThunk<
  boolean,
  { id: number; status: "on" | "off"; params: DatabaseParams }
>(`${DATABASE_SLICE_NAME}/postPublish`, async (params, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  try {
    const response = await postPublishApi(params.id, params.status)
    await dispatch(getExperimentsDatabase(params.params))
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getListShare = createAsyncThunk<ListShareDTO, { id: number }>(
  `${DATABASE_SLICE_NAME}/getListUserShare`,
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await getListShareApi(params.id)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const postListUserShare = createAsyncThunk<
  boolean,
  {
    id: number
    data: { share_type: number; group_ids?: number[]; user_ids: number[] }
  }
>(`${DATABASE_SLICE_NAME}/postListUserShare`, async (params, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await postListUserShareApi(params.id, params.data)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const postPublishAll = createAsyncThunk<
  boolean,
  { status: "on" | "off"; params: DatabaseParams; listCheck: number[] }
>(`${DATABASE_SLICE_NAME}/postPublishAll`, async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  const { status, listCheck, params } = data
  try {
    const response = await postPublishAllApi(status, listCheck)
    await dispatch(getExperimentsDatabase(params))
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const postMultiShare = createAsyncThunk<
  boolean,
  { params: DatabaseParams; dataPost: MultiShareType }
>(`${DATABASE_SLICE_NAME}/postMultiShare`, async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  try {
    const response = await postMultiShareApi(data.dataPost)
    await dispatch(getExperimentsDatabase(data.params))
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getOptionsFilter = createAsyncThunk<FilterParams>(
  `${DATABASE_SLICE_NAME}/getOptionsFilter`,
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await getOptionsFilterApi()
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
