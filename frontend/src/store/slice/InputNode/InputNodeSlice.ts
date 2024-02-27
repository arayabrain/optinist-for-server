import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit"

import { isInputNodePostData } from "api/run/RunUtils"
import { INITIAL_IMAGE_ELEMENT_ID } from "const/flowchart"
import { uploadFile } from "store/slice/FileUploader/FileUploaderActions"
import { addInputNode } from "store/slice/FlowElement/FlowElementActions"
import {
  clearFlowElements,
  deleteFlowNodes,
  deleteFlowNodeById,
} from "store/slice/FlowElement/FlowElementSlice"
import { NODE_TYPE_SET } from "store/slice/FlowElement/FlowElementType"
import { setInputNodeFilePath } from "store/slice/InputNode/InputNodeActions"
import {
  CsvInputParamType,
  FILE_TYPE_SET,
  InputNode,
  INPUT_NODE_SLICE_NAME,
} from "store/slice/InputNode/InputNodeType"
import {
  isCsvInputNode,
  isHDF5InputNode,
  isMatlabInputNode,
} from "store/slice/InputNode/InputNodeUtils"
import {
  reproduceWorkflow,
  importWorkflowConfig,
  fetchWorkflow,
} from "store/slice/Workflow/WorkflowActions"

const initialState: InputNode = {
  [INITIAL_IMAGE_ELEMENT_ID]: {
    fileType: FILE_TYPE_SET.EXPDB,
    param: {},
  },
}

