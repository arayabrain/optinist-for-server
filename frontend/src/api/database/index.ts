import { stringify } from "qs"

import {
  DatabaseDTO,
  DatabaseParams,
  ListShareDTO,
  MultiShareType,
} from "store/slice/Database/DatabaseType"
import axios from "utils/axios"

export const getExperimentsPublicApi = async (
  params: DatabaseParams,
): Promise<DatabaseDTO> => {
  const paramsNew = stringify(params, { indices: false })
  const response = await axios.get(`/public/experiments?${paramsNew}`)
  return response.data
}

export const getCellsPublicApi = async (
  params: DatabaseParams,
): Promise<DatabaseDTO> => {
  const paramsNew = stringify(params, { indices: false })
  const response = await axios.get(`/public/cells?${paramsNew}`)
  return response.data
}

export const getExperimentsApi = async (
  params: DatabaseParams,
): Promise<DatabaseDTO> => {
  const paramsNew = stringify(params, { indices: false })
  const response = await axios.get(`/expdb/experiments?${paramsNew}`)
  return response.data
}

export const getCellsApi = async (
  params: DatabaseParams,
): Promise<DatabaseDTO> => {
  const paramsNew = stringify(params, { indices: false })
  const response = await axios.get(`/expdb/cells?${paramsNew}`)
  return response.data
}

export const postPublishApi = async (
  id: number,
  status: "on" | "off",
): Promise<boolean> => {
  const response = await axios.post(`/expdb/experiment/publish/${id}/${status}`)
  return response.data
}

export const getListShareApi = async (id: number): Promise<ListShareDTO> => {
  const response = await axios.get(`/expdb/share/${id}/status`)
  return response.data
}

export const postListUserShareApi = async (
  id: number,
  data: { share_type: number; user_ids: number[]; group_ids?: number[] },
): Promise<boolean> => {
  const response = await axios.post(`/expdb/share/${id}/status`, data)
  return response.data
}

export const postPublishAllApi = async (
  status: "on" | "off",
  data: number[],
): Promise<boolean> => {
  const response = await axios.post(
    `expdb/experiment/multiple/publish/${status}`,
    data,
  )
  return response.data
}

export const postMultiShareApi = async (
  data: MultiShareType,
): Promise<boolean> => {
  const response = await axios.post("expdb/multiple/share/status", data)
  return response.data
}

export const putAttributesApi = async (
  id: number,
  data: string,
): Promise<boolean> => {
  const response = await axios.put(`expdb/experiment/metadata/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data
}
