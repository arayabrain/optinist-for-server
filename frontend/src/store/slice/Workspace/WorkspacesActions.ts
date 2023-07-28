import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  DataRequestEdit,
  delWorkspaceApi,
  exportWorkspaceApi,
  getWorkspacesApi,
  importWorkspaceApi,
  postWorkspaceApi,
  putWorkspaceApi,
} from 'api/Workspace'
import {
  ItemsWorkspace,
  WorkspaceDataDTO,
  WorkspaceParams,
  WORKSPACE_SLICE_NAME,
} from './WorkspaceType'

// @ts-ignore
export const getWorkspaceList = createAsyncThunk<
  WorkspaceDataDTO,
  { [key: string]: number }
>(`${WORKSPACE_SLICE_NAME}/getWorkspaceList`, async (params, thunkAPI) => {
  // const { rejectWithValue } = thunkAPI
  try {
    const response = await getWorkspacesApi(params as { [key: string]: number })
    return response
  } catch (e) {
    return null
  }
})

export const delWorkspace = createAsyncThunk<boolean, WorkspaceParams>(
  `${WORKSPACE_SLICE_NAME}/delWorkspaceList`,
  async (data, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI
    try {
      const response = await delWorkspaceApi(Number(data.id))
      await dispatch(getWorkspaceList(data.params as { [key: string]: number }))
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const postWorkspace = createAsyncThunk<ItemsWorkspace, DataRequestEdit>(
  `${WORKSPACE_SLICE_NAME}/postWorkspaceList`,
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await postWorkspaceApi(data)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const putWorkspace = createAsyncThunk<ItemsWorkspace, DataRequestEdit>(
  `${WORKSPACE_SLICE_NAME}/putWorkspaceList`,
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await putWorkspaceApi(data)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const importWorkspace = createAsyncThunk<
  ItemsWorkspace,
  { [key: string]: number }
>(`${WORKSPACE_SLICE_NAME}/importWorkspaceList`, async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  try {
    const response = await importWorkspaceApi(data)
    await dispatch(getWorkspaceList(data))
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const exportWorkspace = createAsyncThunk<ItemsWorkspace, number>(
  `${WORKSPACE_SLICE_NAME}/exportWorkspaceList`,
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await exportWorkspaceApi(id)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
