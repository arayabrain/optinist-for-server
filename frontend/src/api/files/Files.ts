import axios from 'utils/axios'

import { BASE_URL } from 'const/API'

export const FILE_TREE_TYPE_SET = {
  IMAGE: 'image',
  CSV: 'csv',
  HDF5: 'hdf5',
  FLUO: 'fluo',
  BEHAVIOR: 'behavior',
  MATLAB: 'matlab',
  TC: 'tc',
  TS: 'ts',
  ALL: 'all',
} as const

export type FILE_TREE_TYPE =
  typeof FILE_TREE_TYPE_SET[keyof typeof FILE_TREE_TYPE_SET]

export type TreeNodeTypeDTO = DirNodeDTO | FileNodeDTO

export interface NodeBaseDTO {
  path: string
  name: string
  isdir: boolean
}

export interface DirNodeDTO extends NodeBaseDTO {
  isdir: true
  nodes: TreeNodeTypeDTO[]
}

export interface FileNodeDTO extends NodeBaseDTO {
  isdir: false
}

export async function getFilesTreeApi(
  workspaceId: number,
  fileType: FILE_TREE_TYPE,
): Promise<TreeNodeTypeDTO[]> {
  const response = await axios.get(`${BASE_URL}/files/${workspaceId}`, {
    params: {
      file_type: fileType,
    },
  })
  return response.data
}

export async function uploadFileApi(
  workspaceId: number,
  fileName: string,
  config: {
    onUploadProgress: (progressEvent: any) => void
  },
  formData: FormData,
): Promise<{ file_path: string }> {
  const response = await axios.post(
    `${BASE_URL}/files/${workspaceId}/upload/${fileName}`,
    formData,
    config,
  )
  return response.data
}
