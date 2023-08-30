import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  DATABASE_SLICE_NAME,
  DatabaseDTO,
  DatabaseParams,
  ListShareDTO,
} from './DatabaseType'
import {
  getCellsApi,
  getCellsPublicApi,
  getExperimentsApi,
  getExperimentsPublicApi,
  getListUserShareApi,
  postListUserShareApi,
  postPublishApi,
} from 'api/database'

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
  { id: number; status: 'on' | 'off'; params: DatabaseParams }
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

export const getListUserShare = createAsyncThunk<ListShareDTO, { id: number }>(
  `${DATABASE_SLICE_NAME}/getListUserShare`,
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await getListUserShareApi(params.id)
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
    data: { share_type: number; user_ids: number[] }
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
