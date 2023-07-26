export const DATABASE_SLICE_NAME = 'database'

export type OrderBy = 'ASC' | 'DESC' | ''

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
  cell_image_urls: string[]
  cell_image_url?: string
  graph_urls: string[]
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

export type DatabaseParams = { [key: string]: number | string | string[] | undefined }
