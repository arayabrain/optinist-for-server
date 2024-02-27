import { CSSProperties } from "react"

export const INITIAL_IMAGE_ELEMENT_ID = "input_0"
export const INITIAL_IMAGE_ELEMENT_NAME = "NoName"
export const NANO_ID_LENGTH = 10
export const ALGO_NODE_STYLE: CSSProperties = {
  border: "1px solid #777",
  height: 140,
  width: 250,
  padding: 0,
  borderRadius: 0,
} as const

export const DATA_NODE_STYLE: CSSProperties = {
  border: "1px solid #777",
  height: 140,
  width: 250,
} as const

export const HANDLE_STYLE: CSSProperties = {
  height: "13%",
  width: "3%",
  border: "1px solid",
  borderColor: "#555",
  borderRadius: 0,
  top: 15,
}

export const REACT_FLOW_NODE_TYPE_KEY = {
  ImageFileNode: "ImageFileNode",
  CsvFileNode: "CsvFileNode",
  HDF5FileNode: "HDF5FileNode",
  FluoFileNode: "FluoFileNode",
  AlgorithmNode: "AlgorithmNode",
  BehaviorFileNode: "BehaviorFileNode",
  MatlabFileNode: "MatlabFileNode",
  MicroscopeFileNode: "MicroscopeFileNode",
  ExpDbNode: "ExpDbNode",
} as const

export type REACT_FLOW_NODE_TYPE =
  (typeof REACT_FLOW_NODE_TYPE_KEY)[keyof typeof REACT_FLOW_NODE_TYPE_KEY]
