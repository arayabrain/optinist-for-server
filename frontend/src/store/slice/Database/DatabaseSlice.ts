import { createSlice } from '@reduxjs/toolkit'
import {
  getExperimentsDatabase,
  getCellsDatabase,
  getExperimentsPublicDatabase,
  getCellsPublicDatabase,
} from './DatabaseActions'
import { DATABASE_SLICE_NAME, DatabaseDTO } from './DatabaseType'

const initData = {
  offset: 0,
  total: 0,
  limit: 0,
  header: {
    graph_titles: [],
  },
  items: [],
}

export type TypeData = {
  public: DatabaseDTO,
  private: DatabaseDTO
}

export const initialState: {
  data: TypeData,
  loading: boolean
  type: 'experiment' | 'cell'
} = {
  data: {
    public: initData,
    private: initData
  },
  loading: false,
  type: 'experiment',
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
      .addCase(getExperimentsDatabase.fulfilled, (state, action) => {
        state.data.private = action.payload
        state.loading = false
      })
      .addCase(getCellsDatabase.fulfilled, (state, action) => {
        state.data.private = action.payload
        state.loading = false
      })
      .addCase(getExperimentsPublicDatabase.fulfilled, (state, action) => {
        state.data.public = action.payload
        state.loading = false
      })
      .addCase(getCellsPublicDatabase.fulfilled, (state, action) => {
        state.data.public = action.payload
        state.loading = false
      })
      .addCase(getExperimentsDatabase.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(getCellsDatabase.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(getExperimentsPublicDatabase.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(getCellsPublicDatabase.rejected, (state, action) => {
        state.loading = false
      })
  },
})

export default databaseSlice.reducer
