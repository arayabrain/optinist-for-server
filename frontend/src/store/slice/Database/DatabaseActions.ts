import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  DATABASE_SLICE_NAME,
  DatabaseDTO,
  DatabaseParams,
} from './DatabaseType'
import {
  getCellsApi,
  getCellsPublicApi,
  getExperimentsApi,
  getExperimentsPublicApi,
  getListUserShareApi,
  postPublistApi,
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

export const postPublist = createAsyncThunk<
    DatabaseDTO,
    {id: number, status: "on" | "off"}
>(`${DATABASE_SLICE_NAME}/postPublist`, async (params, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await postPublistApi(params.id, params.status)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getListUserShare = createAsyncThunk<
    DatabaseDTO,
    {id: number}
>(`${DATABASE_SLICE_NAME}/getListUserShare`, async (params, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getListUserShareApi(params.id)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})


