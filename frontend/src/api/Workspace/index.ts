import axios from "utils/axios"

export type Data = {
  name?: string
  id?: number
}

export const getWorkspacesApi = async () => {
  const response = await axios.get(`/workspaces`)
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