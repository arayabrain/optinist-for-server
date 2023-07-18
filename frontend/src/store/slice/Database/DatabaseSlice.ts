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

export const initialState: { data: DatabaseDTO } = {
  data: initData,
}

export const databaseSlice = createSlice({
  name: DATABASE_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExperimentsDatabase.pending, (state, action) => {
        state.data = initData
      })
      .addCase(getCellsDatabase.pending, (state, action) => {
        state.data = initData
      })
      .addCase(getExperimentsPublicDatabase.pending, (state, action) => {
        state.data = initData
      })
      .addCase(getCellsPublicDatabase.pending, (state, action) => {
        state.data = initData
      })
      .addCase(getExperimentsDatabase.fulfilled, (state, action) => {
        state.data = action.payload
      })
      .addCase(getCellsDatabase.fulfilled, (state, action) => {
        state.data = action.payload
      })
      .addCase(getExperimentsPublicDatabase.fulfilled, (state, action) => {
        state.data = action.payload
      })
      .addCase(getCellsPublicDatabase.fulfilled, (state, action) => {
        state.data = action.payload
      })
  },
})

export default databaseSlice.reducer
