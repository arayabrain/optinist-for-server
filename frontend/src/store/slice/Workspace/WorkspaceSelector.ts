import { RootState } from 'store/store'

export const selectWorkspace = (state: RootState) => state.workspace
export const selectWorkspaceData = (state: RootState) => state.workspace.workspace

export const selectActiveTab = (state: RootState) =>
  state.workspace.currentWorkspace.selectedTab

export const selectCurrentWorkspaceId = (state: RootState) =>
  state.workspace.currentWorkspace.workspaceId

export const selectIsLoadingWorkspaceList = (state: RootState) =>
  state.workspace.loading
