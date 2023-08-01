import { UserDTO } from "api/users/UsersApiDTO"

export const isCheckMe = (user?: UserDTO, idUserWorkSpace?: number) => {
  return user && idUserWorkSpace && user.id === idUserWorkSpace
}
