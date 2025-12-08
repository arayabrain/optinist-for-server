import {
  CsvInputNode,
  ImageInputNode,
  HDF5InputNode,
  ExpDbInputNode,
  InputNodeType,
  FILE_TYPE_SET,
  FILE_TYPE,
  MatlabInputNode,
  MicroscopeInputNode,
  MicroscopeExpdbInputNode,
  ExpdbBatchMicroscopeExpdbInputNode,
} from "store/slice/InputNode/InputNodeType"

/**
 * File type migration mapping for backward compatibility
 * Maps deprecated file type keys to their current equivalents
 */
const FILE_TYPE_MIGRATION_MAP: Record<string, FILE_TYPE> = {
  expdb: FILE_TYPE_SET.EXPDB, // "expdb" -> "standard_expdb"
}

/**
 * Normalize file type for backward compatibility
 * Converts deprecated file type keys to their current equivalents
 * @param fileType - The file type (possibly deprecated)
 * @returns The normalized file type
 */
export function normalizeFileType(fileType: string): string {
  return FILE_TYPE_MIGRATION_MAP[fileType] || fileType
}

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

export function isMatlabInputNode(
  inputNode: InputNodeType,
): inputNode is MatlabInputNode {
  return inputNode.fileType === FILE_TYPE_SET.MATLAB
}

export function isHDF5InputNode(
  inputNode: InputNodeType,
): inputNode is HDF5InputNode {
  return inputNode.fileType === FILE_TYPE_SET.HDF5
}

export function isMicroscopeInputNode(
  inputNode: InputNodeType,
): inputNode is MicroscopeInputNode {
  return inputNode.fileType === FILE_TYPE_SET.MICROSCOPE
}

export function isMicroscopeExpDbInputNode(
  inputNode: InputNodeType,
): inputNode is MicroscopeExpdbInputNode {
  return inputNode.fileType === FILE_TYPE_SET.MICROSCOPE_EXPDB
}

export function isExpDbInputNode(
  inputNode: InputNodeType,
): inputNode is ExpDbInputNode {
  return inputNode.fileType === FILE_TYPE_SET.EXPDB
}

export function isExpdbBatchMicroscopeExpDbInputNode(
  inputNode: InputNodeType,
): inputNode is ExpdbBatchMicroscopeExpdbInputNode {
  return inputNode.fileType === FILE_TYPE_SET.EXPDB_BATCH_MICROSCOPE_EXPDB
}
