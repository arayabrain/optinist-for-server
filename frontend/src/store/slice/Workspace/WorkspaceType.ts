export const WORKSPACE_SLICE_NAME = 'workspace'

export type ItemsWorkspace = {
  id: number
  name: string
  user: {
    id: number
    name: string
    email: string
    created_at: string
    updated_at: string
  },
  created_at: string
  updated_at: string
}

export type WorkspaceDataDTO = {
  items: ItemsWorkspace[],
  total: number
  limit: number
  offset: number
}

export type Workspace = {
  workspace: WorkspaceDataDTO
  currentWorkspace: {
    workspaceId?: string
    selectedTab: number
  }
  loading: boolean
}

export type WorkspaceParams = { [key: string]: string | undefined | number | string[] | object }
