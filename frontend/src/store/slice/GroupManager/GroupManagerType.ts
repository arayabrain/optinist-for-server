
export const GROUP_MANAGER_SLICE_NAME = 'groupManager'

export type GroupManager = {
  groupsManagerData: GroupManagerDTO
  listUserGroup: UserInGroup[]
  listSearchGroup: ItemGroupManage[]
  loading: boolean
}

export type ItemGroupManage = {
  id: number,
  name: string
  users_count: number
}

export type GroupManagerDTO = {
  items: ItemGroupManage[]
  total: number
  limit: number
  offset: number
}

export type UserInGroup = {
  id: number
  name: string
  email: string
  groups: []
  createdTime: string
  updatedTime: string
}

export type GroupManagerParams = { [key: string]: number | string | string[] | undefined }