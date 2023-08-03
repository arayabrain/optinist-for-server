import { ROLE } from '@types'
import { RootState } from 'store/store'

export const selectCurrentUser = (state: RootState) => state.user.currentUser
export const selectListUser = (state: RootState) => state.user.listUser
export const selectLoading = (state: RootState) => state.user.loading
export const selectCurrentUserUid = (state: RootState) =>
  selectCurrentUser(state)?.uid
export const selectCurrentUserEmail = (state: RootState) =>
  selectCurrentUser(state)?.email
export const selectListSearch = (state: RootState) => state.user.listUserSearch
export const isAdmin = (state: RootState) => {
  return state.user && ROLE.ADMIN === state.user.currentUser?.role_id
}

export const isAdminOrManager = (state: RootState) => {
  return [ROLE.ADMIN, ROLE.MANAGER].includes(state.user.currentUser?.role_id as number)
}
