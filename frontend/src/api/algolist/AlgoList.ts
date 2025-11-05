import { BASE_URL } from "const/API"
import { WORKSPACE_TYPE } from "const/Workspace"
import axios from "utils/axios"

export type AlgoListDTO = {
  [name: string]:
    | {
        args: AlgorithmInfo[]
        returns: AlgorithmInfo[]
        path: string
        conda_name: string
        conda_env_exists: boolean
      }
    | { children: AlgoListDTO }
}

export type AlgorithmInfo = {
  name: string
  type: string
  isNone?: boolean
}

export async function getAlgoListApi(
  workspace_type?: number,
): Promise<AlgoListDTO> {
  const endpoint =
    workspace_type === WORKSPACE_TYPE.EXPDB_BATCH
      ? `${BASE_URL}/algolist/expdb`
      : `${BASE_URL}/algolist`
  const response = await axios.get(endpoint)
  return response.data
}
