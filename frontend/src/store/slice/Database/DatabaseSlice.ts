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

export const initialState: { data: DatabaseDTO, loading: boolean } = {
  data: initData,
  loading: false
}

export const databaseSlice = createSlice({
  name: DATABASE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExperimentsDatabase.pending, (state, action) => {
        state.data = initData
        state.loading = false
      })
      .addCase(getCellsDatabase.pending, (state, action) => {
        state.data = initData
        state.loading = false
      })
      .addCase(getExperimentsPublicDatabase.pending, (state, action) => {
        state.data = initData
        state.loading = false
      })
      .addCase(getCellsPublicDatabase.pending, (state, action) => {
        state.data = initData
        state.loading = false
      })
      .addCase(getExperimentsDatabase.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(getCellsDatabase.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(getExperimentsPublicDatabase.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(getCellsPublicDatabase.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
  },
})

export default databaseSlice.reducer
