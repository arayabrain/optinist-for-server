import {ListUserDTO, UserDTO} from 'api/users/UsersApiDTO'

export const USER_SLICE_NAME = 'user'

export type User = {
  currentUser?: UserDTO
  loading?: boolean
  listUser?: ListUserDTO
}
