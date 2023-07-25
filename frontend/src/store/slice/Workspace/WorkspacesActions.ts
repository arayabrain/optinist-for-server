import { createAsyncThunk } from "@reduxjs/toolkit"
import {delWorkspaceApi, getWorkspacesApi, postWorkspaceApi, putWorkspaceApi } from "api/Workspace"
import {ItemsWorkspace, WORKSPACE_SLICE_NAME } from "./WorkspaceType"

// @ts-ignore
export const getWorkspaceList = createAsyncThunk(`${WORKSPACE_SLICE_NAME}/getWorkspaceList`, async () => {
  // const { rejectWithValue } = thunkAPI
  try {
    const response = await getWorkspacesApi()
    return response
  } catch (e) {
    return null
  }
})

export const delWorkspace = createAsyncThunk<
    boolean,
    number
>(`${WORKSPACE_SLICE_NAME}/delWorkspaceList`, async (id, thunkAPI) => {
  const { rejectWithValue,dispatch } = thunkAPI
  try {
    const response = await delWorkspaceApi(id)
    await dispatch(getWorkspaceList())
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const postWorkspace = createAsyncThunk<
    ItemsWorkspace,
    { name: string }
>(`${WORKSPACE_SLICE_NAME}/postWorkspaceList`, async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  try {
    const response = await postWorkspaceApi(data)
    await dispatch(getWorkspaceList())
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const putWorkspace = createAsyncThunk<
    ItemsWorkspace,
    { name?: string, id?: number }
>(`${WORKSPACE_SLICE_NAME}/putWorkspaceList`, async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  try {
    const response = await putWorkspaceApi(data)
    await dispatch(getWorkspaceList())
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})