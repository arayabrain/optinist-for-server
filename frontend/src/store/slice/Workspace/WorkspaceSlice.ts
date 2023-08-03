import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { WORKSPACE_SLICE_NAME, Workspace } from './WorkspaceType'
import { importExperimentByUid } from '../Experiments/ExperimentsActions'
import {
  delWorkspace,
  getListUserShareWorkSpaces,
  getWorkspaceList,
  postListUserShareWorkspaces,
  postWorkspace,
  putWorkspace,
} from './WorkspacesActions'

const initialState: Workspace = {
  currentWorkspace: {
    selectedTab: 0,
  },
  workspace: {
    items: [],
    total: 0,
    limit: 50,
    offset: 0,
  },
  loading: false,
  listUserShare: undefined
}

export const workspaceSlice = createSlice({
  name: WORKSPACE_SLICE_NAME,
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.currentWorkspace.selectedTab = action.payload
    },
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspace.workspaceId = action.payload
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = {
        selectedTab: 0,
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(importExperimentByUid.fulfilled, (state, action) => {
        state.currentWorkspace.workspaceId = action.meta.arg.workspaceId
      })
      .addCase(getWorkspaceList.fulfilled, (state, action) => {
        state.workspace = action.payload
        state.loading = false
      })
      .addCase(getListUserShareWorkSpaces.fulfilled, (state, action) => {
        state.listUserShare = action.payload
        state.loading = false
      })
      .addMatcher(
        isAnyOf(
          getWorkspaceList.rejected,
          postWorkspace.fulfilled,
          postWorkspace.rejected,
          putWorkspace.fulfilled,
          putWorkspace.rejected,
          delWorkspace.fulfilled,
          delWorkspace.rejected,
          getListUserShareWorkSpaces.rejected,
          postListUserShareWorkspaces.rejected
        ),
        (state) => {
          state.loading = false
        },
      )
      .addMatcher(
        isAnyOf(
          getWorkspaceList.pending,
          postWorkspace.pending,
          putWorkspace.pending,
          delWorkspace.pending,
          getListUserShareWorkSpaces.pending,
          postListUserShareWorkspaces.pending
        ),
        (state) => {
          state.loading = true
        },
      )
  },
})

export const { setCurrentWorkspace, clearCurrentWorkspace, setActiveTab } =
  workspaceSlice.actions
export default workspaceSlice.reducer
