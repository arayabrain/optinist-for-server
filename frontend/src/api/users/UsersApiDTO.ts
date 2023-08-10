export type UserDTO = {
  uid?: string
  email: string
  id?: number
  name?: string
  organization_id?: number
  role_id?: number
  created_at?: string
  updated_at?: string
}

export type AddUserDTO = {
  email: string
  password: string
  name: string
  role_id: number
}

export type ListUsersQueryDTO = {
  name?: string
  email?: string
  sort?: string[]
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