export const inputNodeSlice = createSlice({
  name: INPUT_NODE_SLICE_NAME,
  initialState,
  reducers: {
    deleteInputNode(state, action: PayloadAction<string>) {
      delete state[action.payload]
    },
    setCsvInputNodeParam(
      state,
      action: PayloadAction<{
        nodeId: string
        param: CsvInputParamType
      }>,
    ) {
      const { nodeId, param } = action.payload
      const inputNode = state[nodeId]
      if (isCsvInputNode(inputNode)) {
        inputNode.param = param
      }
    },
    setInputNodeMatlabPath(
      state,
      action: PayloadAction<{
        nodeId: string
        path: string
      }>,
    ) {
      const { nodeId, path } = action.payload
      const item = state[nodeId]
      if (isMatlabInputNode(item)) {
        item.matPath = path
      }
    },
    setInputNodeHDF5Path(
      state,
      action: PayloadAction<{
        nodeId: string
        path: string
      }>,
    ) {
      const { nodeId, path } = action.payload
      const item = state[nodeId]
      if (isHDF5InputNode(item)) {
        item.hdf5Path = path
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(setInputNodeFilePath, (state, action) => {
        const { nodeId, filePath } = action.payload
        const targetNode = state[nodeId]
        targetNode.selectedFilePath = filePath
        if (isHDF5InputNode(targetNode)) {
          targetNode.hdf5Path = undefined
        }
      })
      .addCase(addInputNode, (state, action) => {
        const { node, fileType } = action.payload
        if (node.data?.type === NODE_TYPE_SET.INPUT) {
          switch (fileType) {
            case FILE_TYPE_SET.CSV:
              state[node.id] = {
                fileType,
                param: {
                  setHeader: null,
                  setIndex: false,
                  transpose: false,
                },
              }
              break
            case FILE_TYPE_SET.IMAGE:
              state[node.id] = {
                fileType,
                param: {},
              }
              break
            case FILE_TYPE_SET.HDF5:
              state[node.id] = {
                fileType,
                param: {},
              }
              break
            case FILE_TYPE_SET.FLUO:
              state[node.id] = {
                fileType: FILE_TYPE_SET.CSV,
                param: {
                  setHeader: null,
                  setIndex: false,
                  transpose: false,
                },
              }
              break
            case FILE_TYPE_SET.BEHAVIOR:
              state[node.id] = {
                fileType: FILE_TYPE_SET.CSV,
                param: {
                  setHeader: null,
                  setIndex: false,
                  transpose: false,
                },
              }
              break
            case FILE_TYPE_SET.MATLAB:
              state[node.id] = {
                fileType,
                param: {},
              }
              break
            case FILE_TYPE_SET.MICROSCOPE:
              state[node.id] = {
                fileType,
                param: {},
              }
              break
            case FILE_TYPE_SET.EXPDB:
              state[node.id] = {
                fileType,
                param: {},
              }
              break
          }
        }
      })
      .addCase(clearFlowElements, () => initialState)
      .addCase(deleteFlowNodes, (state, action) => {
        action.payload.forEach((node) => {
          if (node.data?.type === NODE_TYPE_SET.INPUT) {
            delete state[node.id]
          }
        })
      })
      .addCase(deleteFlowNodeById, (state, action) => {
        if (Object.keys(state).includes(action.payload)) {
          delete state[action.payload]
        }
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        const { nodeId } = action.meta.arg
        if (nodeId != null) {
          const { resultPath } = action.payload
          const target = state[nodeId]
          if (target.fileType === FILE_TYPE_SET.IMAGE) {
            target.selectedFilePath = [resultPath]
          } else {
            target.selectedFilePath = resultPath
          }
        }
      })
      .addCase(fetchWorkflow.rejected, () => initialState)
      .addCase(importWorkflowConfig.fulfilled, (_, action) => {
        const newState: InputNode = {}
        Object.values(action.payload.nodeDict)
          .filter(isInputNodePostData)
          .forEach((node) => {
            if (node.data != null) {
              if (node.data.fileType === FILE_TYPE_SET.IMAGE) {
                newState[node.id] = {
                  fileType: FILE_TYPE_SET.IMAGE,
                  param: {},
                }
              } else if (node.data.fileType === FILE_TYPE_SET.CSV) {
                newState[node.id] = {
                  fileType: FILE_TYPE_SET.CSV,
                  param: node.data.param as CsvInputParamType,
                }
              } else if (node.data.fileType === FILE_TYPE_SET.MATLAB) {
                newState[node.id] = {
                  fileType: FILE_TYPE_SET.MATLAB,
                  param: {},
                }
              } else if (node.data.fileType === FILE_TYPE_SET.HDF5) {
                newState[node.id] = {
                  fileType: FILE_TYPE_SET.HDF5,
                  param: {},
                }
              } else if (node.data.fileType === FILE_TYPE_SET.MICROSCOPE) {
                newState[node.id] = {
                  fileType: FILE_TYPE_SET.MICROSCOPE,
                  param: {},
                }
              } else if (node.data.fileType === FILE_TYPE_SET.EXPDB) {
                newState[node.id] = {
                  fileType: FILE_TYPE_SET.EXPDB,
                  param: {},
                }
              }
            }
          })
        return newState
      })
      .addMatcher(
        isAnyOf(fetchWorkflow.fulfilled, reproduceWorkflow.fulfilled),
        (_, action) => {
          const newState: InputNode = {}
          Object.values(action.payload.nodeDict)
            .filter(isInputNodePostData)
            .forEach((node) => {
              if (node.data != null) {
                if (node.data.fileType === FILE_TYPE_SET.IMAGE) {
                  newState[node.id] = {
                    fileType: FILE_TYPE_SET.IMAGE,
                    selectedFilePath: node.data.path as string[],
                    param: {},
                  }
                } else if (node.data.fileType === FILE_TYPE_SET.CSV) {
                  newState[node.id] = {
                    fileType: FILE_TYPE_SET.CSV,
                    selectedFilePath: node.data.path as string,
                    param: node.data.param as CsvInputParamType,
                  }
                } else if (node.data.fileType === FILE_TYPE_SET.MATLAB) {
                  newState[node.id] = {
                    fileType: FILE_TYPE_SET.MATLAB,
                    matPath: node.data.matPath,
                    selectedFilePath: node.data.path as string,
                    param: {},
                  }
                } else if (node.data.fileType === FILE_TYPE_SET.HDF5) {
                  newState[node.id] = {
                    fileType: FILE_TYPE_SET.HDF5,
                    hdf5Path: node.data.hdf5Path,
                    selectedFilePath: node.data.path as string,
                    param: {},
                  }
                } else if (node.data.fileType === FILE_TYPE_SET.MICROSCOPE) {
                  newState[node.id] = {
                    fileType: FILE_TYPE_SET.MICROSCOPE,
                    selectedFilePath: node.data.path as string,
                    param: {},
                  }
                } else if (node.data.fileType === FILE_TYPE_SET.EXPDB) {
                  newState[node.id] = {
                    fileType: FILE_TYPE_SET.EXPDB,
                    selectedFilePath: node.data.path as string,
                    param: {},
                  }
                }
              }
            })
          return newState
        },
      ),
})

export const {
  setCsvInputNodeParam,
  setInputNodeMatlabPath,
  setInputNodeHDF5Path,
} = inputNodeSlice.actions

export default inputNodeSlice.reducer
