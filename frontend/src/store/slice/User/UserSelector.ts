import { RootState } from 'store/store'

export const selectCurrentUser = (state: RootState) => state.user.currentUser
export const selectCurrentUserUid = (state: RootState) =>
  selectCurrentUser(state)?.uid
export const selectCurrentUserEmail = (state: RootState) =>
  selectCurrentUser(state)?.email
export const selectListSearch = (state: RootState) => state.user.listUserSearch
export const selectListSearchLoading = (state: RootState) => state.user.loading
