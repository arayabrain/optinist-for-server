import {
  CsvInputNode,
  ImageInputNode,
  HDF5InputNode,
  InputNodeType,
  FILE_TYPE_SET,
  MatlabInputNode,
  ExpDbInputNode,
} from './InputNodeType'

export function isImageInputNode(
  inputNode: InputNodeType,
): inputNode is ImageInputNode {
  return inputNode.fileType === FILE_TYPE_SET.IMAGE
}

export function isCsvInputNode(
  inputNode: InputNodeType,
): inputNode is CsvInputNode {
  return inputNode.fileType === FILE_TYPE_SET.CSV
}

export function isHDF5InputNode(
  inputNode: InputNodeType,
): inputNode is HDF5InputNode {
  return inputNode.fileType === FILE_TYPE_SET.HDF5
}

export function isMatlabInputNode(
  inputNode: InputNodeType,
): inputNode is MatlabInputNode {
  switch (inputNode.fileType) {
    case FILE_TYPE_SET.MATLAB:
    case FILE_TYPE_SET.TC:
    case FILE_TYPE_SET.TS:
      return true
    default:
      return false
  }
}

export function isExpDbInputNode(
  inputNode: InputNodeType,
): inputNode is ExpDbInputNode {
  return inputNode.fileType === FILE_TYPE_SET.EXPDB
}
