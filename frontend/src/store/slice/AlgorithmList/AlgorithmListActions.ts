import { createAsyncThunk } from "@reduxjs/toolkit"

import { AlgoListDTO, getAlgoListApi } from "api/algolist/AlgoList"
import { ALGORITHM_LIST_SLICE_NAME } from "store/slice/AlgorithmList/AlgorithmListType"
import { selectCurrentWorkspaceType } from "store/slice/Workspace/WorkspaceSelector"
import { RootState } from "store/store"

export const getAlgoList = createAsyncThunk<AlgoListDTO, void>(
  `${ALGORITHM_LIST_SLICE_NAME}/getAlgoList`,
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI
    try {
      const state = getState() as RootState
      const workspace_type = selectCurrentWorkspaceType(state)
      const response = await getAlgoListApi(workspace_type)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
