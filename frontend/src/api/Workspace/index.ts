import axios from "utils/axios"
import qs from 'qs'

export type Data = {
  name?: string
  id?: number
}

export const getWorkspacesApi = async (params: { [key: string]: number}) => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/workspaces?${paramsNew}`)
  return response.data
}

export const delWorkspaceApi = async (id: number) => {
  const response = await axios.delete(`/workspace/${id}`)
  return response.data
}

export const postWorkspaceApi = async (data: Data) => {
  const response = await axios.post(`/workspace`, data)
  return response.data
}

export const putWorkspaceApi = async (data: Data) => {
  const response = await axios.put(`/workspace/${data.id}`, {name: data.name})
  return response.data
}

export const importWorkspaceApi = async (data: Object) => {
  const response = await axios.post(`/workspace/import`, {todo_dummy: data})
  return response.data
}

export const exportWorkspaceApi = async (id: number) => {
  const response = await axios.get(`/workspace/export/${id}`)
  return response.data
}
