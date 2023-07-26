import { DatabaseParams } from 'store/slice/Database/DatabaseType'
import axios from 'utils/axios'
import qs from 'qs'

export const getExperimentsPublicApi = async (params: DatabaseParams) => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/public/experiments?${paramsNew}`)
  return response.data
}

export const getCellsPublicApi = async (params: DatabaseParams) => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/public/cells?${paramsNew}`)
  return response.data
}

export const getExperimentsApi = async (params: DatabaseParams) => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/expdb/experiments?${paramsNew}`)
  return response.data
}

export const getCellsApi = async (params: DatabaseParams) => {
  const paramsNew = qs.stringify(params, { indices: false })
  const response = await axios.get(`/expdb/cells?${paramsNew}`)
  return response.data
}

export const postPublistApi = async (id: number, status: 'on' | 'off') => {
  const response = await axios.post(`/expdb/experiment/publish/${id}/${status}`)
  return response.data
}
