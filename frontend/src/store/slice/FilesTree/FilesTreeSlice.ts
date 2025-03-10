import { enqueueSnackbar } from "notistack"

import { createSlice } from "@reduxjs/toolkit"

import { FILE_TREE_TYPE_SET } from "api/files/Files"
import { getFilesTree, deleteFile } from "store/slice/FilesTree/FilesTreeAction"
import {
  FilesTree,
  FILES_TREE_SLICE_NAME,
} from "store/slice/FilesTree/FilesTreeType"
import { convertToTreeNodeType } from "store/slice/FilesTree/FilesTreeUtils"
import { uploadFile } from "store/slice/FileUploader/FileUploaderActions"
import { FILE_TYPE_SET } from "store/slice/InputNode/InputNodeType"
import { importSampleData } from "store/slice/Workflow/WorkflowActions"

export const initialState: FilesTree = {}
export const filesTreeSlice = createSlice({
  name: FILES_TREE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFilesTree.pending, (state, action) => {
        const { fileType } = action.meta.arg
        state[fileType] = {
          ...state[fileType],
          isLoading: true,
          isLatest: false,
        }
      })
      .addCase(getFilesTree.fulfilled, (state, action) => {
        const { fileType } = action.meta.arg
        state[fileType].tree = convertToTreeNodeType(action.payload)
        state[fileType].isLatest = true
        state[fileType].isLoading = false
      })
      .addCase(deleteFile.pending, (state, action) => {
        const { fileType } = action.meta.arg
        state[fileType] = {
          ...state[fileType],
          isLoading: true,
          isLatest: false,
        }
      })
      .addCase(deleteFile.rejected, (state, action) => {
        const { fileType } = action.meta.arg
        state[fileType] = {
          ...state[fileType],
          isLoading: false,
          isLatest: true,
        }
        enqueueSnackbar("Failed to delete file", { variant: "error" })
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        const { fileType, fileName } = action.meta.arg
        const fileTree = state[fileType].tree
        state[fileType].tree = fileTree.filter((node) => node.name !== fileName)
        state[fileType].isLoading = false
        state[fileType].isLatest = true
      })
      .addCase(uploadFile.pending, (state, action) => {
        const { fileType } = action.meta.arg
        if (fileType === FILE_TYPE_SET.IMAGE) {
          if (state[FILE_TREE_TYPE_SET.IMAGE] != null) {
            state[FILE_TREE_TYPE_SET.IMAGE].isLatest = false
          } else {
            state[FILE_TREE_TYPE_SET.IMAGE] = {
              isLoading: false,
              isLatest: false,
              tree: [],
            }
          }
        } else if (fileType === FILE_TYPE_SET.CSV) {
          if (state[FILE_TREE_TYPE_SET.CSV] != null) {
            state[FILE_TREE_TYPE_SET.CSV].isLatest = false
          } else {
            state[FILE_TREE_TYPE_SET.CSV] = {
              isLoading: false,
              isLatest: false,
              tree: [],
            }
          }
        } else if (fileType === FILE_TYPE_SET.HDF5) {
          if (state[FILE_TREE_TYPE_SET.HDF5] != null) {
            state[FILE_TREE_TYPE_SET.HDF5].isLatest = false
          } else {
            state[FILE_TREE_TYPE_SET.HDF5] = {
              isLoading: false,
              isLatest: false,
              tree: [],
            }
          }
        } else if (fileType === FILE_TYPE_SET.MATLAB) {
          if (state[FILE_TREE_TYPE_SET.MATLAB] != null) {
            state[FILE_TREE_TYPE_SET.MATLAB].isLatest = false
          } else {
            state[FILE_TREE_TYPE_SET.MATLAB] = {
              isLoading: false,
              isLatest: false,
              tree: [],
            }
          }
        } else if (fileType === FILE_TYPE_SET.EXPDB) {
          if (state[FILE_TREE_TYPE_SET.EXPDB] != null) {
            state[FILE_TREE_TYPE_SET.EXPDB].isLatest = false
          } else {
            state[FILE_TREE_TYPE_SET.EXPDB] = {
              isLoading: false,
              isLatest: false,
              tree: [],
            }
          }
        } else {
          if (state[FILE_TREE_TYPE_SET.ALL] != null) {
            state[FILE_TREE_TYPE_SET.ALL].isLatest = false
          } else {
            state[FILE_TREE_TYPE_SET.ALL] = {
              isLoading: false,
              isLatest: false,
              tree: [],
            }
          }
        }
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        const { fileType } = action.meta.arg
        if (fileType === FILE_TYPE_SET.IMAGE) {
          state[FILE_TREE_TYPE_SET.IMAGE].isLatest = false
        } else if (fileType === FILE_TYPE_SET.CSV) {
          state[FILE_TREE_TYPE_SET.CSV].isLatest = false
        } else if (fileType === FILE_TYPE_SET.HDF5) {
          state[FILE_TREE_TYPE_SET.HDF5].isLatest = false
        } else if (fileType === FILE_TYPE_SET.MATLAB) {
          state[FILE_TREE_TYPE_SET.MATLAB].isLatest = false
        } else if (fileType === FILE_TYPE_SET.EXPDB) {
          state[FILE_TREE_TYPE_SET.EXPDB].isLatest = false
        } else {
          state[FILE_TREE_TYPE_SET.ALL].isLatest = false
        }
      })
      .addCase(importSampleData.fulfilled, (state) => {
        ;[
          FILE_TREE_TYPE_SET.IMAGE,
          FILE_TREE_TYPE_SET.CSV,
          FILE_TREE_TYPE_SET.HDF5,
          FILE_TREE_TYPE_SET.ALL,
        ].forEach((fileType) => {
          if (state[fileType] != null) {
            state[fileType].isLatest = false
          }
        })
      })
  },
})

export default filesTreeSlice.reducer
