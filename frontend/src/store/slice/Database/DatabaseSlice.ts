import { createSlice, isAnyOf } from "@reduxjs/toolkit"

import {
  getExperimentsDatabase,
  getCellsDatabase,
  getExperimentsPublicDatabase,
  getCellsPublicDatabase,
  getListShare,
  postListUserShare,
  postPublish,
  postPublishAll,
  postMultiShare,
  putAttributes,
} from "store/slice/Database/DatabaseActions"
import {
  DATABASE_SLICE_NAME,
  DatabaseDTO,
  ListShareGroup,
  ListShareUser,
} from "store/slice/Database/DatabaseType"

const initData = {
  offset: 0,
  total: 0,
  limit: 50,
  header: {
    graph_titles: [],
  },
  items: [],
}

export type TypeData = {
  public: DatabaseDTO
  private: DatabaseDTO
}

export const initialState: {
  data: TypeData
  loading: boolean
  type: "experiment" | "cell"
  listShare?: {
    share_type: number
    users: ListShareUser[]
    groups: ListShareGroup[]
  }
  listGroupsShare?: {
    share_type: number
    users: ListShareUser[]
    groups: ListShareGroup[]
  }
} = {
  data: {
    public: initData,
    private: initData,
  },
  loading: false,
  type: "experiment",
  listShare: undefined,
  listGroupsShare: undefined,
}

export const databaseSlice = createSlice({
  name: DATABASE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExperimentsDatabase.pending, (state) => {
        if (state.type === "cell") {
          state.data.private = initData
          state.type = "experiment"
        }
        state.loading = true
      })
      .addCase(getCellsDatabase.pending, (state) => {
        if (state.type === "experiment") {
          state.data.private = initData
          state.type = "cell"
        }
        state.loading = true
      })
      .addCase(getExperimentsPublicDatabase.pending, (state) => {
        if (state.type === "cell") {
          state.data.public = initData
          state.type = "experiment"
        }
        state.loading = true
      })
      .addCase(getCellsPublicDatabase.pending, (state) => {
        if (state.type === "experiment") {
          state.data.public = initData
          state.type = "cell"
        }
        state.loading = true
      })
      .addCase(getListShare.pending, (state) => {
        state.listShare = undefined
        state.loading = true
      })
      .addMatcher(
        isAnyOf(
          postMultiShare.pending,
          postListUserShare.pending,
          postPublish.pending,
          postPublishAll.pending,
          putAttributes.pending,
        ),
        (state) => {
          state.loading = true
        },
      )
      .addMatcher(
        isAnyOf(getCellsDatabase.fulfilled, getExperimentsDatabase.fulfilled),
        (state, action) => {
          state.data.private = action.payload
          state.loading = false
        },
      )
      .addMatcher(
        isAnyOf(
          getCellsPublicDatabase.fulfilled,
          getExperimentsPublicDatabase.fulfilled,
        ),
        (state, action) => {
          state.data.public = action.payload
          state.loading = false
        },
      )
      .addMatcher(isAnyOf(getListShare.fulfilled), (state, action) => {
        state.listShare = action.payload
        state.loading = false
      })
      .addMatcher(
        isAnyOf(
          getExperimentsDatabase.rejected,
          getCellsDatabase.rejected,
          getExperimentsPublicDatabase.rejected,
          getCellsPublicDatabase.rejected,
          getListShare.rejected,
          postListUserShare.rejected,
          postListUserShare.fulfilled,
          postPublish.fulfilled,
          postPublish.rejected,
          postPublishAll.rejected,
          postMultiShare.rejected,
          postMultiShare.fulfilled,
          putAttributes.fulfilled,
          putAttributes.rejected,
        ),
        (state) => {
          state.loading = false
        },
      )
  },
})

export default databaseSlice.reducer
