import { DatabaseParams } from 'store/slice/Database/DatabaseType'
import axios from 'utils/axios'

export const getExperimentsPublicApi = async (params: DatabaseParams) => {
  const response = await axios.get(`/public/experiments`, { params })
  return response.data
}

export const getCellsPublicApi = async (params: DatabaseParams) => {
  const response = await axios.get(`/public/cells`, { params })
  return response.data
}

export const getExperimentsApi = async (params: DatabaseParams) => {
  const response = await axios.get(`/expdb/experiments`, { params })
  return response.data
}

export const getCellsApi = async (params: DatabaseParams) => {
  const response = await axios.get(`/expdb/cells`, { params })
  return response.data
}

export const postPublistApi = async (id: number, status: "on" | "off") => {
  const response = await axios.get(`/expdb/experiment/publish/${id}/${status}`)
  return response.data
}
