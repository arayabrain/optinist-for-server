import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { WORKSPACE_SLICE_NAME, Workspace } from './WorkspaceType'
import { importExperimentByUid } from '../Experiments/ExperimentsActions'
import {delWorkspace, getWorkspaceList, postWorkspace, putWorkspace } from './WorkspacesActions'

const initialState: Workspace = {
  workspaces: [{ workspace_id: 'default' }],
  currentWorkspace: {
    selectedTab: 0,
  },
  data: {
    items: [],
    total: 0,
    limit: 50,
    offset: 0
  },
  loading: false,
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
    .addCase(getWorkspaceList.pending, (state, action) => {
      state.loading = true
    })
    .addCase(getWorkspaceList.fulfilled, (state, action) => {
      state.data = action.payload
      state.loading = false
    })
    .addCase(getWorkspaceList.rejected, (state, action) => {
      state.loading = false
    })
    .addCase(postWorkspace.pending, (state, action) => {
      state.loading = true
    })
    .addCase(postWorkspace.fulfilled, (state, action) => {
      state.loading = false
    })
    .addCase(postWorkspace.rejected, (state, action) => {
      state.loading = false
    })
    .addCase(putWorkspace.pending, (state, action) => {
      state.loading = true
    })
    .addCase(putWorkspace.fulfilled, (state, action) => {
      state.loading = false
    })
    .addCase(putWorkspace.rejected, (state, action) => {
      state.loading = false
    })
    .addCase(delWorkspace.pending, (state, action) => {
      state.loading = true
    })
    .addCase(delWorkspace.fulfilled, (state, action) => {
      state.loading = false
    })
    .addCase(delWorkspace.rejected, (state, action) => {
      state.loading = false
    })
    // TODO: add case for set loading on get workspaces pending
  },
})

export const { setCurrentWorkspace, clearCurrentWorkspace, setActiveTab } =
  workspaceSlice.actions
export default workspaceSlice.reducer
