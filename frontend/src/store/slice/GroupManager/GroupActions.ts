import {createAsyncThunk} from "@reduxjs/toolkit";
import {
  GROUP_MANAGER_SLICE_NAME,
  GroupManagerDTO,
  GroupManagerParams,
  ItemGroupManage,
  UserInGroup
} from "./GroupManagerType";
import {
  getGroupsManagerApi,
  postGroupManagerApi,
  getGroupManagerApi,
  changeNameGroupManagerApi,
  deleteGroupManagerApi, postListSetApi, getListUserGroupApi, getListSearchGroupApi
} from "../../../api/groupManager";

export const getGroupsManager = createAsyncThunk<
    GroupManagerDTO,
    GroupManagerParams
>(`${GROUP_MANAGER_SLICE_NAME}/getGroupManager`, async (params, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getGroupsManagerApi(params)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const postGroupManager = createAsyncThunk<
    GroupManagerDTO,
    string
>(`${GROUP_MANAGER_SLICE_NAME}/getGroupManager`, async (data, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await postGroupManagerApi(data)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getGroupManager = createAsyncThunk<
    GroupManagerDTO,
    number
>(`${GROUP_MANAGER_SLICE_NAME}/getGroupManager`, async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getGroupManagerApi(id)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const changeNameGroupManager = createAsyncThunk<
    GroupManagerDTO,
    {id: number, name: string}
>(`${GROUP_MANAGER_SLICE_NAME}/changeGroupManager`, async (data, thunkAPI) => {
  const { id, name } = data
  const { rejectWithValue } = thunkAPI
  try {
    const response = await changeNameGroupManagerApi(id, name)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const deleteGroupManager = createAsyncThunk<
    GroupManagerDTO,
    { id: number, params: GroupManagerParams}
>(`${GROUP_MANAGER_SLICE_NAME}/deleterGroupManager`, async (data, thunkAPI) => {
  const { id, params } = data
  const { rejectWithValue, dispatch } = thunkAPI
  try {
    const response = await deleteGroupManagerApi(id)
    await dispatch(getGroupsManager(params))
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const postListSet = createAsyncThunk<
    GroupManagerDTO,
    { list: number[], id: number, params: GroupManagerParams }
>(`${GROUP_MANAGER_SLICE_NAME}/deleterGroupManager`, async (data, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI
  const { list, id, params } = data
  try {
    const response = await postListSetApi(list, id)
    await dispatch(getGroupsManager(params))
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getListUserGroup = createAsyncThunk<
    UserInGroup[],
    number
>(`${GROUP_MANAGER_SLICE_NAME}/getListUserGroup`, async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getListUserGroupApi(id)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const getListSearchGroup = createAsyncThunk<
    ItemGroupManage[],
    string
>(`${GROUP_MANAGER_SLICE_NAME}/getListSearchGroup`, async (keyword, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const response = await getListSearchGroupApi(keyword)
    return response
  } catch (e) {
    return rejectWithValue(e)
  }
})

