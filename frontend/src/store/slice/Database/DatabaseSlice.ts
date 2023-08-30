import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import {
  getExperimentsDatabase,
  getCellsDatabase,
  getExperimentsPublicDatabase,
  getCellsPublicDatabase,
  getListUserShare,
  postListUserShare,
  postPublish,
} from './DatabaseActions'
import { DATABASE_SLICE_NAME, DatabaseDTO, ListShare } from './DatabaseType'

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
  type: 'experiment' | 'cell'
  listShare?: {
    share_type: number
    users: ListShare[]
  }
} = {
  data: {
    public: initData,
    private: initData,
  },
  loading: false,
  type: 'experiment',
  listShare: undefined,
}

export const databaseSlice = createSlice({
  name: DATABASE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExperimentsDatabase.pending, (state, action) => {
        if (state.type === 'cell') {
          state.data.private = initData
          state.type = 'experiment'
        }
        state.loading = true
      })
      .addCase(getCellsDatabase.pending, (state, action) => {
        if (state.type === 'experiment') {
          state.data.private = initData
          state.type = 'cell'
        }
        state.loading = true
      })
      .addCase(getExperimentsPublicDatabase.pending, (state, action) => {
        if (state.type === 'cell') {
          state.data.public = initData
          state.type = 'experiment'
        }
        state.loading = true
      })
      .addCase(getCellsPublicDatabase.pending, (state, action) => {
        if (state.type === 'experiment') {
          state.data.public = initData
          state.type = 'cell'
        }
        state.loading = true
      })
      .addCase(getListUserShare.pending, (state, action) => {
        state.listShare = undefined
        state.loading = true
      })
      .addMatcher(
        isAnyOf(postListUserShare.pending, postPublish.pending),
        (state, action) => {
          state.loading = true
        },
      )
      .addMatcher(
        isAnyOf(postPublish.fulfilled, postPublish.rejected),
        (state, _action) => {
          state.loading = false
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
      .addMatcher(isAnyOf(getListUserShare.fulfilled), (state, action) => {
        state.listShare = action.payload
        state.loading = false
      })
      .addMatcher(
        isAnyOf(
          getExperimentsDatabase.rejected,
          getCellsDatabase.rejected,
          getExperimentsPublicDatabase.rejected,
          getCellsPublicDatabase.rejected,
          getListUserShare.rejected,
          postListUserShare.rejected,
          postListUserShare.fulfilled,
        ),
        (state) => {
          state.loading = false
        },
      )
  },
})

export default databaseSlice.reducer
