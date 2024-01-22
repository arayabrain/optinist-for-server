import { createSlice, isAnyOf } from "@reduxjs/toolkit"

import {
  deleteGroupManager,
  getGroupsManager,
  getListSearchGroup,
  getListUserGroup,
  postGroupManager,
  postListSet,
} from "store/slice/GroupManager/GroupActions"
import {
  GROUP_MANAGER_SLICE_NAME,
  GroupManager,
} from "store/slice/GroupManager/GroupManagerType"

const initialState: GroupManager = {
  groupsManagerData: {
    items: [],
    total: 0,
    limit: 50,
    offset: 0,
  },
  listUserGroup: [],
  listSearchGroup: [],
  loading: false,
}

export const groupManagerSlice = createSlice({
  name: GROUP_MANAGER_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getGroupsManager.fulfilled, (state, action) => {
        state.loading = false
        state.groupsManagerData = action.payload
      })
      .addCase(getListUserGroup.fulfilled, (state, action) => {
        state.loading = false
        state.listUserGroup = action.payload
      })
      .addCase(getListSearchGroup.fulfilled, (state, action) => {
        state.loading = false
        state.listSearchGroup = action.payload
      })
      .addMatcher(
        isAnyOf(
          getListSearchGroup.pending,
          getListUserGroup.pending,
          postListSet.pending,
          postGroupManager.pending,
          getGroupsManager.pending,
          deleteGroupManager.pending,
        ),
        (state) => {
          state.loading = true
        },
      )
      .addMatcher(
        isAnyOf(
          postListSet.fulfilled,
          getListUserGroup.rejected,
          getListSearchGroup.rejected,
          postListSet.rejected,
          postGroupManager.rejected,
          getGroupsManager.rejected,
          deleteGroupManager.rejected,
        ),
        (state) => {
          state.loading = false
        },
      )
  },
})

export default groupManagerSlice.reducer
