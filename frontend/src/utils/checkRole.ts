import { UserDTO } from "api/users/UsersApiDTO"

export const isMe = (user?: UserDTO, idUserWorkSpace?: number) => {
  return !!(user && idUserWorkSpace && user.id === idUserWorkSpace)
}
