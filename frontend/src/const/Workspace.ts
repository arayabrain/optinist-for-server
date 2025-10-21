export enum WORKSPACE_TYPE {
  DEFAULT = 0,
  NORMAL = 1,
  BATCH = 2,
  EXPDB_BATCH = 10,
}

export const WORKSPACE_TYPE_LABEL: Record<WORKSPACE_TYPE, string> = {
  [WORKSPACE_TYPE.DEFAULT]: "Normal", // Same as NORMAL
  [WORKSPACE_TYPE.NORMAL]: "Normal",
  [WORKSPACE_TYPE.BATCH]: "Batch",
  [WORKSPACE_TYPE.EXPDB_BATCH]: "Analysis Batch",
}

export const WORKSPACE_TYPE_OPTIONS = [
  {
    value: WORKSPACE_TYPE.NORMAL,
    label: WORKSPACE_TYPE_LABEL[WORKSPACE_TYPE.NORMAL],
  },
  /* NOTE: Currently (v2.5) unused in optinist-for-server
  {
    value: WORKSPACE_TYPE.BATCH,
    label: WORKSPACE_TYPE_LABEL[WORKSPACE_TYPE.BATCH],
  },
  */
  {
    value: WORKSPACE_TYPE.EXPDB_BATCH,
    label: WORKSPACE_TYPE_LABEL[WORKSPACE_TYPE.EXPDB_BATCH],
  },
]
