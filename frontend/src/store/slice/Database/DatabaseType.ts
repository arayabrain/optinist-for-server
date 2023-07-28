export const DATABASE_SLICE_NAME = 'database'

export type OrderBy = 'ASC' | 'DESC' | ''

export type ImageUrls = {
  url: string
  thumb_url: string
  params: {}
}

export type DatabaseType = {
  id: number
  exp_id?: string
  fields: {
    brain_area: string
    cre_driver: string
    reporter_line: string
    imaging_depth: number
  }
  experiment_id?: string
  attributes?: object
  cell_image_urls: ImageUrls[]
  cell_image_url?: {
    url: string,
    thumb_url: string,
    params: {}
  }
  graph_urls: {url: string, params: {}, thumb_url: string}[]
  share_type?: number
  publish_status?: number
  created_at: string
  updated_at: string
}

export type DatabaseDTO = {
  offset: number
  limit: number
  total: number
  header: {
    graph_titles: string[]
  }
  items: DatabaseType[]
}

export type ListShareDTO = {
  share_type: number
  users: ListShare[]
}

export type ListShare = {
  id: number,
  name: string
  email: string
  created_at: string
  updated_at: string
}

export type DatabaseParams = { [key: string]: number | string | string[] | undefined }
