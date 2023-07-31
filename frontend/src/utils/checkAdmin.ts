import { ROLE } from "@types"
import { UserDTO } from "api/users/UsersApiDTO"

export const isAdmin = (user: UserDTO | undefined) => {
  return user && ROLE.ADMIN === user.role_id
}

export const isAdminOrManager = (user?: UserDTO) => {
  if(!user || ![ROLE.ADMIN, ROLE.MANAGER].includes(user.role_id)) return false
  return true
}