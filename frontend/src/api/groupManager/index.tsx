import qs from "qs";
import axios from "../../utils/axios";
import {
  GroupManagerDTO,
  GroupManagerParams,
  ItemGroupManage,
  UserInGroup
} from "../../store/slice/GroupManager/GroupManagerType";

export const getGroupsManagerApi = async (params: GroupManagerParams): Promise<GroupManagerDTO> => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/group?${paramsNew}`)
  return response.data
}

export const postGroupManagerApi = async (name: string): Promise<GroupManagerDTO> => {
  const data = {name}
  const response = await axios.post(`/group`, data)
  return response.data
}

export const getGroupManagerApi = async (id: number): Promise<GroupManagerDTO> => {
  const response = await axios.get(`/group/${id}`)
  return response.data
}

export const changeNameGroupManagerApi = async (id: number, name: string): Promise<GroupManagerDTO> => {
  const response = await axios.put(`/group/${id}`, {name})
  return response.data
}

export const deleteGroupManagerApi = async (id: number): Promise<GroupManagerDTO> => {
  const response = await axios.delete(`/group/${id}`)
  return response.data
}

export const postListSetApi = async (data: number[], params: number): Promise<GroupManagerDTO> => {
  const response = await axios.post(`/group/users?group_id=${params}`, data)
  return response.data
}

export const getListUserGroupApi = async (id: number): Promise<UserInGroup[]> => {
  const response = await axios.get(`/group/users/search?group_id=${id}`)
  return response.data
}

export const getListSearchGroupApi = async (keyword: string): Promise<ItemGroupManage[]> => {
  const response = await axios.get(`/group/search/share_groups?keyword=${keyword}`)
  return response.data
}
