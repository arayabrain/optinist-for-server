export type UserDTO = {
  id: number
  uid?: string
  name?: string
  email?: string
  organization_id?: number
  role_id?: number
}

export type AddUserDTO = {
  email: string
  password: string
}

export type ListUsersQueryDTO = {
  offset?: number
  limit?: number
}

export type UserListDTO = {
  items: UserDTO[]
  total: number
  limit: number
  offset: number
}

export type UpdateUserDTO = {
  email: string
}

export type UpdateUserPasswordDTO = {
  old_password: string
  new_password: string
}
