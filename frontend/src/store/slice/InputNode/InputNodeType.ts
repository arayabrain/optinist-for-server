export const INPUT_NODE_SLICE_NAME = 'inputNode'

export const FILE_TYPE_SET = {
  CSV: 'csv',
  IMAGE: 'image',
  HDF5: 'hdf5',
  FLUO: 'fluo',
  BEHAVIOR: 'behavior',
  MATLAB: 'matlab',
  TC: 'tc',
  TS: 'ts',
} as const

export type FILE_TYPE = typeof FILE_TYPE_SET[keyof typeof FILE_TYPE_SET]

export type InputNode = {
  [nodeId: string]: InputNodeType
}

export type InputNodeType =
  | CsvInputNode
  | ImageInputNode
  | HDF5InputNode
  | MatlabInputNode

interface InputNodeBaseType<
  T extends FILE_TYPE,
  P extends { [key: string]: unknown },
> {
  fileType: T
  selectedFilePath?: string | string[]
  param: P
}

export type CsvInputParamType = {
  setHeader: number | null
  setIndex: boolean
  transpose: boolean
}

export interface CsvInputNode
  extends InputNodeBaseType<'csv', CsvInputParamType> {
  selectedFilePath?: string
}

export interface ImageInputNode extends InputNodeBaseType<'image', {}> {
  selectedFilePath?: string[]
}

export interface HDF5InputNode extends InputNodeBaseType<'hdf5', {}> {
  selectedFilePath?: string
  hdf5Path?: string
}

export type MatlabInputParamType = {
  fieldName?: string
  index?: number[]
}

export interface MatlabInputNode
  extends InputNodeBaseType<'matlab' | 'tc' | 'ts', MatlabInputParamType> {
  selectedFilePath?: string
}
