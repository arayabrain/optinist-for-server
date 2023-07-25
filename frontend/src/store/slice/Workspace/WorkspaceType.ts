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
  workspaces: WorkspaceType[]
  currentWorkspace: {
    workspaceId?: string
    selectedTab: number
  }
  data: WorkspaceDataDTO

  loading: boolean
}

export type WorkspaceType = {
  workspace_id: string
  // TODO: add fields required for workspace
}

export type WorkspaceParams = { [key: string]: string | undefined | number | string[] }
