import { ParamMap } from "utils/param/ParamType"

export const ALGORITHM_NODE_SLICE_NAME = "algorithmNode"

export type AlgorithmNode = {
  [nodeId: string]: AlgorithmNodeType
}

export type TDim = { start?: number; end?: number }

export type TDataFilterParam = {
  dim1?: TDim[]
  dim2?: TDim[]
  dim3?: TDim[]
  roi?: TDim[]
}

type AlgorithmNodeType = {
  functionPath: string
  name: string
  params: ParamMap | null
  dataFilterParam?: TDataFilterParam
  originalValue: unknown
  isUpdate: boolean
  isUpdateFilter?: boolean
}
