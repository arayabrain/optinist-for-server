import { DatabaseDTO, DatabaseParams, ListShareDTO } from 'store/slice/Database/DatabaseType'
import axios from 'utils/axios'
import qs from 'qs'

export const getExperimentsPublicApi = async (params: DatabaseParams): Promise<DatabaseDTO> => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/public/experiments?${paramsNew}`)
  return response.data
}

export const getCellsPublicApi = async (params: DatabaseParams): Promise<DatabaseDTO> => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/public/cells?${paramsNew}`)
  return response.data
}

export const getExperimentsApi = async (params: DatabaseParams): Promise<DatabaseDTO> => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/expdb/experiments?${paramsNew}`)
  return response.data
}

export const getCellsApi = async (params: DatabaseParams): Promise<DatabaseDTO> => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/expdb/cells?${paramsNew}`)
  return response.data
}

export const postPublishApi = async (id: number, status: 'on' | 'off'): Promise<boolean> => {
  const response = await axios.post(`/expdb/experiment/publish/${id}/${status}`)
  return response.data
}

export const getListUserShareApi = async (id: number): Promise<ListShareDTO> => {
  const response = await axios.get(`/expdb/share/${id}/status`)
  return response.data
}

export const postListUserShareApi = async (id: number, data: {share_type: number; user_ids: number[]}): Promise<boolean> => {
  const response = await axios.post(`/expdb/share/${id}/status`, data)
  return response.data
}
