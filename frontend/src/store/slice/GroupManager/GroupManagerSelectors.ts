import { RootState } from "store/store"

export const selectGroupManager = (state: RootState) =>
  state.groupManager.groupsManagerData
export const selectLoadingGroupManager = (state: RootState) =>
  state.groupManager.loading
export const selectListUserGroup = (state: RootState) =>
  state.groupManager.listUserGroup

export const selectListSearchGroup = (state: RootState) =>
  state.groupManager.listSearchGroup
