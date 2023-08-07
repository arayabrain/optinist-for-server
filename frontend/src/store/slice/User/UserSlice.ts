import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { USER_SLICE_NAME } from './UserType'
import { User } from './UserType'
import {deleteMe, getListSearch, getMe, login, updateMe, updateMePassword} from './UserActions'
import {
  removeExToken,
  removeToken,
  saveExToken,
  saveRefreshToken,
  saveToken,
} from 'utils/auth/AuthUtils'

const initialState: User = {
  currentUser: undefined,
  listUserSearch: undefined,
  loading: false
}

export const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    logout: (state) => {
      removeToken()
      removeExToken()
      state = initialState
    },
    resetUserSearch: (state) => {
      state.listUserSearch = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (_, action) => {
        saveToken(action.payload.access_token)
        saveRefreshToken(action.payload.refresh_token)
        saveExToken(action.payload.ex_token)
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
      .addCase(getListSearch.fulfilled, (state, action) => {
        state.loading = false
        state.listUserSearch = action.payload
      })
      .addMatcher(
        isAnyOf(getListSearch.pending, updateMePassword.pending),
        (state) => {
          state.loading = true
        }
      )
      .addMatcher(
        isAnyOf(getListSearch.rejected, updateMePassword.rejected, updateMePassword.fulfilled),
        (state) => {
          state.loading = false
        }
      )
      .addMatcher(
        isAnyOf(login.rejected, getMe.rejected, deleteMe.fulfilled),
        (state) => {
          removeToken()
          removeExToken()
          state = initialState
        },
      )
  },
})

export const { logout, resetUserSearch } = userSlice.actions
export default userSlice.reducer
